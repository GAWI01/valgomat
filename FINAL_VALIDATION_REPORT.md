# Sluttrapport – validering av Valgomat 2027

**Dato:** 15. oktober 2026 (oppdatert etter to oppfølgingsrunder) · **Gren:** `claude/valgomat-2027`

Denne rapporten oppsummerer en red-team-gjennomgang. Målet var å vise at valgomaten tar feil, ikke å bekrefte den. Detaljene står i egne dokumenter:

- [POLITICAL_QA.md](POLITICAL_QA.md): alle 720 partikodinger, unknowns, Rødt-kilden og bias-review av spørsmålene.
- [STRESS_TEST.md](STRESS_TEST.md): 8000+ syntetiske profiler, kalibrering, unknown-bias, viktighet og manuelle testpersoner. Rapporten genereres av `scripts/qa/stress.ts`.
- `test-results/clusters.md`: dobbelttellingsanalysen. Den genereres av `scripts/qa/clusters.ts`.
- `research/qa/`: arbeidsrapportene, endringslisten og loggen før og etter.

Ingen partistandpunkter og ingen deler av algoritmen er endret for å få et bestemt parti øverst for en bestemt testperson. Selve scoren (enighet, vekter, normalisering) er uendret. Algoritmeendringene gjelder bare **klassifiseringen og tekstene** rundt resultatet. Hver endring har en matematisk begrunnelse, som står under FIXED.

---

## PASS

| Kontroll | Resultat |
|---|---|
| Perfekte partiprofiler | Alle 9 partier blir nr. 1 med 100 %. Med støy og tilfeldige svar på partiets unknowns: nr. 1 i 900 av 900 profiler. |
| Motsatte profiler | Partiet havner på plass 8 eller 9, med 7–33 %. |
| Arketyper | Plausible og forklarbare (STRESS_TEST.md §2). Liberal → V. Konservativ → H / KrF. Sosialist → SV. Grønn → MDG. Distrikt → Sp. Innvandringsrestriktiv → FrP. Ruspolitisk liberal → V. Forsvar/NATO → spredt på flere partier, og «ingen passer» i 35 %, noe som er riktig når resten av svarene er tilfeldige. |
| Unknown-bias når standpunkter mangler tilfeldig | Ingen systematisk skjevhet: snittendringen er 0,0–0,2 poeng ved 100/90/75/60 % dekning. Spredningen øker som forventet (std.avvik 1,5 → 3,6 poeng), og det samme gjør intervallbredden (10,8 → 13,7 poeng). |
| Viktighet | ★★ dobler vekten. Ett enkelt spørsmål kan maksimalt utgjøre 3,5 % av vekten (med ★★, når alle 80 er besvart). Én sak kan dermed avgjøre mellom to partier som ligger nær hverandre, men kan ikke snu en hel profil (eksempel A–C i STRESS_TEST.md §5). |
| Genererte tekster | Ingen tekst sier «du bør stemme». De to stedene ordet «stemme» brukes, er en forklaring på at prosenten ikke er en anbefaling. Invariantsjekken på 400 resultater fant 0 brudd. Den kontrollerte at: <ul><li>dealbreakers er reelle konflikter på viktige saker hos topppartiet;</li><li>«nær match» og «klar match» har minst 2,5 poengs avstand;</li><li>«klar match» krever ≥ 6 poeng og ≥ 60 % dekning;</li><li>ingen vinner kåres under tilfeldighetsnivået;</li><li>«mest enige» betyr enighet og «mest uenige» betyr konflikt.</li></ul> |
| Personvern | Svarene lagres bare i `localStorage` (nøkkel `valgomat2027:v1`: svar, posisjon og tidsstempel; `valgomat2027:theme`: lys/mørk modus). Kildekoden har ingen `fetch`, XHR, beacon, websocket eller analyseverktøy. Den bygde siden har nå en CSP med `connect-src 'none'`, så nettleseren hindrer alle nettverkskall fra siden. |
| Kodeinjeksjon | Ingen `innerHTML`, `dangerouslySetInnerHTML` eller `eval`. All tekst fra datafilene rendres som React-tekst og escapes derfor. Kilde-URL-er valideres i byggesteget: bare `https:` er tillatt, så `javascript:`/`data:`-lenker avvises. CSP-en tillater bare egne skript og ett hashet inline-skript. |
| `npm audit` | **0 sårbarheter**, både i det som sendes til brukeren og i test- og byggeverktøyene (etter oppgradering til vitest 5 og Tailwind 4, se FIXED). |
| Tester | 40 enhetstester er grønne (vitest 5). `tsc -b` er grønn. Bygget er grønt. Browser-QA (Playwright, 375 px, 320 px mørk modus og 1280 px) besvarer alle 80 spørsmål, sjekker at det ikke er horisontal scroll eller konsollfeil (CSP inkludert), og at autolagring og «Start på nytt» virker. |

