# Stresstest av scoringsmodellen

Generert av `scripts/qa/stress.ts` på datasettet «Sist oppdatert 2026-10-14». Seed 20271014 – rapporten er reproduserbar. Ingen tall her er brukt til å justere partistandpunkter.

## 1. Perfekte, støyete og motsatte partiprofiler

- **Perfekt:** brukeren svarer nøyaktig partiets kodede standpunkt, «vet ikke» der partiet er ukjent.
- **Støy (n=100 per parti):** som perfekt, men hvert svar flyttes ett hakk med 30 % sannsynlighet og to hakk med 10 %; tilfeldig viktighet (75 % normal, 17 % ★, 8 % ★★).
- **Fyller ukjente (n=100 per parti):** som støy, men brukeren svarer tilfeldig på spørsmål der partiet er ukjent (realistisk: brukeren vet ikke hva partiet mangler).
- **Motsatt:** fortegn snudd (0 → tilfeldig ±3).

| Parti | Perfekt: plass / score | Støy: andel #1 | Støy: median plass | Fyller ukjente: andel #1 | Fyller ukjente: andel topp 2 | Motsatt: plass / score |
|---|---|---:|---:|---:|---:|---|
| Ap | 1 / 100 | 100 % | 1 | 100 % | 100 % | 9 / 33.1 |
| H | 1 / 100 | 100 % | 1 | 100 % | 100 % | 9 / 21.7 |
| FrP | 1 / 100 | 100 % | 1 | 100 % | 100 % | 9 / 9.7 |
| Sp | 1 / 100 | 100 % | 1 | 100 % | 100 % | 9 / 22.7 |
| SV | 1 / 100 | 100 % | 1 | 100 % | 100 % | 8 / 12.1 |
| R | 1 / 100 | 100 % | 1 | 100 % | 100 % | 9 / 6.2 |
| V | 1 / 100 | 100 % | 1 | 100 % | 100 % | 9 / 16.7 |
| KrF | 1 / 100 | 100 % | 1 | 100 % | 100 % | 9 / 21.7 |
| MDG | 1 / 100 | 100 % | 1 | 100 % | 100 % | 9 / 20.2 |

**Hvilket parti havner øverst for «fyller ukjente»-profilene?** (rad = profilens parti, kolonne = vinner, n=100)

| profil \ vinner | Ap | H | FrP | Sp | SV | R | V | KrF | MDG |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Ap | 100 | · | · | · | · | · | · | · | · |
| H | · | 100 | · | · | · | · | · | · | · |
| FrP | · | · | 100 | · | · | · | · | · | · |
| Sp | · | · | · | 100 | · | · | · | · | · |
| SV | · | · | · | · | 100 | · | · | · | · |
| R | · | · | · | · | · | 100 | · | · | · |
| V | · | · | · | · | · | · | 100 | · | · |
| KrF | · | · | · | · | · | · | · | 100 | · |
| MDG | · | · | · | · | · | · | · | · | 100 |

## 2. Arketyper (n=100 per arketype)

Arketypene er definert ut fra spørsmålenes akser (f.eks. «econ=+1» betyr at enig trekker mot marked/lavere skatt), pluss noen få eksplisitte kjernesaker. De bruker **ikke** partienes standpunkter. Støy som over. Tabellen viser hvor ofte hvert parti havner øverst – det finnes ingen fasit, men resultatet bør være politisk forklarbart.

| Arketype | Ap | H | FrP | Sp | SV | R | V | KrF | MDG | median toppscore | andel «klar match» | andel «ingen passer» |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Liberal (marked + personlig frihet + internasjonal) | · | · | · | · | · | · | 100 | · | · | 80.7 | 100 % | 0 % |
| Konservativ (marked + tradisjonelle verdier + streng justis/innvandring) | · | 94 | · | · | · | · | · | 6 | · | 73.7 | 23 % | 0 % |
| Sosialist (omfordeling + statlig styring + EU-skeptisk) | · | · | · | · | 100 | · | · | · | · | 79.3 | 2 % | 0 % |
| Grønn (klima og natur først) | · | · | · | · | · | · | · | · | 100 | 77.1 | 17 % | 0 % |
| Distrikt (desentralisering + landbruk + nasjonal styring) | · | · | · | 100 | · | · | · | · | · | 75.4 | 75 % | 0 % |
| Innvandringsrestriktiv (bare innvandring og justis besvart) | · | · | 100 | · | · | · | · | · | · | 89.4 | 70 % | 0 % |
| Ruspolitisk liberal (rus + frihet, resten tilfeldig) | · | · | · | · | · | · | 99 | · | 1 | 71.5 | 49 % | 27 % |
| Forsvar/NATO (sterkt forsvar, resten tilfeldig) | 24 | 38 | · | · | · | · | 16 | 11 | 11 | 70.5 | 5 % | 47 % |

