#!/usr/bin/env node
// Genererer RESEARCH_AUDIT.md, QUESTION_BANK.md og data/*.json fra research-dataene.
// Kjøres med `npm run audit`. Tallene i rapportene er derfor alltid i takt med dataene.

import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadAll } from './build-data.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const d = loadAll();
const P = d.parties;
const Q = d.questions;
const pos = (q, p) => d.positions.find((x) => x.question === q && x.party === p);
const label = (v) => (v === null ? 'ukjent' : ['Helt uenig', 'Uenig', 'Litt uenig', 'Nøytral', 'Litt enig', 'Enig', 'Helt enig'][v + 3]);
const fmt = (v) => (v === null ? '?' : v > 0 ? `+${v}` : `${v}`);
const themeLabel = (id) => d.themes.find((t) => t.id === id).label;

// ---------- Separate JSON-filer (datastruktur som beskrevet i oppdraget) ----------
mkdirSync(join(root, 'data'), { recursive: true });
const srcById = Object.fromEntries(d.sources.map((s) => [s.id, s]));
writeFileSync(join(root, 'data', 'parties.json'), JSON.stringify(P, null, 2) + '\n');
writeFileSync(join(root, 'data', 'questions.json'), JSON.stringify(Q, null, 2) + '\n');
writeFileSync(join(root, 'data', 'sources.json'), JSON.stringify(d.sources, null, 2) + '\n');
writeFileSync(
  join(root, 'data', 'positions.json'),
  JSON.stringify(
    d.positions.map((p) => ({
      questionId: p.question,
      party: p.party,
      position: p.position === null ? 'unknown' : p.position,
      confidence: p.confidence,
      reasoning: p.reasoning,
      sources: p.refs.map((r) => ({ title: srcById[r.source].title, url: srcById[r.source].url, pages: r.pages, accessed: srcById[r.source].accessed })),
    })),
    null,
    2,
  ) + '\n',
);

// ---------- Statistikk ----------
const known = d.positions.filter((p) => p.position !== null);
const count = (arr, f) => arr.filter(f).length;
const conf = (c) => count(d.positions, (p) => p.confidence === c);

const perParty = P.map((p) => {
  const rows = d.positions.filter((x) => x.party === p.id);
  return {
    p,
    high: count(rows, (r) => r.confidence === 'HIGH'),
    medium: count(rows, (r) => r.confidence === 'MEDIUM'),
    low: count(rows, (r) => r.confidence === 'LOW'),
    unknown: count(rows, (r) => r.position === null),
    pages: new Set(rows.flatMap((r) => r.refs.filter((x) => x.pages).map((x) => `${x.source}:${x.pages}`))).size,
    secondary: count(rows, (r) => r.refs.some((x) => srcById[x.source].type !== 'partiprogram')),
  };
});

const perQuestion = Q.map((q) => {
  const rows = P.map((p) => pos(q.id, p.id));
  const vals = rows.filter((r) => r.position !== null).map((r) => r.position);
  return {
    q,
    unknown: count(rows, (r) => r.position === null),
    low: count(rows, (r) => r.confidence === 'LOW'),
    spread: vals.length ? Math.max(...vals) - Math.min(...vals) : 0,
  };
});
const weak = perQuestion.filter((x) => x.unknown >= 4 || x.unknown + x.low >= 5).sort((a, b) => b.unknown + b.low - (a.unknown + a.low));

// Retningsbalanse: hvor mange påstander der «enig» trekker mot hver pol
const dirBalance = d.dimensions.map((dim) => ({
  dim,
  plus: count(Q, (q) => q.dims[dim.id] === 1),
  minus: count(Q, (q) => q.dims[dim.id] === -1),
}));

