# Stresstest av scoringsmodellen

Generert av `scripts/qa/stress.ts` på datasettet «Sist oppdatert 2026-10-14». Seed 20271014 – rapporten er reproduserbar. Ingen tall her er brukt til å justere partistandpunkter.

## 1. Perfekte, støyete og motsatte partiprofiler

- **Perfekt:** brukeren svarer nøyaktig partiets kodede standpunkt, «vet ikke» der partiet er ukjent.
- **Støy (n=100 per parti):** som perfekt, men hvert svar flyttes ett hakk med 30 % sannsynlighet og to hakk med 10 %; tilfeldig viktighet (75 % normal, 17 % ★, 8 % ★★).
- **Fyller ukjente (n=100 per parti):** som støy, men brukeren svarer tilfeldig på spørsmål der partiet er ukjent (realistisk: brukeren vet ikke hva partiet mangler).
- **Motsatt:** fortegn snudd (0 → tilfeldig ±3).

| Parti | Perfekt: plass / score | Støy: andel #1 | Støy: median plass | Fyller ukjente: andel #1 | Fyller ukjente: andel topp 2 | Motsatt: plass / score |
|---|---|---:|---:|---:|---:|---|
| Ap | 1 / 100 | 100 % | 1 | 100 % | 100 % | 9 / 33.5 |
| H | 1 / 100 | 100 % | 1 | 100 % | 100 % | 9 / 21.8 |
| FrP | 1 / 100 | 100 % | 1 | 100 % | 100 % | 9 / 9.2 |
| Sp | 1 / 100 | 100 % | 1 | 100 % | 100 % | 9 / 23.7 |
| SV | 1 / 100 | 100 % | 1 | 100 % | 100 % | 8 / 12.2 |
| R | 1 / 100 | 100 % | 1 | 100 % | 100 % | 9 / 6.4 |
| V | 1 / 100 | 100 % | 1 | 100 % | 100 % | 9 / 16.7 |
| KrF | 1 / 100 | 100 % | 1 | 100 % | 100 % | 9 / 21.7 |
| MDG | 1 / 100 | 100 % | 1 | 100 % | 100 % | 9 / 20 |

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
| Liberal (marked + personlig frihet + internasjonal) | · | · | · | · | · | · | 100 | · | · | 80.2 | 100 % | 0 % |
| Konservativ (marked + tradisjonelle verdier + streng justis/innvandring) | · | 94 | · | · | · | · | · | 6 | · | 73.8 | 24 % | 0 % |
| Sosialist (omfordeling + statlig styring + EU-skeptisk) | · | · | · | · | 100 | · | · | · | · | 79.3 | 1 % | 0 % |
| Grønn (klima og natur først) | · | · | · | · | · | · | 2 | · | 98 | 77.8 | 34 % | 0 % |
| Distrikt (desentralisering + landbruk + nasjonal styring) | · | · | · | 100 | · | · | · | · | · | 75.8 | 77 % | 0 % |
| Innvandringsrestriktiv (bare innvandring og justis besvart) | · | · | 100 | · | · | · | · | · | · | 88.6 | 73 % | 2 % |
| Ruspolitisk liberal (rus + frihet, resten tilfeldig) | · | · | · | · | · | · | 99 | · | 1 | 71.6 | 56 % | 21 % |
| Forsvar/NATO (sterkt forsvar, resten tilfeldig) | 27 | 41 | · | · | · | · | 11 | 10 | 11 | 71 | 9 % | 32 % |

## 3. Kalibrering av prosentene

**Tilfeldige brukere (n=500):** svarer uniformt tilfeldig (−3…+3) på alle 80, 10 % «vet ikke», tilfeldig viktighet. Dette er «støygulvet»: hva prosentene blir når svarene ikke har noen politisk sammenheng.

| Fordeling | p5 | p25 | median | p75 | p95 |
|---|---:|---:|---:|---:|---:|
| Alle partiscorer (tilfeldig bruker) | 47.8 | 52.8 | 56 | 59.6 | 64.4 |
| Beste parti (tilfeldig bruker) | 58.4 | 61.1 | 63.5 | 65.5 | 68.5 |
| Nest beste (tilfeldig bruker) | 56.6 | 59.2 | 60.9 | 62.5 | 65.1 |
| Dårligste parti (tilfeldig bruker) | 43.5 | 46.9 | 49 | 50.8 | 53 |
| Avstand 1–2 i poeng (tilfeldig bruker) | 0.2 | 1 | 2 | 3.7 | 6.6 |
| Beste parti (partiprofil m/støy, n=270) | 92.2 | 93.5 | 94.4 | 95.3 | 96.4 |

