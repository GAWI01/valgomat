# Sluttrapport – validering av Valgomat 2027

**Dato:** 14. oktober 2026 (oppdatert etter oppfølgingsrunden) · **Gren:** `claude/valgomat-2027`

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

- **160 standpunkter endret** (POLITICAL_QA.md §2–§7):
  - 3 feil fortegn;
  - 54 verdier endret;
  - 5 kodinger satt til unknown;
  - 52 unknowns kodet: 25 fra programmet og 27 fra nyere offisielle kilder (partienes nettsider, landsmøtevedtak, regjeringens budsjettforslag og partienes egne merknader og forslag i Stortinget);
  - 19 kodinger fikk høyere og 34 lavere confidence;
  - 36 sidetall/kilder og 53 begrunnelser rettet.
- **Aps unknowns gikk fra 30 til 14.** Alle sitatene er kontrollert ordrett mot kildene.
- **Rødts kilde er verifisert og byttet** til partiets gjeldende programfil (2. september 2025), hentet fra Rødts eget publiseringssystem (POLITICAL_QA.md §7). Speilet vi brukte var byte-identisk med en eldre opplasting fra Rødt (6. juni 2025). Den nye versjonen har fire små tekstrettelser. Én av dem gjør at Rødt nå eksplisitt sier nei til vindkraft til havs, så `energy_offshore_wind` for Rødt er kodet −2 HIGH.
- **Dobbelttelling fjernet:** 5 drivstoffkodinger var utledet fra den samme CO₂-avgiftssetningen som allerede teller i `cli_co2_tax`, og ble satt til unknown. V og SV er senere kodet ut fra egne uttalelser om drivstoffavgiftene i Stortinget.
- **Bias og steelman:** 2 påstander og 8 bakgrunnstekster er presisert, og 5 for/mot-argumenter er balansert. Blant rettelsene er én faktafeil (Albania) og én utdatert opplysning (energipakken etter juni 2025). Ingen endring påvirker partikodingen (POLITICAL_QA.md §8).
- Byggesteget godtar nå flere kilder per standpunkt (`169;src:…`). Kildebiblioteket viser kildetypen (partiprogram, nettside, landsmøtevedtak, stortingsdokument, sekundærkilde) i stedet for å kalle alt som ikke er program for «sekundærkilde».

### Klassifisering og tekster

- **«Ingen parti passer spesielt godt» (ny klassifisering).**
  - *Problem:* tilfeldige svar ga 63 % til beste parti i median og ble kalt «nær match» eller «klar match» i 41 % av tilfellene. Systemet kunne ikke si at ingen passer.
  - *Løsning:* brukerens egne svar stokkes 200 ganger mellom de besvarte spørsmålene. Er beste partis score lavere enn 90-persentilen for beste parti i de stokkede svarene, er resultatet ikke bedre enn tilfeldig. Da sier vi det.
  - *Effekt:* 438 av 500 tilfeldige brukere får nå «ingen parti passer spesielt godt», og alle de 62 øvrige får merknaden om svak tilpasning. Med 90-persentilen som terskel er det ventet at rundt 10 % av rene tilfeldighetsprofiler havner over. Ingen ekte partiprofil får denne klassifiseringen; marginen er over 15 poeng (testet).
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

## WARNING

1. **Unknowns som ikke mangler tilfeldig.** Selv om unknowns i snitt ikke gir skjevhet, kan de løfte et parti for en *bestemt* bruker når partiet tier om nettopp de sakene der det er uenig med brukeren.
   - Aps score kunne for en tilfeldig bruker ligget mellom 55,1 og 67,8 (spenn 12,6 poeng, ned fra 14,9 før oppfølgingsrunden) dersom alle unknowns var henholdsvis verst og best mulig. For FrP, som har få unknowns, er spennet 3,3 poeng.
   - Testpersonen H/FrP/V viser dette: Ap kommer på 3. plass med 73 %, men verst/best-spennet er 69–75.
   - Appen viser datagrunnlaget per parti og merker resultater under 60 % dekning. Ap har 68,2 % dekning når alle spørsmål er besvart, og havner derfor *ikke* under grensen.
   - Vi har bevisst **ikke** justert scoren: det finnes ingen nøytral måte å gjette på unknowns.
   - Anbefaling for neste runde: vurder å vise «usikkert grunnlag» også når et parti har klart lavere dekning enn de andre.
