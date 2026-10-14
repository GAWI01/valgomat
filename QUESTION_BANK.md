# Spørsmålsbank – Valgomat 2027

> Generert automatisk fra `research/questions/` og `research/coding/` av `scripts/build-audit.mjs`. Rediger kildefilene, ikke denne filen.

80 spørsmål fordelt på 15 temaer. Partienes koding vises som −3 (helt uenig) til +3 (helt enig), «?» = ukjent. Bokstav etter tallet angir confidence (H/M/L).

## Kvalitetskontroll av spørsmålene

Alle spørsmål er gjennomgått for:

- **Ledende språk:** ladede ord er erstattet med nøytrale (f.eks. «kommersielle selskaper» i stedet for «velferdsprofitører», «stramme inn» i stedet for «stenge grensene»).
- **Dobbeltspørsmål:** hver påstand inneholder ett krav. Der eksempler er brukt (f.eks. «for eksempel sterkøl og vin i butikk»), er de illustrasjoner av samme krav.
- **Falske motsetninger:** formuleringer som «X i stedet for Y» er bare brukt der partiene faktisk ser det som en avveining (f.eks. klimakutt hjemme vs. kvotekjøp, jernbane vs. motorvei).
- **Duplikater:** sterkt beslektede spørsmål er slått sammen eller differensiert, og resten er lagt i felles klynge (se RESEARCH_AUDIT.md).
- **Partiskhet:** påstandene er formulert i begge retninger (se retningsbalansen i RESEARCH_AUDIT.md). Argumentene for og mot er skrevet som «steelman»-argumenter med samme antall punkter og samme form på begge sider (kontrolleres automatisk i testene).
- **Skillende kraft:** alle spørsmål skiller minst to skalasteg mellom partiene (kontrolleres i testene).

Ap = Arbeiderpartiet · H = Høyre · FrP = Fremskrittspartiet · Sp = Senterpartiet · SV = Sosialistisk Venstreparti · R = Rødt · V = Venstre · KrF = Kristelig Folkeparti · MDG = Miljøpartiet De Grønne


## Økonomi og skatt (8)

| # | Påstand | Klynge | Ap | H | FrP | Sp | SV | R | V | KrF | MDG |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | Det samlede skatte- og avgiftsnivået i Norge bør reduseres. <br><sub>`econ_tax_level`</sub> | skattenivaa | 0H | +3H | +3H | ? | -2M | -2M | +3H | 0H | -1L |
| 2 | Formuesskatten på eierskap i bedrifter (såkalt arbeidende kapital) bør fjernes. <br><sub>`econ_wealth_working`</sub> | formue | -2M | +3H | +3H | +1H | -3M | -3H | +3H | +3H | -2M |
| 3 | Personer med høye inntekter bør betale mer i skatt enn i dag. <br><sub>`econ_top_tax`</sub> | inntektsskatt | ? | -2M | -2M | +1L | +3H | +3H | -1L | +3H | +3H |
| 4 | Norge bør innføre skatt på store arv. <br><sub>`econ_inheritance`</sub> | formue | -3H | -3H | -3H | ? | +3H | +3H | ? | ? | +3H |
| 5 | Kommunene bør fortsatt kunne kreve eiendomsskatt på boliger. <br><sub>`econ_property_tax`</sub> | eiendom | ? | ? | -3H | +1L | +3H | +3H | +2M | ? | +3H |
| 6 | Norge bør kunne bruke mer av oljefondet enn handlingsregelen tillater i dag. <br><sub>`econ_oil_money`</sub> | oljepenger | -3H | -3H | +1L | -3H | +2M | ? | -3H | -3H | +2H |
| 7 | Staten bør eie mindre i norsk næringsliv enn i dag. <br><sub>`econ_state_owner`</sub> | eierskap | -2H | +3H | +2H | -2H | -3H | -3H | +2H | +1L | -1M |
| 8 | NRK bør få mindre offentlig finansiering enn i dag. <br><sub>`econ_nrk`</sub> | nrk | -2M | +1L | +3H | -2M | ? | ? | -1M | -2M | -2M |