Klassifisering for tilfeldige brukere: klar match 19, nær match 32, usikkert 13, «ingen parti passer spesielt godt» 436 (av 500). Av de 64 som slo tilfeldighetsnivået, fikk 64 i tillegg merknaden om svak tilpasning.

## 4. Ukjente standpunkter – gir de kunstig høy eller lav score?

For hvert parti: start med en realistisk profil, fjern så tilfeldig en andel av partiets **kjente** standpunkter (som om de var ukjente) og mål hvordan partiets score, plass og usikkerhetsintervall endres. 60 gjentak per nivå og parti, to profiltyper: tilfeldig bruker og partiets egen profil med støy.

| Profil | Beholdt andel kjente | Snitt endring i score (poeng) | Std.avvik endring | Snitt |endring| i plass | Snitt intervallbredde (poeng) | Andel med «usikkert grunnlag» (<60 % dekning) |
|---|---:|---:|---:|---:|---:|---:|
| Tilfeldig bruker | 100 % | 0 | 0 | 0 | 10.8 | 0 % |
| Tilfeldig bruker | 90 % | 0.1 | 1.5 | 0.5 | 11.4 | 5.6 % |
| Tilfeldig bruker | 75 % | -0.1 | 2.6 | 0.8 | 12.4 | 75 % |
| Tilfeldig bruker | 60 % | 0.1 | 3.7 | 1.2 | 13.7 | 99.4 % |
| Partiets egen profil | 100 % | 0 | 0 | 0 | 3 | 0 % |
| Partiets egen profil | 90 % | 0 | 0.4 | 0 | 3.2 | 4.1 % |
| Partiets egen profil | 75 % | 0 | 0.7 | 0 | 3.4 | 75 % |
| Partiets egen profil | 60 % | 0 | 0.9 | 0 | 3.8 | 99.6 % |

**Ikke-tilfeldige ukjente.** Tabellen over forutsetter at standpunktene mangler tilfeldig. I virkeligheten tier partiene ofte om saker de ikke prioriterer eller der velgerne deres er delt. Tabellen under viser hvor mye partiets score *kunne* endret seg dersom alle ukjente standpunkter på spørsmålene brukeren svarte på, var henholdsvis lengst mulig unna og helt lik brukeren (MEDIUM confidence; snitt over 40 tilfeldige brukere). Et bredt spenn betyr at scoren hviler mer på det vi ikke vet.

| Parti | Snitt score | Snitt nedre grense | Snitt øvre grense | Snitt spenn (poeng) |
|---|---:|---:|---:|---:|
| Ap | 61.1 | 55.3 | 66.5 | 11.2 |
| H | 56.4 | 50.6 | 63.6 | 13 |
| FrP | 52.2 | 50.3 | 55.1 | 4.8 |
| Sp | 56.7 | 52.8 | 61.3 | 8.5 |
| SV | 55.1 | 50.2 | 61.4 | 11.2 |
| R | 52.8 | 49.2 | 58.1 | 9 |
| V | 55.7 | 51.8 | 60.8 | 9.1 |
| KrF | 56.8 | 52.2 | 62.7 | 10.5 |
| MDG | 57.6 | 53.3 | 62.9 | 9.6 |

**Faktisk dekning når brukeren svarer på alle 80 spørsmål** (confidence-vektet, slik appen viser den):

| Ap | H | FrP | Sp | SV | R | V | KrF | MDG |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 69.4 % | 73.2 % | 86.4 % | 75.4 % | 74.2 % | 78.6 % | 76 % | 71.3 % | 75.8 % |

## 5. Viktighet (normal / ★ / ★★)

