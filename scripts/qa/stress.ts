/**
 * Stresstest av scoringsmodellen med syntetiske brukerprofiler (RED-TEAM-QA).
 *
 *   node scripts/qa/run-ts.mjs scripts/qa/stress.ts            → skriver STRESS_TEST.md + test-results/stress.json
 *
 * Skriptet endrer ingenting i data eller algoritme. Det kjører appens egen kode (src/lib/scoring.ts og
 * src/lib/insights.ts) på ekte data, med deterministisk tilfeldighet (fast seed), slik at rapporten kan
 * reproduseres. Profilene er laget ut fra spørsmålenes akser (dims), ikke ut fra partienes standpunkter
 * – bortsett fra «perfekt parti»-profilene, som bevisst kopierer et partis kodede svar.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import raw from '../../src/data/data.json';
import type { Answers, Dataset, Position } from '../../src/lib/types';
import { computeResults, isModestFit, mulberry32, baseWeights, isAgreement, isConflict, topAgreements, topDisagreements, type ResultSummary } from '../../src/lib/scoring';
import { buildInsights } from '../../src/lib/insights';

const data = raw as Dataset;
const P = data.parties.map((p) => p.id);
const Q = data.questions;
const rand = mulberry32(20271014);
const clamp = (v: number) => Math.max(-3, Math.min(3, Math.round(v)));
const pick = <T,>(xs: T[]) => xs[Math.floor(rand() * xs.length)];
const pos = (d: Dataset, q: string, p: string) => d.positions.find((x) => x.question === q && x.party === p);
const r1 = (x: number) => Math.round(x * 10) / 10;
const pc = (x: number | null | undefined) => (x === null || x === undefined ? '–' : `${r1(x * 100)}`);

/**
 * Følsomhet for ukjente standpunkter: partiets score dersom alle ukjente standpunkter på brukerens besvarte
 * spørsmål hadde vært (a) lengst mulig fra brukeren, (b) lik brukeren – med MEDIUM confidence. Brukes bare i
 * rapporten for å vise hvor mye ukjente kan bety; appen gjetter aldri på ukjente standpunkter.
 */
function unknownBounds(ans: Answers, party: string): [number, number] {
  const fill = (mode: 'worst' | 'best'): Dataset => ({
    ...data,
    positions: data.positions.map((p): Position => {
      if (p.party !== party || p.position !== null) return p;
      const u = ans[p.question]?.value;
      if (u === undefined || u === null) return p;
      const v = mode === 'best' ? u : u >= 0 ? -3 : 3;
      return { ...p, position: v, confidence: 'MEDIUM' };
    }),
  });
  const sc = (d: Dataset) => computeResults(d, ans).ranking.find((r) => r.party === party)!.score!;
  return [sc(fill('worst')), sc(fill('best'))];
}

const out: string[] = [];
const json: Record<string, unknown> = {};
const line = (s = '') => out.push(s);

/** Støy: med sannsynlighet p flyttes svaret ett hakk, med p2 to hakk. */
function noisy(v: number, p = 0.3, p2 = 0.1): number {
  const r = rand();
  if (r < p2) return clamp(v + (rand() < 0.5 ? -2 : 2));
  if (r < p2 + p) return clamp(v + (rand() < 0.5 ? -1 : 1));
  return v;
}
function randomImportance(): 0 | 1 | 2 {
  const r = rand();
  return r < 0.75 ? 0 : r < 0.92 ? 1 : 2;
}

/* ------------------------------------------------------------------ */
/* 1. Perfekte og motsatte partiprofiler                               */
/* ------------------------------------------------------------------ */
type Tally = Record<string, number[]>; // parti → liste av rangeringer
const rankOf = (s: ResultSummary, party: string) => s.ranking.findIndex((r) => r.party === party) + 1;

function partyProfile(party: string, mode: 'exact' | 'noisy' | 'fillUnknown' | 'opposite'): Answers {
  const a: Answers = {};
  for (const q of Q) {
    const p = pos(data, q.id, party)!;
    if (p.position === null) {
      if (mode === 'fillUnknown') a[q.id] = { value: pick([-3, -2, -1, 0, 1, 2, 3]), importance: 0 };
      else a[q.id] = { value: null, importance: 0 };
      continue;
    }
    let v = p.position;
    if (mode === 'noisy' || mode === 'fillUnknown') v = noisy(v);
    if (mode === 'opposite') v = v === 0 ? pick([-3, 3]) : -v;
    a[q.id] = { value: v, importance: mode === 'noisy' ? randomImportance() : 0 };
  }
  return a;
}