## 3. Kalibrering av prosentene

**Tilfeldige brukere (n=500):** svarer uniformt tilfeldig (−3…+3) på alle 80, 10 % «vet ikke», tilfeldig viktighet. Dette er «støygulvet»: hva prosentene blir når svarene ikke har noen politisk sammenheng.

| Fordeling | p5 | p25 | median | p75 | p95 |
|---|---:|---:|---:|---:|---:|
| Alle partiscorer (tilfeldig bruker) | 47.7 | 52.5 | 55.9 | 59.3 | 64.1 |
| Beste parti (tilfeldig bruker) | 58.2 | 60.8 | 62.9 | 64.9 | 68.4 |
| Nest beste (tilfeldig bruker) | 56.5 | 58.8 | 60.5 | 62.2 | 64.7 |
| Dårligste parti (tilfeldig bruker) | 43.6 | 47 | 48.8 | 50.8 | 53 |
| Avstand 1–2 i poeng (tilfeldig bruker) | 0.2 | 0.9 | 2 | 3.7 | 6.7 |
| Beste parti (partiprofil m/støy, n=270) | 92.2 | 93.5 | 94.5 | 95.5 | 96.5 |

Klassifisering for tilfeldige brukere: klar match 21, nær match 21, usikkert 7, «ingen parti passer spesielt godt» 451 (av 500). Av de 49 som slo tilfeldighetsnivået, fikk 48 i tillegg merknaden om svak tilpasning.

## 4. Ukjente standpunkter – gir de kunstig høy eller lav score?

For hvert parti: start med en realistisk profil, fjern så tilfeldig en andel av partiets **kjente** standpunkter (som om de var ukjente) og mål hvordan partiets score, plass og usikkerhetsintervall endres. 60 gjentak per nivå og parti, to profiltyper: tilfeldig bruker og partiets egen profil med støy.

| Profil | Beholdt andel kjente | Snitt endring i score (poeng) | Std.avvik endring | Snitt |endring| i plass | Snitt intervallbredde (poeng) | Andel med «usikkert grunnlag» (<60 % dekning) |
|---|---:|---:|---:|---:|---:|---:|
| Tilfeldig bruker | 100 % | 0 | 0 | 0 | 10.9 | 0 % |
| Tilfeldig bruker | 90 % | 0 | 1.5 | 0.5 | 11.5 | 12.2 % |
| Tilfeldig bruker | 75 % | -0.1 | 2.7 | 0.9 | 12.5 | 79.6 % |
| Tilfeldig bruker | 60 % | 0.4 | 3.8 | 1.2 | 13.8 | 99.6 % |
| Partiets egen profil | 100 % | 0 | 0 | 0 | 3 | 0 % |
| Partiets egen profil | 90 % | 0 | 0.4 | 0 | 3.2 | 10.7 % |
| Partiets egen profil | 75 % | 0 | 0.7 | 0 | 3.5 | 78.1 % |
| Partiets egen profil | 60 % | 0 | 1 | 0 | 3.9 | 99.4 % |

**Ikke-tilfeldige ukjente.** Tabellen over forutsetter at standpunktene mangler tilfeldig. I virkeligheten tier partiene ofte om saker de ikke prioriterer eller der velgerne deres er delt. Tabellen under viser hvor mye partiets score *kunne* endret seg dersom alle ukjente standpunkter på spørsmålene brukeren svarte på, var henholdsvis lengst mulig unna og helt lik brukeren (MEDIUM confidence; snitt over 40 tilfeldige brukere). Et bredt spenn betyr at scoren hviler mer på det vi ikke vet.

| Parti | Snitt score | Snitt nedre grense | Snitt øvre grense | Snitt spenn (poeng) |
|---|---:|---:|---:|---:|
| Ap | 61.1 | 53.5 | 68.4 | 14.9 |
| H | 59.2 | 52.9 | 65.8 | 12.9 |
| FrP | 53.8 | 52.4 | 55.8 | 3.4 |
| Sp | 57.5 | 52.6 | 63.3 | 10.7 |
| SV | 53 | 47.8 | 60.7 | 12.9 |
| R | 51.4 | 47.6 | 57.7 | 10.1 |
| V | 55.2 | 50.6 | 61.5 | 10.8 |
| KrF | 57.3 | 52.4 | 63.1 | 10.6 |
| MDG | 57.4 | 52.4 | 63.4 | 11 |