// Mulige duplikater: høy korrelasjon i partiprofil mellom spørsmålspar
function corr(a, b) {
  const pairs = P.map((p) => [pos(a, p.id).position, pos(b, p.id).position]).filter(([x, y]) => x !== null && y !== null);
  if (pairs.length < 6) return null;
  const mx = pairs.reduce((s, [x]) => s + x, 0) / pairs.length;
  const my = pairs.reduce((s, [, y]) => s + y, 0) / pairs.length;
  let sxy = 0, sxx = 0, syy = 0;
  for (const [x, y] of pairs) { sxy += (x - mx) * (y - my); sxx += (x - mx) ** 2; syy += (y - my) ** 2; }
  if (sxx === 0 || syy === 0) return null;
  return { r: sxy / Math.sqrt(sxx * syy), n: pairs.length };
}
const dupes = [];
for (let i = 0; i < Q.length; i++)
  for (let j = i + 1; j < Q.length; j++) {
    if (Q[i].theme !== Q[j].theme) continue;
    const c = corr(Q[i].id, Q[j].id);
    if (c && Math.abs(c.r) >= 0.95) dupes.push({ a: Q[i], b: Q[j], ...c, sameCluster: Q[i].cluster === Q[j].cluster });
  }

// ---------- RESEARCH_AUDIT.md ----------
const audit = [];
audit.push(`# Research-audit – Valgomat 2027

> Generert automatisk av \`scripts/build-audit.mjs\` fra dataene i \`research/\`. Ikke rediger for hånd – kjør \`npm run audit\`.

**Dato for siste research:** ${d.meta.lastUpdated}

## Sammendrag

| Mål | Verdi |
|---|---|
| Antall spørsmål | ${Q.length} |
| Antall partier | ${P.length} |
| Mulige partiposisjoner (spørsmål × partier) | ${d.positions.length} |
| Kodede partiposisjoner | ${known.length} (${Math.round((known.length / d.positions.length) * 100)} %) |
| – HIGH confidence | ${conf('HIGH')} |
| – MEDIUM confidence | ${conf('MEDIUM')} |
| – LOW confidence | ${conf('LOW')} |
| Unknown (programmet tar ikke stilling) | ${d.positions.length - known.length} |
| Kilder i kildebiblioteket | ${d.sources.length} (${count(d.sources, (s) => s.type === 'partiprogram')} partiprogrammer, ${count(d.sources, (s) => s.type !== 'partiprogram')} sekundærkilde) |

Alle ${d.positions.length} kombinasjoner av spørsmål og parti er gjennomgått manuelt mot partiets program. Standpunkter som ikke kunne dokumenteres, er satt til **unknown** – de er ikke gjettet. Byggeskriptet (\`scripts/build-data.mjs\`) avviser data der et kodet standpunkt mangler kilde, der en sidehenvisning ligger utenfor dokumentet, eller der et parti mangler koding.

## Metode for researchen

1. De vedtatte programmene for stortingsperioden 2025–2029 ble lastet ned fra partienes egne nettsider (SHA-256 og sidetall er lagret i \`research/sources.json\`).
2. Tekst ble ekstrahert per PDF-side, og for hvert spørsmål ble alle ni programmer søkt gjennom med flere søkeord og lest i sammenheng (relevante kapitler ble lest i sin helhet for skatt, innvandring, klima, energi og forsvar).
3. Hvert standpunkt ble kodet −3…+3 med confidence:
   - **HIGH** – direkte og tydelig formulert i vedtatt program
   - **MEDIUM** – tydelig utledet fra ett eller flere offisielle standpunkter
   - **LOW** – indirekte eller uklart
4. Begrunnelsen er en kort parafrase med henvisning til PDF-side. Det er ikke brukt lange sitater.
5. Der programmet ikke tar stilling, ble det gjort et begrenset søk etter nyere offisielle standpunkter (prioritet 2–5 i kildehierarkiet). Bare kilder som kunne verifiseres direkte, ble brukt. Én sekundærkilde (Altinget om Aps landsmøtevedtak om EU, april 2025) er brukt.
6. Eldre kilder er bevisst forkastet: for eksempel en artikkel fra 2017 om Aps syn på arveavgift ble ikke brukt fordi den ikke kan representere partiets syn i 2025–2029.

## Kildedekning per parti

| Parti | HIGH | MEDIUM | LOW | Unknown | Andel kodet | Unike sidehenvisninger | Sekundærkilder |
|---|---:|---:|---:|---:|---:|---:|---:|
${perParty.map((x) => `| ${x.p.name} | ${x.high} | ${x.medium} | ${x.low} | ${x.unknown} | ${Math.round(((Q.length - x.unknown) / Q.length) * 100)} % | ${x.pages} | ${x.secondary} |`).join('\n')}

**Merknad om Arbeiderpartiet:** Aps program er mer overordnet enn de andre partienes på flere felt (særlig skatt, rus og etiske spørsmål), og har derfor flest ukjente standpunkter. Ap sitter i regjering, og regjeringens budsjetter kunne vært brukt som supplement. Regjeringen.no avviste imidlertid automatisk henting under researchen, og standpunkter som ikke kunne verifiseres direkte, er derfor ikke kodet. Dette bør prioriteres ved neste oppdatering (se \`RESEARCH_PLAN.md\`).

**Merknad om Rødt:** roedt.no avviste automatisk nedlasting (HTTP 429). Programteksten ble hentet fra et speil hos Norges idrettsforbund og bærer teksten «vedtatt på Rødts landsmøte 28. februar til 2. mars 2025». Sidetallene bør kontrolleres mot partiets egen fil.

## Spørsmål med svakt datagrunnlag

Spørsmål der minst fire partier er ukjent, eller der ukjent + LOW er minst fem:

| Spørsmål | Ukjent | LOW | Spredning (maks − min) |
|---|---:|---:|---:|
${weak.map((x) => `| ${x.q.short} (\`${x.q.id}\`) | ${x.unknown} | ${x.low} | ${x.spread} |`).join('\n')}