line('# Stresstest av scoringsmodellen');
line();
line(`Generert av \`scripts/qa/stress.ts\` på datasettet «Sist oppdatert ${data.meta.lastUpdated}». Seed 20271014 – rapporten er reproduserbar. Ingen tall her er brukt til å justere partistandpunkter.`);
line();
line('## 1. Perfekte, støyete og motsatte partiprofiler');
line();
line('- **Perfekt:** brukeren svarer nøyaktig partiets kodede standpunkt, «vet ikke» der partiet er ukjent.');
line('- **Støy (n=100 per parti):** som perfekt, men hvert svar flyttes ett hakk med 30 % sannsynlighet og to hakk med 10 %; tilfeldig viktighet (75 % normal, 17 % ★, 8 % ★★).');
line('- **Fyller ukjente (n=100 per parti):** som støy, men brukeren svarer tilfeldig på spørsmål der partiet er ukjent (realistisk: brukeren vet ikke hva partiet mangler).');
line('- **Motsatt:** fortegn snudd (0 → tilfeldig ±3).');
line();
line('| Parti | Perfekt: plass / score | Støy: andel #1 | Støy: median plass | Fyller ukjente: andel #1 | Fyller ukjente: andel topp 2 | Motsatt: plass / score |');
line('|---|---|---:|---:|---:|---:|---|');
const perfectJson: Record<string, unknown> = {};
let totalProfiles = 0;
const confusion: Record<string, Record<string, number>> = {};
for (const party of P) {
  const exact = computeResults(data, partyProfile(party, 'exact'));
  const opp = computeResults(data, partyProfile(party, 'opposite'));
  const noisyRanks: number[] = [];
  const fillRanks: number[] = [];
  confusion[party] = Object.fromEntries(P.map((x) => [x, 0]));
  for (let i = 0; i < 100; i++) {
    const s = computeResults(data, partyProfile(party, 'noisy'));
    noisyRanks.push(rankOf(s, party));
    const f = computeResults(data, partyProfile(party, 'fillUnknown'));
    fillRanks.push(rankOf(f, party));
    confusion[party][f.ranking[0].party] += 1;
  }
  totalProfiles += 202;
  const share = (xs: number[], k: number) => xs.filter((x) => x <= k).length / xs.length;
  const median = [...noisyRanks].sort((a, b) => a - b)[50];
  const er = exact.ranking.find((r) => r.party === party)!;
  const or = opp.ranking.find((r) => r.party === party)!;
  line(`| ${party} | ${rankOf(exact, party)} / ${pc(er.score)} | ${pc(share(noisyRanks, 1))} % | ${median} | ${pc(share(fillRanks, 1))} % | ${pc(share(fillRanks, 2))} % | ${rankOf(opp, party)} / ${pc(or.score)} |`);
  perfectJson[party] = { exactRank: rankOf(exact, party), exactScore: er.score, noisyTop1: share(noisyRanks, 1), fillTop1: share(fillRanks, 1), fillTop2: share(fillRanks, 2), oppositeRank: rankOf(opp, party), oppositeScore: or.score };
}
json.perfect = perfectJson;
line();
line('**Hvilket parti havner øverst for «fyller ukjente»-profilene?** (rad = profilens parti, kolonne = vinner, n=100)');
line();
line(`| profil \\ vinner | ${P.join(' | ')} |`);
line(`|---|${P.map(() => '---:').join('|')}|`);
for (const party of P) line(`| ${party} | ${P.map((x) => confusion[party][x] || '·').join(' | ')} |`);
json.confusion = confusion;
line();

/* ------------------------------------------------------------------ */
/* 2. Arketyper bygget fra akser                                       */
/* ------------------------------------------------------------------ */
type Target = Partial<Record<string, number>>; // akse → −1..1
interface Archetype { id: string; label: string; target: Target; overrides: Record<string, number>; others: 'axis' | 'null' }
const ARCHETYPES: Archetype[] = [
  { id: 'liberal', label: 'Liberal (marked + personlig frihet + internasjonal)', target: { econ: 0.6, social: 1, climate: 0.4, justice: -0.5, immigration: -0.5, intl: 0.9 }, overrides: {}, others: 'axis' },
  { id: 'conservative', label: 'Konservativ (marked + tradisjonelle verdier + streng justis/innvandring)', target: { econ: 0.7, social: -0.9, climate: -0.4, justice: 0.8, immigration: 0.7, intl: 0.2 }, overrides: { def_budget: 3, def_nato_exit: -3 }, others: 'axis' },
  { id: 'socialist', label: 'Sosialist (omfordeling + statlig styring + EU-skeptisk)', target: { econ: -1, social: 0.5, climate: 0.6, justice: -0.5, immigration: -0.6, central: -0.3, intl: -0.7 }, overrides: { for_israel_sanctions: 3, for_nuclear_ban: 3 }, others: 'axis' },
  { id: 'green', label: 'Grønn (klima og natur først)', target: { climate: 1, econ: -0.3, social: 0.5, immigration: -0.6, intl: 0.5 }, overrides: { energy_onshore_wind: 1, for_aid: 3 }, others: 'axis' },
  { id: 'district', label: 'Distrikt (desentralisering + landbruk + nasjonal styring)', target: { central: -1, econ: -0.3, intl: -1, climate: -0.4, social: -0.3 }, overrides: { agri_tariffs: 3, agri_income: 3, agri_predators: -3, dist_county: -3, dist_municipal_merge: -3 }, others: 'axis' },
  { id: 'restrictive', label: 'Innvandringsrestriktiv (bare innvandring og justis besvart)', target: { immigration: 1, justice: 0.8 }, overrides: {}, others: 'null' },
  { id: 'drugliberal', label: 'Ruspolitisk liberal (rus + frihet, resten tilfeldig)', target: { social: 0.9 }, overrides: { drug_decrim: 3, drug_cannabis: 3, drug_alcohol: 2 }, others: 'axis' },
  { id: 'defence', label: 'Forsvar/NATO (sterkt forsvar, resten tilfeldig)', target: { intl: 0.6 }, overrides: { def_budget: 3, def_nato_exit: -3, def_allied_bases: 3, def_ukraine: 3, for_nuclear_ban: -2 }, others: 'axis' },
];