2. **Partiene ligger i et nesten endimensjonalt rom.** Med 9 partier er 210 spørsmålspar korrelert med |r| ≥ 0,9 over partienes standpunkter, også saker uten innholdsmessig sammenheng (f.eks. alkohol og jordbruksinntekt).
   - Dobbelttelling kan derfor ikke løses statistisk uten å vekte bort det meste av spørsmålsbanken. Klyngene er derfor semantiske (samme sak, samme virkemiddel).
   - Klyngene og vektandelene er dokumentert i `test-results/clusters.md`:
     - ingen tema har mer enn 8,7 % av vekten;
     - den største tverrgående blokken (klima, olje, energi og bil, 18 spørsmål) har 20,4 % av vekten, mot 22,5 % av spørsmålene;
     - økonomi-aksen har 29 % av den aksefordelte vekten.
3. **Svake spørsmål:**
   - `work_min_benefits`, `housing_equity` og `def_ukraine` (spredning bare 2, nesten alle enige i retning);
   - `work_activity_duty` og `val_surrogacy` (bare 4 partier kodet).

   `imm_integration_req` og `transport_fuel_tax` var svake, men har nå 8 og 5 kodede partier etter oppfølgingsrunden.

   De skiller lite og har derfor liten effekt, men bør vurderes erstattet før 2027. Se RESEARCH_AUDIT.md.
4. **56 LOW-kodinger og 15 omstridte kodinger** (POLITICAL_QA.md §5). Kodingen er gjort av én koder med automatisert andregangsgjennomgang. En uavhengig menneskelig andregangskoding er ikke gjort.
5. **Kildetilgang:** regjeringen.no, statsbudsjettet.no, udi.no og lovdata.no var blokkert fra researchmiljøet (HTTP 403/405). Ap `dist_municipal_merge` bygger derfor på Statsforvalterens gjengivelse av regjeringens budsjettforslag, ikke på selve proposisjonen. Stortinget.no og data.stortinget.no fungerte og er brukt som erstatning der det var mulig.
6. **19 kodinger bygger på Stortingets innstillinger.** De er kodet bare når partiets egen merknad, forslag eller innlegg svarer direkte på påstanden, og har høyst MEDIUM confidence. En stortingsmerknad er likevel ikke det samme som et vedtatt program.

## UNKNOWN

1. ~~Rødts kilde er ikke byte-verifisert.~~ **Løst** i oppfølgingsrunden (se FIXED og POLITICAL_QA.md §7).
2. **101 unknowns** (ned fra 148 før gjennomgangen). Fordelt per parti:

   | Ap | H | Sp | SV | V | R | KrF | MDG | FrP |
   |---:|---:|---:|---:|---:|---:|---:|---:|---:|
   | 14 | 15 | 12 | 12 | 11 | 11 | 12 | 10 | 4 |

   De står som unknown fordi kildene ikke tar stilling. De er ikke fylt ut for å øke dekningen.
3. Om programtekstene vil endres før 2027 (landsmøter 2026–2027), er ukjent. Kvartalsvis SHA-256-kontroll er beskrevet i RESEARCH_PLAN.md.

## BLOCKER

**Ingen.** Ingen funn hindrer testing med ekte brukere. En uavhengig andregangskoding bør gjøres før en offentlig lansering, men hindrer ikke brukertesting.

## COVERAGE per parti

| Parti | Kodet | HIGH | MEDIUM | LOW | Unknown | Kun ikke-programkilde | Kodet før QA | Dekning (alle 80 besvart, confidence-vektet) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Ap | 66 | 27 | 31 | 8 | 14 | 15 | 50 | 68,2 % |
| H | 65 | 42 | 20 | 3 | 15 | 0 | 64 | 72,9 % |
| FrP | 76 | 57 | 16 | 3 | 4 | 0 | 76 | 87,4 % |
| Sp | 68 | 37 | 25 | 6 | 12 | 2 | 63 | 74,9 % |
| SV | 68 | 44 | 19 | 5 | 12 | 3 | 63 | 74,2 % |
| R | 69 | 52 | 10 | 7 | 11 | 1 | 65 | 78,6 % |
| V | 69 | 42 | 18 | 9 | 11 | 2 | 65 | 75,6 % |
| KrF | 68 | 38 | 17 | 13 | 12 | 2 | 64 | 71,8 % |
| MDG | 70 | 38 | 30 | 2 | 10 | 3 | 62 | 76,3 % |
| **Sum** | **619** | **377** | **186** | **56** | **101** | **28** | **572** | |

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
| Beste parti, tilfeldig bruker | 58,3 | 63,3 | 68,7 |
| Beste parti, ekte partiprofil med støy | 92,1 | 94,5 | 96,5 |
| Avstand 1–2, tilfeldig bruker (poeng) | 0,2 | 2,0 | 6,4 |

