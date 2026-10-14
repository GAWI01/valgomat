import { describe, expect, it } from 'vitest';
import realData from '../src/data/data.json';
import type { Answers, Dataset, Position, Question } from '../src/lib/types';
import {
  agreement,
  baseWeights,
  classify,
  computeResults,
  scoreParty,
  userDimensions,
  chanceBaseline,
  isModestFit,
  isAgreement,
  isConflict,
  mulberry32,
  IMPORTANCE_WEIGHT,
} from '../src/lib/scoring';
import { buildInsights } from '../src/lib/insights';

const data = realData as Dataset;

/** Et lite, kontrollert testdatasett. */
function makeData(opts: {
  questions: Array<Partial<Question> & { id: string; theme: string }>;
  positions: Record<string, Record<string, number | null>>;
  confidence?: Record<string, Record<string, 'HIGH' | 'MEDIUM' | 'LOW'>>;
}): Dataset {
  const parties = Object.keys(opts.positions).map((id) => ({ id, name: id, short: id, color: '#000', programSource: 's' }));
  const themes = [...new Set(opts.questions.map((q) => q.theme))].map((id) => ({ id, label: id }));
  const questions: Question[] = opts.questions.map((q) => ({
    short: q.id, text: q.id, background: '', pro: [], con: [], dims: {}, cluster: `${q.theme}/${q.id}`, ...q,
  }) as Question);
  const positions: Position[] = [];
  for (const [party, byQ] of Object.entries(opts.positions)) {
    for (const q of questions) {
      const v = byQ[q.id];
      positions.push({
        question: q.id, party,
        position: v ?? null,
        confidence: v === null || v === undefined ? null : opts.confidence?.[party]?.[q.id] ?? 'HIGH',
        reasoning: '', refs: [],
      });
    }
  }
  return { meta: { lastUpdated: '', scale: { min: -3, max: 3 } }, themes, dimensions: [{ id: 'econ', label: '', left: '', right: '' }], parties, sources: [], questions, positions };
}

const ans = (value: number | null, importance: 0 | 1 | 2 = 0) => ({ value, importance });

describe('agreement', () => {
  it('er 1 ved identiske svar og 0 ved maksimal avstand', () => {
    expect(agreement(2, 2)).toBe(1);
    expect(agreement(3, -3)).toBe(0);
    expect(agreement(0, 3)).toBeCloseTo(0.5);
  });
});

describe('identisk og motsatt profil (ekte data)', () => {
  for (const party of data.parties) {
    it(`${party.short}: identiske svar gir svært høy score, motsatte svar gir lav score`, () => {
      const same: Answers = {};
      const opposite: Answers = {};
      for (const p of data.positions.filter((x) => x.party === party.id && x.position !== null)) {
        same[p.question] = ans(p.position!);
        opposite[p.question] = ans(-p.position! || 3);
      }
      const r = computeResults(data, same);
      const self = r.ranking.find((x) => x.party === party.id)!;
      expect(self.score!).toBeGreaterThan(0.99);
      expect(r.ranking[0].party).toBe(party.id);

      const ro = computeResults(data, opposite);
      const selfO = ro.ranking.find((x) => x.party === party.id)!;
      expect(selfO.score!).toBeLessThan(0.45);
      // Partiet skal ligge helt nederst eller nest nederst (et enda mer ytterliggående parti kan havne under).
      expect(ro.ranking.slice(-2).map((x) => x.party)).toContain(party.id);
    });
  }
});

describe('Vet ikke', () => {
  it('påvirker ikke scoren – identisk med å ikke svare', () => {
    const d = makeData({
      questions: [{ id: 'a', theme: 't1' }, { id: 'b', theme: 't1' }, { id: 'c', theme: 't2' }],
      positions: { P: { a: 3, b: -2, c: 1 }, Q: { a: -3, b: 2, c: 0 } },
    });
    const base: Answers = { a: ans(2), c: ans(1) };
    const withDontKnow: Answers = { ...base, b: ans(null, 2) };
    const r1 = computeResults(d, base);
    const r2 = computeResults(d, withDontKnow);
    for (const p of ['P', 'Q']) {
      expect(r2.ranking.find((x) => x.party === p)!.score).toBeCloseTo(r1.ranking.find((x) => x.party === p)!.score!, 12);
    }
    expect(r2.dontKnowCount).toBe(1);
    expect(r2.answeredCount).toBe(2);
  });

  it('behandles ikke som nøytralt svar', () => {
    const d = makeData({ questions: [{ id: 'a', theme: 't' }, { id: 'b', theme: 't2' }], positions: { P: { a: 0, b: 3 } } });
    const neutral = scoreParty(d, { a: ans(0), b: ans(3) }, 'P');
    const dk = scoreParty(d, { a: ans(null), b: ans(3) }, 'P');
    expect(neutral.contributions).toHaveLength(2);
    expect(dk.contributions).toHaveLength(1);
  });
});

