/**
 * Valgomat 2027 – scoringsmodellen.
 *
 * Hele metoden er beskrevet for brukerne på siden «Hvordan beregnes resultatet?»
 * (src/pages/MethodPage.tsx). Endrer du konstanter eller formler her, må den siden oppdateres.
 *
 * Kort fortalt:
 *
 *  1. Enighet per spørsmål:   a = 1 − |bruker − parti| / 6          (0 = maksimalt uenig, 1 = helt lik)
 *  2. Vekt per spørsmål:      w = temafaktor × klyngefaktor × viktighet × confidence
 *       - viktighet:   1 (vanlig), 1,5 (⭐), 2 (⭐⭐)
 *       - confidence:  1 (HIGH), 0,75 (MEDIUM), 0,4 (LOW)
 *       - klyngefaktor = 1/√k, der k er antall besvarte spørsmål i samme klynge av sterkt
 *         korrelerte spørsmål. Tre spørsmål om bilkostnader teller da som √3 ≈ 1,7 spørsmål, ikke 3.
 *       - temafaktor   = 1/√n_eff, der n_eff er temaets klyngejusterte antall besvarte spørsmål.
 *         Et tema får dermed samlet innflytelse proporsjonal med √n_eff – flere spørsmål gir noe
 *         mer innflytelse, men ikke lineært.
 *  3. Matchscore:             Σ w·a / Σ w, kun over spørsmål der brukeren har svart og partiets
 *                             standpunkt er kjent. «Vet ikke» og ukjente partistandpunkt teller ikke.
 *  4. Datagrunnlag:           hvor stor andel av vekten bak brukerens svar partiet faktisk har
 *                             kjente standpunkter på (justert for confidence).
 *  5. Usikkerhet:             vektet «bayesiansk bootstrap» over spørsmålene: vi trekker tilfeldige
 *                             vekter på spørsmålene 400 ganger og ser hvor ofte hvert parti havner øverst.
 *                             Det viser hvor sårbar rangeringen er for hvilke spørsmål som er med.
 */
import type { Answers, Confidence, Dataset, Importance, Position, Question } from './types';

export const IMPORTANCE_WEIGHT: Record<Importance, number> = { 0: 1, 1: 1.5, 2: 2 };
export const CONFIDENCE_WEIGHT: Record<Confidence, number> = { HIGH: 1, MEDIUM: 0.75, LOW: 0.4 };
export const SCALE_SPAN = 6; // avstand fra -3 til +3
export const BOOTSTRAP_DRAWS = 400;
export const MIN_ANSWERS_FOR_RESULT = 10;
export const MIN_ANSWERS_PER_DIMENSION = 3;

export interface QuestionContribution {
  questionId: string;
  theme: string;
  user: number;
  importance: Importance;
  party: number | null;
  confidence: Confidence | null;
  /** 0..1, null når partiets standpunkt er ukjent */
  agreement: number | null;
  /** Spørsmålets basisvekt for brukeren (uten confidence) */
  baseWeight: number;
  /** Effektiv vekt for dette partiet (baseWeight × confidence), 0 når ukjent */
  weight: number;
}

export interface ThemeScore {
  theme: string;
  score: number | null;
  answered: number;
  known: number;
  /** temaets andel av brukerens samlede vekt, 0..1 */
  share: number;
}

export interface PartyResult {
  party: string;
  score: number | null;
  coverage: number;
  knownCount: number;
  themes: ThemeScore[];
  contributions: QuestionContribution[];
}

export interface Uncertainty {
  /** andel bootstrap-trekk der partiet var nr. 1 */
  topShare: Record<string, number>;
  /** 10- og 90-persentil for scoren */
  interval: Record<string, [number, number]>;
}

export type Verdict = 'clear' | 'close' | 'uncertain' | 'insufficient';

export interface ResultSummary {
  answeredCount: number;
  dontKnowCount: number;
  ranking: PartyResult[];
  uncertainty: Uncertainty;
  verdict: Verdict;
  /** Partier som realistisk kan være «på topp» gitt usikkerheten */
  contenders: string[];
  gap: number | null;
}

const positionIndex = new WeakMap<Dataset, Map<string, Position>>();
export function getPosition(data: Dataset, questionId: string, partyId: string): Position | undefined {
  let idx = positionIndex.get(data);
  if (!idx) {
    idx = new Map(data.positions.map((p) => [`${p.question}|${p.party}`, p]));
    positionIndex.set(data, idx);
  }
  return idx.get(`${questionId}|${partyId}`);
}

export function agreement(user: number, party: number): number {
  return 1 - Math.abs(user - party) / SCALE_SPAN;
}

/** Besvarte spørsmål (ikke «vet ikke») i datasettets rekkefølge. */
export function answeredQuestions(data: Dataset, answers: Answers): Question[] {
  return data.questions.filter((q) => {
    const a = answers[q.id];
    return a !== undefined && a.value !== null;
  });
}

