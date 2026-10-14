# Sluttrapport – validering av Valgomat 2027

**Dato:** 14. oktober 2026 · **Gren:** `claude/valgomat-2027`

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
| Motsatte profiler | Partiet havner på plass 8 eller 9, med 6–33 %. |
| Arketyper | Plausible og forklarbare (STRESS_TEST.md §2). Liberal → V. Konservativ → H (94 %) / KrF. Sosialist → SV. Grønn → MDG. Distrikt → Sp. Innvandringsrestriktiv → FrP. Ruspolitisk liberal → V. Forsvar/NATO → spredt på H/Ap/V/KrF/MDG, og «ingen passer» i 47 %, noe som er riktig når resten av svarene er tilfeldige. |
| Unknown-bias når standpunkter mangler tilfeldig | Ingen systematisk skjevhet: snittendringen er 0,0–0,4 poeng ved 100/90/75/60 % dekning. Spredningen øker som forventet (std.avvik 1,5 → 3,8 poeng), og det samme gjør intervallbredden (10,9 → 13,8 poeng). |
| Viktighet | ★★ dobler vekten. Ett enkelt spørsmål kan maksimalt utgjøre 3,5 % av vekten (med ★★, når alle 80 er besvart). Én sak kan dermed avgjøre mellom to partier som ligger nær hverandre, men kan ikke snu en hel profil (eksempel A–C i STRESS_TEST.md §5). |
| Genererte tekster | Ingen tekst sier «du bør stemme». De to stedene ordet «stemme» brukes, er en forklaring på at prosenten ikke er en anbefaling. Invariantsjekken på 400 resultater fant 0 brudd. Den kontrollerte at: <ul><li>dealbreakers er reelle konflikter på viktige saker hos topppartiet;</li><li>«nær match» og «klar match» har minst 2,5 poengs avstand;</li><li>«klar match» krever ≥ 6 poeng og ≥ 60 % dekning;</li><li>ingen vinner kåres under tilfeldighetsnivået;</li><li>«mest enige» betyr enighet og «mest uenige» betyr konflikt.</li></ul> |
| Personvern | Svarene lagres bare i `localStorage` (nøkkel `valgomat2027:v1`: svar, posisjon og tidsstempel; `valgomat2027:theme`: lys/mørk modus). Kildekoden har ingen `fetch`, XHR, beacon, websocket eller analyseverktøy. Den bygde siden har nå en CSP med `connect-src 'none'`, så nettleseren hindrer alle nettverkskall fra siden. |
| Kodeinjeksjon | Ingen `innerHTML`, `dangerouslySetInnerHTML` eller `eval`. All tekst fra datafilene rendres som React-tekst og escapes derfor. Kilde-URL-er valideres i byggesteget: bare `https:` er tillatt, så `javascript:`/`data:`-lenker avvises. CSP-en tillater bare egne skript og ett hashet inline-skript. |
| `npm audit --omit=dev` | 0 sårbarheter i det som sendes til brukeren (React og React DOM). |
| Tester | 40 enhetstester er grønne. `tsc -b` er grønn. Bygget er grønt. Browser-QA (Playwright, 375 px, 320 px mørk modus og 1280 px) besvarer alle 80 spørsmål, sjekker at det ikke er horisontal scroll eller konsollfeil (CSP inkludert), og at autolagring og «Start på nytt» virker. |

## FIXED

### Data

- **133 endringer i partikodingen** (POLITICAL_QA.md §2–§6):
  - 3 feil fortegn;
  - 52 verdier endret;
  - 7 kodinger satt til unknown;
  - 38 unknowns kodet, 25 fra programmet og 13 fra nyere offisielle kilder;
  - 18 kodinger fikk høyere og 34 lavere confidence;
  - 33 sidetall og 50 begrunnelser rettet.