## FIXED

### Data

- **173 standpunkter endret** (POLITICAL_QA.md §2–§7):
  - 4 fortegn snudd: 3 feil fra første runde og Aps atomvåpenforbud etter blindtesten;
  - 57 verdier endret;
  - 13 kodinger satt til unknown, 8 av dem etter blindtesten;
  - 59 unknowns kodet: 30 fra programmet og 29 fra nyere offisielle kilder (partienes nettsider, landsmøtevedtak, statsbudsjettet 2027 og partienes egne merknader og forslag i Stortinget);
  - 19 kodinger fikk høyere og 31 lavere confidence;
  - 34 sidetall/kilder og 56 begrunnelser rettet.
- **Aps unknowns gikk fra 30 til 12.** Alle sitatene er kontrollert ordrett mot kildene.
- **Rødts kilde er verifisert og byttet** til partiets gjeldende programfil (2. september 2025), hentet fra Rødts eget publiseringssystem (POLITICAL_QA.md §7). Speilet vi brukte var byte-identisk med en eldre opplasting fra Rødt (6. juni 2025). Den nye versjonen har fire små tekstrettelser. Én av dem gjør at Rødt nå eksplisitt sier nei til vindkraft til havs, så `energy_offshore_wind` for Rødt er kodet −2 HIGH.
- **Dobbelttelling fjernet:** 5 drivstoffkodinger var utledet fra den samme CO₂-avgiftssetningen som allerede teller i `cli_co2_tax`, og ble satt til unknown. V og SV er senere kodet ut fra egne uttalelser om drivstoffavgiftene i Stortinget.
- **Bias og steelman:** 2 påstander og 8 bakgrunnstekster er presisert, og 5 for/mot-argumenter er balansert. Blant rettelsene er én faktafeil (Albania) og én utdatert opplysning (energipakken etter juni 2025). Ingen endring påvirker partikodingen (POLITICAL_QA.md §8).
- Byggesteget godtar nå flere kilder per standpunkt (`169;src:…`). Kildebiblioteket viser kildetypen (partiprogram, nettside, landsmøtevedtak, stortingsdokument, sekundærkilde) i stedet for å kalle alt som ikke er program for «sekundærkilde».

### Klassifisering og tekster

- **«Ingen parti passer spesielt godt» (ny klassifisering).**
  - *Problem:* tilfeldige svar ga 63 % til beste parti i median og ble kalt «nær match» eller «klar match» i 41 % av tilfellene. Systemet kunne ikke si at ingen passer.
  - *Løsning:* brukerens egne svar stokkes 200 ganger mellom de besvarte spørsmålene. Er beste partis score lavere enn 90-persentilen for beste parti i de stokkede svarene, er resultatet ikke bedre enn tilfeldig. Da sier vi det.
  - *Effekt:* 436 av 500 tilfeldige brukere får nå «ingen parti passer spesielt godt», og alle de 64 øvrige får merknaden om svak tilpasning. Med 90-persentilen som terskel er det ventet at rundt 10 % av rene tilfeldighetsprofiler havner over. Ingen ekte partiprofil får denne klassifiseringen; marginen er over 15 poeng (testet).