/**
 * Basisvekt per besvart spørsmål: temafaktor × klyngefaktor × viktighet.
 * Uavhengig av parti, slik at alle partier vurderes mot samme vekting av brukerens svar.
 */
export function baseWeights(data: Dataset, answers: Answers): Map<string, number> {
  const answered = answeredQuestions(data, answers);
  const clusterCount = new Map<string, number>();
  for (const q of answered) clusterCount.set(q.cluster, (clusterCount.get(q.cluster) ?? 0) + 1);

  // Klyngejustert antall per tema: Σ over klynger av √k
  const themeEff = new Map<string, number>();
  const seenCluster = new Set<string>();
  for (const q of answered) {
    if (seenCluster.has(q.cluster)) continue;
    seenCluster.add(q.cluster);
    const k = clusterCount.get(q.cluster)!;
    themeEff.set(q.theme, (themeEff.get(q.theme) ?? 0) + Math.sqrt(k));
  }

  const out = new Map<string, number>();
  for (const q of answered) {
    const clusterFactor = 1 / Math.sqrt(clusterCount.get(q.cluster)!);
    const themeFactor = 1 / Math.sqrt(themeEff.get(q.theme)!);
    const imp = IMPORTANCE_WEIGHT[answers[q.id].importance ?? 0];
    out.set(q.id, themeFactor * clusterFactor * imp);
  }
  return out;
}

export function scoreParty(data: Dataset, answers: Answers, partyId: string, weights = baseWeights(data, answers)): PartyResult {
  const contributions: QuestionContribution[] = [];
  let num = 0;
  let den = 0;
  let totalBase = 0;
  let knownBase = 0;
  const themeAcc = new Map<string, { num: number; den: number; answered: number; known: number; base: number }>();

  for (const q of answeredQuestions(data, answers)) {
    const a = answers[q.id];
    const base = weights.get(q.id)!;
    const pos = getPosition(data, q.id, partyId);
    const known = pos !== undefined && pos.position !== null && pos.confidence !== null;
    const w = known ? base * CONFIDENCE_WEIGHT[pos!.confidence!] : 0;
    const ag = known ? agreement(a.value!, pos!.position!) : null;

    totalBase += base;
    const t = themeAcc.get(q.theme) ?? { num: 0, den: 0, answered: 0, known: 0, base: 0 };
    t.answered += 1;
    t.base += base;
    if (known) {
      num += w * ag!;
      den += w;
      knownBase += w;
      t.num += w * ag!;
      t.den += w;
      t.known += 1;
    }
    themeAcc.set(q.theme, t);

    contributions.push({
      questionId: q.id,
      theme: q.theme,
      user: a.value!,
      importance: a.importance ?? 0,
      party: known ? pos!.position : null,
      confidence: known ? pos!.confidence : null,
      agreement: ag,
      baseWeight: base,
      weight: w,
    });
  }

  const themes: ThemeScore[] = data.themes
    .filter((t) => themeAcc.has(t.id))
    .map((t) => {
      const acc = themeAcc.get(t.id)!;
      return {
        theme: t.id,
        score: acc.den > 0 ? acc.num / acc.den : null,
        answered: acc.answered,
        known: acc.known,
        share: totalBase > 0 ? acc.base / totalBase : 0,
      };
    });

  return {
    party: partyId,
    score: den > 0 ? num / den : null,
    coverage: totalBase > 0 ? knownBase / totalBase : 0,
    knownCount: contributions.filter((c) => c.agreement !== null).length,
    themes,
    contributions,
  };
}