**Faktisk dekning når brukeren svarer på alle 80 spørsmål** (confidence-vektet, slik appen viser den):

| Ap | H | FrP | Sp | SV | R | V | KrF | MDG |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 65.8 % | 72.9 % | 87.4 % | 73.8 % | 72.2 % | 77 % | 73.6 % | 71.3 % | 74 % |

## 5. Viktighet (normal / ★ / ★★)

- Når alle 80 er besvart med normal viktighet, er største vektandel for ett spørsmål 1.8 % (spørsmål alene i et tema med få spørsmål). Med ★★ på ett spørsmål og normal på resten er maksimum 3.5 % (`drug_decrim`). Ett spørsmål kan altså flytte en partiscore med høyst rundt 3.5 poeng (fra full enighet til full uenighet).
- **Eksempel A:** Høyre-profil + «helt enig» i kjernekraft. ★ på kjernekraft: normal: H 99.8 / FrP 77.8 (plass 1 / 2) · ★: H 99.7 / FrP 77.9 (plass 1 / 2) · ★★: H 99.5 / FrP 78.1 (plass 1 / 2).
- **Eksempel B:** Høyre-profil, men «helt uenig» i EU-medlemskap (Høyres kjernesak): normal: H 97.8 / FrP 79.8 (plass 1 / 2) · ★: H 96.7 / FrP 80 (plass 1 / 2) · ★★: H 95.7 / FrP 80.2 (plass 1 / 2).
- **Eksempel C:** SV-profil + «helt enig» i raskere økning av forsvarsbudsjettet: normal: SV 99.6 / Ap 67.3 (plass 1 / 4) · ★: SV 99.4 / Ap 67.2 (plass 1 / 4) · ★★: SV 99.2 / Ap 67 (plass 1 / 4).
- Tolkning: ★★ dobler vekten og kan avgjøre mellom to partier som ellers ligger nær hverandre, men én sak kan ikke snu en hel profil – partiet profilen er kopiert fra, forblir øverst.

## 6. Manuelle testpersoner

Synthetic bruker: lavere skatt, lavere bilavgifter, strengere innvandring, strengere straff, pro NATO og høyere forsvarsbudsjett, offentlig helse med private leverandører, avkriminalisering, positiv til regulert cannabis, moderat på klima, pro kjernekraft, pro EØS. Alle andre spørsmål «vet ikke».

### Testperson H/FrP/V – EU-medlemskap = nøytral (0)

Besvart: 24 spørsmål. Klassifisering: **close** + merknad «treffet er mindre presist enn prosenten tilsier» (under 10 poeng over tilfeldighetsnivået) (avstand 1–2: 5.1 poeng; tilfeldighetsnivå 73.1 %).

| Plass | Parti | Score | 10–90-intervall | Andel øverst i bootstrap | Dekning | Spenn om ukjente var verst/best mulig |
|---:|---|---:|---|---:|---:|---|
| 1 | H | 78.5 | 73.1–83 | 80.8 % | 87.9 % | 76.6–79.1 |
| 2 | FrP | 73.4 | 67.7–78.7 | 3 % | 93.9 % | 71.8–74.1 |
| 3 | Ap | 73.2 | 67.4–79 | 6.5 % | 70.3 % | 67.5–75.9 |
| 4 | V | 70.5 | 63.7–76.8 | 6 % | 82.8 % | 67.4–72.3 |
| 5 | KrF | 70.1 | 62.8–77.1 | 3.8 % | 76.1 % | 65.6–72.9 |
| 6 | MDG | 60.6 | 53–68.6 | 0 % | 71.8 % | 55.2–66.3 |
| 7 | Sp | 58.1 | 49.7–66.3 | 0 % | 69 % | 50.9–65.3 |
| 8 | R | 41.2 | 33.9–50.1 | 0 % | 72.6 % | 38.1–48.7 |
| 9 | SV | 40.6 | 35.8–47 | 0 % | 69.2 % | 35.9–50.7 |

**Spørsmålene som skiller H / FrP / V mest** (bidrag til score i poeng; «–» = ukjent standpunkt):