- Når alle 80 er besvart med normal viktighet, er største vektandel for ett spørsmål 1.8 % (spørsmål alene i et tema med få spørsmål). Med ★★ på ett spørsmål og normal på resten er maksimum 3.5 % (`drug_decrim`). Ett spørsmål kan altså flytte en partiscore med høyst rundt 3.5 poeng (fra full enighet til full uenighet).
- **Eksempel A:** Høyre-profil + «helt enig» i kjernekraft. ★ på kjernekraft: normal: H 99.8 / FrP 77.6 (plass 1 / 2) · ★: H 99.7 / FrP 77.8 (plass 1 / 2) · ★★: H 99.6 / FrP 77.9 (plass 1 / 2).
- **Eksempel B:** Høyre-profil, men «helt uenig» i EU-medlemskap (Høyres kjernesak): normal: H 97.8 / FrP 79.7 (plass 1 / 2) · ★: H 96.7 / FrP 79.9 (plass 1 / 2) · ★★: H 95.7 / FrP 80.1 (plass 1 / 2).
- **Eksempel C:** SV-profil + «helt enig» i raskere økning av forsvarsbudsjettet: normal: SV 99.6 / Ap 68.3 (plass 1 / 4) · ★: SV 99.4 / Ap 68.2 (plass 1 / 4) · ★★: SV 99.2 / Ap 68.1 (plass 1 / 4).
- Tolkning: ★★ dobler vekten og kan avgjøre mellom to partier som ellers ligger nær hverandre, men én sak kan ikke snu en hel profil – partiet profilen er kopiert fra, forblir øverst.

## 6. Manuelle testpersoner

Synthetic bruker: lavere skatt, lavere bilavgifter, strengere innvandring, strengere straff, pro NATO og høyere forsvarsbudsjett, offentlig helse med private leverandører, avkriminalisering, positiv til regulert cannabis, moderat på klima, pro kjernekraft, pro EØS. Alle andre spørsmål «vet ikke».

### Testperson H/FrP/V – EU-medlemskap = nøytral (0)

Besvart: 24 spørsmål. Klassifisering: **close** + merknad «treffet er mindre presist enn prosenten tilsier» (under 10 poeng over tilfeldighetsnivået) (avstand 1–2: 4.5 poeng; tilfeldighetsnivå 72.6 %).

| Plass | Parti | Score | 10–90-intervall | Andel øverst i bootstrap | Dekning | Spenn om ukjente var verst/best mulig |
|---:|---|---:|---|---:|---:|---|
| 1 | H | 77.9 | 72.3–82.5 | 82.5 % | 86.8 % | 75–79.1 |
| 2 | FrP | 73.4 | 67.7–78.7 | 4.3 % | 93.9 % | 71.8–74.1 |
| 3 | Ap | 71.9 | 66.1–77.4 | 4.3 % | 74.3 % | 69.9–72.9 |
| 4 | KrF | 69.5 | 62.5–76.9 | 3.8 % | 77.3 % | 66.5–71.5 |
| 5 | V | 69.4 | 62.5–75.7 | 5.3 % | 84.5 % | 67.1–70.9 |
| 6 | MDG | 59.4 | 51.7–67 | 0 % | 72.7 % | 53.2–66.2 |
| 7 | Sp | 59.2 | 51.5–66.8 | 0 % | 74 % | 56.5–61.8 |
| 8 | R | 41.1 | 34.2–49.7 | 0 % | 75.3 % | 39.3–46.5 |
| 9 | SV | 40.5 | 36–46.5 | 0 % | 73 % | 37.3–47.1 |

**Spørsmålene som skiller H / FrP / V mest** (bidrag til score i poeng; «–» = ukjent standpunkt):

| Spørsmål | Bruker | H standpunkt | FrP standpunkt | V standpunkt | H bidrag | FrP bidrag | V bidrag | Spredning |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| `drug_decrim` | 2 | 1 | -3 | 3 | 3.2 | 0.8 | 4.3 | 47.1 |
| `drug_cannabis` | 2 | -3 | -3 | 3 | 0.8 | 0.6 | 4.3 | 47.1 |
| `imm_level` | 2 ★ | 3 | 3 | -2 | 4.5 | 4.1 | 1.4 | 37.5 |
| `cli_co2_tax` | -1 | 0 | -3 | 3 | 2.9 | 2.8 | 1.6 | 32.2 |
| `just_sentences` | 2 | 2 | 3 | -1 | 4.3 | 3.3 | 1.6 | 29.7 |
| `just_alt_sentences` | -1 | 1 | -2 | 3 | 2.1 | 3.3 | 1.5 | 29.7 |
| `transport_toll` | 2 | 0 | 3 | -2 | 1.1 | 3.3 | 1.5 | 29.7 |
| `transport_fuel_tax` | 2 | – | 3 | -2 | – | 3.3 | 1.1 | 29.7 |
| `imm_residence` | 2 | 3 | 3 | -1 | 3 | 2.8 | 0.7 | 16.7 |
| `welfare_commercial` | 1 | 3 | 3 | 2 | 4.8 | 4.4 | 6.1 | 16.7 |
| `oil_explore` | 1 | 3 | 3 | -3 | 2.2 | 2 | 1.1 | 15.2 |
| `eu_eea` | -3 | -3 | -2 | -3 | 5.1 | 3.9 | 5.2 | 11.8 |