describe('Ukjent partistandpunkt', () => {
  it('verken straffer eller belønner partiet', () => {
    const d = makeData({
      questions: [{ id: 'a', theme: 't1' }, { id: 'b', theme: 't2' }],
      positions: { P: { a: 3, b: null } },
    });
    const onlyA = scoreParty(d, { a: ans(1) }, 'P');
    const withB_agree = scoreParty(d, { a: ans(1), b: ans(3) }, 'P');
    const withB_disagree = scoreParty(d, { a: ans(1), b: ans(-3) }, 'P');
    expect(withB_agree.score).toBeCloseTo(onlyA.score!, 12);
    expect(withB_disagree.score).toBeCloseTo(onlyA.score!, 12);
    // men det reduserer datagrunnlaget
    expect(withB_agree.coverage).toBeLessThan(1);
    expect(onlyA.coverage).toBe(1);
  });

  it('gir ingen score når ingen standpunkter er kjent', () => {
    const d = makeData({ questions: [{ id: 'a', theme: 't' }], positions: { P: { a: null } } });
    expect(scoreParty(d, { a: ans(2) }, 'P').score).toBeNull();
  });
});

describe('Viktighet', () => {
  const qs = Array.from({ length: 10 }, (_, i) => ({ id: `q${i}`, theme: `t${i}` }));
  const posP = Object.fromEntries(qs.map((q, i) => [q.id, i === 0 ? -3 : 3]));
  const d = makeData({ questions: qs, positions: { P: posP } });
  const answers: Answers = Object.fromEntries(qs.map((q) => [q.id, ans(3)]));

  it('øker innflytelsen til viktige spørsmål', () => {
    const plain = scoreParty(d, answers, 'P').score!;
    const important = scoreParty(d, { ...answers, q0: ans(3, 2) }, 'P').score!;
    expect(important).toBeLessThan(plain);
  });

  it('er moderat: ett ⭐⭐-spørsmål kan ikke dominere resultatet', () => {
    const important = scoreParty(d, { ...answers, q0: ans(3, 2) }, 'P').score!;
    // 9 av 10 helt enige, 1 helt uenig med dobbel vekt → 9/11 ≈ 0.82
    expect(important).toBeCloseTo(9 / 11, 5);
    expect(important).toBeGreaterThan(0.75);
    expect(IMPORTANCE_WEIGHT[2]).toBeLessThanOrEqual(2);
  });
});

describe('Temanormalisering', () => {
  it('et tema med mange spørsmål dominerer ikke lineært', () => {
    // Tema A: 9 spørsmål der P er enig. Tema B: 1 spørsmål der P er helt uenig.
    const qs = [
      ...Array.from({ length: 9 }, (_, i) => ({ id: `a${i}`, theme: 'A' })),
      { id: 'b0', theme: 'B' },
    ];
    const pos = Object.fromEntries(qs.map((q) => [q.id, q.theme === 'A' ? 3 : -3]));
    const d = makeData({ questions: qs, positions: { P: pos } });
    const answers: Answers = Object.fromEntries(qs.map((q) => [q.id, ans(3)]));
    const score = scoreParty(d, answers, 'P').score!;
    // Uten normalisering: 9/10 = 0.9. Med √n-normalisering: √9/(√9+√1) = 0.75.
    expect(score).toBeCloseTo(0.75, 6);
    const w = baseWeights(d, answers);
    const themeA = [...w.entries()].filter(([k]) => k.startsWith('a')).reduce((s, [, v]) => s + v, 0);
    expect(themeA / w.get('b0')!).toBeCloseTo(3, 6);
  });
});

