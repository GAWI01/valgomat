# Valgomat 2027

En åpen og kildebasert norsk valgomat. Du svarer på **80 politiske påstander**. Valgomaten sammenligner svarene dine med de ni stortingspartienes **vedtatte programmer for 2025–2029** og viser *hvorfor* partiene passer eller ikke passer: per spørsmål, per tema, med kilde og sikkerhet for hvert partistandpunkt.

**Sist oppdatert: 14. oktober 2026** · Partier: Ap, H, FrP, Sp, SV, Rødt, Venstre, KrF og MDG

## Hovedtrekk

- **80 spørsmål i 15 temaer.** Hvert spørsmål har nøytral bakgrunn og balanserte argumenter for og mot. Alle er gjennomgått for skjev formulering.
- **720 partistandpunkter (80 × 9):** 618 kodet med kilde, sidetall, begrunnelse og sikkerhet (høy/middels/lav). 102 er ærlig markert som *ukjent*, fordi partiet ikke tar stilling. Vi gjetter aldri.
- **Skala:** sju trinn pluss «Vet ikke». Du kan markere saker som viktige (★) eller svært viktige (★★).
- **Scoring:**
  - normalisering per tema og per klynge av nært beslektede spørsmål, så ingen sak teller dobbelt;
  - vekting etter hvor sikker kodingen er;
  - usikkerhetsanslag med bootstrap.
- **Ærlige resultater:**
  - «Klar match», «Nær match» eller «Usikkert mellom flere partier».
  - **«Ingen parti passer spesielt godt»** når beste parti ikke matcher bedre enn de samme svarene stokket tilfeldig.
  - Advarsel når et parti har lite datagrunnlag.
- **Forklaringer:**
  - de spørsmålene du er mest enig og mest uenig med hvert parti i;
  - mulige «dealbreakers» (et toppparti som er uenig med deg i en sak du har markert som viktig);
  - match per tema;
  - politisk profil på sju akser;
  - kilde for hvert standpunkt.
- **Personvern:** svarene lagres bare i nettleseren din. Den bygde siden har en Content-Security-Policy som forbyr alle nettverkskall, og det finnes ingen analyseverktøy.
- **Tilgjengelighet:** utformet for mobil først, med mørk og lys modus, en glassdesign i Apple-stil (gjennomskinnelige flater med uskarp bakgrunn, respekterer «redusert gjennomsiktighet») i nøytral grafitt (partifargene brukes bare til å skille partiene), WCAG AA-kontrast sjekket med axe-core, tastaturnavigasjon og automatisk lagring.

## Kom i gang

Krever Node 22.12 eller nyere.

```bash
npm install
npm run dev        # bygger data og starter utviklingsserver
npm test           # 40 tester: scoring, dataintegritet og sikkerhet
npm run build      # statisk produksjonsbygg i dist/ – kan hostes hvor som helst
npm run audit      # regenererer RESEARCH_AUDIT.md, QUESTION_BANK.md og data/*.json
```

### Kvalitetssikring

```bash
npm run build && npx vite preview --port 4173 &
BASE=http://localhost:4173/ npm run qa:smoke   # nettlesertest: 320/375 px og desktop, mørk modus, autosave, nullstilling
BASE=http://localhost:4173/ npm run qa:review  # skjermbilder av alle sider (mobil/desktop, lys/mørk) + axe-core → test-results/review/
npm run qa:stress                               # 8000+ syntetiske profiler → STRESS_TEST.md
npm run qa:clusters                             # dobbelttellingsanalyse → test-results/clusters.md
npm run qa:watch                                # Stortingssaker som kan avklare ukjente standpunkter
npm run party-review                            # gjennomgangspakker til partiene → party-review/
```

## Datagrunnlag og kvalitet