Genererte innsikter: themeWinner, themeWinner.

### Testperson H/FrP/V – EU-medlemskap = «vet ikke»

Besvart: 23 spørsmål. Klassifisering: **close** + merknad «treffet er mindre presist enn prosenten tilsier» (under 10 poeng over tilfeldighetsnivået) (avstand 1–2: 5.2 poeng; tilfeldighetsnivå 71.5 %).

| Plass | Parti | Score | 10–90-intervall | Andel øverst i bootstrap | Dekning | Spenn om ukjente var verst/best mulig |
|---:|---|---:|---|---:|---:|---|
| 1 | H | 79.8 | 74.4–84.4 | 85.3 % | 86.5 % | 76.8–80.9 |
| 2 | FrP | 74.7 | 68.6–80.3 | 4.5 % | 93.7 % | 73–75.4 |
| 3 | Ap | 72.1 | 64.8–78.1 | 1.8 % | 74.8 % | 70.1–73.1 |
| 4 | V | 71.1 | 64.2–77.2 | 6 % | 84 % | 68.7–72.6 |
| 5 | KrF | 70.4 | 62–77.9 | 2.5 % | 76.7 % | 67.3–72.5 |
| 6 | MDG | 61.1 | 53.3–69 | 0 % | 72 % | 54.4–67.7 |
| 7 | Sp | 58.2 | 49.6–68.2 | 0 % | 73.3 % | 55.5–61 |
| 8 | SV | 39.8 | 34.4–45.1 | 0 % | 71.9 % | 36.5–46.7 |
| 9 | R | 39.7 | 31.6–49 | 0 % | 75.7 % | 38–45.3 |

**Spørsmålene som skiller H / FrP / V mest** (bidrag til score i poeng; «–» = ukjent standpunkt):

| Spørsmål | Bruker | H standpunkt | FrP standpunkt | V standpunkt | H bidrag | FrP bidrag | V bidrag | Spredning |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| `drug_decrim` | 2 | 1 | -3 | 3 | 3.3 | 0.8 | 4.5 | 47.1 |
| `drug_cannabis` | 2 | -3 | -3 | 3 | 0.9 | 0.6 | 4.5 | 47.1 |
| `imm_level` | 2 ★ | 3 | 3 | -2 | 4.6 | 4.3 | 1.4 | 37.5 |
| `cli_co2_tax` | -1 | 0 | -3 | 3 | 3 | 2.9 | 1.6 | 32.2 |
| `just_sentences` | 2 | 2 | 3 | -1 | 4.4 | 3.4 | 1.7 | 29.7 |
| `just_alt_sentences` | -1 | 1 | -2 | 3 | 2.2 | 3.4 | 1.5 | 29.7 |
| `transport_toll` | 2 | 0 | 3 | -2 | 1.2 | 3.4 | 1.5 | 29.7 |
| `transport_fuel_tax` | 2 | – | 3 | -2 | – | 3.4 | 1.1 | 29.7 |
| `imm_residence` | 2 | 3 | 3 | -1 | 3.1 | 2.8 | 0.8 | 16.7 |
| `welfare_commercial` | 1 | 3 | 3 | 2 | 4.9 | 4.5 | 6.3 | 16.7 |
| `eu_eea` | -3 | -3 | -2 | -3 | 7.4 | 5.7 | 7.6 | 16.7 |
| `oil_explore` | 1 | 3 | 3 | -3 | 2.2 | 2.1 | 1.2 | 15.2 |

Genererte innsikter: themeWinner.

**Viktighet i praksis (samme testperson, «vet ikke» på EU):** av 23 besvarte spørsmål er det 0 der ★★ alene endrer hvilket parti som er øverst.