function archetypeAnswers(a: Archetype): Answers {
  const ans: Answers = {};
  for (const q of Q) {
    if (q.id in a.overrides) { ans[q.id] = { value: noisy(a.overrides[q.id], 0.2, 0.05), importance: rand() < 0.5 ? 2 : 1 }; continue; }
    const dims = Object.entries(q.dims).filter(([d]) => a.target[d] !== undefined);
    if (dims.length === 0) {
      // Akser profilen ikke sier noe om: «vet ikke» eller tilfeldig (halvparten vet ikke).
      ans[q.id] = { value: a.others === 'null' || rand() < 0.5 ? null : pick([-2, -1, 0, 1, 2]), importance: 0 };
      continue;
    }
    const v = (3 * dims.reduce((s, [d, sign]) => s + sign * a.target[d]!, 0)) / dims.length;
    ans[q.id] = { value: noisy(clamp(v)), importance: randomImportance() };
  }
  return ans;
}

line('## 2. Arketyper (n=100 per arketype)');
line();
line('Arketypene er definert ut fra spørsmålenes akser (f.eks. «econ=+1» betyr at enig trekker mot marked/lavere skatt), pluss noen få eksplisitte kjernesaker. De bruker **ikke** partienes standpunkter. Støy som over. Tabellen viser hvor ofte hvert parti havner øverst – det finnes ingen fasit, men resultatet bør være politisk forklarbart.');
line();
line(`| Arketype | ${P.join(' | ')} | median toppscore | andel «klar match» | andel «ingen passer» |`);
line(`|---|${P.map(() => '---:').join('|')}|---:|---:|---:|`);
const archJson: Record<string, unknown> = {};
for (const a of ARCHETYPES) {
  const wins: Record<string, number> = Object.fromEntries(P.map((x) => [x, 0]));
  const tops: number[] = [];
  let clear = 0;
  let weak = 0;
  for (let i = 0; i < 100; i++) {
    const s = computeResults(data, archetypeAnswers(a));
    wins[s.ranking[0].party] += 1;
    tops.push(s.ranking[0].score!);
    if (s.verdict === 'clear') clear++;
    if (s.verdict === 'weak') weak++;
  }
  totalProfiles += 100;
  tops.sort((x, y) => x - y);
  line(`| ${a.label} | ${P.map((x) => wins[x] || '·').join(' | ')} | ${pc(tops[50])} | ${clear} % | ${weak} % |`);
  archJson[a.id] = { wins, medianTop: tops[50], clear, weak };
}
json.archetypes = archJson;
line();

/* ------------------------------------------------------------------ */
/* 3. Kalibrering: tilfeldige brukere                                  */
/* ------------------------------------------------------------------ */
function randomAnswers(nAnswered = 80, dkShare = 0.1): Answers {
  const ans: Answers = {};
  const ids = [...Q.map((q) => q.id)].sort(() => rand() - 0.5).slice(0, nAnswered);
  for (const id of ids) ans[id] = { value: rand() < dkShare ? null : pick([-3, -2, -1, 0, 1, 2, 3]), importance: randomImportance() };
  return ans;
}
const quant = (xs: number[], p: number) => { const s = [...xs].sort((a, b) => a - b); return s[Math.min(s.length - 1, Math.round(p * (s.length - 1)))]; };

const calib = { top: [] as number[], second: [] as number[], bottom: [] as number[], gap: [] as number[], all: [] as number[], verdict: { clear: 0, close: 0, uncertain: 0, weak: 0, insufficient: 0 } as Record<string, number> };
const N_RANDOM = 500;
for (let i = 0; i < N_RANDOM; i++) {
  const s = computeResults(data, randomAnswers());
  const sc = s.ranking.map((r) => r.score!);
  calib.top.push(sc[0]); calib.second.push(sc[1]); calib.bottom.push(sc[sc.length - 1]); calib.gap.push((sc[0] - sc[1]) * 100);
  calib.all.push(...sc);
  calib.verdict[s.verdict] += 1;
  if (isModestFit(s)) calib.verdict.modest = (calib.verdict.modest ?? 0) + 1;
}
totalProfiles += N_RANDOM;
// Sammenlign med «ekte» profiler: perfekte partiprofiler med støy
const realTop: number[] = [];
for (const party of P) for (let i = 0; i < 30; i++) realTop.push(computeResults(data, partyProfile(party, 'fillUnknown')).ranking[0].score!);
totalProfiles += P.length * 30;

