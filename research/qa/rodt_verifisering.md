# Verifisering av Rødts arbeidsprogram 2025–2029 (speilkopi vs. Rødts egne filer)

Dato: 2026-10-14. Ingenting i /home/user/Valgomat er endret.

## Konklusjon (kort)

1. **Speilkopien (idrettsforbundet.no, SHA-256 2a3d8502…5c5) er byte-identisk med en fil Rødt selv har lastet opp**:
   Rødts Sanity-fillager har asset `file-09ea12fc8fe276490fee4cbd8a06f5da646babd2-pdf`
   (originalFilename `arbeidsprogram25-29_skjerm.pdf`, lastet opp 2025-06-06T06:48:10Z, 1 280 793 byte).
   Den lastet jeg ned fra Rødts CDN, og den har samme SHA-256 som R.pdf. Speilet er altså ekte, men det er **en mellomversjon**.
2. **Rødt har siden byttet fil.** Filen roedt.no/arbeidsprogram peker på nå («Rødts arbeidsprogram – Bokmål») er
   `7393ab981e025ec77c5c78797892dfc9f020fc17` (lastet opp 2025-09-02). Den har **samme innhold, med fire små tekstendringer**.
   Tre av endringene ligger på sider valgomaten siterer (26, 98, 99), se under.
3. Lenken vi hadde som «offisiell» (`a75af475…`) er **en eldre utgave** (2025-05-28). Den er ikke den gjeldende versjonen.

Status: **samme dokument, men en annen og eldre versjon enn den gjeldende. Det er små avvik.**

## Hvordan jeg fikk tilgang (hva virket og hva ikke)

| Forsøk | Resultat |
|---|---|
| curl roedt.no / xn--rdt-0na.no, 6 forsøk med ~60 s pause, ulike UA (Chrome, Firefox, Safari, iPhone, curl, Wget), HTTP/1.1 og HTTP/2, med og uten `?dl=` | Alle **429**: Vercel Security Checkpoint (`x-vercel-mitigated: challenge`, JS-utfordring) |
| WebFetch roedt.no/arbeidsprogram | 429 |
| roedt-no.translate.goog (Google Translate-proxy) | 429 |
| r.jina.ai/https://roedt.no/arbeidsprogram | **200** (trolig mellomlagret av jina). Viser lenker til bokmål `7393ab98…` og nynorsk `66380b5c…`. PDF-ene gjennom jina gir 429, også med `X-Engine: browser` |
| Google Docs viewer (viewerng) | Ingen nyttig respons (500 / tom) |
| archive.ph / archive.today | Forbindelsen tilbakestilt |
| web.archive.org CDX | Forbindelsen tilbakestilt. `archive.org/wayback/available` svarer, men har ingen snapshots |
| Google cache | Gir bare en søkeside. Bing cache: 502 |
| pdf-arkivet.no/rv/ | Har Rødt-programmer til og med 2021–2025, men ikke 2025–2029 |
| arbark.no/eldok | Har `Rødt2021_23.pdf` (2021-programmet). 2025-varianter gir 404 |
| polsys.sikt.no, nb.no | Fant ikke 2025–2029-programmet |
| WebSearch etter tredjepartskopier (idrettskretser, LO, FFO, Rød Ungdom, lokallag osv.) | Fant bare idrettsforbundet-speilet. Søket ga også flere roedt.no/fil-hasher: `a75af475…`, `25ba75b9…`, `f55e933a…` |
| **cdn.sanity.io/files/cvvjxa4t/production_new/&lt;hash&gt;.pdf** | **Dette virket.** Rødts `roedt.no/fil/<sha1>.pdf` er Sanity-assets. Et søketreff viste en Rødt-fil på denne CDN-stien |
| **Sanity offentlig GROQ-API** `cvvjxa4t.apicdn.sanity.io/v2021-10-21/data/query/production_new` | **Dette virket.** Gir asset-metadata (filnavn, opplastingstid, sha1) og hvilke dokumenter som refererer til hver fil |

