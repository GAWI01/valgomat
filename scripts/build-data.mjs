#!/usr/bin/env node
// Bygger src/data/data.json fra de menneskelesbare research-filene i research/.
//
//   research/questions/*.txt  – spørsmålstekst, tema, klynge, akser, bakgrunn og for/mot
//   research/coding/*.txt     – partienes kodede standpunkter med kilde og confidence
//   research/parties.json     – partiliste
//   research/sources.json     – kildebibliotek
//
// Skriptet stopper med feilmelding dersom dataene er inkonsistente (for eksempel et parti
// som mangler koding, en sidehenvisning utenfor dokumentet eller en ukjent kilde).
// Det er bevisst strengt: valgomaten skal aldri vise et standpunkt uten sporbar kilde.

import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const research = join(root, 'research');

export const LAST_UPDATED = '2026-10-14';

export const THEMES = [
  { id: 'okonomi', label: 'Økonomi og skatt' },
  { id: 'arbeid', label: 'Arbeid, velferd og bolig' },
  { id: 'helse', label: 'Helse' },
  { id: 'innvandring', label: 'Innvandring og integrering' },
  { id: 'justis', label: 'Justis og politi' },
  { id: 'rus', label: 'Ruspolitikk' },
  { id: 'klima', label: 'Klima og natur' },
  { id: 'energi', label: 'Olje og energi' },
  { id: 'transport', label: 'Transport' },
  { id: 'skole', label: 'Skole og utdanning' },
  { id: 'familie', label: 'Familie og abort' },
  { id: 'frihet', label: 'Personlig frihet og etikk' },
  { id: 'distrikt', label: 'Distrikt og landbruk' },
  { id: 'eu', label: 'EU og Europa' },
  { id: 'forsvar', label: 'Forsvar og utenriks' },
];

// Aksene i den politiske profilen. «Enig» på et spørsmål med dim=+1 trekker mot høyre pol.
export const DIMENSIONS = [
  { id: 'econ', label: 'Økonomi', left: 'Mer stat og omfordeling', right: 'Mer marked og lavere skatt' },
  { id: 'social', label: 'Verdier og frihet', left: 'Mer konservativ', right: 'Mer liberal' },
  { id: 'climate', label: 'Klima og natur', left: 'Lavere prioritet', right: 'Høy prioritet' },
  { id: 'justice', label: 'Justis', left: 'Vekt på rehabilitering', right: 'Strengere reaksjoner' },
  { id: 'immigration', label: 'Innvandring', left: 'Mer liberal', right: 'Mer restriktiv' },
  { id: 'central', label: 'Styring', left: 'Desentralisering', right: 'Større enheter/sentralisering' },
  { id: 'intl', label: 'Internasjonalt', left: 'Nasjonal suverenitet', right: 'Europeisk/internasjonal integrasjon' },
];

const CONFIDENCES = ['HIGH', 'MEDIUM', 'LOW'];

function fail(msg) {
  console.error(`\n✗ Datafeil: ${msg}\n`);
  process.exit(1);
}

function readDir(dir) {
  return readdirSync(dir)
    .filter((f) => f.endsWith('.txt'))
    .sort()
    .map((f) => ({ file: f, text: readFileSync(join(dir, f), 'utf8') }));
}

export function parseQuestions(files) {
  const questions = [];
  for (const { file, text } of files) {
    let cur = null;
    text.split('\n').forEach((raw, i) => {
      const line = raw.trimEnd();
      if (!line || line.startsWith('#') && !line.startsWith('### ')) return;
      if (line.startsWith('### ')) {
        cur = { id: line.slice(4).trim(), pro: [], con: [], dims: {}, file };
        questions.push(cur);
        return;
      }
      if (!cur) fail(`${file}:${i + 1}: felt utenfor spørsmål`);
      const m = line.match(/^(\w+):\s?(.*)$/);
      if (!m) fail(`${file}:${i + 1}: kan ikke tolke linjen «${line}»`);
      const [, key, value] = m;
      switch (key) {
        case 'tema': cur.theme = value.trim(); break;
        case 'klynge': cur.cluster = value.trim(); break;
        case 'kort': cur.short = value.trim(); break;
        case 'tekst': cur.text = value.trim(); break;
        case 'bakgrunn': cur.background = value.trim(); break;
        case 'for': cur.pro.push(value.trim()); break;
        case 'mot': cur.con.push(value.trim()); break;
        case 'dim':
          for (const part of value.split(',').map((s) => s.trim()).filter(Boolean)) {
            const [d, s] = part.split('=');
            const sign = Number(s);
            if (sign === 0) continue;
            if (!DIMENSIONS.some((x) => x.id === d) || ![1, -1].includes(sign)) fail(`${file}:${i + 1}: ugyldig akse «${part}»`);
            cur.dims[d] = sign;
          }
          break;
        default: fail(`${file}:${i + 1}: ukjent felt «${key}»`);
      }
    });
  }
  const ids = new Set();
  for (const q of questions) {
    if (ids.has(q.id)) fail(`duplisert spørsmål-id ${q.id}`);
    ids.add(q.id);
    for (const k of ['theme', 'cluster', 'short', 'text', 'background']) if (!q[k]) fail(`${q.id} mangler «${k}»`);
    if (!THEMES.some((t) => t.id === q.theme)) fail(`${q.id}: ukjent tema ${q.theme}`);
    if (q.pro.length < 2 || q.pro.length > 4 || q.con.length < 2 || q.con.length > 4) fail(`${q.id}: må ha 2–4 argumenter for og mot`);
    // Klyngene skal være tema-lokale slik at temanormaliseringen og klyngenormaliseringen ikke krysser hverandre.
    q.cluster = `${q.theme}/${q.cluster}`;
    delete q.file;
  }
  return questions;
}