## Arbeid, velferd og bolig (7)

| # | Påstand | Klynge | Ap | H | FrP | Sp | SV | R | V | KrF | MDG |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | Sykelønnen bør reduseres noe ved lange sykemeldinger, for eksempel fra 100 til 80 prosent etter seks måneder. <br><sub>`work_sickpay`</sub> | sykelonn | -3H | -2H | -2M | -3H | -3H | -3H | +3H | +1L | -2M |
| 2 | Alle sosialhjelpsmottakere i arbeidsfør alder bør ha plikt til å delta i aktivitet for å få utbetalt støtte. <br><sub>`work_activity_duty`</sub> | aktivitet | ? | +3H | +3H | +1M | ? | ? | ? | ? | -2M |
| 3 | Det bør bli enklere for bedrifter å ansette midlertidig og leie inn arbeidskraft fra bemanningsbyråer. <br><sub>`work_temp_agency`</sub> | arbeidsliv | -3H | +3H | +3H | ? | -3H | -3H | +3H | -2M | +1L |
| 4 | Minsteytelsene i velferden (som minstepensjon, minste uføretrygd og sosialhjelp) bør økes betydelig. <br><sub>`work_min_benefits`</sub> | ytelser | +1L | ? | +1M | +2M | +3H | +3H | +2M | +1L | +3H |
| 5 | Kommersielle selskaper bør kunne drive offentlig finansierte velferdstjenester som barnehager, sykehjem og barnevern. <br><sub>`welfare_commercial`</sub> | velferdsprivat | -1L | +3H | +3H | -2H | -3H | -3H | +2H | +1M | ? |
| 6 | Egenkapitalkravet for boliglån bør lempes eller fjernes, særlig for førstegangskjøpere. <br><sub>`housing_equity`</sub> | bolig | +1M | +2H | +3H | +1M | +1L | ? | +3H | +1M | ? |
| 7 | Staten bør finansiere mange flere ikke-kommersielle utleieboliger med rimelig husleie. <br><sub>`housing_nonprofit`</sub> | bolig | +2M | ? | -1L | ? | +3H | +3H | -1L | ? | +2H |

## Helse (4)

| # | Påstand | Klynge | Ap | H | FrP | Sp | SV | R | V | KrF | MDG |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | Pasienter bør kunne velge behandling hos private klinikker, betalt av det offentlige (fritt behandlingsvalg). <br><sub>`health_free_choice`</sub> | privathelse | -1M | +3H | +3H | -2M | -3M | -3H | +3H | +3H | +1M |
| 2 | Helseforetaksmodellen bør avvikles, slik at sykehusene styres mer direkte av folkevalgte. <br><sub>`health_trusts`</sub> | sykehusstyring | +1L | ? | +1M | +3H | +3H | +3H | -1M | +1M | +3H |
| 3 | Tannbehandling for voksne bør dekkes av det offentlige på samme måte som annen helsehjelp, med egenandeler og frikort. <br><sub>`health_dental`</sub> | tannhelse | +2H | -1M | +1M | +2M | +3H | +3H | -1M | +2M | +2M |
| 4 | Egenandelene i helsetjenesten bør reduseres kraftig eller fjernes. <br><sub>`health_copay`</sub> | egenandel | +1M | ? | 0M | +1M | +2H | +3H | ? | +1M | +1M |

## Innvandring og integrering (9)