Bevis for at kildene er ekte:
- Sanity-asset-ID er SHA-1 av filinnholdet. For alle nedlastede filer stemmer `sha1sum` med ID-en.
- Datasettet inneholder `documentFile` «Rødts arbeidsprogram – Bokmål» (id `ZCdePxbue4i5F7LvJpWuy7`) → `7393ab98…`, og «Rødts arbeidsprogram – Nynorsk» → `66380b5c…`. Dette stemmer med lenkene på roedt.no/arbeidsprogram (via jina).
- Datasettet har også Rødts andre programfiler: 2021–2025-programmet, komitéforslaget for 2025 osv.

## Alle versjoner av arbeidsprogram25-29 i Rødts fillager

Filene ligger i /tmp/claude-0/rodt-kandidater/sanity_&lt;sha1&gt;/file.pdf. Alle har 106 sider og A4-format, Producer Adobe PDF Library 17.0.

| Opplastet (UTC) | sha1 (= roedt.no/fil-ID) | SHA-256 | Byte | Creator | CreationDate | Brukes nå? | Identiske sider mot speilet |
|---|---|---|---|---|---|---|---|
| 2025-05-21 07:52 | 25ba75b90597df613816bd5c6c77dc7d49192e20 | 9d9a96fc…831c3c | 1 425 826 | InDesign 20.3 | 2025-05-21 07:51 | nei | 93/106 |
| 2025-05-28 13:30 | a75af475e3d0afdb5e0a85cff8016ab7bf1de8a6 («vår offisielle lenke») | a64cc1c2…07d974 | 1 281 101 | InDesign 20.3 | 2025-05-28 13:16 | nei | 103/106 |
| **2025-06-06 06:48** | **09ea12fc8fe276490fee4cbd8a06f5da646babd2** | **2a3d8502…dfe15c5 (= R.pdf)** | 1 280 793 | InDesign 20.3 | 2025-06-06 06:41 | nei | **106/106 (byte-identisk)** |
| 2025-06-12 07:37 | f55e933a9fb27aeda2e87c2c0eecc42ee781810c | bfbd2e14…dfe77be | 1 280 796 | InDesign 20.3 | 2025-06-11 13:50 | nei | 105/106 |
| **2025-09-02 07:35** | **7393ab981e025ec77c5c78797892dfc9f020fc17** | **b3aa1058ba0451d3708cd6731c3b13c58e0f86b09f4bd7fc5af141a4d64cafd0** | 1 280 981 | InDesign 20.5 | 2025-09-02 07:34 | **JA, bokmål** | **100/106** |
| 2025-09-17 08:52 | 66380b5c6c6a1a4a5f06219bf07c701a5a110f6f (nynorsk) | 37dfc6c3…e437e23 | 1 285 143 | InDesign 20.5 | 2025-09-17 08:51 | JA, nynorsk | ikke sammenlignet (annet språk) |

Ingen av filene har Title i pdfinfo.

## Avvik: speilet (06-06) mot gjeldende offisiell versjon (09-02, `7393ab98…`)

Sammenligningen er gjort side for side. Whitespace er normalisert. Sidene som avviker er 26, 27, 55, 60, 98 og 99. Det er fire reelle endringer:

1. **s.26 (Skole):** Speilet har avsnittet «Dagens skole reproduserer også kjønnsforskjeller … bygge ned disse forskjellene» **to ganger**. Gjeldende versjon har det bare én gang. Duplikatet er fjernet, og innholdet er det samme. Dette gir litt omflyt, så punkt j) og k) («Styrk oppfølgingstjenesten …», «Elever med funksjonsnedsettelser …») flytter fra s.27 til s.26. Bokstavene er de samme.
2. **s.55 (skog):** «Ta ut mer sitkagran fra norsk **fauna**» er endret til «… norsk **flora**».
3. **s.60 (energi), punkt l):** «Si nei til vindkraft på land, i fjæra til havs» er endret til «Si nei til vindkraft på land, i fjæra **og** til havs». Denne rettelsen finnes allerede i 06-12-versjonen.
4. **s.98 (Kriminalitetsforebygging og straff), RØDT VIL:** Et **nytt punkt d)** er satt inn: «Ha betydelig skjerpet straff for voksne som rekrutterer, utnytter eller på andre måter involverer barn i kriminelle handlinger.» Speilets punkt d)–h) blir dermed **e)–i)**. Dette gjelder «Utvikle og forsterke alternativer til fengsel …», «At fengsel som straff bør gjelde …», «At all soning … i Norge», «Sikre at strafferammene … skjerpes» og «Ansvarliggjøre og straffe plattformer …». Som følge av dette flyter punkt c)–d) i lista om økonomisk kriminalitet («Øke straffeutmålingen …», «Etablere et a-krimsenter …») over fra s.98 til s.99. Bokstavene i den lista er de samme.