line('## 3. Kalibrering av prosentene');
line();
line(`**Tilfeldige brukere (n=${N_RANDOM}):** svarer uniformt tilfeldig (−3…+3) på alle 80, 10 % «vet ikke», tilfeldig viktighet. Dette er «støygulvet»: hva prosentene blir når svarene ikke har noen politisk sammenheng.`);
line();
line('| Fordeling | p5 | p25 | median | p75 | p95 |');
line('|---|---:|---:|---:|---:|---:|');
const row = (label: string, xs: number[], f = pc) => line(`| ${label} | ${[0.05, 0.25, 0.5, 0.75, 0.95].map((p) => f(quant(xs, p))).join(' | ')} |`);
row('Alle partiscorer (tilfeldig bruker)', calib.all);
row('Beste parti (tilfeldig bruker)', calib.top);
row('Nest beste (tilfeldig bruker)', calib.second);
row('Dårligste parti (tilfeldig bruker)', calib.bottom);
row('Avstand 1–2 i poeng (tilfeldig bruker)', calib.gap, (x) => `${r1(x)}`);
row('Beste parti (partiprofil m/støy, n=270)', realTop);
line();
line(`Klassifisering for tilfeldige brukere: klar match ${calib.verdict.clear}, nær match ${calib.verdict.close}, usikkert ${calib.verdict.uncertain}, «ingen parti passer spesielt godt» ${calib.verdict.weak} (av ${N_RANDOM}). Av de ${N_RANDOM - calib.verdict.weak} som slo tilfeldighetsnivået, fikk ${calib.verdict.modest ?? 0} i tillegg merknaden om svak tilpasning.`);
line();
json.calibration = { top: [0.05, 0.25, 0.5, 0.75, 0.95].map((p) => quant(calib.top, p)), all: [0.05, 0.5, 0.95].map((p) => quant(calib.all, p)), realTop: [0.05, 0.5, 0.95].map((p) => quant(realTop, p)), verdict: calib.verdict };

/* ------------------------------------------------------------------ */
/* 4. Unknown-bias: samme profil ved 100/90/75/60 % dekning            */
/* ------------------------------------------------------------------ */
function maskParty(d: Dataset, party: string, keepShare: number): Dataset {
  const known = d.positions.filter((p) => p.party === party && p.position !== null);
  const drop = new Set(known.filter(() => rand() > keepShare).map((p) => p.question));
  return { ...d, positions: d.positions.map((p): Position => (p.party === party && drop.has(p.question) ? { ...p, position: null, confidence: null } : p)) };
}
line('## 4. Ukjente standpunkter – gir de kunstig høy eller lav score?');
line();
line('For hvert parti: start med en realistisk profil, fjern så tilfeldig en andel av partiets **kjente** standpunkter (som om de var ukjente) og mål hvordan partiets score, plass og usikkerhetsintervall endres. 60 gjentak per nivå og parti, to profiltyper: tilfeldig bruker og partiets egen profil med støy.');
line();
line('| Profil | Beholdt andel kjente | Snitt endring i score (poeng) | Std.avvik endring | Snitt |endring| i plass | Snitt intervallbredde (poeng) | Andel med «usikkert grunnlag» (<60 % dekning) |');
line('|---|---:|---:|---:|---:|---:|---:|');
const covJson: Record<string, unknown> = {};
for (const kind of ['random', 'own'] as const) {
  for (const keep of [1, 0.9, 0.75, 0.6]) {
    const deltas: number[] = []; const rankD: number[] = []; const widths: number[] = []; let low = 0; let n = 0;
    for (const party of P) {
      for (let i = 0; i < 60; i++) {
        const ans = kind === 'random' ? randomAnswers() : partyProfile(party, 'fillUnknown');
        const base = computeResults(data, ans);
        const masked = keep === 1 ? base : computeResults(maskParty(data, party, keep), ans);
        const b = base.ranking.find((r) => r.party === party)!;
        const m = masked.ranking.find((r) => r.party === party)!;
        deltas.push((m.score! - b.score!) * 100);
        rankD.push(Math.abs(rankOf(masked, party) - rankOf(base, party)));
        const iv = masked.uncertainty.interval[party];
        widths.push((iv[1] - iv[0]) * 100);
        if (m.coverage < 0.6) low++;
        n++;
      }
    }
    totalProfiles += n;
    const mean = (xs: number[]) => xs.reduce((s, x) => s + x, 0) / xs.length;
    const sd = (xs: number[]) => Math.sqrt(mean(xs.map((x) => (x - mean(xs)) ** 2)));
    line(`| ${kind === 'random' ? 'Tilfeldig bruker' : 'Partiets egen profil'} | ${keep * 100} % | ${r1(mean(deltas))} | ${r1(sd(deltas))} | ${r1(mean(rankD))} | ${r1(mean(widths))} | ${r1((low / n) * 100)} % |`);
    covJson[`${kind}_${keep}`] = { meanDelta: mean(deltas), sdDelta: sd(deltas), meanRankChange: mean(rankD), meanWidth: mean(widths), lowShare: low / n };
  }
}
json.coverage = covJson;
line();