| # | Påstand | Klynge | Ap | H | FrP | Sp | SV | R | V | KrF | MDG |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | Norge bør ta imot færre asylsøkere og flyktninger enn i dag. <br><sub>`imm_level`</sub> | asylniva | +1L | +3H | +3H | +1M | -3H | -3M | -2M | -1L | -2M |
| 2 | Norge bør ta imot minst så mange kvoteflyktninger som FN anbefaler. <br><sub>`imm_quota`</sub> | asylniva | +1M | -3H | -3H | +1M | +3H | +3M | +3H | +3H | +3H |
| 3 | Asylsøkere som kommer til Norge, bør kunne sendes til et mottak i et trygt land utenfor Europa mens søknaden behandles. <br><sub>`imm_offshore`</sub> | asylsystem | ? | +1M | +3H | +1M | -3H | -3H | ? | -3H | -2H |
| 4 | Reglene for familiegjenforening bør bli strengere. <br><sub>`imm_family`</sub> | familie | +1M | +3H | +3H | +3H | -3H | -2M | -1L | -1L | -3H |
| 5 | Det bør stilles strengere krav for å få permanent opphold og norsk statsborgerskap, for eksempel om selvforsørgelse og norskkunnskaper. <br><sub>`imm_residence`</sub> | varig | ? | +3H | +3H | ? | -2M | -3H | -1L | -2M | ? |
| 6 | Det bør bli enklere for folk fra land utenfor EU/EØS å få arbeidstillatelse i Norge. <br><sub>`imm_labour`</sub> | arbeidsinnvandring | +1L | +2H | +1M | ? | ? | 0L | +3H | ? | +2M |
| 7 | Personer som har fått endelig avslag på asyl, men har bodd lenge i Norge, bør kunne få bli. <br><sub>`imm_amnesty`</sub> | asylsystem | -1M | -2M | -3H | -2M | +3H | +3H | -1M | +1L | +3H |
| 8 | Flyktninger bør som hovedregel bare få midlertidig opphold og returnere når hjemlandet er trygt. <br><sub>`imm_temporary`</sub> | varig | ? | +3H | +3H | ? | -3H | -1L | ? | -1L | ? |
| 9 | Innvandrere som ikke deltar i norskopplæring eller introduksjonsprogram, bør få redusert økonomisk støtte. <br><sub>`imm_integration_req`</sub> | integrering | +1M | +2H | +3H | ? | ? | ? | ? | ? | ? |

## Justis og politi (4)

| # | Påstand | Klynge | Ap | H | FrP | Sp | SV | R | V | KrF | MDG |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | Straffene for alvorlig kriminalitet bør generelt bli strengere enn i dag. <br><sub>`just_sentences`</sub> | straff | +1M | +2H | +3H | +1L | -3H | ? | -1M | 0H | ? |
| 2 | Politiet bør være generelt bevæpnet. <br><sub>`just_police_arms`</sub> | politi | +3H | +3H | +3H | +3H | -3H | -3H | -3H | +3H | -3H |
| 3 | Politiet bør få flere digitale verktøy, som utvidet overvåking og ansiktsgjenkjenning, for å bekjempe alvorlig kriminalitet. <br><sub>`just_surveillance`</sub> | overvaking | +1M | +2M | +2M | -1M | ? | -2M | -2M | -1L | -2M |
| 4 | Flere lovbrytere bør sone med fotlenke eller samfunnsstraff i stedet for i fengsel. <br><sub>`just_alt_sentences`</sub> | straff | +1L | +1M | -2H | +2H | +3H | +2H | +3H | ? | +3H |

## Ruspolitikk (3)

| # | Påstand | Klynge | Ap | H | FrP | Sp | SV | R | V | KrF | MDG |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | Bruk og besittelse av små mengder narkotika til eget bruk bør ikke straffes. <br><sub>`drug_decrim`</sub> | rusbruk | 0M | +1M | -3H | -3H | +3H | +3H | +3H | -2H | +3H |
| 2 | Det bør innføres lovlig, strengt regulert salg av cannabis til voksne. <br><sub>`drug_cannabis`</sub> | legalisering | -3H | -3H | -3M | -3H | ? | +3H | +3H | -3H | +3H |
| 3 | Alkoholpolitikken bør bli mindre streng, for eksempel ved at sterkøl og vin kan selges i vanlige butikker. <br><sub>`drug_alcohol`</sub> | alkohol | -2H | +2M | +3H | -2H | -2M | -3H | +2H | -3H | -2M |

## Klima og natur (4)

