/**
 * Dobbelttellingsanalyse: hvor stor andel av vekten hvert tema, hver semantisk blokk og hver akse får
 * når en bruker svarer på alle spørsmål med normal viktighet, og hvilke spørsmålspar som er nesten
 * perfekt korrelert på tvers av partiene (|r| ≥ 0,9).
 *
 *   npx vite-node scripts/qa/clusters.ts   → skriver test-results/clusters.md
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import raw from '../../src/data/data.json';
import type { Answers, Dataset, Question } from '../../src/lib/types';
import { baseWeights } from '../../src/lib/scoring';

const d = raw as Dataset;
const all: Answers = Object.fromEntries(d.questions.map((q) => [q.id, { value: 0, importance: 0 as const }]));
const w = baseWeights(d, all);
const tot = [...w.values()].reduce((a, b) => a + b, 0);
const share = (f: (q: Question) => boolean) => d.questions.filter(f).reduce((s, q) => s + w.get(q.id)! / tot, 0);
const pc = (x: number) => `${(x * 100).toFixed(1)} %`;
const out: string[] = [];

out.push('### Vektandel per tema (alle 80 besvart, normal viktighet)', '', '| Tema | Antall spørsmål | Klynger | Vektandel | Andel av spørsmålene |', '|---|---:|---:|---:|---:|');
for (const t of d.themes) {
  const qs = d.questions.filter((q) => q.theme === t.id);
  out.push(`| ${t.label} | ${qs.length} | ${new Set(qs.map((q) => q.cluster)).size} | ${pc(share((q) => q.theme === t.id))} | ${pc(qs.length / d.questions.length)} |`);
}

const BLOCS: Array<[string, (q: Question) => boolean]> = [
  ['Klima/olje/energi/bil (klima, energi, transport)', (q) => ['klima', 'energi', 'transport'].includes(q.theme)],
  ['EU/suverenitet (eu + energy_cables + agri_tariffs)', (q) => q.theme === 'eu' || ['energy_cables', 'agri_tariffs'].includes(q.id)],
  ['Innvandring', (q) => q.theme === 'innvandring'],
  ['Skatt/omfordeling (okonomi + arbeid + fam_child_benefit_tax)', (q) => ['okonomi', 'arbeid'].includes(q.theme) || q.id === 'fam_child_benefit_tax'],
  ['Verdier/frihet (rus + frihet + familie)', (q) => ['rus', 'frihet', 'familie'].includes(q.theme)],
  ['Forsvar/utenriks', (q) => q.theme === 'forsvar'],
];
out.push('', '### Semantiske blokker på tvers av tema', '', '| Blokk | Antall spørsmål | Vektandel | Andel av spørsmålene |', '|---|---:|---:|---:|');
for (const [label, f] of BLOCS) out.push(`| ${label} | ${d.questions.filter(f).length} | ${pc(share(f))} | ${pc(d.questions.filter(f).length / d.questions.length)} |`);

const dims: Record<string, number> = {};
for (const q of d.questions) {
  const ks = Object.keys(q.dims);
  for (const k of ks) dims[k] = (dims[k] ?? 0) + w.get(q.id)! / tot / ks.length;
}
out.push('', '### Vektandel per akse (spørsmål med flere akser deles likt; spørsmål uten akse telles ikke)', '', '| Akse | Vektandel |', '|---|---:|');
for (const dim of d.dimensions) out.push(`| ${dim.label} | ${pc(dims[dim.id] ?? 0)} |`);

const P = d.parties.map((p) => p.id);
const pos = (q: string, p: string) => d.positions.find((x) => x.question === q && x.party === p)!.position;
const pairs: string[] = [];
for (let i = 0; i < d.questions.length; i++) {
  for (let j = i + 1; j < d.questions.length; j++) {
    const a = d.questions[i];
    const b = d.questions[j];
    const ps = P.filter((p) => pos(a.id, p) !== null && pos(b.id, p) !== null);
    if (ps.length < 6) continue;
    const x = ps.map((p) => pos(a.id, p)!);
    const y = ps.map((p) => pos(b.id, p)!);
    const mx = x.reduce((s, v) => s + v, 0) / x.length;
    const my = y.reduce((s, v) => s + v, 0) / y.length;
    let sxy = 0, sxx = 0, syy = 0;
    x.forEach((v, k) => { sxy += (v - mx) * (y[k] - my); sxx += (v - mx) ** 2; syy += (y[k] - my) ** 2; });
    if (sxx === 0 || syy === 0) continue;
    const r = sxy / Math.sqrt(sxx * syy);
    if (Math.abs(r) >= 0.9) pairs.push(`| \`${a.id}\` | \`${b.id}\` | ${r.toFixed(2)} | ${ps.length} | ${a.theme === b.theme ? 'ja' : 'nei'} | ${a.cluster === b.cluster ? 'ja' : 'nei'} |`);
  }
}
out.push('', `### Spørsmålspar med |r| ≥ 0,9 over partienes standpunkter (${pairs.length} par)`, '', '| Spørsmål A | Spørsmål B | r | Partier med begge kjent | Samme tema | Samme klynge |', '|---|---|---:|---:|---|---|', ...pairs);

mkdirSync('test-results', { recursive: true });
writeFileSync('test-results/clusters.md', out.join('\n') + '\n');
console.log(out.join('\n'));