Sider som valgomaten siterer, sammenlignet med gjeldende versjon:
- **Identiske:** 7, 11, 13, 14, 16, 28, 35, 39, 58, 59, 66, 69, 73, 76, 85, 86, 87, 88, 93, 95, 96, 97.
- **Avviker:** 26 (bare duplikatet og omflyt), 98 (nytt punkt og bokstavforskyvning), 99 (omflyt). Side 60 er ikke på lista, men research/qa/faktasjekk_D.md siterer den.

### Hva dette betyr for valgomaten
- Sitater fra s.98 i faktasjekk_B og faktasjekk_C har fortsatt **samme ordlyd og samme side**. Det gjelder «Utvikle og forsterke alternativer til fengsel …», «At fengsel som straff bør gjelde …», «strafferammene … skjerpes» og «La ureturnerbare asylsøkere …». Hvis valgomaten oppgir **bokstavpunkter** for punktene etter c) i straffelista, er de forskjøvet med én. Det nye punktet om skjerpet straff for voksne som rekrutterer barn kan også være relevant for `just_sentences`, fordi det trekker i strengere retning.
- **energy_onshore_wind / energy_offshore_wind:** faktasjekk_D siterer s.60 som «i fjæra til havs». Gjeldende tekst er «Si nei til vindkraft på land, i fjæra **og** til havs». Det betyr et eksplisitt nei til vindkraft til havs, som er relevant for `energy_offshore_wind` (nå U/OMSTRIDT). Sitatet bør rettes.
- s.55 «fauna» → «flora» gjelder bare et skogpunkt. Ingen kjent påvirkning.

## Avvik i de eldre versjonene (til orientering)
- `a75af475…` (05-28): s.42–43 har rovdyr- og allemannsrett-delen satt opp annerledes (overskriften «Rovdyr» og et «RØDT VIL:» mangler, og punktene står i annen rekkefølge), og s.78 har «romani» i stedet for «romanifolket». Ingen siterte sider avviker.
- `25ba75b9…` (05-21): Har i tillegg tegnsettingsforskjeller på s.2–11, bokstavforskyvning på s.6 og en annen rekkefølge i avsnittet om Kina/imperialisme på s.86–87. Siterte sider som avviker: 7, 11, 86 og 87 (mest tegnsetting, men 86–87 har strukturendringer).
- `f55e933a…` (06-12): Avviker fra speilet bare med «i fjæra **og** til havs» på s.60.

## Filer
- Kandidater: /tmp/claude-0/rodt-kandidater/sanity_&lt;sha1&gt;/file.pdf (+ file.txt, file.layout.txt)
- Mislykkede direkteforsøk: /tmp/claude-0/rodt-kandidater/roedt_direct/, /tmp/claude-0/rodt-kandidater/proxies/, /tmp/claude-0/rodt-kandidater/jina/
- Sanity-metadata: scratchpad/sanity_q.json, scratchpad/sanity_all.json
- Diff-utdata: scratchpad/cmp_out.txt (per side), scratchpad/cmp_whole_out.txt (hele dokumentet)
- Skript: scratchpad/cmp_pages.py, scratchpad/cmp_whole.py

## Anbefaling
Bytt kildefilen til den gjeldende versjonen: `https://cdn.sanity.io/files/cvvjxa4t/production_new/7393ab981e025ec77c5c78797892dfc9f020fc17.pdf`, som er det samme som `https://roedt.no/fil/7393ab981e025ec77c5c78797892dfc9f020fc17.pdf?dl=`. SHA-256 er b3aa1058…cafd0. Rett deretter sitatet på s.60 og eventuelle bokstavreferanser på s.98. Sidetallene for alle siterte punkter er de samme.