| # | Påstand | Klynge | Ap | H | FrP | Sp | SV | R | V | KrF | MDG |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | Norge bør ha et strengere klimamål for 2035 enn dagens mål om 70–75 prosent kutt (sammenlignet med 1990). <br><sub>`cli_target`</sub> | klimamal | 0H | -1L | -3M | -1L | +3H | +1L | +1L | +3H | +3H |
| 2 | Norge bør ta klimakuttene hjemme i Norge, heller enn å betale for kutt i andre land (for eksempel gjennom klimakvoter). <br><sub>`cli_domestic`</sub> | klimamal | 0M | -2M | -3H | -1M | +3H | +3H | +2H | +2M | +3H |
| 3 | CO₂-avgiften bør økes raskere enn dagens plan om rundt 2000 kroner per tonn i 2030. <br><sub>`cli_co2_tax`</sub> | klimaavgift | 0H | 0M | -3H | -2M | +2M | +1L | +3H | +1L | +2M |
| 4 | Mer natur bør vernes, selv om det begrenser utbygging av for eksempel hytter, veier og næringsområder. <br><sub>`nature_protect`</sub> | natur | +2H | +1M | -3H | -2M | +3H | +3H | +3H | +3H | +3H |

## Olje og energi (9)

| # | Påstand | Klynge | Ap | H | FrP | Sp | SV | R | V | KrF | MDG |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | Norge bør fortsette å lete etter ny olje og gass. <br><sub>`oil_explore`</sub> | olje | +3H | +3H | +3H | +3H | -3H | -3H | -3H | -1M | -3H |
| 2 | Norge bør vedta en sluttdato for olje- og gassproduksjonen. <br><sub>`oil_end_date`</sub> | olje | -3M | -2M | -3M | -3M | +2M | +2M | +1M | -1L | +3H |
| 3 | Havområdene utenfor Lofoten, Vesterålen og Senja bør vernes permanent mot oljevirksomhet. <br><sub>`oil_lofoten`</sub> | oljeomrader | +2M | -2H | -3H | +3H | +3H | +3H | +3H | +3H | +3H |
| 4 | Norge bør legge til rette for å bygge kjernekraftverk. <br><sub>`energy_nuclear`</sub> | kjernekraft | 0M | +2H | +3H | 0M | ? | 0M | +3H | +3H | +2M |
| 5 | Det bør bygges mer vindkraft på land i Norge. <br><sub>`energy_onshore_wind`</sub> | vindkraft | +2M | +2M | -3H | 0M | -2H | -3H | +1M | 0M | 0M |
| 6 | Staten bør gi økonomisk støtte for å få bygget ut havvind. <br><sub>`energy_offshore_wind`</sub> | vindkraft | +2M | +2H | -3H | ? | +1L | ? | +2H | -3H | +2M |
| 7 | Det bør åpnes for mer vannkraftutbygging, også i noen vassdrag som i dag er vernet. <br><sub>`energy_hydro`</sub> | vannkraft | +1L | +2M | +3H | +2H | -3H | -1L | -3H | +1L | -3H |
| 8 | Norge bør ikke bygge flere strømkabler til utlandet. <br><sub>`energy_cables`</sub> | krafteksport | +3H | -1M | +2M | +3H | +3H | +3H | -2M | ? | -3H |
| 9 | Staten bør styre strømprisen for husholdningene, for eksempel med fastpris eller makspris, i stedet for at markedet alene bestemmer. <br><sub>`energy_price_control`</sub> | strompris | +2H | -1M | +3H | +2M | +2H | +3H | -1L | 0M | 0M |

## Transport (5)

| # | Påstand | Klynge | Ap | H | FrP | Sp | SV | R | V | KrF | MDG |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | Bompenger bør i stor grad fjernes, og veier bør heller finansieres over statsbudsjettet. <br><sub>`transport_toll`</sub> | bilkostnader | ? | +1L | +3H | +1M | ? | +2H | -2H | -1M | -2H |
| 2 | Avgiftene på bensin og diesel bør settes ned. <br><sub>`transport_fuel_tax`</sub> | bilkostnader | ? | ? | +3H | +3H | ? | ? | ? | ? | -3H |
| 3 | Elbiler bør fortsatt ha store avgiftsfordeler sammenlignet med bensin- og dieselbiler. <br><sub>`transport_ev`</sub> | bilkostnader | -2H | ? | -1M | ? | +2M | ? | +2M | -2H | -2H |
| 4 | Staten bør prioritere jernbane og kollektivtransport foran bygging av nye store motorveier. <br><sub>`transport_rail_vs_road`</sub> | infrastruktur | ? | -1M | -3H | -1L | +3H | +3H | +2H | -1L | +3H |
| 5 | Persontrafikken på jernbanen bør konkurranseutsettes, slik at flere selskaper kan konkurrere om å kjøre togene. <br><sub>`transport_rail_tender`</sub> | jernbane | -3H | +3H | +3H | -3H | -3H | -3H | ? | ? | ? |