// Ikke-tilfeldige ukjente: hvor mye kunne ukjente standpunkter endret scoren (verst/best tenkelig)?
{
  line('**Ikke-tilfeldige ukjente.** Tabellen over forutsetter at standpunktene mangler tilfeldig. I virkeligheten tier partiene ofte om saker de ikke prioriterer eller der velgerne deres er delt. Tabellen under viser hvor mye partiets score *kunne* endret seg dersom alle ukjente standpunkter på spørsmålene brukeren svarte på, var henholdsvis lengst mulig unna og helt lik brukeren (MEDIUM confidence; snitt over 40 tilfeldige brukere). Et bredt spenn betyr at scoren hviler mer på det vi ikke vet.');
  line();
  line('| Parti | Snitt score | Snitt nedre grense | Snitt øvre grense | Snitt spenn (poeng) |');
  line('|---|---:|---:|---:|---:|');
  const agg: Record<string, number[][]> = Object.fromEntries(P.map((p) => [p, []]));
  for (let i = 0; i < 40; i++) {
    const ans = randomAnswers();
    const s = computeResults(data, ans);
    for (const p of P) agg[p].push([s.ranking.find((r) => r.party === p)!.score!, ...unknownBounds(ans, p)]);
  }
  totalProfiles += 40;
  const m = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
  for (const p of P) {
    const sc = m(agg[p].map((x) => x[0]));
    const lo = m(agg[p].map((x) => x[1]));
    const hi = m(agg[p].map((x) => x[2]));
    line(`| ${p} | ${pc(sc)} | ${pc(lo)} | ${pc(hi)} | ${r1((hi - lo) * 100)} |`);
  }
  line();
}

// Faktisk dekning per parti med en bruker som svarer på alt
const allAnswer: Answers = Object.fromEntries(Q.map((q) => [q.id, { value: 1, importance: 0 as const }]));
const fullRes = computeResults(data, allAnswer);
line('**Faktisk dekning når brukeren svarer på alle 80 spørsmål** (confidence-vektet, slik appen viser den):');
line();
line(`| ${P.join(' | ')} |`);
line(`|${P.map(() => '---:').join('|')}|`);
line(`| ${P.map((p) => `${pc(fullRes.ranking.find((r) => r.party === p)!.coverage)} %`).join(' | ')} |`);
line();

/* ------------------------------------------------------------------ */
/* 5. Viktighet                                                        */
/* ------------------------------------------------------------------ */
line('## 5. Viktighet (normal / ★ / ★★)');
line();
// Største vektandel ett enkelt spørsmål kan få
let maxShare = { q: '', share: 0 };
for (const q of Q) {
  const ans: Answers = Object.fromEntries(Q.map((x) => [x.id, { value: 0, importance: 0 as const }]));
  ans[q.id] = { value: 0, importance: 2 };
  const w = baseWeights(data, ans);
  const tot = [...w.values()].reduce((s, x) => s + x, 0);
  const share = w.get(q.id)! / tot;
  if (share > maxShare.share) maxShare = { q: q.id, share };
}
const allNormal: Answers = Object.fromEntries(Q.map((x) => [x.id, { value: 0, importance: 0 as const }]));
const wN = baseWeights(data, allNormal);
const totN = [...wN.values()].reduce((s, x) => s + x, 0);
const maxNormal = Math.max(...[...wN.values()]) / totN;
line(`- Når alle 80 er besvart med normal viktighet, er største vektandel for ett spørsmål ${pc(maxNormal)} % (spørsmål alene i et tema med få spørsmål). Med ★★ på ett spørsmål og normal på resten er maksimum ${pc(maxShare.share)} % (\`${maxShare.q}\`). Ett spørsmål kan altså flytte en partiscore med høyst rundt ${r1(maxShare.share * 100)} poeng (fra full enighet til full uenighet).`);

