# Stresstest av scoringsmodellen

Generert av `scripts/qa/stress.ts` på datasettet «Sist oppdatert 2026-10-14». Seed 20271014 – rapporten er reproduserbar. Ingen tall her er brukt til å justere partistandpunkter.

## 1. Perfekte, støyete og motsatte partiprofiler

- **Perfekt:** brukeren svarer nøyaktig partiets kodede standpunkt, «vet ikke» der partiet er ukjent.
- **Støy (n=100 per parti):** som perfekt, men hvert svar flyttes ett hakk med 30 % sannsynlighet og to hakk med 10 %; tilfeldig viktighet (75 % normal, 17 % ★, 8 % ★★).
- **Fyller ukjente (n=100 per parti):** som støy, men brukeren svarer tilfeldig på spørsmål der partiet er ukjent (realistisk: brukeren vet ikke hva partiet mangler).
- **Motsatt:** fortegn snudd (0 → tilfeldig ±3).

| Parti | Perfekt: plass / score | Støy: andel #1 | Støy: median plass | Fyller ukjente: andel #1 | Fyller ukjente: andel topp 2 | Motsatt: plass / score |
|---|---|---:|---:|---:|---:|---|
| Ap | 1 / 100 | 100 % | 1 | 100 % | 100 % | 9 / 32.5 |
| H | 1 / 100 | 100 % | 1 | 100 % | 100 % | 9 / 21.7 |
| FrP | 1 / 100 | 100 % | 1 | 100 % | 100 % | 9 / 9.7 |
| Sp | 1 / 100 | 100 % | 1 | 100 % | 100 % | 9 / 22.9 |
| SV | 1 / 100 | 100 % | 1 | 100 % | 100 % | 8 / 12.2 |
| R | 1 / 100 | 100 % | 1 | 100 % | 100 % | 9 / 6.7 |
| V | 1 / 100 | 100 % | 1 | 100 % | 100 % | 9 / 16.6 |
| KrF | 1 / 100 | 100 % | 1 | 100 % | 100 % | 9 / 21.5 |
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
| Liberal (marked + personlig frihet + internasjonal) | · | · | · | · | · | · | 100 | · | · | 80.3 | 100 % | 0 % |
| Konservativ (marked + tradisjonelle verdier + streng justis/innvandring) | · | 97 | · | · | · | · | · | 3 | · | 73.9 | 21 % | 0 % |
| Sosialist (omfordeling + statlig styring + EU-skeptisk) | · | · | · | · | 100 | · | · | · | · | 79.3 | 5 % | 0 % |
| Grønn (klima og natur først) | · | · | · | · | · | · | 2 | · | 98 | 77.2 | 20 % | 0 % |
| Distrikt (desentralisering + landbruk + nasjonal styring) | · | · | · | 100 | · | · | · | · | · | 75.5 | 91 % | 0 % |
| Innvandringsrestriktiv (bare innvandring og justis besvart) | · | 1 | 99 | · | · | · | · | · | · | 88.8 | 61 % | 0 % |
| Ruspolitisk liberal (rus + frihet, resten tilfeldig) | · | · | · | · | · | · | 98 | · | 2 | 70.7 | 46 % | 28 % |
| Forsvar/NATO (sterkt forsvar, resten tilfeldig) | 25 | 40 | · | · | · | · | 17 | 7 | 11 | 70.7 | 5 % | 35 % |

## 3. Kalibrering av prosentene

**Tilfeldige brukere (n=500):** svarer uniformt tilfeldig (−3…+3) på alle 80, 10 % «vet ikke», tilfeldig viktighet. Dette er «støygulvet»: hva prosentene blir når svarene ikke har noen politisk sammenheng.

| Fordeling | p5 | p25 | median | p75 | p95 |
|---|---:|---:|---:|---:|---:|
| Alle partiscorer (tilfeldig bruker) | 47.8 | 52.8 | 56 | 59.6 | 64.4 |
| Beste parti (tilfeldig bruker) | 58.3 | 61 | 63.3 | 65.5 | 68.7 |
| Nest beste (tilfeldig bruker) | 56.6 | 59 | 60.8 | 62.5 | 65 |
| Dårligste parti (tilfeldig bruker) | 43.7 | 46.9 | 49.1 | 50.9 | 53 |
| Avstand 1–2 i poeng (tilfeldig bruker) | 0.2 | 1 | 2 | 3.5 | 6.4 |
| Beste parti (partiprofil m/støy, n=270) | 92.1 | 93.6 | 94.5 | 95.4 | 96.5 |