## Skole og utdanning (3)

| # | Påstand | Klynge | Ap | H | FrP | Sp | SV | R | V | KrF | MDG |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | Det bør bli enklere å starte private skoler (friskoler) med offentlig støtte. <br><sub>`edu_private_schools`</sub> | friskoler | -2H | +2H | +3H | -1M | -2M | ? | +3H | +3H | 0M |
| 2 | Fraværsgrensen i videregående skole bør beholdes. <br><sub>`edu_absence_limit`</sub> | fravaer | +2H | +3H | +3M | +1M | -3H | -3H | ? | +2H | ? |
| 3 | Nasjonale prøver bør beholdes som et verktøy for å følge med på elevenes læring. <br><sub>`edu_national_tests`</sub> | prover | -2M | +3H | +3H | -3H | -1L | -3H | ? | -2M | -2H |

## Familie og abort (4)

| # | Påstand | Klynge | Ap | H | FrP | Sp | SV | R | V | KrF | MDG |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | Kontantstøtten (støtte til foreldre som ikke bruker barnehage) bør beholdes. <br><sub>`fam_cash_benefit`</sub> | barnehage | ? | -3H | +1M | +2H | ? | ? | -3H | +3H | +3H |
| 2 | Foreldrene bør selv få bestemme hvordan hele foreldrepermisjonen fordeles, uten øremerkede kvoter til mor og far. <br><sub>`fam_leave_quota`</sub> | permisjon | -3H | +1H | +3H | -3H | -2M | -3H | -3H | +3H | -3H |
| 3 | Barnetrygden bør gjøres skattepliktig og samtidig økes, slik at familier med lave inntekter får mest igjen. <br><sub>`fam_child_benefit_tax`</sub> | barnetrygd | ? | -3H | -1L | -3H | ? | -3H | +3H | ? | +3H |
| 4 | Grensen for selvbestemt abort bør settes tilbake fra 18 til 12 uker. <br><sub>`fam_abortion`</sub> | abort | -3H | 0H | ? | ? | -3M | -3H | -3H | +3H | -3M |

## Personlig frihet og etikk (4)

| # | Påstand | Klynge | Ap | H | FrP | Sp | SV | R | V | KrF | MDG |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | Aktiv dødshjelp bør bli tillatt for alvorlig syke voksne, under strenge vilkår. <br><sub>`val_assisted_dying`</sub> | dodshjelp | ? | ? | +3H | -3H | ? | ? | +1M | -3H | -1M |
| 2 | Surrogati (at en kvinne bærer fram et barn for andre) bør bli tillatt i Norge under regulerte former. <br><sub>`val_surrogacy`</sub> | bioteknologi | ? | ? | +3H | ? | ? | -3H | +3H | -3H | ? |
| 3 | Kommunene bør selv kunne tillate at butikker holder åpent på søndager. <br><sub>`val_sunday`</sub> | sondag | -2H | +3H | +3H | -2H | -3H | -3H | +3M | -2M | ? |
| 4 | Forbudet mot å kjøpe sex (sexkjøpsloven) bør oppheves. <br><sub>`val_sex_purchase`</sub> | sexkjop | ? | ? | +3H | -3H | -3H | -3H | +3H | -3H | +1M |

## Distrikt og landbruk (5)