Prosentene ligger altså i et smalere og høyere bånd enn intuisjonen tilsier: 55 % er støygulvet, ikke «litt enig». Dette er dokumentert for brukeren. Skalaen er **ikke** endret, fordi enhver omskalering ville være en kosmetisk justering uten ny informasjon. Rekkefølgen, avstanden og tilfeldighetsnivået er det som bærer informasjon.

**Testperson H vs FrP vs V.** Brukeren vil ha lavere skatt og bilavgifter, strengere innvandring og straff, NATO og høyere forsvarsbudsjett, private helseleverandører, avkriminalisering og regulert cannabis, er moderat på klima, for kjernekraft og EØS, og usikker på EU. Testpersonen svarte på 23–24 spørsmål.

- Resultat: **H 80 %**, FrP 75 %, Ap 73 %, KrF 71 %, V 71 % → «nær match» (5–6 poeng, H øverst i 88 % av bootstrap-trekkene), med merknaden om svak tilpasning (tilfeldighetsnivå 72 %).
- Det som avgjør:
  - **V taper** på innvandringsnivå (V −2 mot bruker +2★), strengere straffer (V −1), bompenger (V −2), oljeleting (V −3) og CO₂-avgift (V +3 mot bruker −1). V vinner stort på avkriminalisering og cannabis (V +3), men det er bare to av spørsmålene.
  - **H slår FrP** fordi H er moderat der brukeren er moderat: avkriminalisering (H +1 mot FrP −3, bruker +2) og CO₂-avgift (H 0 mot FrP −3, bruker −1). FrP vinner på bompenger og alternative straffer.
  - **Ap på 3. plass** skyldes delvis unknowns: Ap har ikke kjent standpunkt på bompenger og drivstoff. Verst/best-spennet for Ap er 69–75 %.
  - ★★ på ett enkelt spørsmål endrer ikke vinneren for denne personen (0 av 23).
- Resultatet er forklarbart ut fra dataene, og vi har ikke endret noe for å påvirke det.

**Kryss-politiske testpersoner.**
- Testperson 1: venstre økonomi, streng innvandring og justis, liberal, EU, grønn. Resultat: MDG 69 % og V 67 % mot tilfeldighetsnivå 63 %, «usikkert mellom flere partier», med merknaden om svak tilpasning (6 poeng over tilfeldighetsnivået).
- Testperson 2, «hjemløs»: marked, streng innvandring, grønn, liberal, EU-skeptisk, mot NATO. Resultat: V 68 % mot tilfeldighetsnivå 64 %, «klar match» relativt sett (12 poeng foran nr. 2), med merknaden om at treffet er mindre presist enn prosenten tilsier.
- Systemet kan altså si fra når ingen passer godt. For helt tilfeldige svar sier det «ingen parti passer spesielt godt» i 438 av 500 tilfeller, og alle de 62 øvrige får merknaden om svak tilpasning.

## POLITICAL QA

Tallene gjelder de **572 standpunktene som var kodet før gjennomgangen**:

| | Antall |
|---|---:|
| **Beholdt** (verdi og confidence uendret) | **480** (465 helt uendret + 15 med bare side, kilde eller begrunnelse rettet) |
| **Endret** (verdi) | **54** (herav 3 feil fortegn) |
| **Satt til unknown** | **5** |
| **Confidence opp** | **19** |
| **Confidence ned** | **34** |

I tillegg ble **52 av 148 unknowns kodet**: 25 fra programmet, der noe var oversett, og 27 fra nyere offisielle kilder. 96 unknowns er beholdt.

Første gjennomlesning vurderte 576 av 720 linjer (80 %) som OK. De fleste avvikene gjaldt confidence, sidetall og presisjon. De viktigste funnene var tre feil fortegn og for mange falske unknowns. Søkeverktøyet viste bare de 12 første treffene per parti, og det forklarer de fleste falske unknowns. Begge deler er rettet og dokumentert linje for linje i POLITICAL_QA.md.

---

## Klar for testing med ekte brukere?

**Ja, for en lukket brukertest.** Rødt-kilden og alle npm-sårbarhetene er nå løst. Det gjenstår to ting før en offentlig lansering:

1. En uavhengig person bør gjøre en andregangskoding av et utvalg, særlig de LOW og omstridte kodingene.
2. Partiene bør få se sine egne kodinger.