Kryss-politisk velger: helt venstre på økonomi, helt restriktiv på innvandring og streng på justis, helt liberal på verdier og rus, helt for EU-integrasjon, høy klimaprioritet, for sentralisering, for kjernekraft og NATO. Svarer på alle 80.

### Kryss-politisk velger

Besvart: 80 spørsmål. Klassifisering: **uncertain** + merknad «treffet er mindre presist enn prosenten tilsier» (under 10 poeng over tilfeldighetsnivået) (avstand 1–2: 2.5 poeng; tilfeldighetsnivå 63.2 %).

| Plass | Parti | Score | 10–90-intervall | Andel øverst i bootstrap | Dekning | Spenn om ukjente var verst/best mulig |
|---:|---|---:|---|---:|---:|---|
| 1 | MDG | 69.3 | 64.1–75.2 | 66.5 % | 75.8 % | 61.3–73.1 |
| 2 | V | 66.8 | 59.7–73.4 | 24.5 % | 76 % | 59.1–70.6 |
| 3 | SV | 60.8 | 54.6–68.7 | 2.5 % | 74.2 % | 53–66.4 |
| 4 | Ap | 60.8 | 55.5–66.6 | 6.3 % | 69.4 % | 52.3–66.3 |
| 5 | R | 56.8 | 49.8–64.6 | 0.3 % | 78.6 % | 51.3–61.7 |
| 6 | H | 49.9 | 42.4–56.1 | 0 % | 73.2 % | 42.8–58.1 |
| 7 | KrF | 45.3 | 39.2–52 | 0 % | 71.3 % | 39.1–52.8 |
| 8 | Sp | 43.3 | 37.6–49.8 | 0 % | 75.4 % | 39.7–49.3 |
| 9 | FrP | 40.3 | 32.8–46.5 | 0 % | 86.4 % | 39.2–43.9 |

Genererte innsikter: closePair(MDG/V), themeWinner, themeWinner, themeWinner.

Beste parti får 69.3 %, som er over 95-persentilen for beste parti hos en helt tilfeldig bruker (68.5 %).

Politisk «hjemløs» velger: marked og lavere skatt, restriktiv innvandring, høy klimaprioritet, liberal på verdier og rus, EU-skeptisk, desentralisering, mildere straffer, for kjernekraft, skeptisk til NATO og mot høyere forsvarsbudsjett. Svarer på alle 80.

### Politisk «hjemløs» velger

Besvart: 80 spørsmål. Klassifisering: **clear** + merknad «treffet er mindre presist enn prosenten tilsier» (under 10 poeng over tilfeldighetsnivået) (avstand 1–2: 11.9 poeng; tilfeldighetsnivå 63.4 %).

| Plass | Parti | Score | 10–90-intervall | Andel øverst i bootstrap | Dekning | Spenn om ukjente var verst/best mulig |
|---:|---|---:|---|---:|---:|---|
| 1 | V | 68 | 61.6–74.3 | 92.3 % | 76 % | 60.2–71.7 |
| 2 | H | 56.1 | 50.1–62.6 | 1.5 % | 73.2 % | 48.3–63.2 |
| 3 | FrP | 55.6 | 49–62.2 | 4.3 % | 86.4 % | 53.6–58.3 |
| 4 | SV | 50.7 | 42.9–57.6 | 1 % | 74.2 % | 43.9–57.7 |
| 5 | MDG | 50.2 | 43.3–56.3 | 0 % | 75.8 % | 44.6–56.3 |
| 6 | R | 49.4 | 41.6–56.7 | 1 % | 78.6 % | 45.1–55.1 |
| 7 | Sp | 43.9 | 37.3–50.3 | 0 % | 75.4 % | 40.3–49.9 |
| 8 | Ap | 39.2 | 34.4–44 | 0 % | 69.4 % | 34.1–47.7 |
| 9 | KrF | 37.8 | 31.4–43.5 | 0 % | 71.3 % | 33–46.3 |

Genererte innsikter: themeWinner, themeWinner, themeWinner.

Beste parti får 68 %; tilfeldighetsnivået for disse svarene er 63.4 %. Klassifisering: **clear**, med merknaden om at treffet er mindre presist enn prosenten tilsier.

## 7. Oppsummering

- Antall syntetiske profiler kjørt: **8148**.
- Invariantsjekk av genererte innsikter: 400 resultater kontrollert, 0 brudd.