| Spørsmål | Bruker | H standpunkt | FrP standpunkt | V standpunkt | H bidrag | FrP bidrag | V bidrag | Spredning |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| `drug_decrim` | 2 | 1 | -3 | 3 | 3.1 | 0.8 | 4.4 | 47.1 |
| `drug_cannabis` | 2 | -3 | -3 | 3 | 0.8 | 0.6 | 4.4 | 47.1 |
| `imm_level` | 2 ★ | 3 | 3 | -2 | 4.4 | 4.1 | 1.4 | 37.5 |
| `cli_co2_tax` | -1 | 0 | -3 | 3 | 2.8 | 2.8 | 1.6 | 32.2 |
| `just_sentences` | 2 | 2 | 3 | -1 | 4.2 | 3.3 | 1.7 | 29.7 |
| `just_alt_sentences` | -1 | 1 | -2 | 3 | 2.1 | 3.3 | 1.5 | 29.7 |
| `transport_toll` | 2 | 1 | 3 | -2 | 1.4 | 3.3 | 1.5 | 29.7 |
| `imm_residence` | 2 | 3 | 3 | -1 | 2.9 | 2.8 | 0.8 | 16.7 |
| `welfare_commercial` | 1 | 3 | 3 | 2 | 4.7 | 4.4 | 6.3 | 16.7 |
| `oil_explore` | 1 | 3 | 3 | -3 | 2.1 | 2 | 1.1 | 15.2 |
| `cli_target` | -1 | -1 | -3 | 1 | 1.3 | 1.5 | 0.9 | 15.2 |
| `eu_eea` | -3 | -3 | -2 | -3 | 5 | 3.9 | 5.3 | 11.8 |

Genererte innsikter: themeWinner, themeWinner, themeWinner.

### Testperson H/FrP/V – EU-medlemskap = «vet ikke»

Besvart: 23 spørsmål. Klassifisering: **close** + merknad «treffet er mindre presist enn prosenten tilsier» (under 10 poeng over tilfeldighetsnivået) (avstand 1–2: 5.7 poeng; tilfeldighetsnivå 72.2 %).

| Plass | Parti | Score | 10–90-intervall | Andel øverst i bootstrap | Dekning | Spenn om ukjente var verst/best mulig |
|---:|---|---:|---|---:|---:|---|
| 1 | H | 80.4 | 75.1–84.8 | 86 % | 87.6 % | 78.4–81 |
| 2 | FrP | 74.7 | 68.6–80.3 | 2.3 % | 93.7 % | 73–75.4 |
| 3 | Ap | 73.4 | 65.8–79.5 | 1.8 % | 70.7 % | 67.6–76.1 |
| 4 | V | 72.3 | 65.1–78 | 7.2 % | 82.4 % | 69–74 |
| 5 | KrF | 71 | 62.8–78.5 | 2.5 % | 75.4 % | 66.3–73.8 |
| 6 | MDG | 62.4 | 54.5–70 | 0.3 % | 71 % | 56.5–68 |
| 7 | Sp | 57 | 48.2–67.5 | 0 % | 68.2 % | 49.8–64.6 |
| 8 | SV | 39.8 | 34.3–45.4 | 0 % | 68 % | 35.1–50.4 |
| 9 | R | 39.8 | 31.4–50 | 0 % | 73 % | 36.8–47.6 |

**Spørsmålene som skiller H / FrP / V mest** (bidrag til score i poeng; «–» = ukjent standpunkt):

| Spørsmål | Bruker | H standpunkt | FrP standpunkt | V standpunkt | H bidrag | FrP bidrag | V bidrag | Spredning |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| `drug_decrim` | 2 | 1 | -3 | 3 | 3.2 | 0.8 | 4.6 | 47.1 |
| `drug_cannabis` | 2 | -3 | -3 | 3 | 0.9 | 0.6 | 4.6 | 47.1 |
| `imm_level` | 2 ★ | 3 | 3 | -2 | 4.6 | 4.3 | 1.5 | 37.5 |
| `cli_co2_tax` | -1 | 0 | -3 | 3 | 2.9 | 2.9 | 1.7 | 32.2 |
| `just_sentences` | 2 | 2 | 3 | -1 | 4.3 | 3.4 | 1.7 | 29.7 |
| `just_alt_sentences` | -1 | 1 | -2 | 3 | 2.2 | 3.4 | 1.5 | 29.7 |
| `transport_toll` | 2 | 1 | 3 | -2 | 1.4 | 3.4 | 1.5 | 29.7 |
| `imm_residence` | 2 | 3 | 3 | -1 | 3 | 2.8 | 0.8 | 16.7 |
| `welfare_commercial` | 1 | 3 | 3 | 2 | 4.9 | 4.5 | 6.5 | 16.7 |
| `eu_eea` | -3 | -3 | -2 | -3 | 7.3 | 5.7 | 7.7 | 16.7 |
| `oil_explore` | 1 | 3 | 3 | -3 | 2.2 | 2.1 | 1.2 | 15.2 |
| `cli_target` | -1 | -1 | -3 | 1 | 1.3 | 1.5 | 0.9 | 15.2 |