// Konkret eksempel: Partiprofil for H med støy. Finn spørsmålet der H og FrP er lengst fra hverandre og sett ★★.
function importanceExample(base: Answers, qid: string, a: string, b: string) {
  const res: string[] = [];
  for (const imp of [0, 1, 2] as const) {
    const ans = { ...base, [qid]: { ...base[qid], importance: imp } };
    const s = computeResults(data, ans);
    const sa = s.ranking.find((r) => r.party === a)!.score!;
    const sb = s.ranking.find((r) => r.party === b)!.score!;
    res.push(`${['normal', '★', '★★'][imp]}: ${a} ${pc(sa)} / ${b} ${pc(sb)} (plass ${rankOf(s, a)} / ${rankOf(s, b)})`);
  }
  return res.join(' · ');
}
const hProfile = partyProfile('H', 'exact');
// Bruker = Høyre-profil, men helt uenig med H på oljeleting (en sak der FrP og H er like, og MDG/V motsatt)
const exA: Answers = { ...hProfile, energy_nuclear: { value: 3, importance: 0 } };
line(`- **Eksempel A:** Høyre-profil + «helt enig» i kjernekraft. ★ på kjernekraft: ${importanceExample(exA, 'energy_nuclear', 'H', 'FrP')}.`);
const exB: Answers = { ...hProfile, eu_membership: { value: -3, importance: 0 } };
line(`- **Eksempel B:** Høyre-profil, men «helt uenig» i EU-medlemskap (Høyres kjernesak): ${importanceExample(exB, 'eu_membership', 'H', 'FrP')}.`);
// Eksempel C: én ★★-sak mot en hel profil: SV-profil med ★★ på NATO-utmelding = -3 (SV vil ikke melde ut nå?)
const svProfile = partyProfile('SV', 'exact');
const exC: Answers = { ...svProfile, def_budget: { value: 3, importance: 0 } };
line(`- **Eksempel C:** SV-profil + «helt enig» i raskere økning av forsvarsbudsjettet: ${importanceExample(exC, 'def_budget', 'SV', 'Ap')}.`);
line('- Tolkning: ★★ dobler vekten og kan avgjøre mellom to partier som ellers ligger nær hverandre, men én sak kan ikke snu en hel profil – partiet profilen er kopiert fra, forblir øverst.');
line();
json.importance = { maxNormal, maxStarStar: maxShare };

/* ------------------------------------------------------------------ */
/* 6. Genererte tekster (innsikter) – invariantsjekk                   */
/* ------------------------------------------------------------------ */
let checked = 0; const violations: string[] = [];
for (let i = 0; i < 400; i++) {
  const ans = i % 2 ? randomAnswers() : partyProfile(pick(P), 'fillUnknown');
  const s = computeResults(data, ans);
  const ins = buildInsights(data, ans, s);
  checked++;
  const top = s.ranking[0];
  for (const x of ins) {
    if (x.kind === 'dealbreaker') {
      if (x.party !== top.party) violations.push(`dealbreaker for ikke-topp ${x.party}`);
      if (Math.abs(x.user - x.partyPos) < 3 || x.importance < 1 || !isConflict(x.user, x.partyPos)) violations.push(`svak dealbreaker ${x.questionId}`);
      if (ans[x.questionId]?.value !== x.user) violations.push('dealbreaker feil brukersvar');
    }
    if (x.kind === 'closePair' && x.gap >= 3) violations.push('closePair med gap ≥ 3');
    if (x.kind === 'lowCoverage' && x.coverage >= 0.6) violations.push('lowCoverage med dekning ≥ 0.6');
  }
  if (s.verdict === 'clear' && (s.gap! < 6 || top.coverage < 0.6)) violations.push('clear uten margin/dekning');
  if (s.verdict !== 'weak' && s.verdict !== 'insufficient' && s.baseline !== null && top.score! < s.baseline) violations.push('vinner under tilfeldighetsnivå uten «ingen passer»');
  if ((s.verdict === 'close' || s.verdict === 'clear') && s.gap! < 2.5) violations.push('nær/klar match med avstand under 2,5');
  for (const r of s.ranking) {
    for (const c of topAgreements(r)) if (!isAgreement(c.user, c.party!)) violations.push(`«enig» uten enighet ${c.questionId}`);
    for (const c of topDisagreements(r)) if (!isConflict(c.user, c.party!)) violations.push(`«uenig» uten konflikt ${c.questionId}`);
  }
}
totalProfiles += checked;
json.textInvariants = { checked, violations };