Klassifisering for tilfeldige brukere: klar match 16, nær match 33, usikkert 13, «ingen parti passer spesielt godt» 438 (av 500). Av de 62 som slo tilfeldighetsnivået, fikk 62 i tillegg merknaden om svak tilpasning.

## 4. Ukjente standpunkter – gir de kunstig høy eller lav score?

For hvert parti: start med en realistisk profil, fjern så tilfeldig en andel av partiets **kjente** standpunkter (som om de var ukjente) og mål hvordan partiets score, plass og usikkerhetsintervall endres. 60 gjentak per nivå og parti, to profiltyper: tilfeldig bruker og partiets egen profil med støy.

| Profil | Beholdt andel kjente | Snitt endring i score (poeng) | Std.avvik endring | Snitt |endring| i plass | Snitt intervallbredde (poeng) | Andel med «usikkert grunnlag» (<60 % dekning) |
|---|---:|---:|---:|---:|---:|---:|
| Tilfeldig bruker | 100 % | 0 | 0 | 0 | 10.8 | 0 % |
| Tilfeldig bruker | 90 % | 0.1 | 1.5 | 0.5 | 11.4 | 7.4 % |
| Tilfeldig bruker | 75 % | 0 | 2.6 | 0.8 | 12.3 | 72.8 % |
| Tilfeldig bruker | 60 % | -0.2 | 3.6 | 1.2 | 13.7 | 98.1 % |
| Partiets egen profil | 100 % | 0 | 0 | 0 | 3 | 0 % |
| Partiets egen profil | 90 % | 0 | 0.4 | 0 | 3.2 | 5 % |
| Partiets egen profil | 75 % | 0 | 0.7 | 0 | 3.5 | 76.7 % |
| Partiets egen profil | 60 % | -0.1 | 1 | 0 | 3.8 | 99.4 % |

**Ikke-tilfeldige ukjente.** Tabellen over forutsetter at standpunktene mangler tilfeldig. I virkeligheten tier partiene ofte om saker de ikke prioriterer eller der velgerne deres er delt. Tabellen under viser hvor mye partiets score *kunne* endret seg dersom alle ukjente standpunkter på spørsmålene brukeren svarte på, var henholdsvis lengst mulig unna og helt lik brukeren (MEDIUM confidence; snitt over 40 tilfeldige brukere). Et bredt spenn betyr at scoren hviler mer på det vi ikke vet.

| Parti | Snitt score | Snitt nedre grense | Snitt øvre grense | Snitt spenn (poeng) |
|---|---:|---:|---:|---:|
| Ap | 61.6 | 55.1 | 67.8 | 12.6 |
| H | 57.1 | 51.1 | 64.2 | 13.1 |
| FrP | 53.1 | 51.7 | 55 | 3.3 |
| Sp | 58.4 | 53.9 | 63.3 | 9.4 |
| SV | 55.3 | 50.7 | 61.6 | 10.9 |
| R | 53.4 | 49.6 | 58.8 | 9.1 |
| V | 55 | 51 | 60.2 | 9.1 |
| KrF | 57.3 | 52.8 | 62.7 | 9.9 |
| MDG | 57.5 | 53.3 | 62.2 | 8.9 |

**Faktisk dekning når brukeren svarer på alle 80 spørsmål** (confidence-vektet, slik appen viser den):

| Ap | H | FrP | Sp | SV | R | V | KrF | MDG |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 68.2 % | 72.9 % | 87.4 % | 74.9 % | 74.2 % | 78.6 % | 75.6 % | 71.8 % | 76.3 % |

## 5. Viktighet (normal / ★ / ★★)

