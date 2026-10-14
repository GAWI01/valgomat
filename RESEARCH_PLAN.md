# Research-plan – Valgomat 2027

Dette dokumentet beskriver hvordan researchen bak valgomaten er gjort, hvilke kilder som brukes, datamodellen, scoringsalgoritmen og hvordan standpunktene skal holdes oppdatert fram mot 2027.

**Sist oppdatert: 14. oktober 2026.**

## 1. Hvilke programmer gjelder i 2027?

Stortingsvalget ble holdt i september 2025. De nyeste **vedtatte** programmene er derfor partienes programmer for stortingsperioden **2025–2029**, vedtatt på landsmøtene vinteren og våren 2025. Programmer for valget i 2029 vil normalt vedtas først vinteren/våren 2029. Valgomaten bygger derfor på 2025–2029-programmene, og viser tydelig «Sist oppdatert»-dato og programperiode på forsiden, i bunnteksten og på kildesiden.

Vi presenterer ikke eldre standpunkter (f.eks. fra 2021-programmene eller avisartikler fra før 2025) som gjeldende. Der nyere offisielle standpunkter finnes og kan verifiseres, legges de inn som egen kilde med lavere prioritet enn programmet (eksempel: Aps landsmøtevedtak om EU i april 2025).

## 2. Kildehierarki

1. Partienes vedtatte partiprogrammer (2025–2029)
2. Partienes offisielle nettsider og politiske dokumenter
3. Alternative statsbudsjett og konkrete forslag (for regjeringspartier: regjeringens budsjettproposisjoner)
4. Stortingsforslag og dokumenterte avstemninger
5. Uttalelser fra partiledelse/fagpolitikere når programmet ikke avklarer saken
6. Seriøse sekundærkilder – bare som supplement, og bare når innholdet er verifisert

I denne versjonen bygger 571 av 572 kodede standpunkter på nivå 1. Ett bygger på nivå 6 (Altinget om Aps landsmøtevedtak).

## 3. Primærkilder per parti