Disse spørsmålene er beholdt fordi de måler reelle konfliktlinjer og skiller tydelig mellom partiene som har tatt stilling. Ukjente standpunkter påvirker ikke scoren, men reduserer «datagrunnlaget» som vises til brukeren.

## Spredning per spørsmål

Alle spørsmål har en spredning på minst 2 skalasteg mellom partiene (kontrollert i testene). Antall spørsmål per spredning:

| Spredning | Antall spørsmål |
|---:|---:|
${[2, 3, 4, 5, 6].map((s) => `| ${s} | ${count(perQuestion, (x) => x.spread === s)} |`).join('\n')}

## Spørsmål vurdert og forkastet

Følgende kandidater ble undersøkt, men forkastet fordi programmene ga for lite grunnlag eller fordi nesten alle partier var enige:

- **Lovfestet minstelønn** – bare FrP (positiv omtale) og Sp (imot) tar stilling.
- **Sekstimersdag / kortere arbeidstid** – bare SV og Rødt tar stilling.
- **Pensjonsregulering** – nesten ingen programmer tar stilling etter omleggingen i 2024.
- **Dagpenger** – for lite variasjon.
- **Gratis skolemat** – alle partier som tar stilling, er for; ingen er dokumentert imot.
- **Skolepenger for studenter utenfor EØS** – bare SV, Rødt og Venstre tar stilling.
- **Karakterer i barneskolen** – ingen programmer tar tydelig stilling.
- **Flytting av statlige arbeidsplasser** – bred enighet.
- **Momskutt på mat** – bare FrP vil halvere matmomsen generelt; andre gjelder bare frukt og grønt.
- **Selskapsskatt** – for få tydelige standpunkter.
- **Stemmerett for 16-åringer** og **monarki/republikk** – for få partier tar stilling.
- **Egen lavalder for straff** – bare FrP tar stilling.

## Mulige duplikater

Spørsmålspar i samme tema med svært lik partiprofil (|r| ≥ 0,95 over partiene med kjent standpunkt på begge). Korrelasjon på tvers av temaer er ikke tatt med, fordi partiene i stor grad ordner seg langs de samme konfliktlinjene uansett tema, og det ville gjort nesten alle spørsmål til «duplikater»:

${dupes.length === 0 ? 'Ingen.' : `| Spørsmål A | Spørsmål B | r | n | Samme klynge |\n|---|---|---:|---:|---|\n${dupes.map((x) => `| ${x.a.short} | ${x.b.short} | ${x.r.toFixed(2)} | ${x.n} | ${x.sameCluster ? 'ja' : 'nei'} |`).join('\n')}`}