- **Merknad om svak tilpasning.**
  - *Problem:* en politisk «hjemløs» testperson fikk «Klar match» for V med 68 %, bare 4,5 poeng over sitt eget tilfeldighetsnivå.
  - *Løsning:* Rangeringen er riktig, men ordet «klar» overdriver tilpasningen. Ligger beste parti mindre enn 10 poeng over tilfeldighetsnivået, får brukeren nå en merknad om at en stor del av prosenten ville kommet også med tilfeldig stokkede svar, og at treffet derfor er mindre presist enn prosenten tilsier. Vi valgte bevisst ikke å skrive «ingen partier passer» her: H/FrP/V-testpersonen nedenfor får merknaden selv med 80 % for H, fordi svarene stort sett er «enig», noe som gir et høyt tilfeldighetsnivå (73 %).
  - *Begrunnelse for 10 poeng:* ekte partiprofiler ligger 25–30 poeng over, tilfeldige profiler under 5. Grensen er dokumentert på metodesiden.
- **«Mest enige» og «mest uenige».**
  - *Problem:* «Mest enige» kunne vise et spørsmål der brukeren sa +1 og partiet −1, altså motsatte sider. «Mest uenige» og dealbreaker kunne utløses av et nøytralt svar mot et ytterpunkt.
  - *Ny definisjon av enighet:* høyst 1 steg fra hverandre, eller 2 steg på samme side av midten.
  - *Ny definisjon av konflikt:* hver sin side av midten med minst 3 stegs avstand, eller minst 4 steg fra hverandre.
  - Definisjonene er testet og dokumentert på metodesiden.
- **Kalibrering forklart:** metodesiden sier nå at helt tilfeldige svar gir rundt 55 % til hvert parti og rundt 64 % til det beste.

### Avhengigheter (alle sårbarheter rettet)

- `npm audit` viste 10 sårbarheter (2 kritiske) i test- og byggeverktøyene: vitest/tinypool og tailwind/chokidar/braces. For `braces` finnes ingen rettet versjon, så eneste løsning var å fjerne avhengigheten.
- **vitest 3 → 5.** Alle 40 tester er grønne uten endringer.
- **Tailwind CSS 3 → 4**, migrert med Tailwinds eget verktøy. Tailwind 4 bruker ikke lenger braces, chokidar eller micromatch, og autoprefixer trengs ikke.
- For å beholde utseendet nøyaktig:
  - v3-fargepaletten er låst i `@theme` (v4 har en ny standardpalett);
  - hånd-pekeren på knapper er beholdt;
  - v3-regelen for listeavstand i løpende tekst er gjenskapt;
  - tre overskrifter har fått eksplisitt linjehøyde på større skjermer.
- **Verifisert at UI-et er uendret:**
  - beregnede stiler for alle elementer på alle sider er sammenlignet, i lys og mørk modus, på mobil og desktop;
  - skjermbildene er sammenlignet piksel for piksel;
  - 24 av 33 skjermbilder er identiske (innenfor normal kantutjevning), og resten har bare forskjeller i kantutjevning eller fra inn-animasjonen.
- `vite-node` er fjernet. Det krevde Vite 8. QA-skriptene kjøres nå med Vites egen `runnerImport` (`npm run qa:stress`, `qa:clusters`, `qa:smoke`).
- **Resultat: `npm audit` = 0 sårbarheter.**

### Sikkerhet

- Ugyldig prosentkoding i URL-en (f.eks. `#/sak/%E0%A4`) krasjet appen. Nå fanges den.
- Spørsmålsnummeret i URL-en valideres som et heltall mellom 1 og 1000.
- Lagrede svar valideres når de lastes. Svar på ukjente spørsmål, verdier utenfor −3…3 og ugyldig viktighet forkastes, så manipulert localStorage ikke kan gi NaN-scorer.
- Content-Security-Policy er lagt til i den bygde siden: `default-src 'none'`, `connect-src 'none'`, `script-src 'self'` + hash.
- 6 nye sikkerhetstester (`tests/security.test.ts`).

## Oppfølgingsrunde 2: punktene som gjensto før lansering