Genererte innsikter: themeWinner, themeWinner.

**Viktighet i praksis (samme testperson, «vet ikke» på EU):** av 23 besvarte spørsmål er det 0 der ★★ alene endrer hvilket parti som er øverst.

Kryss-politisk velger: helt venstre på økonomi, helt restriktiv på innvandring og streng på justis, helt liberal på verdier og rus, helt for EU-integrasjon, høy klimaprioritet, for sentralisering, for kjernekraft og NATO. Svarer på alle 80.

### Kryss-politisk velger

Besvart: 80 spørsmål. Klassifisering: **close** + merknad «treffet er mindre presist enn prosenten tilsier» (under 10 poeng over tilfeldighetsnivået) (avstand 1–2: 3.7 poeng; tilfeldighetsnivå 63.3 %).

| Plass | Parti | Score | 10–90-intervall | Andel øverst i bootstrap | Dekning | Spenn om ukjente var verst/best mulig |
|---:|---|---:|---|---:|---:|---|
| 1 | MDG | 71.1 | 65.8–76.8 | 73.5 % | 74 % | 61.7–75.2 |
| 2 | V | 67.4 | 60–74.3 | 18 % | 73.6 % | 58.9–72 |
| 3 | SV | 62 | 55.5–69.9 | 2.3 % | 72.2 % | 52.3–68.4 |
| 4 | Ap | 61.8 | 56.1–67.8 | 6 % | 65.8 % | 50–69.1 |
| 5 | R | 57.7 | 50.6–65.9 | 0.3 % | 77 % | 51.2–63.3 |
| 6 | H | 49.6 | 42.2–55.8 | 0 % | 72.9 % | 42.6–57.7 |
| 7 | KrF | 45.5 | 39.4–52.3 | 0 % | 71.3 % | 39.3–53 |
| 8 | Sp | 43.3 | 37.4–49.8 | 0 % | 73.8 % | 38.5–50.8 |
| 9 | FrP | 40.5 | 33.1–46.7 | 0 % | 87.4 % | 39.7–42.9 |

Genererte innsikter: themeWinner, themeWinner, themeWinner.

Beste parti får 71.1 %, som er over 95-persentilen for beste parti hos en helt tilfeldig bruker (68.4 %).

Politisk «hjemløs» velger: marked og lavere skatt, restriktiv innvandring, høy klimaprioritet, liberal på verdier og rus, EU-skeptisk, desentralisering, mildere straffer, for kjernekraft, skeptisk til NATO og mot høyere forsvarsbudsjett. Svarer på alle 80.

### Politisk «hjemløs» velger

Besvart: 80 spørsmål. Klassifisering: **clear** + merknad «treffet er mindre presist enn prosenten tilsier» (under 10 poeng over tilfeldighetsnivået) (avstand 1–2: 12.4 poeng; tilfeldighetsnivå 63.7 %).

| Plass | Parti | Score | 10–90-intervall | Andel øverst i bootstrap | Dekning | Spenn om ukjente var verst/best mulig |
|---:|---|---:|---|---:|---:|---|
| 1 | V | 68.2 | 61.6–74.7 | 92.5 % | 73.6 % | 59.9–72.6 |
| 2 | FrP | 55.8 | 49.2–62.3 | 4.3 % | 87.4 % | 54.5–57.6 |
| 3 | H | 55.7 | 49.8–62.4 | 1.5 % | 72.9 % | 48.2–62.9 |
| 4 | SV | 50.4 | 42.3–57.9 | 0.8 % | 72.2 % | 42.7–58.7 |
| 5 | MDG | 50.2 | 43.3–56.5 | 0 % | 74 % | 43.7–57.1 |
| 6 | R | 50.2 | 42.4–57.5 | 1 % | 77 % | 45–56.7 |
| 7 | Sp | 43.3 | 36.7–49.8 | 0 % | 73.8 % | 38.6–50.9 |
| 8 | Ap | 40 | 35.2–45 | 0 % | 65.8 % | 33.2–51.4 |
| 9 | KrF | 37.4 | 31.3–43.4 | 0 % | 71.3 % | 32.7–45.9 |

Genererte innsikter: themeWinner, themeWinner, themeWinner.

Beste parti får 68.2 %; tilfeldighetsnivået for disse svarene er 63.7 %. Klassifisering: **clear**, med merknaden om at treffet er mindre presist enn prosenten tilsier.

## 7. Oppsummering

- Antall syntetiske profiler kjørt: **8148**.
- Invariantsjekk av genererte innsikter: 400 resultater kontrollert, 0 brudd.