export function parseCoding(files, questions, parties, sources) {
  const qids = new Set(questions.map((q) => q.id));
  const pids = new Set(parties.map((p) => p.id));
  const srcById = Object.fromEntries(sources.map((s) => [s.id, s]));
  const positions = [];
  const seen = new Set();
  for (const { file, text } of files) {
    text.split('\n').forEach((raw, i) => {
      const line = raw.trim();
      if (!line || line.startsWith('#')) return;
      const parts = line.split('|');
      if (parts.length !== 6) fail(`${file}:${i + 1}: forventet 6 felt, fant ${parts.length}`);
      const [qid, party, val, conf, ref, reasoning] = parts.map((s) => s.trim());
      if (!qids.has(qid)) fail(`${file}:${i + 1}: ukjent spørsmål ${qid}`);
      if (!pids.has(party)) fail(`${file}:${i + 1}: ukjent parti ${party}`);
      const key = `${qid}|${party}`;
      if (seen.has(key)) fail(`${file}:${i + 1}: dobbel koding ${key}`);
      seen.add(key);
      if (!reasoning) fail(`${file}:${i + 1}: mangler begrunnelse`);
      let position = null;
      let confidence = null;
      if (val === 'U') {
        if (conf !== '-') fail(`${file}:${i + 1}: «unknown» skal ha confidence «-»`);
      } else {
        position = Number(val);
        if (!Number.isInteger(position) || position < -3 || position > 3) fail(`${file}:${i + 1}: ugyldig verdi ${val}`);
        if (!CONFIDENCES.includes(conf)) fail(`${file}:${i + 1}: ugyldig confidence ${conf}`);
        confidence = conf;
      }
      // Kildehenvisning: «13», «31-32», «11,46», «src:id» eller «src:id@12». «-» betyr ingen relevant side.
      const refs = [];
      const partyDef = parties.find((p) => p.id === party);
      if (ref !== '-') {
        let srcId = partyDef.programSource;
        let pagesPart = ref;
        if (ref.startsWith('src:')) {
          const [id, pg] = ref.slice(4).split('@');
          srcId = id;
          pagesPart = pg ?? '';
        }
        const src = srcById[srcId];
        if (!src) fail(`${file}:${i + 1}: ukjent kilde ${srcId}`);
        const pages = pagesPart ? pagesPart.split(',').map((s) => s.trim()) : [];
        for (const p of pages) {
          const [a, b] = p.split('-').map(Number);
          for (const n of [a, b].filter((x) => x !== undefined)) {
            if (!Number.isInteger(n) || n < 1 || (src.pages && n > src.pages)) fail(`${file}:${i + 1}: side ${p} er utenfor ${srcId}`);
          }
        }
        refs.push({ source: srcId, pages: pages.join(', ') || null });
      } else if (position !== null) {
        fail(`${file}:${i + 1}: kodet standpunkt uten kildehenvisning`);
      }
      // Et ukjent standpunkt som likevel peker på en side, viser hvor vi har lett – men programmet er
      // alltid kilden for «tar ikke stilling».
      if (position === null && refs.length === 0) refs.push({ source: partyDef.programSource, pages: null });
      positions.push({ question: qid, party, position, confidence, reasoning, refs });
    });
  }
  for (const q of questions) for (const p of parties) if (!seen.has(`${q.id}|${p.id}`)) fail(`mangler koding for ${q.id} / ${p.id}`);
  return positions;
}

export function loadAll() {
  const parties = JSON.parse(readFileSync(join(research, 'parties.json'), 'utf8'));
  const sources = JSON.parse(readFileSync(join(research, 'sources.json'), 'utf8'));
  const questions = parseQuestions(readDir(join(research, 'questions')));
  const positions = parseCoding(readDir(join(research, 'coding')), questions, parties, sources);
  for (const p of parties) if (!sources.some((s) => s.id === p.programSource)) fail(`${p.id}: ukjent programkilde`);
  return {
    meta: { lastUpdated: LAST_UPDATED, scale: { min: -3, max: 3 } },
    themes: THEMES,
    dimensions: DIMENSIONS,
    parties,
    sources,
    questions,
    positions,
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const data = loadAll();
  mkdirSync(join(root, 'src', 'data'), { recursive: true });
  writeFileSync(join(root, 'src', 'data', 'data.json'), JSON.stringify(data, null, 1) + '\n');
  const known = data.positions.filter((p) => p.position !== null).length;
  console.log(`✓ ${data.questions.length} spørsmål, ${data.parties.length} partier, ${data.positions.length} posisjoner (${known} kodet, ${data.positions.length - known} ukjent), ${data.sources.length} kilder`);
}