| # | Påstand | Klynge | Ap | H | FrP | Sp | SV | R | V | KrF | MDG |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | Staten bør gi sterkere insentiver til at kommuner slår seg sammen til større kommuner. <br><sub>`dist_municipal_merge`</sub> | kommunestruktur | +2M | +3H | ? | -3H | ? | -2L | +3H | +2H | +2M |
| 2 | Fylkeskommunen bør legges ned, slik at vi får to forvaltningsnivåer: stat og kommune. <br><sub>`dist_county`</sub> | kommunestruktur | -3M | +3H | +3H | -3H | ? | -3H | ? | -3H | ? |
| 3 | Tollvernet for norske landbruksvarer bør styrkes for å sikre norsk matproduksjon, selv om det kan gi høyere matpriser. <br><sub>`agri_tariffs`</sub> | landbruk | +1M | -1H | -3H | +3H | +2M | +3H | ? | +1M | +1M |
| 4 | Staten bør bruke mer penger på landbruket for å tette inntektsgapet mellom bønder og andre grupper. <br><sub>`agri_income`</sub> | landbruk | +2H | -2M | -3H | +3H | +3H | +3H | ? | +3H | +2H |
| 5 | Bestandene av ulv og andre store rovdyr i Norge bør få bli større enn i dag. <br><sub>`agri_predators`</sub> | rovdyr | -1M | 0M | -2M | -3H | +1M | +2M | +3H | 0M | +3H |

## EU og Europa (4)

| # | Påstand | Klynge | Ap | H | FrP | Sp | SV | R | V | KrF | MDG |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | Norge bør si nei til EUs fjerde energimarkedspakke. <br><sub>`eu_energy_package`</sub> | euregler | ? | ? | +3H | +3H | +3H | +3H | -3H | ? | ? |
| 2 | Norge bør søke om medlemskap i EU. <br><sub>`eu_membership`</sub> | eumedlemskap | -1M | +3H | -3H | -3H | -3H | -3M | +3H | -2H | +3H |
| 3 | Norge bør si opp EØS-avtalen og erstatte den med en handelsavtale. <br><sub>`eu_eea`</sub> | eos | -3H | -3H | -2H | +3H | +1M | +3H | -3H | -3H | -3H |
| 4 | Norge bør oftere si nei til nye EU-regler gjennom EØS, særlig når de overfører makt til EU-organer. <br><sub>`eu_reservation`</sub> | euregler | ? | -2M | +3H | +3H | +3H | +3H | -3H | ? | -3H |

## Forsvar og utenriks (7)

| # | Påstand | Klynge | Ap | H | FrP | Sp | SV | R | V | KrF | MDG |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | Norge bør øke forsvarsbudsjettet raskere og mer enn dagens langtidsplan legger opp til. <br><sub>`def_budget`</sub> | forsvarsbudsjett | 0M | +3H | +3H | +2M | -1L | 0L | +1L | +3H | +1M |
| 2 | Norge bør melde seg ut av NATO. <br><sub>`def_nato_exit`</sub> | nato | -3H | -3H | -3H | -3H | -1M | +3H | -3H | -3H | -3H |
| 3 | Norge bør åpne for at allierte land kan ha faste militærbaser i Norge. <br><sub>`def_allied_bases`</sub> | allierte | ? | ? | +3H | -3H | -3H | -3H | +2M | +3H | +1M |
| 4 | Norge bør øke den militære og sivile støtten til Ukraina betydelig. <br><sub>`def_ukraine`</sub> | ukraina | +1M | +3H | ? | ? | +1M | ? | +3H | +3H | +2M |
| 5 | Norge bør bruke minst 1 prosent av nasjonalinntekten (BNI) på bistand. <br><sub>`for_aid`</sub> | bistand | +3H | ? | -3H | +3H | +3H | +3H | +3H | +3H | +3H |
| 6 | Norge bør signere FNs atomvåpenforbud. <br><sub>`for_nuclear_ban`</sub> | nedrustning | 0M | ? | ? | 0M | +3H | +3H | -1L | +3H | ? |
| 7 | Norge bør innføre økonomiske sanksjoner eller boikott mot Israel på grunn av okkupasjonen av palestinske områder. <br><sub>`for_israel_sanctions`</sub> | midtosten | +1M | ? | -3H | ? | +2H | +3H | +1L | -3H | +2M |
