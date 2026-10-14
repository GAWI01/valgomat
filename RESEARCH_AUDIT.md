# Research-audit – Valgomat 2027

> Generert automatisk av `scripts/build-audit.mjs` fra dataene i `research/`. Ikke rediger for hånd – kjør `npm run audit`.

**Dato for siste research:** 2026-10-14

## Sammendrag

| Mål | Verdi |
|---|---|
| Antall spørsmål | 80 |
| Antall partier | 9 |
| Mulige partiposisjoner (spørsmål × partier) | 720 |
| Kodede partiposisjoner | 603 (84 %) |
| – HIGH confidence | 376 |
| – MEDIUM confidence | 175 |
| – LOW confidence | 52 |
| Unknown (programmet tar ikke stilling) | 117 |
| Kilder i kildebiblioteket | 22 (9 partiprogrammer, 13 sekundærkilde) |

Alle 720 kombinasjoner av spørsmål og parti er gjennomgått manuelt mot partiets program. Standpunkter som ikke kunne dokumenteres, er satt til **unknown** – de er ikke gjettet. Byggeskriptet (`scripts/build-data.mjs`) avviser data der et kodet standpunkt mangler kilde, der en sidehenvisning ligger utenfor dokumentet, eller der et parti mangler koding.

## Metode for researchen

1. De vedtatte programmene for stortingsperioden 2025–2029 ble lastet ned fra partienes egne nettsider (SHA-256 og sidetall er lagret i `research/sources.json`).
2. Tekst ble ekstrahert per PDF-side, og for hvert spørsmål ble alle ni programmer søkt gjennom med flere søkeord og lest i sammenheng (relevante kapitler ble lest i sin helhet for skatt, innvandring, klima, energi og forsvar).
3. Hvert standpunkt ble kodet −3…+3 med confidence:
   - **HIGH** – direkte og tydelig formulert i vedtatt program
   - **MEDIUM** – tydelig utledet fra ett eller flere offisielle standpunkter
   - **LOW** – indirekte eller uklart
4. Begrunnelsen er en kort parafrase med henvisning til PDF-side. Det er ikke brukt lange sitater.
5. Der programmet ikke tar stilling, ble det gjort et begrenset søk etter nyere offisielle standpunkter (prioritet 2–5 i kildehierarkiet). Bare kilder som kunne verifiseres direkte, ble brukt. Én sekundærkilde (Altinget om Aps landsmøtevedtak om EU, april 2025) er brukt.
6. Eldre kilder er bevisst forkastet: for eksempel en artikkel fra 2017 om Aps syn på arveavgift ble ikke brukt fordi den ikke kan representere partiets syn i 2025–2029.

## Kildedekning per parti

| Parti | HIGH | MEDIUM | LOW | Unknown | Andel kodet | Unike sidehenvisninger | Sekundærkilder |
|---|---:|---:|---:|---:|---:|---:|---:|
| Arbeiderpartiet | 27 | 29 | 7 | 17 | 79 % | 48 | 13 |
| Høyre | 42 | 20 | 3 | 15 | 81 % | 45 | 0 |
| Fremskrittspartiet | 57 | 16 | 3 | 4 | 95 % | 62 | 0 |
| Senterpartiet | 37 | 24 | 5 | 14 | 83 % | 54 | 0 |
| Sosialistisk Venstreparti | 44 | 17 | 4 | 15 | 81 % | 41 | 0 |
| Rødt | 51 | 9 | 7 | 13 | 84 % | 47 | 0 |
| Venstre | 42 | 16 | 9 | 13 | 84 % | 46 | 0 |
| Kristelig Folkeparti | 38 | 17 | 12 | 13 | 84 % | 40 | 1 |
| Miljøpartiet De Grønne | 38 | 27 | 2 | 13 | 84 % | 45 | 0 |

**Merknad om Arbeiderpartiet:** Aps program er mer overordnet enn de andre partienes på flere felt (særlig skatt, rus og etiske spørsmål), og har derfor flest ukjente standpunkter. Ap sitter i regjering, og regjeringens budsjetter kunne vært brukt som supplement. Regjeringen.no avviste imidlertid automatisk henting under researchen, og standpunkter som ikke kunne verifiseres direkte, er derfor ikke kodet. Dette bør prioriteres ved neste oppdatering (se `RESEARCH_PLAN.md`).

**Merknad om Rødt:** roedt.no avviste automatisk nedlasting (HTTP 429). Programteksten ble hentet fra et speil hos Norges idrettsforbund og bærer teksten «vedtatt på Rødts landsmøte 28. februar til 2. mars 2025». Sidetallene bør kontrolleres mot partiets egen fil.

## Spørsmål med svakt datagrunnlag

Spørsmål der minst fire partier er ukjent, eller der ukjent + LOW er minst fem:

| Spørsmål | Ukjent | LOW | Spredning (maks − min) |
|---|---:|---:|---:|
| Midlertidig opphold for flyktninger (`imm_temporary`) | 4 | 2 | 6 |
| Kutt i støtte ved manglende deltakelse (`imm_integration_req`) | 6 | 0 | 2 |
| Lavere bensin- og dieselavgifter (`transport_fuel_tax`) | 6 | 0 | 6 |
| Aktivitetsplikt for sosialhjelp (`work_activity_duty`) | 5 | 0 | 5 |
| Flere ikke-kommersielle utleieboliger (`housing_nonprofit`) | 3 | 2 | 4 |
| Enklere arbeidsinnvandring utenfor EØS (`imm_labour`) | 3 | 2 | 3 |
| Tillate regulert surrogati (`val_surrogacy`) | 5 | 0 | 6 |
| Nei til EUs fjerde energimarkedspakke (`eu_energy_package`) | 4 | 0 | 6 |
| Tillate aktiv dødshjelp (`val_assisted_dying`) | 4 | 0 | 6 |

Disse spørsmålene er beholdt fordi de måler reelle konfliktlinjer og skiller tydelig mellom partiene som har tatt stilling. Ukjente standpunkter påvirker ikke scoren, men reduserer «datagrunnlaget» som vises til brukeren.

## Spredning per spørsmål

Alle spørsmål har en spredning på minst 2 skalasteg mellom partiene (kontrollert i testene). Antall spørsmål per spredning:

| Spredning | Antall spørsmål |
|---:|---:|
| 2 | 4 |
| 3 | 3 |
| 4 | 8 |
| 5 | 10 |
| 6 | 55 |

## Spørsmål vurdert og forkastet

Følgende kandidater ble undersøkt, men forkastet fordi programmene ga for lite grunnlag eller fordi nesten alle partier var enige:

- **Lovfestet minstelønn** – bare FrP (positiv omtale) og Sp (imot) tar stilling.
- **Sekstimersdag / kortere arbeidstid** – bare SV og Rødt tar stilling.
- **Pensjonsregulering** – nesten ingen programmer tar stilling etter omleggingen i 2024.
- **Dagpenger** – for lite variasjon.
- **Gratis skolemat** – alle partier som tar stilling, er for; ingen er dokumentert imot.
- **Skolepenger for studenter utenfor EØS** – bare SV, Rødt og Venstre tar stilling.
- **Karakterer i barneskolen** – ingen programmer tar tydelig stilling.
- **Flytting av statlige arbeidsplasser** – bred enighet.
- **Momskutt på mat** – bare FrP vil halvere matmomsen generelt; andre gjelder bare frukt og grønt.
- **Selskapsskatt** – for få tydelige standpunkter.
- **Stemmerett for 16-åringer** og **monarki/republikk** – for få partier tar stilling.
- **Egen lavalder for straff** – bare FrP tar stilling.

## Mulige duplikater

Spørsmålspar i samme tema med svært lik partiprofil (|r| ≥ 0,95 over partiene med kjent standpunkt på begge). Korrelasjon på tvers av temaer er ikke tatt med, fordi partiene i stor grad ordner seg langs de samme konfliktlinjene uansett tema, og det ville gjort nesten alle spørsmål til «duplikater»:

| Spørsmål A | Spørsmål B | r | n | Samme klynge |
|---|---|---:|---:|---|
| Færre asylsøkere og flyktninger | Strengere krav for varig opphold og statsborgerskap | 0.96 | 6 | nei |
| Kvoteflyktninger etter FNs anbefaling | Strengere krav for varig opphold og statsborgerskap | -0.97 | 6 | nei |
| Strengere familiegjenforening | Strengere krav for varig opphold og statsborgerskap | 0.96 | 6 | nei |
| Fortsatt oljeleting | Sluttdato for olje og gass | -0.95 | 9 | ja |
| Fri fordeling av foreldrepermisjon | Abortgrensen tilbake til 12 uker | 0.98 | 7 | nei |
| Søndagsåpne butikker | Oppheve sexkjøpsloven | 0.99 | 6 | nei |
| Legge ned fylkeskommunen | Mer penger til landbruket | -0.98 | 6 | nei |
| Norsk EU-medlemskap | Oftere nei til nye EU-regler | -0.99 | 7 | nei |

Høy korrelasjon i partienes standpunkter betyr ikke at spørsmålene er duplikater for velgerne: mange velgere kan for eksempel være for EØS, men mot EU-medlemskap. Spørsmål som i tillegg er tematisk tett beslektet, er lagt i samme klynge og vektes ned mot dobbelttelling (se metodesiden).

## Retningsbalanse i påstandene

For å motvirke at «ja-sigere» systematisk trekkes mot én side, er påstandene formulert i begge retninger. Antall påstander der «enig» trekker mot hver pol:

| Akse | Venstre pol | Høyre pol | «Enig» → venstre | «Enig» → høyre |
|---|---|---|---:|---:|
| Økonomi | Mer stat og omfordeling | Mer marked og lavere skatt | 11 | 14 |
| Verdier og frihet | Mer konservativ | Mer liberal | 5 | 7 |
| Klima og natur | Lavere prioritet | Høy prioritet | 4 | 10 |
| Justis | Vekt på rehabilitering | Strengere reaksjoner | 1 | 3 |
| Innvandring | Mer liberal | Mer restriktiv | 3 | 6 |
| Styring | Desentralisering | Større enheter/sentralisering | 1 | 2 |
| Internasjonalt | Nasjonal suverenitet | Europeisk/internasjonal integrasjon | 5 | 3 |

## Dato og versjon

- Research gjennomført: 2026-10-14
- Programperiode: 2025–2029 (nyeste vedtatte programmer)
- Neste planlagte gjennomgang: se `RESEARCH_PLAN.md`