/* ------------------------------------------------------------------ */
/* 7. Manuelle personas                                                */
/* ------------------------------------------------------------------ */
function explain(ans: Answers, parties: string[], title: string) {
  const s = computeResults(data, ans);
  line(`### ${title}`);
  line();
  line(`Besvart: ${s.answeredCount} spørsmål. Klassifisering: **${s.verdict}**${isModestFit(s) ? ' + merknad «treffet er mindre presist enn prosenten tilsier» (under 10 poeng over tilfeldighetsnivået)' : ''} (avstand 1–2: ${r1(s.gap ?? 0)} poeng; tilfeldighetsnivå ${pc(s.baseline)} %).`);
  line();
  line('| Plass | Parti | Score | 10–90-intervall | Andel øverst i bootstrap | Dekning | Spenn om ukjente var verst/best mulig |');
  line('|---:|---|---:|---|---:|---:|---|');
  s.ranking.forEach((r, i) => {
    const iv = s.uncertainty.interval[r.party];
    const [lo, hi] = unknownBounds(ans, r.party);
    line(`| ${i + 1} | ${r.party} | ${pc(r.score)} | ${pc(iv[0])}–${pc(iv[1])} | ${pc(s.uncertainty.topShare[r.party])} % | ${pc(r.coverage)} % | ${pc(lo)}–${pc(hi)} |`);
  });
  line();
  if (parties.length >= 2) {
    // Hvilke spørsmål avgjør rekkefølgen mellom de oppgitte partiene? Bidrag = w·a / Σw for hver.
    line(`**Spørsmålene som skiller ${parties.join(' / ')} mest** (bidrag til score i poeng; «–» = ukjent standpunkt):`);
    line();
    line(`| Spørsmål | Bruker | ${parties.map((p) => `${p} standpunkt`).join(' | ')} | ${parties.map((p) => `${p} bidrag`).join(' | ')} | Spredning |`);
    line(`|---|---:|${parties.map(() => '---:').join('|')}|${parties.map(() => '---:').join('|')}|---:|`);
    const res = parties.map((p) => s.ranking.find((r) => r.party === p)!);
    const den = res.map((r) => r.contributions.reduce((sum, c) => sum + c.weight, 0));
    const rows = res[0].contributions.map((c, i) => {
      const contrib = res.map((r, j) => { const cc = r.contributions[i]; return cc.agreement === null ? null : (cc.weight * cc.agreement) / den[j] * 100; });
      // «Skilleverdi»: forskjell i enighet × gjennomsnittlig vekt
      const ags = res.map((r) => r.contributions[i].agreement);
      const known = ags.filter((x) => x !== null) as number[];
      const spread = known.length >= 2 ? (Math.max(...known) - Math.min(...known)) * c.baseWeight : 0;
      return { c, contrib, parties: res.map((r) => r.contributions[i].party), spread };
    }).sort((a, b) => b.spread - a.spread).slice(0, 12);
    for (const r of rows) line(`| \`${r.c.questionId}\` | ${r.c.user}${r.c.importance ? ' ' + '★'.repeat(r.c.importance) : ''} | ${r.parties.map((v) => v ?? '–').join(' | ')} | ${r.contrib.map((v) => (v === null ? '–' : r1(v))).join(' | ')} | ${r1(r.spread * 100)} |`);
    line();
  }
  const ins = buildInsights(data, ans, s);
  line(`Genererte innsikter: ${ins.map((x) => x.kind + (x.kind === 'dealbreaker' ? `(${x.questionId})` : x.kind === 'closePair' ? `(${x.a}/${x.b})` : '')).join(', ') || 'ingen'}.`);
  line();
  return s;
}

line('## 6. Manuelle testpersoner');
line();
const HFV = (euMembership: number | null): Answers => ({
  econ_tax_level: { value: 2, importance: 1 },
  transport_fuel_tax: { value: 2, importance: 0 },
  transport_toll: { value: 2, importance: 0 },
  imm_level: { value: 2, importance: 1 },
  imm_family: { value: 1, importance: 0 },
  imm_residence: { value: 2, importance: 0 },
  imm_integration_req: { value: 2, importance: 0 },
  just_sentences: { value: 2, importance: 0 },
  just_alt_sentences: { value: -1, importance: 0 },
  def_budget: { value: 2, importance: 0 },
  def_nato_exit: { value: -3, importance: 1 },
  def_ukraine: { value: 2, importance: 0 },
  health_free_choice: { value: 2, importance: 0 },
  welfare_commercial: { value: 1, importance: 0 },
  health_trusts: { value: null, importance: 0 },
  drug_decrim: { value: 2, importance: 0 },
  drug_cannabis: { value: 2, importance: 0 },
  cli_target: { value: -1, importance: 0 },
  cli_co2_tax: { value: -1, importance: 0 },
  cli_domestic: { value: 0, importance: 0 },
  oil_explore: { value: 1, importance: 0 },
  oil_end_date: { value: -1, importance: 0 },
  energy_nuclear: { value: 3, importance: 0 },
  eu_eea: { value: -3, importance: 0 },
  eu_membership: { value: euMembership, importance: 0 },
});
line('Synthetic bruker: lavere skatt, lavere bilavgifter, strengere innvandring, strengere straff, pro NATO og høyere forsvarsbudsjett, offentlig helse med private leverandører, avkriminalisering, positiv til regulert cannabis, moderat på klima, pro kjernekraft, pro EØS. Alle andre spørsmål «vet ikke».');
line();
const hfv0 = explain(HFV(0), ['H', 'FrP', 'V'], 'Testperson H/FrP/V – EU-medlemskap = nøytral (0)');
const hfvN = explain(HFV(null), ['H', 'FrP', 'V'], 'Testperson H/FrP/V – EU-medlemskap = «vet ikke»');
{
  const base = HFV(null);
  const s0 = computeResults(data, base);
  const flips: string[] = [];
  for (const id of Object.keys(base)) {
    if (base[id].value === null) continue;
    const s2 = computeResults(data, { ...base, [id]: { ...base[id], importance: 2 } });
    if (s2.ranking[0].party !== s0.ranking[0].party) flips.push(`\`${id}\` → ${s2.ranking[0].party} (${pc(s2.ranking[0].score)} mot ${s0.ranking[0].party} ${pc(s2.ranking.find((r) => r.party === s0.ranking[0].party)!.score)})`);
  }
  line(`**Viktighet i praksis (samme testperson, «vet ikke» på EU):** av ${s0.answeredCount} besvarte spørsmål er det ${flips.length} der ★★ alene endrer hvilket parti som er øverst${flips.length ? ': ' + flips.join('; ') : ''}.`);
  line();
}
json.personaHFV = { neutral: hfv0.ranking.map((r) => [r.party, r.score]), dontKnow: hfvN.ranking.map((r) => [r.party, r.score]), verdict: [hfv0.verdict, hfvN.verdict] };

