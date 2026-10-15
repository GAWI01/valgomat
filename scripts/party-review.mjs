/**
 * Lager én gjennomgangspakke per parti (party-review/<parti>.md og .csv) som partiene kan bruke til å
 * kontrollere hvordan valgomaten har kodet dem. Kjør etter `npm run data`:
 *   node scripts/party-review.mjs
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const data = JSON.parse(readFileSync('src/data/data.json', 'utf8'));
const srcById = Object.fromEntries(data.sources.map((s) => [s.id, s]));
const themeLabel = Object.fromEntries(data.themes.map((t) => [t.id, t.label]));
const LABEL = { '-3': 'Helt uenig', '-2': 'Uenig', '-1': 'Litt uenig', 0: 'Nøytral / mellomposisjon', 1: 'Litt enig', 2: 'Enig', 3: 'Helt enig' };
const CONF = { HIGH: 'Høy', MEDIUM: 'Middels', LOW: 'Lav' };

const refText = (r) => {
  const s = srcById[r.source];
  if (!s) return r.source;
  const pages = r.pages ? `, s. ${r.pages}` : '';
  const url = r.pages && /\.pdf|dl=/.test(s.url) ? `${s.url}#page=${r.pages.split(/[,–-]/)[0].trim()}` : s.url;
  return `[${s.title}${pages}](${url})`;
};
const csvCell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;

mkdirSync('party-review', { recursive: true });
for (const party of data.parties) {
  const rows = data.questions.map((q) => ({ q, p: data.positions.find((x) => x.question === q.id && x.party === party.id) }));
  const coded = rows.filter((r) => r.p.position !== null);
  const unknown = rows.filter((r) => r.p.position === null);
  const md = [];
  md.push(`# Valgomat 2027 – gjennomgang for ${party.name}`);
  md.push('');
  md.push(`Datagrunnlag per ${data.meta.lastUpdated}. ${coded.length} av ${rows.length} standpunkter er kodet, ${unknown.length} står som «ukjent».`);
  md.push('');
  md.push('## Slik svarer dere');
  md.push('');
  md.push('1. Gå gjennom tabellen. For hvert standpunkt dere mener er feil, fyll ut kolonnene `partiets_forslag` og `kilde_fra_partiet` i den medfølgende CSV-fila (eller svar i e-post med spørsmålets id).');
  md.push('2. **Vi endrer bare et standpunkt når endringen kan dokumenteres** i en vedtatt kilde: partiprogrammet 2025–2029, et landsmøte- eller landsstyrevedtak, partiets egne publiserte politikksider, eller partiets egne forslag og merknader i Stortinget. Oppgi side, dato eller lenke.');
  md.push('3. For spørsmål som står som «ukjent»: hvis partiet har et vedtatt standpunkt, send kilden. Uten kilde blir standpunktet stående som ukjent – vi gjetter aldri.');
  md.push('4. Alle endringer som følge av tilbakemeldinger blir logget offentlig i valgomatens endringslogg, med kilden partiet oppga. Ordlyden i spørsmålene endres ikke på oppfordring fra ett parti.');
  md.push('');
  md.push('Skala: −3 helt uenig … +3 helt enig i påstanden. Sikkerhet: **Høy** = eksplisitt formulering som svarer direkte på påstanden, **Middels** = tydelig, men tolkning trengs, **Lav** = indirekte slutning.');
  md.push('');
  md.push('## Kodede standpunkter');
  md.push('');
  md.push('| id | Tema | Påstand | Kodet | Sikkerhet | Begrunnelse | Kilde |');
  md.push('|---|---|---|---|---|---|---|');
  for (const { q, p } of coded) {
    md.push(`| \`${q.id}\` | ${themeLabel[q.theme]} | ${q.text} | ${p.position > 0 ? '+' : ''}${p.position} ${LABEL[p.position]} | ${CONF[p.confidence]} | ${p.reasoning.replace(/\|/g, '/')} | ${p.refs.map(refText).join('; ')} |`);
  }
  md.push('');
  md.push('## Ukjente standpunkter');
  md.push('');
  md.push('Vi fant ikke at partiet tar stilling i programmet eller andre offisielle kilder. Har partiet et vedtatt standpunkt, send kilden.');
  md.push('');
  md.push('| id | Tema | Påstand | Merknad fra kodingen |');
  md.push('|---|---|---|---|');
  for (const { q, p } of unknown) md.push(`| \`${q.id}\` | ${themeLabel[q.theme]} | ${q.text} | ${p.reasoning.replace(/\|/g, '/')} |`);
  md.push('');
  writeFileSync(`party-review/${party.id}.md`, md.join('\n'));

  const csv = [['id', 'tema', 'påstand', 'kodet_verdi', 'sikkerhet', 'begrunnelse', 'kilde', 'partiets_forslag', 'kilde_fra_partiet', 'kommentar'].map(csvCell).join(',')];
  for (const { q, p } of rows) {
    csv.push([q.id, themeLabel[q.theme], q.text, p.position ?? 'ukjent', p.confidence ? CONF[p.confidence] : '', p.reasoning, p.refs.map((r) => `${srcById[r.source]?.title ?? r.source}${r.pages ? ` s. ${r.pages}` : ''}`).join('; '), '', '', ''].map(csvCell).join(','));
  }
  writeFileSync(`party-review/${party.id}.csv`, '﻿' + csv.join('\r\n') + '\r\n');
}
console.log(`✓ party-review/: ${data.parties.length} partier (md + csv)`);