| Parti | Kilde | Vedtatt | PDF-sider |
|---|---|---|---:|
| Arbeiderpartiet | [Partiprogram 2025–2029](https://www.arbeiderpartiet.no/politikken/partiprogram/) (PDF lenket fra partiets side) | Landsmøtet april 2025 | 180 |
| Høyre | [Stortingsvalgprogram 2025–2029, tekstversjon](https://hoyre.no/content/uploads/sites/83/2025/04/Hoyres_stortingsvalgprogram_2025-2029_-_tekstversjon.pdf) | Landsmøtet mars 2025 | 88 |
| Fremskrittspartiet | [Partiprogram 2025–2029](https://www.frp.no/files/Program/2025/Program-2025-2029.pdf) | 2025 | 125 |
| Senterpartiet | [Stortingsvalgprogram 2025–2029 (bokmål)](https://www.senterpartiet.no/politikk) | 2025 | 140 |
| SV | [Arbeidsprogram 2025–2029](https://www.sv.no/politikken/arbeidsprogram/) | Landsmøtet 16. mars 2025 | 53 |
| Rødt | [Arbeidsprogram 2025–2029](https://roedt.no/arbeidsprogram) | Landsmøtet 28. feb.–2. mars 2025 | 106 |
| Venstre | [Stortingsvalgprogram 2025–2029](https://www.venstre.no/assets/venstre-stortingsprogram-2025-2029.pdf) | Landsmøtet mars 2025 | 68 |
| KrF | [Stortingsprogram 2025–2029](https://krf.no/content/uploads/2020/09/Partiprogram-2025-2029.pdf) | 2025 | 86 |
| MDG | [Arbeidsprogram 2025–2029](https://www.mdg.no/politikk) | 2025 | 112 |

Fullstendige URL-er, SHA-256 for hver PDF og merknader (bl.a. at Rødts tekst ble hentet fra et speil) ligger i `research/sources.json`.

## 4. Arbeidsflyt (slik den ble gjennomført)

1. **Research:** programmene ble lastet ned og tekst ekstrahert per PDF-side (`research/tools/fetch-sources.sh`).
2. **Spørsmålsdesign:** rundt 110 kandidater ble skissert over alle temaene i oppdraget.
3. **Bias-/duplikatreview:** kandidater som var ledende, doble, duplikater eller ikke skilte mellom partiene, ble omformulert eller forkastet. Resultat: 80 spørsmål (liste over forkastede kandidater i `RESEARCH_AUDIT.md`).
4. **Partikoding:** hvert spørsmål ble søkt opp i alle ni programmer (`research/tools/sok.py`), relevante avsnitt lest i sammenheng (`research/tools/side.py`) og kodet med verdi, confidence, sidehenvisning og kort parafrasert begrunnelse i `research/coding/*.txt`.
5. **Validering:** `scripts/build-data.mjs` avviser manglende koding, ukjente kilder og sidehenvisninger utenfor dokumentet. Testene kontrollerer at alle spørsmål skiller mellom partiene og at argumentene er balanserte.
6. **Audit:** `npm run audit` genererer `RESEARCH_AUDIT.md` og `QUESTION_BANK.md` fra dataene.

## 5. Datamodell

Research og frontend er skilt. Menneskelesbare kildefiler i `research/` bygges til JSON:

```
research/questions/*.txt   →  data/questions.json   (spørsmål, tema, klynge, akser, bakgrunn, for/mot)
research/coding/*.txt      →  data/positions.json   (ett standpunkt per spørsmål × parti)
research/parties.json      →  data/parties.json
research/sources.json      →  data/sources.json
                           →  src/data/data.json    (samlet, brukes av appen)
```

Ett standpunkt i `data/positions.json`:

```json
{
  "questionId": "imm_quota",
  "party": "V",
  "position": 3,
  "confidence": "HIGH",
  "reasoning": "Venstre vil at Norge tar imot minst så mange kvoteflyktninger som FN ber om.",
  "sources": [{ "title": "Venstres stortingsvalgprogram 2025–2029", "url": "https://…pdf", "pages": "48", "accessed": "2026-10-14" }]
}
```

`position` er −3…+3 eller `"unknown"`. `0` brukes bare om en dokumentert mellomposisjon – aldri som erstatning for «vet ikke». `confidence` er `HIGH`/`MEDIUM`/`LOW` (og `null` for unknown).

Kodeformatet i `research/coding/*.txt` er én linje per standpunkt:

```
spørsmål-id|parti|verdi (-3..3 eller U)|confidence (HIGH|MEDIUM|LOW|-)|kilde|begrunnelse
imm_quota|V|3|HIGH|48|Venstre vil at Norge tar imot minst så mange kvoteflyktninger som FN ber om.
eu_membership|Ap|-1|MEDIUM|src:altinget_ap_eu_2025|…
```

Kildefeltet er PDF-sider i partiets program (`48`, `31-32`, `11,46`), en annen kilde (`src:id` eller `src:id@side`) eller `-`.

**Nye partier** legges til i `research/parties.json` og `research/sources.json`, og får én linje per spørsmål i kodefilene. Byggeskriptet sier fra om noe mangler. Ingen kode i frontend må endres.

## 6. Scoringsalgoritme

Implementert i `src/lib/scoring.ts`, dokumentert for brukerne på siden «Hvordan beregnes resultatet?» og testet i `tests/scoring.test.ts`.

- Enighet per spørsmål: `a = 1 − |bruker − parti| / 6`
- Vekt: `w = temafaktor × klyngefaktor × viktighet × confidence`
  - viktighet 1 / 1,5 (★) / 2 (★★)
  - confidence 1 / 0,75 / 0,4
  - klyngefaktor `1/√k` for k besvarte spørsmål i samme klynge (mot dobbelttelling)
  - temafaktor `1/√n_eff` → hvert tema får innflytelse ∝ √(antall klyngejusterte svar)
- Matchscore: `Σ w·a / Σ w` over spørsmål der både bruker og parti har standpunkt. «Vet ikke» og ukjente partistandpunkt holdes utenfor.
- Datagrunnlag: andel av brukerens vekt der partiets standpunkt er kjent (confidence-justert).
- Usikkerhet: 400 trekk med bayesiansk bootstrap over spørsmålene → hvor ofte hvert parti er øverst og 10–90-persentil for scoren.
- Klassifisering: «klar match» / «nær match» / «usikkert mellom flere partier» ut fra avstand, bootstrap og datagrunnlag.

## 7. Plan for å holde standpunktene oppdatert fram mot 2027 (og 2029)

| Når | Hva | Hvordan |
|---|---|---|
| **Hvert kvartal** | Sjekk om programfilene er endret | `research/tools/fetch-sources.sh` sammenligner SHA-256. Endret fil → kontroller sidehenvisningene for partiet. |
| **Oktober hvert år** | Statsbudsjett og alternative budsjetter | Gå gjennom regjeringens forslag og partienes alternative budsjetter for skatte-, avgifts-, bistands- og forsvarsspørsmål. Prioriter Aps ukjente standpunkter (regjeringspartiet). |
| **Etter hvert landsmøte** | Nye vedtak og uttalelser | Partiene holder landsmøter hvert eller annethvert år. Vedtatte uttalelser som endrer et standpunkt, legges inn som egen kilde (nivå 2) med dato. |
| **Ved større saker i Stortinget** | Avstemninger | Bruk stortinget.no (voteringer) for spørsmål der programmet er uklart. Registrer saksnummer som kilde. |
| **Vår 2027** | Full gjennomgang før lokalvalget | Gå gjennom alle 720 kodinger på nytt, med vekt på spørsmål med `LOW` eller `unknown` (se RESEARCH_AUDIT.md). Oppdater «Sist oppdatert». |
| **2028–2029** | Nye programmer | Når programutkast for 2029–2033 publiseres, lag en egen gren med nye kodinger. Bytt til de vedtatte programmene først når de er vedtatt på landsmøtet. |

**Kjente forbedringspunkter for neste runde:**

1. Aps 30 ukjente standpunkter – særlig formuesskatt, arveavgift, eiendomsskatt, bompenger og etiske spørsmål – bør vurderes mot regjeringens budsjetter og dokumenterte avstemninger.
2. Rødts sidehenvisninger bør kontrolleres mot partiets egen PDF (teksten ble hentet fra et speil).
3. LOW-kodinger (43 stk.) bør få en ekstra vurdering, gjerne av en annen person enn den som kodet.
4. En uavhengig andregangskoding av et tilfeldig utvalg (f.eks. 10 %) vil gi et mål på kodingens pålitelighet.

## 8. Rettigheter og etikk

- Partiprogrammene sjekkes ikke inn i repoet. Begrunnelsene er korte parafraser med lenke til originalen.
- Argumentene for og mot er skrevet av redaksjonen og merket som det – de er ikke sitater fra partiene.
- Ingen spørsmål, tekster, design eller beregningsmetoder er kopiert fra andre valgomater.
- Brukernes svar lagres bare lokalt i nettleseren (localStorage) og sendes ikke noe sted.
