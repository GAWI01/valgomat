# Interkoder-reliabilitet (blind andregangskoding)

En uavhengig koder fikk bare påstanden og partiprogrammene, ikke valgomatens koding, og kodet et utvalg på nytt etter samme kodebok. Utvalget består av alle kodinger med lav sikkerhet som bygger på programmet, alle omstridte kodinger, 60 tilfeldige av de øvrige og 20 tilfeldige ukjente.

| Gruppe | Antall | Begge kodet | Enige om kjent/ukjent | Eksakt lik verdi | Innen ±1 | Samme retning | Vektet kappa |
|---|---:|---:|---:|---:|---:|---:|---:|
| Tilfeldig | 60 | 60 | 100 % | 75 % | 95 % | 92 % | 0.96 |
| Low | 52 | 42 | 81 % | 71 % | 95 % | 83 % | 0.81 |
| Omstridt | 13 | 11 | 85 % | 18 % | 82 % | 55 % | 0.57 |
| Ukjent | 20 | 0 | 70 % | – | – | – | – |
| Alle | 145 | 113 | 88 % | 68 % | 94 % | 85 % | 0.92 |

Kappa tolkes vanligvis slik: over 0,8 er svært godt samsvar, 0,6–0,8 er godt, og 0,4–0,6 er moderat.

## Uenigheter som må avgjøres

Med uenighet menes enten at den ene koderen har kodet og den andre har satt «ukjent», at fortegnet er ulikt, eller at verdiene skiller seg med mer enn ett steg.

| id | Spørsmål | Parti | Gruppe | Valgomaten | Blindkoder | Blindkoderens begrunnelse |
|---|---|---|---|---|---|---|
| B011 | `cli_target` | H | LOW | -1 LOW | U | Vil «videreføre samarbeidet om energi- og klimapolitikken med EU»; ingen skjerping av 2035-målet omtalt. |
| B061 | `cli_target` | V | LOW | +1 LOW | U | Mål om «55 % innen 2030 og 95 % innen 2050»; ingen 2035-mål angitt. |
| B110 | `cli_target` | R | LOW | +1 LOW | U | «Kutte minst 55 prosent av norske utslipp innen 2030»; 2035-mål ikke angitt. |
| B132 | `econ_oil_money` | FrP | LOW | +1 LOW | U | Handlingsregelen/oljefondsbruk ikke omtalt. |
| B114 | `econ_tax_level` | MDG | LOW | -1 LOW | U | «Brede og rettferdige skatter skal finansiere velferdsstaten» – grønn skatteomlegging, ikke samlet nivå. |
| B072 | `fam_child_benefit_tax` | FrP | LOW | -1 LOW | U | «barnetrygden videreføres som en universell ordning, begrenset oppad til fem barn» – skatteplikt ikke omtalt. |
| B109 | `for_israel_sanctions` | V | LOW | +1 LOW | U | Krever at okkupasjonen «må opphøre», men ingen sanksjoner/boikott nevnt. |
| B033 | `housing_nonprofit` | V | LOW | -1 LOW | +1 LOW | «Øke låne- og tilskuddsrammene til Husbanken»; ingen eksplisitt satsing på ikke-kommersielle utleieboliger. |
| B082 | `housing_nonprofit` | FrP | LOW | -1 LOW | U | Ikke-kommersielle utleieboliger ikke omtalt. |
| B019 | `just_alt_sentences` | Ap | LOW | +1 LOW | U | Kriminalomsorg omtales («styrke friomsorgen»), men ingen standpunkt om flere på fotlenke/samfunnsstraff i stedet for fengsel. |
| B116 | `transport_toll` | H | LOW | +1 LOW | -1 LOW | Kun «åpne for lengre nedbetalingstid på bompengeprosjekter for å redusere bompengebelastningen på enkelte prosjekter». |
| B141 | `work_sickpay` | KrF | LOW | +1 LOW | U | Sykelønn ikke omtalt. |
| B129 | `agri_tariffs` | V | OMSTRIDT | U | -2 MEDIUM | «Dreie landbrukspolitikken til å bli mindre basert på støtte gjennom høye priser og markedsreguleringer». |
| B080 | `def_budget` | Sp | OMSTRIDT | +2 MEDIUM | -1 MEDIUM | «Øke bevilgningene til Forsvaret i tråd med Langtidsplanen for Forsvaret 2025-2036». |
| B066 | `for_nuclear_ban` | Ap | OMSTRIDT | +0 MEDIUM | -2 HIGH | «I dagens sikkerhetspolitiske situasjon er det ikke mulig for NATO-land som Norge å undertegne»; mål på sikt. |
| B107 | `just_sentences` | R | OMSTRIDT | U | -2 MEDIUM | «At den norske og nordiske tradisjonen om lave fengselsrater skal fastholdes». |
| B126 | `dist_county` | R | TILFELDIG | -3 HIGH | -1 MEDIUM | «Øke kommunenes og fylkeskommunenes demokratiske handlingsrom ved å styrke deres økonomi» – forutsetter fylkeskommunen. |
| B040 | `health_dental` | KrF | TILFELDIG | +2 MEDIUM | -1 LOW | Vil «Sikre den offentlige tannhelsetjenesten tilstrekkelig finansiering» og prioritere vanskeligstilte – ikke universell dekning. |
| B140 | `just_sentences` | KrF | TILFELDIG | +0 HIGH | -2 HIGH | «Beholde det generelle straffenivået, men vurdere ... straffenivået for seksuallovbrudd». |
| B092 | `dist_county` | V | UKJENT | U | +0 LOW | «Som en del av en slik reform bør også organiseringen på fylkes-/regionnivå vurderes» – ingen klar nedleggelse. |
| B131 | `dist_municipal_merge` | FrP | UKJENT | U | -2 MEDIUM | «Det er kommunene selv som må ta initiativ til tettere samarbeid eller sammenslåing med nabokommunene». |
| B007 | `econ_tax_level` | Sp | UKJENT | U | +1 MEDIUM | «Senterpartiet vil redusere avgiftene i Norge»; samtidig progressiv skatt som finansiering av velferd. |
| B078 | `econ_top_tax` | Ap | UKJENT | U | +1 LOW | «fremfor store skattekutt til de som har mest fra før»; progressivt skattesystem, ikke eksplisitt økning. |
| B012 | `fam_child_benefit_tax` | SV | UKJENT | U | -1 LOW | «trappe opp barnetrygden per barn til 30 000 kroner ... og ellers være en universell ordning» – skatteplikt ikke foreslått. |
| B015 | `transport_ev` | H | UKJENT | U | +2 MEDIUM | «mål om at alle nye personbiler skal være utslippsfrie, og ha et avgiftssystem ... som bygger opp under dette». |