- Når alle 80 er besvart med normal viktighet, er største vektandel for ett spørsmål 1.8 % (spørsmål alene i et tema med få spørsmål). Med ★★ på ett spørsmål og normal på resten er maksimum 3.5 % (`drug_decrim`). Ett spørsmål kan altså flytte en partiscore med høyst rundt 3.5 poeng (fra full enighet til full uenighet).
- **Eksempel A:** Høyre-profil + «helt enig» i kjernekraft. ★ på kjernekraft: normal: H 99.8 / FrP 77.8 (plass 1 / 2) · ★: H 99.7 / FrP 77.9 (plass 1 / 2) · ★★: H 99.5 / FrP 78.1 (plass 1 / 2).
- **Eksempel B:** Høyre-profil, men «helt uenig» i EU-medlemskap (Høyres kjernesak): normal: H 97.8 / FrP 79.8 (plass 1 / 2) · ★: H 96.7 / FrP 80 (plass 1 / 2) · ★★: H 95.7 / FrP 80.2 (plass 1 / 2).
- **Eksempel C:** SV-profil + «helt enig» i raskere økning av forsvarsbudsjettet: normal: SV 99.6 / Ap 68.1 (plass 1 / 4) · ★: SV 99.4 / Ap 68 (plass 1 / 4) · ★★: SV 99.2 / Ap 67.9 (plass 1 / 4).
- Tolkning: ★★ dobler vekten og kan avgjøre mellom to partier som ellers ligger nær hverandre, men én sak kan ikke snu en hel profil – partiet profilen er kopiert fra, forblir øverst.

## 6. Manuelle testpersoner

Synthetic bruker: lavere skatt, lavere bilavgifter, strengere innvandring, strengere straff, pro NATO og høyere forsvarsbudsjett, offentlig helse med private leverandører, avkriminalisering, positiv til regulert cannabis, moderat på klima, pro kjernekraft, pro EØS. Alle andre spørsmål «vet ikke».

### Testperson H/FrP/V – EU-medlemskap = nøytral (0)

Besvart: 24 spørsmål. Klassifisering: **close** + merknad «treffet er mindre presist enn prosenten tilsier» (under 10 poeng over tilfeldighetsnivået) (avstand 1–2: 5.1 poeng; tilfeldighetsnivå 72.5 %).

| Plass | Parti | Score | 10–90-intervall | Andel øverst i bootstrap | Dekning | Spenn om ukjente var verst/best mulig |
|---:|---|---:|---|---:|---:|---|
| 1 | H | 78.5 | 73.1–83 | 83 % | 87.9 % | 76.6–79.1 |
| 2 | FrP | 73.4 | 67.7–78.7 | 3.3 % | 93.9 % | 71.8–74.1 |
| 3 | Ap | 72.8 | 67.1–78.2 | 5 % | 71.6 % | 68.7–74.7 |
| 4 | KrF | 70.3 | 63.2–77.2 | 4 % | 77.3 % | 67.3–72.3 |
| 5 | V | 69.3 | 62.5–75.7 | 4.8 % | 85.6 % | 67.9–70.2 |
| 6 | MDG | 59 | 51.7–66.2 | 0 % | 76.4 % | 56.2–62.6 |
| 7 | Sp | 58.5 | 50.4–66.5 | 0 % | 70.2 % | 52.4–64.6 |
| 8 | R | 41 | 33.9–49.6 | 0 % | 74.9 % | 38.6–46.8 |
| 9 | SV | 40.5 | 36–46.5 | 0 % | 73 % | 37.3–47.1 |

**Spørsmålene som skiller H / FrP / V mest** (bidrag til score i poeng; «–» = ukjent standpunkt):

| Spørsmål | Bruker | H standpunkt | FrP standpunkt | V standpunkt | H bidrag | FrP bidrag | V bidrag | Spredning |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| `drug_decrim` | 2 | 1 | -3 | 3 | 3.1 | 0.8 | 4.3 | 47.1 |
| `drug_cannabis` | 2 | -3 | -3 | 3 | 0.8 | 0.6 | 4.3 | 47.1 |
| `imm_level` | 2 ★ | 3 | 3 | -2 | 4.4 | 4.1 | 1.4 | 37.5 |
| `cli_co2_tax` | -1 | 0 | -3 | 3 | 2.8 | 2.8 | 1.6 | 32.2 |
| `just_sentences` | 2 | 2 | 3 | -1 | 4.2 | 3.3 | 1.6 | 29.7 |
| `just_alt_sentences` | -1 | 1 | -2 | 3 | 2.1 | 3.3 | 1.4 | 29.7 |
| `transport_toll` | 2 | 1 | 3 | -2 | 1.4 | 3.3 | 1.4 | 29.7 |
| `transport_fuel_tax` | 2 | – | 3 | -2 | – | 3.3 | 1.1 | 29.7 |
| `imm_residence` | 2 | 3 | 3 | -1 | 2.9 | 2.8 | 0.7 | 16.7 |
| `welfare_commercial` | 1 | 3 | 3 | 2 | 4.7 | 4.4 | 6.1 | 16.7 |
| `oil_explore` | 1 | 3 | 3 | -3 | 2.1 | 2 | 1.1 | 15.2 |
| `cli_target` | -1 | -1 | -3 | 1 | 1.3 | 1.5 | 0.9 | 15.2 |