- **Aps unknowns gikk fra 30 til 17.** De nye kodingene bygger på Aps nettsider, landsmøtevedtak og Stortingets innstillinger. Alle sitatene er kontrollert ordrett.
- **Dobbelttelling fjernet:** 5 drivstoffkodinger var utledet fra den samme CO₂-avgiftssetningen som allerede teller i `cli_co2_tax`. De er nå unknown.
- **Bias og steelman:** 2 påstander og 8 bakgrunnstekster er presisert, og 5 for/mot-argumenter er balansert. Blant rettelsene er én faktafeil (Albania) og én utdatert opplysning (energipakken etter juni 2025). Ingen endring påvirker partikodingen (POLITICAL_QA.md §8).
- Byggesteget godtar nå flere kilder per standpunkt (`169;src:…`). Kildebiblioteket viser kildetypen (partiprogram, nettside, landsmøtevedtak, stortingsdokument, sekundærkilde) i stedet for å kalle alt som ikke er program for «sekundærkilde».

### Klassifisering og tekster

- **«Ingen parti passer spesielt godt» (ny klassifisering).**
  - *Problem:* tilfeldige svar ga 63 % til beste parti i median og ble kalt «nær match» eller «klar match» i 41 % av tilfellene. Systemet kunne ikke si at ingen passer.
  - *Løsning:* brukerens egne svar stokkes 200 ganger mellom de besvarte spørsmålene. Er beste partis score lavere enn 90-persentilen for beste parti i de stokkede svarene, er resultatet ikke bedre enn tilfeldig. Da sier vi det.
  - *Effekt:* 451 av 500 tilfeldige brukere får nå «ingen parti passer spesielt godt». Med 90-persentilen som terskel er det ventet at rundt 10 % av rene tilfeldighetsprofiler havner over. Ingen ekte partiprofil får denne klassifiseringen; marginen er over 15 poeng (testet).
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

### Sikkerhet

- Ugyldig prosentkoding i URL-en (f.eks. `#/sak/%E0%A4`) krasjet appen. Nå fanges den.
- Spørsmålsnummeret i URL-en valideres som et heltall mellom 1 og 1000.
- Lagrede svar valideres når de lastes. Svar på ukjente spørsmål, verdier utenfor −3…3 og ugyldig viktighet forkastes, så manipulert localStorage ikke kan gi NaN-scorer.
- Content-Security-Policy er lagt til i den bygde siden: `default-src 'none'`, `connect-src 'none'`, `script-src 'self'` + hash.
- 6 nye sikkerhetstester (`tests/security.test.ts`).

## WARNING

1. **Unknowns som ikke mangler tilfeldig.** Selv om unknowns i snitt ikke gir skjevhet, kan de løfte et parti for en *bestemt* bruker når partiet tier om nettopp de sakene der det er uenig med brukeren.
   - Aps score kunne for en tilfeldig bruker ligget mellom 53,5 og 68,4 (spenn 14,9 poeng) dersom alle unknowns var henholdsvis verst og best mulig. For FrP, som har få unknowns, er spennet 3,4 poeng.
   - Testpersonen H/FrP/V viser dette: Ap kommer på 3. plass med 73 %, men verst/best-spennet er 68–76.
   - Appen viser datagrunnlaget per parti og merker resultater under 60 % dekning. Ap har 65,8 % dekning når alle spørsmål er besvart, og havner derfor *ikke* under grensen.
   - Vi har bevisst **ikke** justert scoren: det finnes ingen nøytral måte å gjette på unknowns.
   - Anbefaling for neste runde: vurder å vise «usikkert grunnlag» også når et parti har klart lavere dekning enn de andre.
2. **Partiene ligger i et nesten endimensjonalt rom.** Med 9 partier er 192 spørsmålspar korrelert med |r| ≥ 0,9 over partienes standpunkter, også saker uten innholdsmessig sammenheng (f.eks. alkohol og jordbruksinntekt).
   - Dobbelttelling kan derfor ikke løses statistisk uten å vekte bort det meste av spørsmålsbanken. Klyngene er derfor semantiske (samme sak, samme virkemiddel).
   - Klyngene og vektandelene er dokumentert i `test-results/clusters.md`:
     - ingen tema har mer enn 8,7 % av vekten;
     - den største tverrgående blokken (klima, olje, energi og bil, 18 spørsmål) har 20,4 % av vekten, mot 22,5 % av spørsmålene;
     - økonomi-aksen har 29 % av den aksefordelte vekten.