| Punkt | Status | Hva som er gjort |
|---|---|---|
| Uavhengig andregangskoding | **Gjort (blindtest)** | En separat koder fikk bare påstanden og programmene. Den kodet 145 standpunkter blindt: alle LOW-kodinger, de omstridte, 60 tilfeldige og 20 unknowns. Vektet kappa 0,96 for vanlige kodinger og 0,92 totalt. Alle 25 uenigheter er avgjort, og 8 svakt belagte kodinger er satt til unknown (POLITICAL_QA.md §6d, `research/qa/reliabilitet.md`). Koderen var en AI-agent, ikke et menneske. |
| Partiene ser sine kodinger | **Klart til utsending** | `party-review/` har én pakke per parti (markdown og regneark med svarkolonner), følgebrev og en rutine for likebehandling og logging av svar. Utsendelsen må gjøres av redaksjonen. |
| Aps unknowns etter landsmøte og stortingsbehandling | **Overvåket** | Status 15.10.2026: dødshjelp (Dok. 8:264 S) er til behandling, og sexkjøp (Dok. 8:16 S) er mottatt. `npm run qa:watch` sjekker sakene i `research/qa/watchlist.json` mot data.stortinget.no og varsler (exit-kode 2) når en sak er ferdigbehandlet. Aps neste ordinære landsmøte er våren 2027. |
| regjeringen.no blokkert | **Løst uten å omgå sperren** | Sperren er en Cloudflare-sjekk mot automatiske besøk, ikke vår proxy. Budsjettforslaget for 2027 er lest via Stortingets referat av finansministerens redegjørelse, trontaledebatten med voteringer, Statsforvalteren og Aps egne sider (POLITICAL_QA.md §6c). Ap `transport_fuel_tax` (−1 MEDIUM) og `econ_property_tax` (+1 LOW) er kodet. Når proposisjonsteksten trengs, kan den lastes ned i en vanlig nettleser og tas inn med `research/tools/import-pdf.sh`. |

## WARNING

1. **Unknowns som ikke mangler tilfeldig.** Selv om unknowns i snitt ikke gir skjevhet, kan de løfte et parti for en *bestemt* bruker når partiet tier om nettopp de sakene der det er uenig med brukeren.
   - Aps score kunne for en tilfeldig bruker ligget mellom 55,3 og 66,5 (spenn 11,2 poeng, ned fra 14,9 før oppfølgingsrundene) dersom alle unknowns var henholdsvis verst og best mulig. For FrP er spennet 4,8 poeng.
   - Testpersonen H/FrP/V: Ap kommer på 3. plass med 72 %. Verst/best-spennet er 70–73.
   - Appen viser datagrunnlaget per parti og merker resultater under 60 % dekning. Ap har 69,4 % dekning når alle spørsmål er besvart.
   - Vi har bevisst **ikke** justert scoren: det finnes ingen nøytral måte å gjette på unknowns.
2. **Partiene ligger i et nesten endimensjonalt rom.** Med 9 partier er 195 spørsmålspar korrelert med |r| ≥ 0,9 over partienes standpunkter, også saker uten innholdsmessig sammenheng.
   - Klyngene er derfor semantiske (samme sak, samme virkemiddel).
   - Vektandelene er dokumentert i `test-results/clusters.md`:
     - ingen tema har mer enn 8,7 % av vekten;
     - den største tverrgående blokken (klima, olje, energi og bil) har 20,4 % av vekten, mot 22,5 % av spørsmålene.
3. **Svake spørsmål:**
   - `work_min_benefits`, `housing_equity` og `def_ukraine` (spredning bare 2);
   - `work_activity_duty` og `val_surrogacy` (bare 4 partier kodet).

   De bør vurderes erstattet før 2027. Se RESEARCH_AUDIT.md.
4. **Omstridte kodinger og blindtest med AI-koder.** Samsvaret er lavest for de omstridte kodingene (kappa 0,57). Disse er justert eller flagget (POLITICAL_QA.md §5 og §6d). En menneskelig andregangskoding av de omstridte kodingene, eller tilbakemelding fra partiene, vil gjøre dem sikrere.
5. **Kildetilgang:** regjeringen.no, statsbudsjettet.no, ks.no, udi.no og lovdata.no avviser automatiske besøk. Budsjettinnholdet er hentet via Stortinget og Statsforvalteren. Selve proposisjonsteksten er ikke lest, og elbil-momsgrensen (150 000 kr) er bare bekreftet via bransjekilde og finanstalen.
6. **21 kodinger bygger på Stortingets innstillinger og debatter.** De er kodet bare når partiets egen merknad, forslag eller innlegg svarer direkte på påstanden, og har høyst MEDIUM confidence.