Genererte innsikter: themeWinner, themeWinner.

### Testperson H/FrP/V – EU-medlemskap = «vet ikke»

Besvart: 23 spørsmål. Klassifisering: **close** + merknad «treffet er mindre presist enn prosenten tilsier» (under 10 poeng over tilfeldighetsnivået) (avstand 1–2: 5.7 poeng; tilfeldighetsnivå 71.7 %).

| Plass | Parti | Score | 10–90-intervall | Andel øverst i bootstrap | Dekning | Spenn om ukjente var verst/best mulig |
|---:|---|---:|---|---:|---:|---|
| 1 | H | 80.4 | 75.1–84.8 | 88 % | 87.6 % | 78.4–81 |
| 2 | FrP | 74.7 | 68.6–80.3 | 2.5 % | 93.7 % | 73–75.4 |
| 3 | Ap | 73 | 65.5–79.1 | 1.8 % | 71.9 % | 68.8–75 |
| 4 | KrF | 71.2 | 62.9–78.5 | 2.5 % | 76.7 % | 68–73.2 |
| 5 | V | 71 | 64.2–77 | 5.3 % | 85.2 % | 69.6–71.8 |
| 6 | MDG | 60.5 | 53.2–68 | 0 % | 75.8 % | 57.5–64.1 |
| 7 | Sp | 57.5 | 48.7–67.9 | 0 % | 69.5 % | 51.3–63.9 |
| 8 | SV | 39.8 | 34.4–45.1 | 0 % | 71.9 % | 36.5–46.7 |
| 9 | R | 39.6 | 31.5–49.2 | 0 % | 75.4 % | 37.3–45.7 |

**Spørsmålene som skiller H / FrP / V mest** (bidrag til score i poeng; «–» = ukjent standpunkt):

| Spørsmål | Bruker | H standpunkt | FrP standpunkt | V standpunkt | H bidrag | FrP bidrag | V bidrag | Spredning |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| `drug_decrim` | 2 | 1 | -3 | 3 | 3.2 | 0.8 | 4.4 | 47.1 |
| `drug_cannabis` | 2 | -3 | -3 | 3 | 0.9 | 0.6 | 4.4 | 47.1 |
| `imm_level` | 2 ★ | 3 | 3 | -2 | 4.6 | 4.3 | 1.4 | 37.5 |
| `cli_co2_tax` | -1 | 0 | -3 | 3 | 2.9 | 2.9 | 1.6 | 32.2 |
| `just_sentences` | 2 | 2 | 3 | -1 | 4.3 | 3.4 | 1.7 | 29.7 |
| `just_alt_sentences` | -1 | 1 | -2 | 3 | 2.2 | 3.4 | 1.5 | 29.7 |
| `transport_toll` | 2 | 1 | 3 | -2 | 1.4 | 3.4 | 1.5 | 29.7 |
| `transport_fuel_tax` | 2 | – | 3 | -2 | – | 3.4 | 1.1 | 29.7 |
| `imm_residence` | 2 | 3 | 3 | -1 | 3 | 2.8 | 0.7 | 16.7 |
| `welfare_commercial` | 1 | 3 | 3 | 2 | 4.9 | 4.5 | 6.2 | 16.7 |
| `eu_eea` | -3 | -3 | -2 | -3 | 7.3 | 5.7 | 7.5 | 16.7 |
| `oil_explore` | 1 | 3 | 3 | -3 | 2.2 | 2.1 | 1.1 | 15.2 |

Genererte innsikter: themeWinner.

**Viktighet i praksis (samme testperson, «vet ikke» på EU):** av 23 besvarte spørsmål er det 0 der ★★ alene endrer hvilket parti som er øverst.