3. **Svake spørsmål:**
   - `imm_integration_req` (bare 3 partier kodet, spredning 2);
   - `transport_fuel_tax` (3 kodet);
   - `work_min_benefits` og `housing_equity` (spredning 2);
   - `def_ukraine` (spredning 2, nesten alle enige).

   De skiller lite og har derfor liten effekt, men bør vurderes erstattet før 2027. Se RESEARCH_AUDIT.md.
4. **52 LOW-kodinger og 15 omstridte kodinger** (POLITICAL_QA.md §5). Kodingen er gjort av én koder med automatisert andregangsgjennomgang. En uavhengig menneskelig andregangskoding er ikke gjort.
5. **Utviklingsavhengigheter:** `npm audit` viser 10 sårbarheter (2 kritiske) i vitest/tinypool og tailwind/chokidar/braces. De brukes bare ved testing og bygging lokalt og sendes ikke til brukeren. Retting krever hovedversjonsoppgradering (vitest 5, tailwind 4), som er utsatt for ikke å endre UI eller byggeoppsett under QA.
6. **Kildetilgang:** regjeringen.no, udi.no og lovdata.no var blokkert fra researchmiljøet. Én koding (Ap `dist_municipal_merge`) bygger derfor på NTB i stedet for regjeringens egen budsjettproposisjon.

## UNKNOWN

1. **Rødts kilde er ikke byte-verifisert.** roedt.no svarte HTTP 429 eller tilbakestilte forbindelsen ved alle forsøk; Wayback Machine er blokkert.
   - Speilet hos Norges idrettsforbund er kontrollert for tittel, vedtaksdato («vedtatt på Rødts landsmøte 28. februar til 2. mars 2025»), produksjonsdato (6. juni 2025) og sidetall. Bunntekstens sidetall er lik PDF-sideindeksen.
   - Sannsynligvis er dette riktig dokument. Merkingen er beholdt.
2. **117 unknowns.** Fordelt per parti:

   | Ap | H | Sp | SV | V | R | KrF | MDG | FrP |
   |---:|---:|---:|---:|---:|---:|---:|---:|---:|
   | 17 | 15 | 14 | 15 | 13 | 13 | 13 | 13 | 4 |

   De står som unknown fordi kildene ikke tar stilling. De er ikke fylt ut for å øke dekningen.
3. Om programtekstene vil endres før 2027 (landsmøter 2026–2027), er ukjent. Kvartalsvis SHA-256-kontroll er beskrevet i RESEARCH_PLAN.md.

## BLOCKER

**Ingen.** Ingen funn hindrer testing med ekte brukere. Rødt-verifiseringen og den uavhengige andregangskodingen bør gjøres før en offentlig lansering, men hindrer ikke brukertesting.

## COVERAGE per parti

| Parti | Kodet | HIGH | MEDIUM | LOW | Unknown | Kun ikke-programkilde | Kodet før QA | Dekning (alle 80 besvart, confidence-vektet) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Ap | 63 | 27 | 29 | 7 | 17 | 12 | 50 | 65,8 % |
| H | 65 | 42 | 20 | 3 | 15 | 0 | 64 | 72,9 % |
| FrP | 76 | 57 | 16 | 3 | 4 | 0 | 76 | 87,4 % |
| Sp | 66 | 37 | 24 | 5 | 14 | 0 | 63 | 73,8 % |
| SV | 65 | 44 | 17 | 4 | 15 | 0 | 63 | 72,2 % |
| R | 67 | 51 | 9 | 7 | 13 | 0 | 65 | 77,0 % |
| V | 67 | 42 | 16 | 9 | 13 | 0 | 65 | 73,6 % |
| KrF | 67 | 38 | 17 | 12 | 13 | 1 | 64 | 71,3 % |
| MDG | 67 | 38 | 27 | 2 | 13 | 0 | 62 | 74,0 % |
| **Sum** | **603** | **376** | **175** | **52** | **117** | **13** | **572** | |

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
| Alle partiscorer, tilfeldig bruker | 47,7 | 55,9 | 64,1 |
| Beste parti, tilfeldig bruker | 58,2 | 62,9 | 68,4 |
| Beste parti, ekte partiprofil med støy | 92,2 | 94,5 | 96,5 |
| Avstand 1–2, tilfeldig bruker (poeng) | 0,2 | 2,0 | 6,7 |