## Avgjørelser

Tallene over gjelder valgomatens koding **før** avgjørelsene. Alle 25 uenigheter er gått gjennom mot programteksten. Ved reell tvil valgte vi den mest forsiktige lesningen. Endringene står i `research/qa/changes_2026-10-14.txt`, under «Blind andregangskoding».

| Utfall | Antall | Eksempler |
|---|---:|---|
| Valgomatens koding beholdt: blindkoderen hadde oversett et eksplisitt punkt | 4 | R `dist_county` (s.76 «tre forvaltningsnivåer»), V `for_israel_sanctions` (oljefondet og okkupasjonen, s.64), KrF `health_dental` (frikortgrense, s.32), Ap `just_alt_sentences` (styrke friomsorgen) |
| Valgomatens koding beholdt som unknown | 3 | Ap `econ_top_tax`, SV `fam_child_benefit_tax`, V `dist_county` |
| Satt til unknown: begge kodere enige om at belegget var for indirekte | 8 | `cli_target` for H, V og R; FrP `econ_oil_money`; MDG `econ_tax_level`; FrP `fam_child_benefit_tax`; FrP `housing_nonprofit`; KrF `work_sickpay` |
| Justert til mellomposisjon (0): koderne var uenige om retning, og kilden peker begge veier | 3 | V `housing_nonprofit`, H `transport_toll`, R `just_sentences` |
| Justert verdi | 4 | Ap `for_nuclear_ban` (0 → −1; Sp justert likt for konsistens), KrF `just_sentences` (0 → −1), Sp `def_budget` (+2 → +1), V `agri_tariffs` (U → −2) |
| Nye kodinger der blindkoderen fant et belegg vi hadde oversett | 3 | FrP `dist_municipal_merge` (−1 LOW), Sp `econ_tax_level` (+1 LOW), H `transport_ev` (+1 MEDIUM) |

**Vurdering:** For vanlige kodinger er samsvaret svært godt: vektet kappa er 0,96, og 95 % av verdiene ligger innen ±1. Det er de svakt belagte kodingene som er usikre, som forventet. Etter blindtesten er 8 av dem satt til unknown og 3 justert til mellomposisjon. Den uavhengige koderen var en separat AI-agent som ikke hadde tilgang til valgomatens kodinger. Den kodet etter samme kodebok, med bare påstanden og partiprogrammene. Dette er en reell blindtest, men erstatter ikke en menneskelig andregangskoding fullt ut.