| | |
|---|---|
| Primærkilder | Partienes vedtatte programmer 2025–2029, med SHA-256 for hver PDF. Sidetallene i valgomaten er PDF-sidetall. |
| Andre kilder | 30 standpunkter bygger på partienes nettsider, landsmøtevedtak, regjeringens budsjettforslag eller partienes egne forslag og merknader i Stortinget (høyst «middels» sikkerhet) |
| Faktasjekk | Alle 720 kodinger er lest på nytt mot kildene i en red-team-gjennomgang ([POLITICAL_QA.md](POLITICAL_QA.md)) |
| Blind andregangskoding | 145 standpunkter er kodet blindt på nytt: vektet kappa 0,92, og 0,96 for vanlige kodinger ([research/qa/reliabilitet.md](research/qa/reliabilitet.md)) |
| Partienes kontroll | Pakker med følgebrev ligger klare i [party-review/](party-review/README.md) |

Dekningen per parti (andel av vekten med kjent standpunkt når alle spørsmål er besvart) er 69–86 %. Ap har lavest dekning fordi programmet er generelt formulert. Se [FINAL_VALIDATION_REPORT.md](FINAL_VALIDATION_REPORT.md).

## Struktur

| Sti | Innhold |
|---|---|
| `research/questions/` | Spørsmålene: tekst, tema, klynge, akser, bakgrunn og argumenter for og mot |
| `research/coding/` | Partikodingen: verdi, sikkerhet, kilde/sidetall og begrunnelse |
| `research/sources.json`, `research/parties.json` | Kildebibliotek og partiliste |
| `research/qa/` | Faktasjekk, endringslister, blindkoding, Stortings- og budsjettkilder, overvåkingsliste |
| `research/tools/` | Laste ned programmer, søke i dem og importere manuelt nedlastede dokumenter |
| `scripts/build-data.mjs` | Validerer researchfilene og bygger `src/data/data.json` |
| `scripts/build-audit.mjs` | Genererer audit, spørsmålsbank og `data/*.json` |
| `scripts/qa/` | Nettlesertest, stresstest, klyngeanalyse, reliabilitet, Stortingsovervåking |
| `data/` | Åpne data: `parties.json`, `questions.json`, `positions.json`, `sources.json` |
| `src/lib/scoring.ts` | Scoringsmodellen (dokumentert i koden og på metodesiden) |
| `src/lib/insights.ts` | Datadrevne innsikter og dealbreakers |
| `src/pages/` | Forside, spørsmålsflyt, resultat, parti, sak, metode, «Hvorfor ulikt?», kilder |
| `tests/` | Vitest-tester for scoring, dataintegritet og sikkerhet |
| `party-review/` | Gjennomgangspakker til partiene (md og csv), følgebrev og rutine |

## Dokumentasjon

- [RESEARCH_PLAN.md](RESEARCH_PLAN.md): kildehierarki, datamodell, algoritme og oppdateringsplan fram mot 2027
- [QUESTION_BANK.md](QUESTION_BANK.md): alle spørsmål med partienes koding
- [RESEARCH_AUDIT.md](RESEARCH_AUDIT.md): revisjon av alle 720 posisjoner, svake spørsmål og korrelasjoner
- [POLITICAL_QA.md](POLITICAL_QA.md): faktasjekk, ukjente standpunkter, Rødt-kilden, blindtest og full endringslogg
- [STRESS_TEST.md](STRESS_TEST.md): syntetiske profiler, kalibrering av prosentene, viktighet og testpersoner
- [FINAL_VALIDATION_REPORT.md](FINAL_VALIDATION_REPORT.md): sluttrapport med status for lansering

## Teknologi

Vite 7, React 19, TypeScript, Tailwind CSS 4 og Vitest 5. Valgomaten trenger ingen server. Alt beregnes i nettleseren, svarene forlater aldri brukerens maskin, og et statisk bygg er enkelt å drifte. Diagrammene er ren SVG/HTML, for full kontroll over tilgjengelighet og mobilvisning. `npm audit` viser 0 sårbarheter.

## Forbehold

Å kode partistandpunkter krever skjønn. Derfor er alle begrunnelser og kilder åpne, så de kan etterprøves. Prosenten er ikke en sannsynlighet og ikke en anbefaling. Resultatet er et analyseverktøy, ikke en fasit på hvilket parti noen «er». Har du funnet en feil? Rett den i `research/`, kjør `npm test` og send et forslag.
