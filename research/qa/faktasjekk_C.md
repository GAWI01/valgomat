# QA-rapport C – faktasjekk av 05_justis, 06_rus, 07_klima, 10_skole

Alle sider er PDF-sideindeks (samme som ref). Sitater er fra /tmp/claude-0/progs/*.txt.

## 05_justis.txt
| qid | parti | nå | verdikt | forslag | kommentar (med sitat/side) |
|---|---|---|---|---|---|
| just_sentences | Ap | 1 MEDIUM 101 | OK | – | s.101: «strengere straffer mot gjengvold»; ingen generell økning. |
| just_sentences | H | 2 HIGH 1,13 | OK | – | s.1 «gi strengere straffer»; s.12–13 flere strafferammer heves, men også «redusere minstestraffer og øke maksstraffene». |
| just_sentences | FrP | 3 HIGH 36 | OK | – | s.36: «skjerpe straffenivået og øke maksstraffen til 50 år»; «høyere strafferammer generelt sett». |
| just_sentences | Sp | 1 LOW 83,88 | ENDRE_SIDE | ref 83,85,88 | Begrunnelsens «straffenivå må vurderes jevnlig» står på s.85: «Ulike soningsformer og straffenivå må jevnlig vurderes opp mot kriminalstatistikk». Verdi OK. |
| just_sentences | SV | -3 HIGH 51 | OK | – | s.51: «gjennomgang av det totale straffenivået, med mål om å senke det». |
| just_sentences | R | U 11,98 | OMSTRIDT | U (evt. 0 LOW) | Blandet: s.98 «strafferammene for seksuelt misbruk av barn, voldtekt, partnervold … skjerpes», men s.97 «tradisjonen om lave fengselsrater skal fastholdes». U forsvarlig; 0 LOW mulig. |
| just_sentences | V | -1 MEDIUM 45-46 | OK | – | s.46: «Redusere bruken av minstestraffer … unngå at vi straffer folk lenger enn det som er nødvendig». |
| just_sentences | KrF | 0 HIGH 21 | OK | – | s.21: «Beholde det generelle straffenivået, men vurdere … seksuallovbrudd». |
| just_sentences | MDG | U 70 | OK | – | s.70 kun miljøkrim opp og innreiseforbud ned; ikke generelt nivå. |
| just_police_arms | Ap | U | OK | – | Ingen treff på bevæpning i politikontekst. |
| just_police_arms | H | 3 HIGH 11 | OK | – | s.11: «innføre generell bevæpning av politiet». |
| just_police_arms | FrP | 3 HIGH 33-34 | OK | – | s.33: «Generell bevæpning av politiet er helt nødvendig». |
| just_police_arms | Sp | 3 HIGH 82 | OK | – | s.82: «Gå inn for generell bevæpning av politiet». |
| just_police_arms | SV | -3 HIGH 50 | OK | – | s.50: «Et ubevæpnet politi, med punktsikring … og framskutt lagring». |
| just_police_arms | R | -3 HIGH 99 | OK | – | s.99: «går imot generell bevæpning og militarisering av politiet». |
| just_police_arms | V | -3 HIGH 44-45 | OK | – | s.45: «Ikke åpne for generell bevæpning av politiet». |
| just_police_arms | KrF | 3 HIGH 21 | OK | – | s.21: «Innføre generell bevæpning». |
| just_police_arms | MDG | -3 HIGH 69 | OK | – | s.69: «Gå mot generell bevæpning av politiet». |
| just_surveillance | Ap | U 145 | OK | – | s.145 gjelder private selskaper; intet om politiets metoder. |
| just_surveillance | H | 2 MEDIUM 11-12 | OK | – | s.12: «nødvendig med flere verktøy for å sikre at politiet kan etterforske og få dømt» nettverkskriminelle. |
| just_surveillance | FrP | 1 MEDIUM 33-34 | ENDRE_VERDI | 2 MEDIUM; tekst: «FrP vil begrense overvåking generelt, men mener politiet mangler effektive metoder mot alvorlig kriminalitet og vil pålegge datalagring og tillate romavlytting og bevisprovokasjon.» | Påstanden gjelder nettopp alvorlig kriminalitet. s.33: «Politiet mangler i dag effektive metoder for å bekjempe alvorlig kriminalitet på Internett … Nettleverandørene skal derfor pålegges å lagre … data». s.34: «akseptere bruk av forhåndsgodkjent rom- og telefonavlytting, bevisprovokasjoner». |
| just_surveillance | Sp | -1 MEDIUM 81 | OK | – | s.81: «motstandere av ny lovgivning som åpner for økt overvåkning av lovlydige borgere», men aksepterer det ved alvorlig kriminalitet. |
| just_surveillance | SV | U | OK | – | s.44 bare kommersiell overvåking; s.43 vil at hemmelige tjenester skal «overvåke og stoppe ekstreme trusler» – ikke nok for koding. |
| just_surveillance | R | -2 MEDIUM 76,85 | OK | – | s.76: etterretningsloven skal ikke åpne «for masseovervåkning», «strengere lover for datalagring». (s.85-forbudet gjelder *kommersiell* ansiktsgjenkjenning; parafrasen bør si det.) |
| just_surveillance | V | -2 MEDIUM 47 | ENDRE_SIDE | ref 45,61; tekst: «Venstre sier nei til all digital masseovervåking og vil ha høy terskel for politiets skjulte tvangsmidler, kun i de mest alvorlige sakene.» | s.47-sitatet handler om utenforskap/beredskap. Direkte belegg s.61: «nei til alle former for digital masseovervåking … terskelen for at politiet får bruke skjulte tvangsmidler … høy nok»; s.45 «Stanse praksisen med tilrettelagt innhenting». Verdi OK. |
| just_surveillance | KrF | -1 MEDIUM 39 | ENDRE_CONF | -1 LOW, ref 39,85; tekst: «KrF vil forby kommersiell ansiktsgjenkjenning og at nye overvåkingsmetoder skal vurderes av domstolene.» | s.39-forbudet gjelder *kommersiell* bruk, ikke politiet. s.85: «vurderinger av nye overvåkningsmetoder må tas av domstolene». s.21 vil også at «politiet må sikres mulighet til å forfølge nye former for kriminalitet» – svakt motsatt. Indirekte → LOW. |
| just_surveillance | MDG | -2 MEDIUM 66 | OK | – | s.66: «reversere vedtak om storskala overvåking og lagring av data … hos politiet og etteretningstjenesten» + forby automatisk ansiktsgjenkjenning. (Gjerne nevne politiledd i begrunnelsen.) |
| just_alt_sentences | Ap | 1 LOW 107 | OK | – | s.107: «sikre at domfelte på elektronisk kontroll gis et rehabiliterende tilbud». |
| just_alt_sentences | H | 1 MEDIUM 14 | OK | – | s.14: «utvide bruken av fotlenke som straff for unge». |
| just_alt_sentences | FrP | -2 HIGH 37 | OK | – | s.37: «Elektronisk kontroll bør begrenses til bruk overfor dem med mindre forseelser». |
| just_alt_sentences | Sp | 2 HIGH 85-86 | OK | – | s.85: «utvide ordningen med … fotlenke», «Øke bruken av samfunnsstraff» (men vil også bygge flere fengsler). |
| just_alt_sentences | SV | 3 HIGH 51 | OK | – | s.51: «utvide bruken av soning med elektronisk kontroll», «styrke … alternative soningsmåter». |
| just_alt_sentences | R | U | FRA_U | 3 HIGH (evt. 2), ref 97-98; tekst: «Rødt vil utvikle og forsterke alternativer til fengsel og mener fengsel bør forbeholdes dem som er til skade for andre eller ved betydelig kriminalitet.» | s.98: «Utvikle og forsterke alternativer til fengsel som sanksjons- og straffeformer og reetablere åpne fengsler. At fengsel som straff bør gjelde for mennesker som er til skade for andre». s.97: «lave fengselsrater skal fastholdes». |
| just_alt_sentences | V | 1 LOW 46 | ENDRE_VERDI | 3 HIGH; tekst: «Venstre vil øke bruken av soning med fotlenke og videreutvikle samfunnsstraff.» | Eksplisitt på s.46: «Øke bruken av soning med elektronisk kontroll (fotlenke)» og «samfunnsstraff og straffegjennomføring med elektronisk kontroll må videreutvikles». |
| just_alt_sentences | KrF | U | OK | – | s.20–22: rehabilitering, ingen fotlenke/samfunnsstraff-standpunkt. |
| just_alt_sentences | MDG | 3 HIGH 70 | OK | – | s.70: «Prioritere og utvikle alternative straffereaksjoner til fengselsstraff, herunder utvide bruken av samfunnsstraff og elektronisk fotlenke». |

## 06_rus.txt
| qid | parti | nå | verdikt | forslag | kommentar (med sitat/side) |
|---|---|---|---|---|---|
| drug_decrim | Ap | 0 MEDIUM 80 | OK | – | s.80: «helsehjelp fremfor straffereaksjoner» men «vil derfor ikke endre disse vurderingene». |
| drug_decrim | H | 1 MEDIUM 52-53 | OMSTRIDT | behold 1 MEDIUM | s.52 «Bruk og besittelse … skal være forbudt»; s.53 «henvises til hjelp … i stedet for straff … Manglende oppmøte sanksjoneres». Tolkningsavhengig om gebyr = straff. |
| drug_decrim | FrP | -3 HIGH 33 | OK | – | s.33: «gjeninnføre straff for besittelse, bruk og omsetning». |
| drug_decrim | Sp | -3 HIGH 84-85 | OK | – | s.84 «Ingen narkotiske stoffer skal avkriminaliseres»; s.85 «Bøtelegge bruk og besittelse». |
| drug_decrim | SV | 3 HIGH 17 | OK | – | s.17: «rusreform der bruk og besittelse … avkriminaliseres». |
| drug_decrim | R | 3 HIGH 18 | OK | – | s.18: «avkriminalisere bruk og besittelse av øvrige rusmidler til eget bruk». |
| drug_decrim | V | 3 HIGH 32 | OK | – | s.32: «avkriminalisere bruk og besittelse av mindre mengder narkotika». |
| drug_decrim | KrF | -2 HIGH 24 | OK | – | s.24 «all bruk og besittelse … forbudt», «tunge rusutfordringer skal ikke møtes med straff». (s.23 forenklede forelegg kan legges til ref.) |
| drug_decrim | MDG | 3 HIGH 35,40 | OK | – | s.40: «Fjerne straff for bruk og besittelse av brukerdoser». |
| drug_cannabis | Ap | U | OK | – | Ingen treff på cannabis/legalisering. |
| drug_cannabis | H | -3 HIGH 52 | OK | – | s.52: «ikke legalisere bruk eller besittelse av narkotika». |
| drug_cannabis | FrP | -3 MEDIUM 33,61 | OK | – | Slutning fra s.33 straff for «omsetning»; s.61 kun medisinsk cannabis. MEDIUM riktig. |
| drug_cannabis | Sp | -3 HIGH 84 | OK | – | s.84: «Ingen narkotiske stoffer skal … legaliseres». |
| drug_cannabis | SV | U 17 | OK | – | Kun avkriminalisering; ingen salgsmodell. |
| drug_cannabis | R | 3 HIGH 18 | OK | – | s.18: «Legalisere og regulere omsetningen av cannabis … likt vinmonopolet». |
| drug_cannabis | V | 3 HIGH 32 | OK | – | s.32: «Tillate strengt regulert omsetning av cannabis». |
| drug_cannabis | KrF | -3 HIGH 24 | OK | – | s.24: «legalisering av rusmidler vil øke rusmisbruket». |
| drug_cannabis | MDG | 3 HIGH 40 | OK | – | s.40: «Legalisere og strengt regulere salg av cannabis til eget bruk». |
| drug_alcohol | Ap | -2 HIGH 73 | OK | – | s.73: «føre en restriktiv alkoholpolitikk og opprettholde Vinmonopolets samfunnsrolle». |
| drug_alcohol | H | 2 MEDIUM 69 | OK | – | s.69: «utvide åpningstidene for alkoholsalg i butikk og på Vinmonopolet»; s.34 modernisere reklameforbudet. |
| drug_alcohol | FrP | 3 MEDIUM 56 | ENDRE_CONF | 3 HIGH, ref 56-57; tekst: «FrP vil liberalisere alkohollovgivningen og oppheve monopolet for omsetning av alkoholholdige drikker.» | Eksplisitt i vil-listen s.57: «liberalisere alkohollovgivningen oppheve monopolet for omsetning av alkoholholdige drikker … fjerne reguleringen av åpnings-, salgs- og skjenketider». |
| drug_alcohol | Sp | -2 HIGH 59 | OK | – | s.59: «opprettholde Vinmonopolordningen». |
| drug_alcohol | SV | -2 MEDIUM 18 | OK | – | s.18: «ansvarlig alkoholpolitikk med mål om å redusere alkoholforbruket». |
| drug_alcohol | R | -3 HIGH 16 | OK | – | s.16: «Si nei til liberalisering av dagens skjenketider. Opprettholde salgsmonopol for brennevin, vin og sterkøl». |
| drug_alcohol | V | 3 HIGH 32-33 | ENDRE_VERDI | 2 HIGH; tekst: «Venstre vil i hovedsak videreføre dagens alkoholpolitikk, men åpne for sterkøl i butikk, lokale salgstider og alkohol i det offentlige rom.» | Kontekst demper: s.32 «Venstre vil i hovedsak videreføre dagens alkoholpolitiske virkemidler. Samtidig bør det gjennomføres enkelte liberaliseringer». Ikke kategorisk → 2. |
| drug_alcohol | KrF | -3 HIGH 24,29 | OK | – | s.29: «reduserer den alminnelige skjenketiden fra 03.00 til 02.00». |
| drug_alcohol | MDG | -1 MEDIUM 41 | OMSTRIDT | -2 MEDIUM | s.41: «Videreføre en restriktiv politikk for omsetning av alkohol gjennom å beholde Vinmonopolet»; park-unntaket gjelder konsum, ikke salg. Ap har samme kombinasjon (s.73 + park s.133) og er kodet -2 – inkonsistent. |

## 07_klima.txt
| qid | parti | nå | verdikt | forslag | kommentar (med sitat/side) |
|---|---|---|---|---|---|
| cli_target | Ap | 0 HIGH 121 | OK | – | s.121: «minst 70-75 prosent sammenlignet med … 1990». |
| cli_target | H | -1 LOW 42 | OMSTRIDT | -1 LOW eller U | s.42 nevner bare «betydelige utslippsreduksjoner innen 2030 i samarbeid med EU»; ingenting om 2035. Svak slutning. |
| cli_target | FrP | -3 HIGH 92-93 | ENDRE_CONF | -3 MEDIUM | Sterk retning, men ikke direkte om 2035-målet. s.92: «andre partienes svar … urealistiske, ineffektive og kostbare mål». |
| cli_target | Sp | -1 LOW 19,22 | OK | – | s.22: «Innta skog i klimamålet for 2035, dersom dette gjør det enklere å nå klimamålet». |
| cli_target | SV | 3 HIGH 32 | OK | – | s.32: «lovfestes et mål om 80 prosent nasjonale utslippsreduksjoner i 2035». |
| cli_target | R | 1 LOW 38 | OK | – | s.38: «gradvis forsterke forpliktelsene»; ikke tallfestet 2035. |
| cli_target | V | 1 MEDIUM 6 | ENDRE_CONF | 1 LOW | Kun 2030/2050-tall (s.6: «55 % innen 2030 og 95 % innen 2050 … gjennom nasjonale tiltak»); 2035-nivået er en slutning → LOW. |
| cli_target | KrF | 2 HIGH 41 | ENDRE_VERDI | 3 HIGH | Like eksplisitt som SV/MDG (kodet 3). s.41: «minst 55 prosent innen 2030, minst 80 prosent innen 2035». EU-koblingen endrer ikke ambisjonsnivået. |
| cli_target | MDG | 3 HIGH 7 | OK | – | s.7: «kutte minst 80 prosent av våre territorielle utslipp innen 2035». |
| cli_domestic | Ap | -1 MEDIUM 121 | ENDRE_VERDI | 0 MEDIUM; tekst: «Ap vil at 2035-målet i hovedsak nås gjennom nasjonale tiltak og gjennom samarbeid med EU.» | Begrunnelsen utelater en sentral del av setningen. s.121: «Målet skal i hovedsak nås gjennom nasjonale tiltak og gjennom samarbeid med EU.» Dokumentert mellomposisjon. |
| cli_domestic | H | -2 MEDIUM 42 | OK | – | s.42: «gir større fleksibilitet og er mer kostnadseffektivt enn å oppnå målene alene». |
| cli_domestic | FrP | -3 HIGH 92-93 | OK | – | s.92: «kjøpe klimakvoter for å gjennomføre utslippskutt der de er billigst». |
| cli_domestic | Sp | -1 MEDIUM 19 | OK | – | s.19: «nasjonale utslippskutt og … Dette innebærer kvotekjøp». |
| cli_domestic | SV | 3 HIGH 4 | OK | – | s.4: «Vi skal ikke benytte oss av fleksible mekanismer». |
| cli_domestic | R | 3 HIGH 38 | OK | – | s.38: «skal tas innenlands, ikke gjennom kvotekjøp». |
| cli_domestic | V | 3 HIGH 6 | OMSTRIDT | 2 HIGH | s.6: «planlegges for at målene nås gjennom nasjonale tiltak», men samme liste: «Forlenge klimaavtalen med EU til 2040». Mindre kategorisk enn SV/R. |
| cli_domestic | KrF | 2 MEDIUM 41 | OK | – | s.41: «betydelige, raske og tilstrekkelige kutt hjemme» + EUs kvotemarked «sentrale virkemidlet». |
| cli_domestic | MDG | 3 HIGH 7 | OK | – | s.7: «uten at handel med internasjonale klimakvoter … regnes med». |
| cli_co2_tax | Ap | 0 HIGH 121 | OK | – | s.121: «trappe opp CO2-avgiften til minst 2000 2020-kroner innen 2030». |
| cli_co2_tax | H | 0 MEDIUM 42 | OK | – | s.42: «fortsette opptrappingen av CO2-avgiftene, men kompensere». |
| cli_co2_tax | FrP | -3 HIGH 92 | OK | – | s.92: «ingen løsning å pålegge økt CO2-avgift før alternativ teknologi er tilgjengelig». |
| cli_co2_tax | Sp | -2 MEDIUM 102,109 | OK | – | s.102 «Fjerne CO2-avgiften på LNG …», s.109 «Redusere … drivstoffavgifter», «Ikke innføre CO2-avgift på biologiske produksjoner». |
| cli_co2_tax | SV | 2 MEDIUM 5,32 | OK | – | s.5: «Prisen for CO2-utslipp i olje- og gassvirksomheten bør økes kraftig fram mot 2030». |
| cli_co2_tax | R | 1 MEDIUM 39 | ENDRE_CONF | 1 LOW | s.39: «Øke CO2-avgiften gradvis for å nå klimamålene» – sier ikke raskere enn planen; slutning via strengere klimamål. |
| cli_co2_tax | V | 3 HIGH 5,42 | OK | – | s.42: «Trappe opp CO2-avgiften til 3000 kroner innen 2030»; s.5 «raskere opptrapping». |
| cli_co2_tax | KrF | 1 MEDIUM 41 | ENDRE_CONF | 1 LOW | s.41: «forutsigbar og økende prisbane som er tilstrekkelig» / s.50 «gradvis økning» – ikke «raskere» uttrykt; kun slutning fra 80 %-målet. |
| cli_co2_tax | MDG | 2 MEDIUM 45,49 | OK | – | s.45: «i tråd med 1,5-gradersmålet, inkludert en oppjustering også etter 2030». |
| nature_protect | Ap | 2 HIGH 125 | OK | – | s.125: «verner og beskytter minst 30 prosent av naturen», arealnøytral 2040. |
| nature_protect | H | 1 MEDIUM 45-46 | OK | – | s.46: «øke utnyttelsen av allerede utbygde områder», «vurdere om større deler av statens skogeiendommer kan vernes» (men s.41 vil gjennomgå vassdragsvern for kraft). |
| nature_protect | FrP | -3 HIGH 90,93 | OK | – | s.90: «vurdere opphevelse av allerede vedtatte verneområder»; s.93 «bruk og forvaltning fremfor vern». |
| nature_protect | Sp | -1 MEDIUM 24 | ENDRE_VERDI | -2 MEDIUM, ref 19,24,78 | Mer enn lokale hensyn: s.19 «ikke gjennom ensidig vern»; s.78 «Begrense omfanget av marine verneplaner»; s.24 lokale interesser og frivillig skogvern. |
| nature_protect | SV | 3 HIGH 31 | OK | – | s.31: «forbud mot nedbygging av myr», «handlingsregel for natur». |
| nature_protect | R | 3 HIGH 40 | OK | – | s.40: «arealplanlegging må være arealnøytral», nye verneplaner. |
| nature_protect | V | 3 HIGH 6 | OK | – | s.6: «30 %-målet … må sikres formell vernestatus». |
| nature_protect | KrF | 3 HIGH 44 | OK | – | s.44: «innfrir Naturavtalen om … minst 30 prosent», arealnøytralitet (forbehold om minst mulige konsekvenser for avvirkning). |
| nature_protect | MDG | 3 HIGH 9 | OK | – | s.9: «lovfeste at Norge skal være arealnøytrale innen 2030». |

## 10_skole.txt
| qid | parti | nå | verdikt | forslag | kommentar (med sitat/side) |
|---|---|---|---|---|---|
| edu_private_schools | Ap | -2 HIGH 52-53 | OK | – | s.52 «uten å øke innslaget av private skoler»; s.53 «nei til … nye kommersielle privatskoler». |
| edu_private_schools | H | 2 HIGH 22 | OK | – | s.22: «forutsigbar og trygg finansiering av friskoler», «flere profilskoler … yrkesfaglige friskoler». |
| edu_private_schools | FrP | 3 HIGH 68,72 | OK | – | s.72: «liberalisere privatskoleloven og gjøre det enklere å starte privatskoler». |
| edu_private_schools | Sp | -1 MEDIUM 125-126 | OK | – | s.125 «vil ikke endre godkjenningsgrunnlag»; s.126 distriktshensyn ved godkjenning. |
| edu_private_schools | SV | U 26 | FRA_U | -2 MEDIUM, ref 27; tekst: «SV vil ha demokratisk styring av private skoler slik at antall private plasser reduseres, og forby profitt.» | s.27: «demokratisk styring av både det offentlige og det private barnehage- og skoletilbudet, slik at … antall private plasser reduseres»; «Eiere av private barnehager og skoler skal ikke kunne ta ut profitt». |
| edu_private_schools | R | U | OK | – | Ingen treff på friskole/privatskole; kun generell anti-kommersialisme (s.13, s.27). |
| edu_private_schools | V | 3 HIGH 16 | OK | – | s.16: «det skal være rom for flere friskoler i Norge». |
| edu_private_schools | KrF | 3 HIGH 13 | OK | – | s.13: 90 % tilskudd og «Endre privatskolelovens § 2-1 som … gir kommunene … vetorett mot nye friskoler» (styrker 3). |
| edu_private_schools | MDG | 0 MEDIUM 30 | OK | – | s.30: «Beholde adgangen til å etablere ikke-kommersielle private skoler». |
| edu_absence_limit | Ap | U | OK | – | Ingen treff på fraværsgrense. |
| edu_absence_limit | H | 3 HIGH 23 | OK | – | s.23: «beholde en nasjonal fraværsgrense». |
| edu_absence_limit | FrP | 3 HIGH 69 | ENDRE_CONF | 3 MEDIUM; tekst: «FrP vil innføre fraværsgrense også på ungdomsskolen (implisitt beholde i vgs).» | Sier ikke eksplisitt «beholde» i vgs. s.69: «innføre fraværsgrense på ungdomsskolen». Slutning er sterk, men tolkning trengs. |
| edu_absence_limit | Sp | 1 MEDIUM 126 | OK | – | s.126: «fraværsreglementet … blir praktisert på en fleksibel måte». |
| edu_absence_limit | SV | -3 HIGH 27 | OK | – | s.27: «fjerne dagens fraværsgrense». |
| edu_absence_limit | R | -3 HIGH 28 | OK | – | s.28: «Jobbe mot fraværsgrensa på videregående skole og i ungdomsskolen». |
| edu_absence_limit | V | U | OK | – | Kun «oppfølging av elever med høyt fravær» (s.16). |
| edu_absence_limit | KrF | 2 HIGH 12 | OK | – | s.12: «Beholde fraværsgrensen, men bytte ut 10 prosentgrensen med 15 prosent i 2- og 3-timers fag». |
| edu_absence_limit | MDG | U | OK | – | Ingen treff. |
| edu_national_tests | Ap | U 53 | OK | – | s.53: «sikre fortsatt kunnskap om elevenes faglige utvikling over tid» – nevner ikke prøvene. |
| edu_national_tests | H | 3 HIGH 25-26 | OK | – | s.25: «nasjonale prøver og ulike kartleggingsprøver er viktig»; s.26 «vurdere behovet for flere nasjonale prøver». |
| edu_national_tests | FrP | 3 HIGH 68 | OK | – | s.68: «Nasjonale prøver og internasjonale målinger … er viktige verktøy». |
| edu_national_tests | Sp | -3 HIGH 125 | OK | – | s.125: «erstatte dagens nasjonale prøver med et kartleggingsverktøy for internt bruk». |
| edu_national_tests | SV | U | FRA_U | -1 LOW, ref 26; tekst: «SV mener målstyringen har gått for langt og at standardiserte prøver har gitt for mye pugging.» | s.26: «Målstyringen i skolen har gått for langt. Standardiserte prøver og teoretisering har resultert i for mye pugging». Kritikk, ikke konkret forslag → LOW. |
| edu_national_tests | R | -2 MEDIUM 26 | ENDRE_VERDI | -3 MEDIUM, ref 26,28; tekst: «Rødt vil stanse obligatoriske, standardiserte tester og erstatte dem med utvalgsprøver og klasseromsforskning.» | Kodingen overså s.28: «Stanse rangering av elever og skoler gjennom obligatoriske, standardiserte tester. Kunnskap om skolen som system må innhentes gjennom utvalgsprøver». Tilsvarer Sp (-3). |
| edu_national_tests | V | U | OK | – | Kun PISA nevnt om naturfag (s.15). |
| edu_national_tests | KrF | U | OK | – | Ingen treff. |
| edu_national_tests | MDG | -2 HIGH 29 | OK | – | s.29: «avvikling av nasjonale prøver i dagens form». (-3 kan forsvares, men «i dagens form» begrunner -2.) |

## Oppsummering
Totalt 126 linjer.

| verdikt | antall |
|---|---|
| OK | 102 |
| ENDRE_VERDI | 7 |
| ENDRE_CONF | 7 |
| ENDRE_SIDE | 2 |
| FRA_U | 3 |
| OMSTRIDT | 5 |
| ENDRE_TEKST | 0 (tekstendringer er tatt med i forslagene over) |
| TIL_U | 0 |

ENDRE_VERDI: FrP just_surveillance 1→2, V just_alt_sentences 1→3, V drug_alcohol 3→2, KrF cli_target 2→3, Ap cli_domestic -1→0, Sp nature_protect -1→-2, R edu_national_tests -2→-3.
ENDRE_CONF: KrF just_surveillance →LOW, FrP drug_alcohol →HIGH, FrP cli_target →MEDIUM, V cli_target →LOW, R cli_co2_tax →LOW, KrF cli_co2_tax →LOW, FrP edu_absence_limit →MEDIUM.
FRA_U: R just_alt_sentences (+3), SV edu_private_schools (-2), SV edu_national_tests (-1).
ENDRE_SIDE: Sp just_sentences (+85), V just_surveillance (→45,61).
OMSTRIDT: R just_sentences, H drug_decrim, MDG drug_alcohol, H cli_target, V cli_domestic.