// Kryss-politisk velger: venstre på økonomi, streng på innvandring og justis, liberal på verdier/rus,
// pro-EU, høy klimaambisjon, pro kjernekraft og pro NATO.
const cross: Answers = {};
const crossTarget: Target = { econ: -1, immigration: 1, justice: 1, social: 1, intl: 1, climate: 1, central: 1 };
for (const q of Q) {
  const dims = Object.entries(q.dims);
  const v = dims.length ? (3 * dims.reduce((s, [d, sign]) => s + sign * (crossTarget[d] ?? 0), 0)) / dims.length : 0;
  cross[q.id] = { value: clamp(v), importance: 0 };
}
Object.assign(cross, { energy_nuclear: { value: 3, importance: 0 }, def_budget: { value: 3, importance: 0 }, def_nato_exit: { value: -3, importance: 0 } });
line('Kryss-politisk velger: helt venstre på økonomi, helt restriktiv på innvandring og streng på justis, helt liberal på verdier og rus, helt for EU-integrasjon, høy klimaprioritet, for sentralisering, for kjernekraft og NATO. Svarer på alle 80.');
line();
const cr = explain(cross, [], 'Kryss-politisk velger');
const tops = cr.ranking.map((r) => r.score!);
line(`Beste parti får ${pc(tops[0])} %, som er ${tops[0] < quant(calib.top, 0.95) ? '**innenfor**' : 'over'} 95-persentilen for beste parti hos en helt tilfeldig bruker (${pc(quant(calib.top, 0.95))} %).`);
line();
// Politisk «hjemløs» velger: kombinerer kjernesaker som i dataene ligger hos ulike partier.
const homeless: Answers = {};
const homelessTarget: Target = { econ: 1, immigration: 1, climate: 1, social: 1, intl: -1, central: -1, justice: -1 };
for (const q of Q) {
  const dims = Object.entries(q.dims);
  const v = dims.length ? (3 * dims.reduce((s, [d, sign]) => s + sign * (homelessTarget[d] ?? 0), 0)) / dims.length : 0;
  homeless[q.id] = { value: clamp(v), importance: 0 };
}
Object.assign(homeless, { energy_nuclear: { value: 3, importance: 0 }, def_nato_exit: { value: 2, importance: 0 }, def_budget: { value: -2, importance: 0 } });
line('Politisk «hjemløs» velger: marked og lavere skatt, restriktiv innvandring, høy klimaprioritet, liberal på verdier og rus, EU-skeptisk, desentralisering, mildere straffer, for kjernekraft, skeptisk til NATO og mot høyere forsvarsbudsjett. Svarer på alle 80.');
line();
const hl = explain(homeless, [], 'Politisk «hjemløs» velger');
line(`Beste parti får ${pc(hl.ranking[0].score)} %; tilfeldighetsnivået for disse svarene er ${pc(hl.baseline)} %. Klassifisering: **${hl.verdict}**${isModestFit(hl) ? ', med merknaden om at treffet er mindre presist enn prosenten tilsier' : ''}.`);
line();
json.homeless = { ranking: hl.ranking.map((r) => [r.party, r.score]), verdict: hl.verdict, baseline: hl.baseline };
json.cross = { ranking: cr.ranking.map((r) => [r.party, r.score]), verdict: cr.verdict, randomTopP95: quant(calib.top, 0.95) };

line('## 7. Oppsummering');
line();
line(`- Antall syntetiske profiler kjørt: **${totalProfiles}**.`);
line(`- Invariantsjekk av genererte innsikter: ${checked} resultater kontrollert, ${violations.length} brudd${violations.length ? ': ' + [...new Set(violations)].join('; ') : ''}.`);
json.totalProfiles = totalProfiles;

writeFileSync('STRESS_TEST.md', out.join('\n') + '\n');
mkdirSync('test-results', { recursive: true });
writeFileSync('test-results/stress.json', JSON.stringify(json, null, 2));
console.log(`STRESS_TEST.md skrevet (${totalProfiles} profiler, ${violations.length} brudd).`);
