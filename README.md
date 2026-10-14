# Valgomat 2027

En transparent og kildebasert norsk valgomat. Den sammenligner brukerens svar på **80 politiske spørsmål** med de ni største partienes **vedtatte programmer for 2025–2029**, og forklarer *hvorfor* partiene matcher: per spørsmål, per tema, med kilde og sikkerhet for hvert partistandpunkt.

**Sist oppdatert: 14. oktober 2026**

## Hovedtrekk

- 80 spørsmål i 15 temaer, hvert med bakgrunn og balanserte argumenter for og mot
- 720 partiposisjoner (80 × 9): 572 kodet med sidehenvisning og confidence (HIGH/MEDIUM/LOW), 148 ærlig markert som *unknown*
- Sjudelt skala + «Vet ikke», og ★ / ★★ for viktige saker (moderat vekting)
- Scoring med tema- og klyngenormalisering mot dobbelttelling, confidence-vekting og bootstrap-basert usikkerhet
- Resultat: rangering, «klar match / nær match / usikkert», datagrunnlag per parti, match per tema, politisk profil på sju akser, datadrevne «dealbreakers», og kilder for hvert standpunkt
- Mobil først, mørk/lys modus, tastaturnavigasjon, autosave lokalt, ingen data sendes noe sted

## Kom i gang

```bash
npm install
npm run dev        # bygger data og starter utviklingsserver
npm test           # scoringstester og dataintegritet
npm run build      # produksjonsbygg i dist/ (statisk, kan hostes hvor som helst)
npm run audit      # regenererer RESEARCH_AUDIT.md, QUESTION_BANK.md og data/*.json
```

Nettlesertest (mobil 320/375 px og desktop, inkl. horisontal scroll, autosave og nullstilling):

```bash
npm run build && npx vite preview --port 4173 &
node scripts/qa/smoke.mjs
npx vite-node scripts/qa/stress.ts     # stresstest med 8000+ syntetiske profiler → STRESS_TEST.md
npx vite-node scripts/qa/clusters.ts   # dobbelttellingsanalyse → test-results/clusters.md
```

## Struktur

| Sti | Innhold |
|---|---|
| `research/questions/` | Spørsmålene (tekst, tema, klynge, akser, bakgrunn, for/mot) |
| `research/coding/` | Partikodingen: verdi, confidence, sidehenvisning, begrunnelse |
| `research/sources.json`, `research/parties.json` | Kildebibliotek og partiliste |
| `research/tools/` | Verktøy for å laste ned programmer og søke i dem |
| `scripts/build-data.mjs` | Validerer og bygger `src/data/data.json` |
| `scripts/build-audit.mjs` | Genererer audit, spørsmålsbank og `data/*.json` |
| `data/` | `parties.json`, `questions.json`, `positions.json`, `sources.json` |
| `src/lib/scoring.ts` | Scoringsmodellen (dokumentert i koden og på metodesiden) |
| `src/lib/insights.ts` | Datadrevne innsikter / dealbreakers |
| `src/pages/` | Forside, spørsmålsflyt, resultat, parti, sak, metode, «hvorfor ulikt», kilder |
| `tests/` | Vitest-tester for scoring og dataintegritet |

## Dokumentasjon

- [`RESEARCH_PLAN.md`](RESEARCH_PLAN.md) – kildehierarki, primærkilder, datamodell, algoritme og oppdateringsplan mot 2027
- [`QUESTION_BANK.md`](QUESTION_BANK.md) – alle spørsmål med partienes koding og kvalitetskontroll
- [`RESEARCH_AUDIT.md`](RESEARCH_AUDIT.md) – full revisjon av alle 720 posisjoner
- [`POLITICAL_QA.md`](POLITICAL_QA.md) – red-team-faktasjekk av alle standpunkter, med endringslogg
- [`STRESS_TEST.md`](STRESS_TEST.md) – stresstest, kalibrering og testpersoner
- [`FINAL_VALIDATION_REPORT.md`](FINAL_VALIDATION_REPORT.md) – sluttrapport (PASS/FIXED/WARNING/UNKNOWN/BLOCKER)

## Teknologivalg

Vite + React + TypeScript + Tailwind CSS. Next.js ble vurdert, men valgomaten trenger ingen server: alt beregnes i nettleseren, svarene skal ikke forlate brukerens maskin, og et rent statisk bygg er enklest å drifte og hoste. Diagrammene er enkel SVG/HTML i stedet for et chartbibliotek, for full kontroll over tilgjengelighet og mobilvisning.

## Forbehold

Kodingen av partistandpunkter krever skjønn. Alle begrunnelser og kilder er åpne nettopp for at de skal kunne etterprøves. Resultatet er et analyseverktøy, ikke en fasit på hvilket parti noen «er». Fant du en feil, rett den i `research/` og kjør `npm test`.