describe('Klyngenormalisering mot dobbelttelling', () => {
  it('tre korrelerte spørsmål i samme klynge teller som √3, ikke 3', () => {
    const qs = [
      { id: 'toll', theme: 'T', cluster: 'T/bil' },
      { id: 'fuel', theme: 'T', cluster: 'T/bil' },
      { id: 'ev', theme: 'T', cluster: 'T/bil' },
      { id: 'rail', theme: 'T', cluster: 'T/tog' },
    ];
    const d = makeData({ questions: qs, positions: { P: { toll: 3, fuel: 3, ev: 3, rail: -3 } } });
    const answers: Answers = { toll: ans(3), fuel: ans(3), ev: ans(3), rail: ans(3) };
    const score = scoreParty(d, answers, 'P').score!;
    // Uten klynger: 3/4 = 0.75. Med klynger: √3/(√3+1) ≈ 0.634
    expect(score).toBeCloseTo(Math.sqrt(3) / (Math.sqrt(3) + 1), 6);
  });
});

describe('Confidence', () => {
  it('LOW-confidence teller mindre enn HIGH', () => {
    const d = makeData({
      questions: [{ id: 'a', theme: 'A' }, { id: 'b', theme: 'B' }],
      positions: { P: { a: 3, b: -3 } },
      confidence: { P: { b: 'LOW' } },
    });
    const s = scoreParty(d, { a: ans(3), b: ans(3) }, 'P').score!;
    expect(s).toBeCloseTo(1 / 1.4, 6);
  });
});

describe('Uavgjort og nære resultater', () => {
  it('to nesten like partier fremstilles ikke som klar vinner', () => {
    const qs = Array.from({ length: 20 }, (_, i) => ({ id: `q${i}`, theme: `t${i % 5}` }));
    const P = Object.fromEntries(qs.map((q) => [q.id, 2]));
    const Q = Object.fromEntries(qs.map((q, i) => [q.id, i === 0 ? 1 : 2]));
    const R = Object.fromEntries(qs.map((q) => [q.id, -3]));
    const d = makeData({ questions: qs, positions: { P, Q, R } });
    const answers: Answers = Object.fromEntries(qs.map((q) => [q.id, ans(2)]));
    const res = computeResults(d, answers);
    expect(res.verdict).not.toBe('clear');
    expect(res.contenders).toEqual(expect.arrayContaining(['P', 'Q']));
    expect(res.gap!).toBeLessThan(2.5);
  });

  it('en tydelig vinner klassifiseres som klar match', () => {
    const qs = Array.from({ length: 20 }, (_, i) => ({ id: `q${i}`, theme: `t${i % 5}` }));
    const P = Object.fromEntries(qs.map((q) => [q.id, 2]));
    const Q = Object.fromEntries(qs.map((q) => [q.id, -1]));
    const d = makeData({ questions: qs, positions: { P, Q } });
    const answers: Answers = Object.fromEntries(qs.map((q) => [q.id, ans(2)]));
    expect(computeResults(d, answers).verdict).toBe('clear');
  });

  it('for få svar gir «insufficient»', () => {
    const d = makeData({ questions: [{ id: 'a', theme: 't' }], positions: { P: { a: 1 }, Q: { a: 2 } } });
    const res = computeResults(d, { a: ans(2) });
    expect(res.verdict).toBe('insufficient');
    expect(classify(res.ranking, res.uncertainty, 1).verdict).toBe('insufficient');
  });
});

describe('Usikkerhet (bootstrap)', () => {
  it('er deterministisk for samme svar', () => {
    const answers: Answers = Object.fromEntries(data.questions.slice(0, 30).map((q, i) => [q.id, ans((i % 7) - 3)]));
    const a = computeResults(data, answers).uncertainty.topShare;
    const b = computeResults(data, answers).uncertainty.topShare;
    expect(a).toEqual(b);
    const total = Object.values(a).reduce((s, v) => s + v, 0);
    expect(total).toBeCloseTo(1, 6);
  });
});

describe('Politisk profil', () => {
  it('viser ikke en akse uten nok svar', () => {
    const d = makeData({ questions: [{ id: 'a', theme: 't', dims: { econ: 1 } }], positions: { P: { a: 1 } } });
    expect(userDimensions(d, { a: ans(3) })[0].value).toBeNull();
  });
});

