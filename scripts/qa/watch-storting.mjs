/**
 * Sjekker status på Stortinget for sakene i research/qa/watchlist.json og lister nye saker som kan
 * gi grunnlag for å kode ukjente standpunkter. Bruker data.stortinget.no (åpent API).
 *   npm run qa:watch            → skriver status, avslutter med kode 2 hvis en fulgt sak er ferdigbehandlet
 */
import { readFileSync } from 'node:fs';

const STATUS = { 1: 'behandlet', 2: 'til behandling', 3: 'mottatt/varslet', 5: 'trukket' };
const watch = JSON.parse(readFileSync('research/qa/watchlist.json', 'utf8'));

function sesjoner(now = new Date()) {
  // Stortingssesjonen starter 1. oktober.
  const y = now.getMonth() >= 9 ? now.getFullYear() : now.getFullYear() - 1;
  return [`${y - 1}-${y}`, `${y}-${y + 1}`];
}

async function saker(sesjon) {
  const r = await fetch(`https://data.stortinget.no/eksport/saker?sesjonid=${sesjon}&format=json`);
  if (!r.ok) throw new Error(`data.stortinget.no svarte ${r.status} for ${sesjon}`);
  return (await r.json()).saker_liste ?? [];
}

const alle = [];
for (const s of sesjoner()) alle.push(...(await saker(s)).map((x) => ({ ...x, sesjon: s })));
const byId = new Map(alle.map((x) => [String(x.id), x]));

let ferdig = 0;
console.log('Fulgte saker:');
for (const w of watch.stortinget) {
  const s = byId.get(w.sakId);
  const st = s ? STATUS[s.status] ?? `status ${s.status}` : 'ikke funnet i de to siste sesjonene';
  if (s?.status === 1) ferdig++;
  console.log(`  ${s?.status === 1 ? '✓' : '·'} ${w.henvisning} – ${w.tema}: ${st}${s?.henvisning ? ` (${s.henvisning})` : ''} → ${w.qids.join(', ')}`);
}

const kjente = new Set(watch.stortinget.map((w) => w.sakId));
const ord = watch.sok.ord.map((o) => o.toLowerCase());
const kandidater = alle.filter((x) => !kjente.has(String(x.id)) && ord.some((o) => (x.tittel ?? '').toLowerCase().includes(o)));
console.log(`\nAndre saker som kan være relevante (${kandidater.length}):`);
for (const x of kandidater) console.log(`  ${STATUS[x.status] ?? x.status} · ${x.henvisning ?? ''} · ${(x.tittel ?? '').slice(0, 120)} (sak ${x.id})`);

for (const l of watch.landsmoter) console.log(`\nLandsmøte: ${l.parti} – ${l.merknad}`);
if (ferdig) {
  console.log(`\n${ferdig} fulgt(e) sak(er) er ferdigbehandlet – les merknadene og vurder koding (POLITICAL_QA.md §6b).`);
  process.exitCode = 2;
}