Kryss-politisk velger: helt venstre på økonomi, helt restriktiv på innvandring og streng på justis, helt liberal på verdier og rus, helt for EU-integrasjon, høy klimaprioritet, for sentralisering, for kjernekraft og NATO. Svarer på alle 80.

### Kryss-politisk velger

Besvart: 80 spørsmål. Klassifisering: **uncertain** + merknad «treffet er mindre presist enn prosenten tilsier» (under 10 poeng over tilfeldighetsnivået) (avstand 1–2: 2 poeng; tilfeldighetsnivå 63.2 %).

| Plass | Parti | Score | 10–90-intervall | Andel øverst i bootstrap | Dekning | Spenn om ukjente var verst/best mulig |
|---:|---|---:|---|---:|---:|---|
| 1 | MDG | 69.3 | 64.2–75.2 | 64.3 % | 76.3 % | 62–72.8 |
| 2 | V | 67.3 | 60.1–74 | 27 % | 75.6 % | 59.5–71 |
| 3 | Ap | 60.9 | 55.4–66.8 | 6 % | 68.2 % | 51.3–67.1 |
| 4 | SV | 60.8 | 54.6–68.7 | 2.5 % | 74.2 % | 53–66.4 |
| 5 | R | 56.9 | 49.8–64.6 | 0.3 % | 78.6 % | 51.4–61.8 |
| 6 | H | 49.6 | 42.2–55.8 | 0 % | 72.9 % | 42.6–57.7 |
| 7 | KrF | 45.5 | 39.5–52.3 | 0 % | 71.8 % | 39.7–52.4 |
| 8 | Sp | 43.7 | 37.8–50.4 | 0 % | 74.9 % | 39.7–50.3 |
| 9 | FrP | 40.5 | 33.1–46.7 | 0 % | 87.4 % | 39.7–42.9 |

Genererte innsikter: closePair(MDG/V), themeWinner, themeWinner, themeWinner.

Beste parti får 69.3 %, som er over 95-persentilen for beste parti hos en helt tilfeldig bruker (68.7 %).

Politisk «hjemløs» velger: marked og lavere skatt, restriktiv innvandring, høy klimaprioritet, liberal på verdier og rus, EU-skeptisk, desentralisering, mildere straffer, for kjernekraft, skeptisk til NATO og mot høyere forsvarsbudsjett. Svarer på alle 80.

### Politisk «hjemløs» velger

Besvart: 80 spørsmål. Klassifisering: **clear** + merknad «treffet er mindre presist enn prosenten tilsier» (under 10 poeng over tilfeldighetsnivået) (avstand 1–2: 12.1 poeng; tilfeldighetsnivå 63.5 %).

| Plass | Parti | Score | 10–90-intervall | Andel øverst i bootstrap | Dekning | Spenn om ukjente var verst/best mulig |
|---:|---|---:|---|---:|---:|---|
| 1 | V | 67.9 | 61.5–74.2 | 92.3 % | 75.6 % | 60.1–71.6 |
| 2 | FrP | 55.8 | 49.2–62.3 | 4.3 % | 87.4 % | 54.5–57.6 |
| 3 | H | 55.7 | 49.8–62.4 | 1.5 % | 72.9 % | 48.2–62.9 |
| 4 | SV | 50.7 | 42.9–57.6 | 1 % | 74.2 % | 43.9–57.7 |
| 5 | MDG | 50.1 | 43.2–56.2 | 0 % | 76.3 % | 45–55.7 |
| 6 | R | 49.5 | 41.8–56.9 | 1 % | 78.6 % | 45.2–55.2 |
| 7 | Sp | 43.8 | 37.1–50 | 0 % | 74.9 % | 39.7–50.3 |
| 8 | Ap | 39 | 34.3–44.1 | 0 % | 68.2 % | 33.6–48.6 |
| 9 | KrF | 37.7 | 31.5–43.6 | 0 % | 71.8 % | 33.3–45.6 |

Genererte innsikter: themeWinner, themeWinner.

Beste parti får 67.9 %; tilfeldighetsnivået for disse svarene er 63.5 %. Klassifisering: **clear**, med merknaden om at treffet er mindre presist enn prosenten tilsier.

## 7. Oppsummering

- Antall syntetiske profiler kjørt: **8148**.
- Invariantsjekk av genererte innsikter: 400 resultater kontrollert, 0 brudd.