Høy korrelasjon i partienes standpunkter betyr ikke at spørsmålene er duplikater for velgerne: mange velgere kan for eksempel være for EØS, men mot EU-medlemskap. Spørsmål som i tillegg er tematisk tett beslektet, er lagt i samme klynge og vektes ned mot dobbelttelling (se metodesiden).

## Retningsbalanse i påstandene

For å motvirke at «ja-sigere» systematisk trekkes mot én side, er påstandene formulert i begge retninger. Antall påstander der «enig» trekker mot hver pol:

| Akse | Venstre pol | Høyre pol | «Enig» → venstre | «Enig» → høyre |
|---|---|---|---:|---:|
${dirBalance.map((x) => `| ${x.dim.label} | ${x.dim.left} | ${x.dim.right} | ${x.minus} | ${x.plus} |`).join('\n')}

## Dato og versjon

- Research gjennomført: ${d.meta.lastUpdated}
- Programperiode: 2025–2029 (nyeste vedtatte programmer)
- Neste planlagte gjennomgang: se \`RESEARCH_PLAN.md\`
`);
writeFileSync(join(root, 'RESEARCH_AUDIT.md'), audit.join('\n'));

// ---------- QUESTION_BANK.md ----------
const qb = [];
qb.push(`# Spørsmålsbank – Valgomat 2027

> Generert automatisk fra \`research/questions/\` og \`research/coding/\` av \`scripts/build-audit.mjs\`. Rediger kildefilene, ikke denne filen.

${Q.length} spørsmål fordelt på ${d.themes.length} temaer. Partienes koding vises som −3 (helt uenig) til +3 (helt enig), «?» = ukjent. Bokstav etter tallet angir confidence (H/M/L).

## Kvalitetskontroll av spørsmålene

Alle spørsmål er gjennomgått for:

- **Ledende språk:** ladede ord er erstattet med nøytrale (f.eks. «kommersielle selskaper» i stedet for «velferdsprofitører», «stramme inn» i stedet for «stenge grensene»).
- **Dobbeltspørsmål:** hver påstand inneholder ett krav. Der eksempler er brukt (f.eks. «for eksempel sterkøl og vin i butikk»), er de illustrasjoner av samme krav.
- **Falske motsetninger:** formuleringer som «X i stedet for Y» er bare brukt der partiene faktisk ser det som en avveining (f.eks. klimakutt hjemme vs. kvotekjøp, jernbane vs. motorvei).
- **Duplikater:** sterkt beslektede spørsmål er slått sammen eller differensiert, og resten er lagt i felles klynge (se RESEARCH_AUDIT.md).
- **Partiskhet:** påstandene er formulert i begge retninger (se retningsbalansen i RESEARCH_AUDIT.md). Argumentene for og mot er skrevet som «steelman»-argumenter med samme antall punkter og samme form på begge sider (kontrolleres automatisk i testene).
- **Skillende kraft:** alle spørsmål skiller minst to skalasteg mellom partiene (kontrolleres i testene).

${P.map((p) => `${p.short} = ${p.name}`).join(' · ')}
`);
for (const t of d.themes) {
  const qs = Q.filter((q) => q.theme === t.id);
  qb.push(`\n## ${t.label} (${qs.length})\n`);
  qb.push(`| # | Påstand | Klynge | ${P.map((p) => p.short).join(' | ')} |`);
  qb.push(`|---|---|---|${P.map(() => '---:').join('|')}|`);
  qs.forEach((q, i) => {
    qb.push(`| ${i + 1} | ${q.text} <br><sub>\`${q.id}\`</sub> | ${q.cluster.split('/')[1]} | ${P.map((p) => { const x = pos(q.id, p.id); return x.position === null ? '?' : `${fmt(x.position)}${x.confidence[0]}`; }).join(' | ')} |`);
  });
}
writeFileSync(join(root, 'QUESTION_BANK.md'), qb.join('\n') + '\n');

console.log(`✓ RESEARCH_AUDIT.md, QUESTION_BANK.md og data/*.json skrevet (${dupes.length} korrelerte par, ${weak.length} svake spørsmål)`);
void label;
void themeLabel;