Prosentene ligger altså i et smalere og høyere bånd enn intuisjonen tilsier: 55 % er støygulvet, ikke «litt enig». Dette er dokumentert for brukeren. Skalaen er **ikke** endret, fordi enhver omskalering ville være en kosmetisk justering uten ny informasjon. Rekkefølgen, avstanden og tilfeldighetsnivået er det som bærer informasjon.

**Testperson H vs FrP vs V.** Brukeren vil ha lavere skatt og bilavgifter, strengere innvandring og straff, NATO og høyere forsvarsbudsjett, private helseleverandører, avkriminalisering og regulert cannabis, er moderat på klima, for kjernekraft og EØS, og usikker på EU. Testpersonen svarte på 23–24 spørsmål.

- Resultat: **H 80 %**, FrP 75 %, Ap 73 %, V 72 %, KrF 71 % → «nær match» (5–6 poeng, H øverst i 86 % av bootstrap-trekkene), med merknaden om svak tilpasning (tilfeldighetsnivå 72 %).
- Det som avgjør:
  - **V taper** på innvandringsnivå (V −2 mot bruker +2★), strengere straffer (V −1), bompenger (V −2), oljeleting (V −3) og CO₂-avgift (V +3 mot bruker −1). V vinner stort på avkriminalisering og cannabis (V +3), men det er bare to av spørsmålene.
  - **H slår FrP** fordi H er moderat der brukeren er moderat: avkriminalisering (H +1 mot FrP −3, bruker +2) og CO₂-avgift (H 0 mot FrP −3, bruker −1). FrP vinner på bompenger og alternative straffer.
  - **Ap på 3. plass** skyldes delvis unknowns: Ap har ikke kjent standpunkt på bompenger og drivstoff. Verst/best-spennet for Ap er 68–76 %.
  - ★★ på ett enkelt spørsmål endrer ikke vinneren for denne personen (0 av 23).
- Resultatet er forklarbart ut fra dataene, og vi har ikke endret noe for å påvirke det.

**Kryss-politiske testpersoner.**
- Testperson 1: venstre økonomi, streng innvandring og justis, liberal, EU, grønn. Resultat: MDG 71 % mot tilfeldighetsnivå 63 %, «nær match», med merknaden om svak tilpasning (8 poeng over tilfeldighetsnivået).
- Testperson 2, «hjemløs»: marked, streng innvandring, grønn, liberal, EU-skeptisk, mot NATO. Resultat: V 68 % mot tilfeldighetsnivå 64 %, «klar match» relativt sett (12 poeng foran nr. 2), med merknaden om at treffet er mindre presist enn prosenten tilsier.
- Systemet kan altså si fra når ingen passer godt. For helt tilfeldige svar sier det «ingen parti passer spesielt godt» i 451 av 500 tilfeller, og 48 av de 49 øvrige får merknaden om svak tilpasning.

## POLITICAL QA

Tallene gjelder de **572 standpunktene som var kodet før gjennomgangen**:

| | Antall |
|---|---:|
| **Beholdt** (verdi og confidence uendret) | **480** (466 helt uendret + 14 med bare side eller begrunnelse rettet) |
| **Endret** (verdi) | **52** (herav 3 feil fortegn) |
| **Satt til unknown** | **7** |
| **Confidence opp** | **18** |
| **Confidence ned** | **34** |

I tillegg ble **38 av 148 unknowns kodet**: 25 fra programmet, der noe var oversett, og 13 fra nyere offisielle kilder. 110 unknowns er beholdt.

Første gjennomlesning vurderte 576 av 720 linjer (80 %) som OK. De fleste avvikene gjaldt confidence, sidetall og presisjon. De viktigste funnene var tre feil fortegn og for mange falske unknowns. Søkeverktøyet viste bare de 12 første treffene per parti, og det forklarer de fleste falske unknowns. Begge deler er rettet og dokumentert linje for linje i POLITICAL_QA.md.

---

## Klar for testing med ekte brukere?

**Ja, for en lukket brukertest.** Det gjenstår tre ting før en offentlig lansering:

1. Rødts kilde bør verifiseres mot partiets egen PDF.
2. En uavhengig person bør gjøre en andregangskoding av et utvalg, særlig de LOW og omstridte kodingene.
3. Partiene bør få se sine egne kodinger.