## UNKNOWN

1. ~~Rødts kilde er ikke byte-verifisert.~~ **Løst** (POLITICAL_QA.md §7).
2. **102 unknowns** (ned fra 148 før gjennomgangen). Fordelt per parti:

   | Ap | H | Sp | SV | V | R | KrF | MDG | FrP |
   |---:|---:|---:|---:|---:|---:|---:|---:|---:|
   | 12 | 15 | 11 | 12 | 11 | 11 | 13 | 11 | 6 |

   Etter blindtesten ble 8 svakt belagte kodinger satt tilbake til unknown, så tallet steg med én fra forrige runde. Unknowns fylles ikke ut for å øke dekningen.
3. Om programtekstene vil endres før 2027 (landsmøter 2026–2027), er ukjent. Kvartalsvis SHA-256-kontroll og `npm run qa:watch` er beskrevet i RESEARCH_PLAN.md.

## BLOCKER

**Ingen.** Ingen funn hindrer testing med ekte brukere.

## COVERAGE per parti

| Parti | Kodet | HIGH | MEDIUM | LOW | Unknown | Kun ikke-programkilde | Kodet før QA | Dekning (alle 80 besvart, confidence-vektet) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Ap | 68 | 27 | 32 | 9 | 12 | 17 | 50 | 69,4 % |
| H | 65 | 42 | 21 | 2 | 15 | 0 | 64 | 73,2 % |
| FrP | 74 | 57 | 16 | 1 | 6 | 0 | 76 | 86,4 % |
| Sp | 69 | 37 | 25 | 7 | 11 | 2 | 63 | 75,4 % |
| SV | 68 | 44 | 19 | 5 | 12 | 3 | 63 | 74,2 % |
| R | 69 | 52 | 10 | 7 | 11 | 1 | 65 | 78,6 % |
| V | 69 | 42 | 19 | 8 | 11 | 2 | 65 | 76,0 % |
| KrF | 67 | 38 | 17 | 12 | 13 | 2 | 64 | 71,3 % |
| MDG | 69 | 38 | 30 | 1 | 11 | 3 | 62 | 75,8 % |
| **Sum** | **618** | **377** | **189** | **52** | **102** | **30** | **572** | |

## SCORING STRESS TEST

**Profiler.** Over 8000 syntetiske profiler (reproduserbart, seed 20271014):

| Profiltype | Antall |
|---|---:|
| Perfekte, støyete og motsatte partiprofiler | 1 818 |
| Arketyper | 800 |
| Tilfeldige brukere (kalibrering) | 770 |
| Unknown-maskering ved 100/90/75/60 % | 4 320 |
| Unknown-grenser | 40 |
| Invariantsjekk av tekster | 400 |

**Prosentfordeling (kalibrering):**

| | p5 | median | p95 |
|---|---:|---:|---:|
| Alle partiscorer, tilfeldig bruker | 47,8 | 56,0 | 64,4 |
| Beste parti, tilfeldig bruker | 58,4 | 63,5 | 68,5 |
| Beste parti, ekte partiprofil med støy | 92,2 | 94,4 | 96,4 |
| Avstand 1–2, tilfeldig bruker (poeng) | 0,2 | 2,0 | 6,6 |

Prosentene ligger altså i et smalere og høyere bånd enn intuisjonen tilsier: 55 % er støygulvet, ikke «litt enig». Dette er dokumentert for brukeren. Skalaen er **ikke** endret, fordi enhver omskalering ville være en kosmetisk justering uten ny informasjon. Rekkefølgen, avstanden og tilfeldighetsnivået er det som bærer informasjon.

**Testperson H vs FrP vs V.** Brukeren vil ha lavere skatt og bilavgifter, strengere innvandring og straff, NATO og høyere forsvarsbudsjett, private helseleverandører, avkriminalisering og regulert cannabis, er moderat på klima, for kjernekraft og EØS, og usikker på EU. Testpersonen svarte på 23–24 spørsmål.