/** Enkel, deterministisk PRNG (mulberry32) slik at samme svar alltid gir samme usikkerhetsanslag. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashAnswers(answers: Answers): number {
  let h = 2166136261;
  for (const k of Object.keys(answers).sort()) {
    const a = answers[k];
    const s = `${k}:${a.value}:${a.importance}`;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
  }
  return h >>> 0;
}

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return NaN;
  const idx = Math.min(sorted.length - 1, Math.max(0, Math.round(p * (sorted.length - 1))));
  return sorted[idx];
}

export function bootstrap(results: PartyResult[], answers: Answers, draws = BOOTSTRAP_DRAWS): Uncertainty {
  const rand = mulberry32(hashAnswers(answers));
  const qids = results[0]?.contributions.map((c) => c.questionId) ?? [];
  const topCount: Record<string, number> = Object.fromEntries(results.map((r) => [r.party, 0]));
  const samples: Record<string, number[]> = Object.fromEntries(results.map((r) => [r.party, []]));
  if (qids.length === 0) return { topShare: topCount, interval: {} };

  for (let d = 0; d < draws; d++) {
    // Bayesiansk bootstrap: eksponentialfordelte vekter ≈ Dirichlet(1,…,1)
    const mult = qids.map(() => -Math.log(1 - rand()));
    let best: string | null = null;
    let bestScore = -Infinity;
    for (const r of results) {
      let num = 0;
      let den = 0;
      r.contributions.forEach((c, i) => {
        if (c.agreement === null) return;
        num += mult[i] * c.weight * c.agreement;
        den += mult[i] * c.weight;
      });
      if (den === 0) continue;
      const s = num / den;
      samples[r.party].push(s);
      if (s > bestScore) {
        bestScore = s;
        best = r.party;
      }
    }
    if (best) topCount[best] += 1;
  }

  const topShare: Record<string, number> = {};
  const interval: Record<string, [number, number]> = {};
  for (const r of results) {
    topShare[r.party] = topCount[r.party] / draws;
    const s = samples[r.party].sort((a, b) => a - b);
    interval[r.party] = [percentile(s, 0.1), percentile(s, 0.9)];
  }
  return { topShare, interval };
}

/** Klassifiserer hvor tydelig resultatet er. Grensene er dokumentert på metodesiden. */
export function classify(ranking: PartyResult[], uncertainty: Uncertainty, answeredCount: number): { verdict: Verdict; contenders: string[]; gap: number | null } {
  const scored = ranking.filter((r) => r.score !== null);
  if (answeredCount < MIN_ANSWERS_FOR_RESULT || scored.length < 2) {
    return { verdict: 'insufficient', contenders: scored.slice(0, 1).map((r) => r.party), gap: null };
  }
  const gap = (scored[0].score! - scored[1].score!) * 100;
  const top = scored[0];
  const share = uncertainty.topShare[top.party] ?? 0;
  const contenders = scored
    .filter((r, i) => i === 0 || (top.score! - r.score!) * 100 < 3 || (uncertainty.topShare[r.party] ?? 0) >= 0.15)
    .map((r) => r.party);
  let verdict: Verdict;
  if (gap >= 6 && share >= 0.8 && top.coverage >= 0.6) verdict = 'clear';
  else if (gap >= 2.5 && share >= 0.5) verdict = 'close';
  else verdict = 'uncertain';
  return { verdict, contenders: verdict === 'clear' ? [top.party] : contenders, gap };
}

export function computeResults(data: Dataset, answers: Answers): ResultSummary {
  const weights = baseWeights(data, answers);
  const results = data.parties.map((p) => scoreParty(data, answers, p.id, weights));
  const ranking = [...results].sort((a, b) => (b.score ?? -1) - (a.score ?? -1));
  const uncertainty = bootstrap(results, answers);
  const answeredCount = answeredQuestions(data, answers).length;
  const dontKnowCount = Object.values(answers).filter((a) => a.value === null).length;
  return { answeredCount, dontKnowCount, ranking, uncertainty, ...classify(ranking, uncertainty, answeredCount) };
}

/* ------------------------------------------------------------------ */
/* Politisk profil (akser)                                             */
/* ------------------------------------------------------------------ */

export interface DimensionValue {
  dimension: string;
  /** -1..1, null hvis for lite grunnlag */
  value: number | null;
  n: number;
}

export function userDimensions(data: Dataset, answers: Answers): DimensionValue[] {
  return data.dimensions.map((d) => {
    let sum = 0;
    let n = 0;
    for (const q of answeredQuestions(data, answers)) {
      const sign = q.dims[d.id];
      if (!sign) continue;
      sum += (answers[q.id].value! * sign) / 3;
      n += 1;
    }
    return { dimension: d.id, value: n >= MIN_ANSWERS_PER_DIMENSION ? sum / n : null, n };
  });
}

/** Partienes plassering på aksene, beregnet fra alle kodede standpunkter (confidence-vektet). */
export function partyDimensions(data: Dataset, partyId: string): DimensionValue[] {
  return data.dimensions.map((d) => {
    let sum = 0;
    let wsum = 0;
    let n = 0;
    for (const q of data.questions) {
      const sign = q.dims[d.id];
      if (!sign) continue;
      const pos = getPosition(data, q.id, partyId);
      if (!pos || pos.position === null || !pos.confidence) continue;
      const w = CONFIDENCE_WEIGHT[pos.confidence];
      sum += w * (pos.position * sign) / 3;
      wsum += w;
      n += 1;
    }
    return { dimension: d.id, value: n >= MIN_ANSWERS_PER_DIMENSION && wsum > 0 ? sum / wsum : null, n };
  });
}

/* ------------------------------------------------------------------ */
/* Forklaringer per parti                                              */
/* ------------------------------------------------------------------ */

export function topAgreements(r: PartyResult, limit = 8): QuestionContribution[] {
  return r.contributions
    .filter((c) => c.agreement !== null && c.agreement >= 2 / 3)
    .sort((a, b) => b.weight * b.agreement! - a.weight * a.agreement! || b.agreement! - a.agreement!)
    .slice(0, limit);
}

export function topDisagreements(r: PartyResult, limit = 8): QuestionContribution[] {
  return r.contributions
    .filter((c) => c.agreement !== null && c.agreement <= 0.5)
    .sort((a, b) => b.weight * (1 - b.agreement!) - a.weight * (1 - a.agreement!))
    .slice(0, limit);
}