describe('Innsikter', () => {
  it('flagger konflikt på ⭐⭐-sak hos toppartiet', () => {
    const qs = Array.from({ length: 12 }, (_, i) => ({ id: `q${i}`, theme: `t${i % 4}` }));
    const P = Object.fromEntries(qs.map((q, i) => [q.id, i === 0 ? -3 : 3]));
    const Q = Object.fromEntries(qs.map((q) => [q.id, -2]));
    const d = makeData({ questions: qs, positions: { P, Q } });
    const answers: Answers = Object.fromEntries(qs.map((q, i) => [q.id, ans(3, i === 0 ? 2 : 0)]));
    const res = computeResults(d, answers);
    const ins = buildInsights(d, answers, res);
    expect(ins.some((x) => x.kind === 'dealbreaker' && x.party === 'P' && x.questionId === 'q0')).toBe(true);
  });
});

describe('Datasettets integritet', () => {
  it('har 70–90 spørsmål, ni partier og komplett matrise', () => {
    expect(data.questions.length).toBeGreaterThanOrEqual(70);
    expect(data.questions.length).toBeLessThanOrEqual(90);
    expect(data.parties).toHaveLength(9);
    expect(data.positions).toHaveLength(data.questions.length * data.parties.length);
  });
  it('alle kodede standpunkter har confidence og kilde', () => {
    for (const p of data.positions) {
      if (p.position !== null) {
        expect(p.confidence).not.toBeNull();
        expect(p.refs.length).toBeGreaterThan(0);
        expect(data.sources.some((s) => s.id === p.refs[0].source)).toBe(true);
      } else {
        expect(p.confidence).toBeNull();
      }
    }
  });
  it('hvert spørsmål skiller mellom minst to partier', () => {
    for (const q of data.questions) {
      const vals = data.positions.filter((p) => p.question === q.id && p.position !== null).map((p) => p.position!);
      expect(Math.max(...vals) - Math.min(...vals), q.id).toBeGreaterThanOrEqual(2);
    }
  });
  it('hvert spørsmål har balanserte argumenter (2–4 for og mot, omtrent like mange)', () => {
    for (const q of data.questions) {
      expect(Math.abs(q.pro.length - q.con.length), q.id).toBeLessThanOrEqual(1);
    }
  });
});

describe('Tilfeldighetsnivå («ingen parti passer spesielt godt»)', () => {
  const rnd = mulberry32(42);
  const pick = () => Math.floor(rnd() * 7) - 3;

  it('et partis egen profil passer klart bedre enn tilfeldig stokkede svar', () => {
    for (const party of data.parties) {
      const answers: Answers = {};
      for (const p of data.positions.filter((x) => x.party === party.id && x.position !== null)) answers[p.question] = ans(p.position!);
      const res = computeResults(data, answers);
      expect(res.verdict).not.toBe('weak');
      expect(res.ranking[0].score!).toBeGreaterThan(res.baseline! + 0.15);
      expect(isModestFit(res)).toBe(false);
    }
  });

  it('helt tilfeldige svar klassifiseres som regel som «ingen parti passer spesielt godt»', () => {
    let weak = 0;
    for (let i = 0; i < 40; i++) {
      const answers: Answers = Object.fromEntries(data.questions.map((q) => [q.id, ans(pick())]));
      if (computeResults(data, answers).verdict === 'weak') weak++;
    }
    expect(weak).toBeGreaterThanOrEqual(30);
  });

  it('er deterministisk og null ved for få svar', () => {
    const answers: Answers = Object.fromEntries(data.questions.slice(0, 20).map((q, i) => [q.id, ans((i % 7) - 3)]));
    expect(chanceBaseline(data, answers)).toBe(chanceBaseline(data, answers));
    expect(chanceBaseline(data, { [data.questions[0].id]: ans(1) })).toBeNull();
  });
});

describe('Merkelapper for enighet og konflikt', () => {
  it('«enig» krever nærhet og samme side', () => {
    expect(isAgreement(2, 3)).toBe(true);
    expect(isAgreement(1, 3)).toBe(true);
    expect(isAgreement(0, 1)).toBe(true);
    expect(isAgreement(1, -1)).toBe(false); // to steg, men hver sin side
    expect(isAgreement(0, 2)).toBe(false);
  });
  it('«konflikt» krever motsatt side eller stor avstand', () => {
    expect(isConflict(2, -1)).toBe(true);
    expect(isConflict(-3, 3)).toBe(true);
    expect(isConflict(0, 3)).toBe(false); // nøytral mot ytterpunkt
    expect(isConflict(-1, 3)).toBe(true); // fire steg
    expect(isConflict(1, -1)).toBe(false);
  });
});