- Resultat: **H 80 %**, FrP 75 %, Ap 72 %, V 71 %, KrF 70 % → «nær match» (5 poeng, H øverst i 85 % av bootstrap-trekkene), med merknaden om svak tilpasning (tilfeldighetsnivå 72 %).
- Det som avgjør:
  - **V taper** på innvandringsnivå (V −2 mot bruker +2★), strengere straffer (V −1), bompenger (V −2), oljeleting (V −3) og CO₂-avgift (V +3 mot bruker −1). V vinner stort på avkriminalisering og cannabis (V +3), men det er bare to av spørsmålene.
  - **H slår FrP** fordi H er moderat der brukeren er moderat: avkriminalisering (H +1 mot FrP −3, bruker +2) og CO₂-avgift (H 0 mot FrP −3, bruker −1). FrP vinner på bompenger og alternative straffer.
  - **Ap på 3. plass** skyldes delvis unknowns: Ap har ikke kjent standpunkt på bompenger og drivstoff. Verst/best-spennet for Ap er 70–73 %.
  - ★★ på ett enkelt spørsmål endrer ikke vinneren for denne personen (0 av 23).
- Resultatet er forklarbart ut fra dataene, og vi har ikke endret noe for å påvirke det.

**Kryss-politiske testpersoner.**
- Testperson 1: venstre økonomi, streng innvandring og justis, liberal, EU, grønn. Resultat: MDG 69 % og V 67 % mot tilfeldighetsnivå 63 %, «usikkert mellom flere partier», med merknaden om svak tilpasning (6 poeng over tilfeldighetsnivået).
- Testperson 2, «hjemløs»: marked, streng innvandring, grønn, liberal, EU-skeptisk, mot NATO. Resultat: V 68 % mot tilfeldighetsnivå 63 %, «klar match» relativt sett (12 poeng foran nr. 2), med merknaden om at treffet er mindre presist enn prosenten tilsier.
- Systemet kan altså si fra når ingen passer godt. For helt tilfeldige svar sier det «ingen parti passer spesielt godt» i 436 av 500 tilfeller, og alle de 64 øvrige får merknaden om svak tilpasning.

## POLITICAL QA

Tallene gjelder de **572 standpunktene som var kodet før gjennomgangen**:

| | Antall |
|---|---:|
| **Beholdt** (verdi og confidence uendret) | **473** (458 helt uendret + 15 med bare side, kilde eller begrunnelse rettet) |
| **Endret** (verdi) | **57** (herav 4 med snudd fortegn) |
| **Satt til unknown** | **13** |
| **Confidence opp** | **19** |
| **Confidence ned** | **31** |

I tillegg ble **59 av 148 unknowns kodet**: 30 fra programmet, der noe var oversett, og 29 fra nyere offisielle kilder. 89 unknowns er beholdt. En blind andregangskoding av 145 standpunkter ga vektet kappa 0,92 (POLITICAL_QA.md §6d).

Første gjennomlesning vurderte 576 av 720 linjer (80 %) som OK. De fleste avvikene gjaldt confidence, sidetall og presisjon. De viktigste funnene var tre feil fortegn og for mange falske unknowns. Søkeverktøyet viste bare de 12 første treffene per parti, og det forklarer de fleste falske unknowns. Begge deler er rettet og dokumentert linje for linje i POLITICAL_QA.md.

---

## Klar for testing med ekte brukere?

**Ja, også for en bredere test.** Alle tekniske og kildemessige punkter som ble funnet, er løst eller dokumentert. Følgende gjenstår, og alt krever at redaksjonen handler:

1. **Send pakkene i `party-review/` til partiene**, med samme frist for alle. Behandle svarene etter rutinen i `party-review/README.md`.
2. **Kjør `npm run qa:watch` jevnlig.** Når dødshjelp- og sexkjøpssakene er behandlet, og etter Aps landsmøte våren 2027, vurderes de berørte unknowns på nytt.
3. **Valgfritt:** en menneskelig andregangskoding av de 13 omstridte kodingene. Blindtesten med AI-koder viser at det er her usikkerheten ligger.
