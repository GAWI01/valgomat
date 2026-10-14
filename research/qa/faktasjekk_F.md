# Faktasjekk F – 13_eu.txt og 14_forsvar_utenriks.txt

## Særskilt: eu_membership|Ap (-1 MEDIUM, src:altinget_ap_eu_2025)
- **Programmet tar stilling, i motsetning til det begrunnelsen sier.** Ap s.169: «Arbeiderpartiet er tilhenger av et sterkt politisk samarbeid i Europa. Ved to tidligere folkeavstemninger har vi derfor anbefalt å si ja til norsk medlemskap. Samtidig er det rom for ulike syn i EU-spørsmålet. Dersom et medlemskapsspørsmål skulle bli aktuelt, skal det være gjenstand for ny landsmøtebehandling.» (g.py 'EU-medlemskap|medlemskap i EU' gir ingen treff, fordi teksten bruker «norsk medlemskap» og «medlemskapsspørsmål». Det forklarer trolig hvorfor kodingen bommet.)
- Altinget-kilden er sjekket med WebFetch: landsmøtet tok ikke stilling til medlemskap. Forslag om å støtte medlemskap ble ikke vedtatt, og uttalelsen sier at «det ikke er tiden for en medlemskapsprosess nå». Det gjør at kilden og programmet sier det samme: prinsipielt EU-vennlig, ingen søknad nå og ingen standpunkt i perioden.
- **Vurdering:** -1 går an å forsvare. Påstanden gjelder å *søke*, og Ap avviser eksplisitt en prosess nå. Begrunnelsen og referansen må likevel rettes. 0 er også et rimelig valg (en dokumentert mellomposisjon: ja to ganger, «rom for ulike syn»). Verdien bør ses sammen med for_nuclear_ban|Ap, som har samme mønster («et mål, men ikke nå») og nå er kodet +1. Behandle dem likt.
- **Forslag:** behold -1 MEDIUM, ref `169,src:altinget_ap_eu_2025`, ny begrunnelse: «Ap har tidligere anbefalt ja og er for sterkt europeisk samarbeid, men programmet sier det er "rom for ulike syn" og at et medlemskapsspørsmål krever ny landsmøtebehandling. Landsmøtet 2025 mente "det ikke er tiden for en medlemskapsprosess nå".» Merkes OMSTRIDT (alternativ: 0).

## 13_eu.txt
| qid | parti | nå | verdikt | forslag | kommentar (med sitat/side) |
|---|---|---|---|---|---|
| eu_membership | Ap | -1 MEDIUM src | ENDRE_SIDE / ENDRE_TEKST (OMSTRIDT) | -1 MEDIUM, ref 169,src:altinget_ap_eu_2025, ny tekst (se over); alternativ 0 | s.169: «rom for ulike syn i EU-spørsmålet … skal det være gjenstand for ny landsmøtebehandling». Det stemmer ikke at «programmet ikke tar stilling». |
| eu_membership | H | 3 HIGH 5 | OK | – | s.5: «arbeide for norsk EU-medlemskap» |
| eu_membership | FrP | -3 HIGH 14 | OK | – | s.14: «arbeide for et fortsatt nei til norsk medlemskap i EU» |
| eu_membership | Sp | -3 HIGH 138 | OK | – | s.138: «gå mot alle forsøk på å fremme en norsk søknad om EU-medlemskap» |
| eu_membership | SV | -3 HIGH 43,45 | OK | – | s.43: «si nei til norsk EU medlemskap»; s.45: «holde oss utenfor EU» |
| eu_membership | R | -3 MEDIUM 90 | OK | – | s.90: viser til folkeavstemningenes nei og vil erstatte EØS med en handelsavtale. Indirekte, så MEDIUM er riktig. |
| eu_membership | V | 3 HIGH 63 | OK | (ref kan gjerne være 63-64) | s.63: «vil Venstre at Norge skal bli med i EU»; s.64: «melde seg inn i EU» |
| eu_membership | KrF | -2 HIGH 76 | OK | – | s.76: «våre nåværende tilknytningsformer er den beste løsningen» |
| eu_membership | MDG | 3 HIGH 46,107 | OK | – | s.107: «nye forhandlinger med EU med sikte på norsk EU-medlemskap»; s.100 også |
| eu_eea | Ap | -3 HIGH 13,32 | OK | – | s.32: «EØS-avtalen er vår viktigste. Den ligger fast.» |
| eu_eea | H | -3 HIGH 5 | OK | – | s.5: «forsvare EØS-avtalen» |
| eu_eea | FrP | -2 HIGH 14 | OK | – | s.14: «handel med EU skal styres gjennom EØS-avtalen», men deler bør «reforhandles» |
| eu_eea | Sp | 3 HIGH 138 | OK | – | s.138: «Erstatte EØS-avtalen med handels- og samarbeidsavtaler med EU» |
| eu_eea | SV | 1 MEDIUM 43 | OK | – | s.43: en samarbeidsform «som ikke avgir suverenitet slik EØS gjør», men «uhensiktsmessig å skulle starte forhandlinger de neste fire årene» |
| eu_eea | R | 3 HIGH 11,90 | OK | – | s.11: «At EØS-avtalen sies opp og erstattes med en handelsavtale» |
| eu_eea | V | -3 HIGH 64 | OK | – | s.64: «så bredt og dypt samarbeid med EU som mulig gjennom EØS-avtalen» |
| eu_eea | KrF | -3 HIGH 76 | OK | – | s.76: EØS «svært avgjørende» |
| eu_eea | MDG | -3 HIGH 46,107 | OK | – | s.107: «Frem til dette vil vi bevare EØS-avtalen» |
| eu_reservation | Ap | U | OK | – | Bare «bruke handlingsrommet» (s.169) og «bruke mulighetene» (s.32). Ingen treff på reservasjonsrett. |
| eu_reservation | H | -2 MEDIUM 5 | OK | – | s.5: «vente-og-se-politikk må erstattes av en effektiv europapolitikk» og pro EU-medlemskap. Indirekte, men retningen er klar. |
| eu_reservation | FrP | 3 HIGH 14 | OK | – | s.14: «benytte reservasjonsretten for å hindre implementering av direktiver» og «for ofte ukritisk godtar» |
| eu_reservation | Sp | 3 HIGH 138 | OK | – | s.138: «Bruke reservasjonsretten …», «Si nei til nye avtaler … forrang til EU-retten» |
| eu_reservation | SV | 3 HIGH 43 | OK | – | s.43: «si nei til ny EU-lovgivning som avgir ytterligere suverenitet» |
| eu_reservation | R | 3 HIGH 90 | OK | (ref 11,90) | s.90: «aktivt å bruke reservasjonsretten»; s.11 også |
| eu_reservation | V | -3 HIGH 6,64 | OK | – | s.6: «snarest mulig slutte Norge til … fjerde energimarkedspakke» |
| eu_reservation | KrF | -1 LOW 76 | TIL_U | U | s.76 sier bare «Beholde dagens tilknytningsform». Teksten vil også sikre «selvbestemmelsesrett på områder som er særlig viktige for Norge», så retningen er ikke negativ. Begrunnelsen innrømmer selv at KrF «ikke tar eksplisitt stilling». |
| eu_reservation | MDG | -3 HIGH 46,107 | OK | – | s.107: «ta igjen etterslepet på gjennomføring av EØS-relevante rettsakter» |

## 14_forsvar_utenriks.txt
| qid | parti | nå | verdikt | forslag | kommentar (med sitat/side) |
|---|---|---|---|---|---|
| def_budget | Ap | 0 MEDIUM 176 | ENDRE_TEKST (OMSTRIDT) | 0 LOW eller -1 LOW; ny tekst: «Ap vil sikre at forsvarsløftet i langtidsplanen gjennomføres, men lover ikke økning utover planen» | s.176: «Arbeiderpartiet er garantisten for at forsvarsløftet gjennomføres». «uten å gå utover planen» står ikke i kilden og er sterkere enn den. Kilden sier heller ikke «sikre at Norge oppfyller NATOs mål», bare «Med Ap i regjering oppfyller Norge NATOs toprosentmål». |
| def_budget | H | 3 HIGH 7 | OK | – | s.7: «utvide og fremskynde ambisjonene i LTP, blant annet ved å øke finansieringen» |
| def_budget | FrP | 3 HIGH 17 | ENDRE_SIDE | ref 19-20 | Punktet står på s.20: «øke Forsvarets årlige budsjett for å forsterke og forsere den vedtatte Langtidsplanen» og «luftvernkapasiteten utover vedtatt Langtidsplan». s.19: «vesentlig mer til luftvern enn … vedtatt». s.17 nevner bare NATO-ambisjonen. |
| def_budget | Sp | 3 HIGH 48 | OMSTRIDT | 2 MEDIUM | s.48: «minimum 3 % av BNP», men også «Øke bevilgningene … i tråd med Langtidsplanen» og (s.43) «bygges opp i tråd med satsingene i Langtidsplanen». Ingen tidsangivelse. Mindre kategorisk enn KrFs «3 prosent av BNP i 2027». |
| def_budget | SV | -1 LOW 49 | OK | – | s.49: «sikre at økning i forsvarsbudsjettet ikke skjer på bekostning av den sivile beredskapen», og bedre styring må være «vilkår for nye, større investeringer i materiell» |
| def_budget | R | -1 LOW 88 | OMSTRIDT | 0 LOW, ref 87-88 | s.87: «Styrke den nasjonale forsvarsevnen. Derfor har Rødt tilsluttet seg forsvarsforliket». s.88: «Bevilge 1 milliard til … fred og nedrustning. Beløpet justeres opp hver gang bevilgningene til forsvaret økes» er ikke motstand mot økning. R ligger nærmere LTP-nivået (0). |
| def_budget | V | 0 MEDIUM 66 | OMSTRIDT | 1 LOW | s.66: «Kraftig ruste opp Forsvarets operative evne» og toprosentmålet «vil måtte vurderes … i takt med den geopolitiske situasjonen og NATOs behov», altså en vurdering oppover. Svakt positivt. |
| def_budget | KrF | 3 HIGH 75 | OK | – | s.75: «Øke forsvarsutgiftene til 3 prosent av BNP i 2027» |
| def_budget | MDG | 1 MEDIUM 105 | OK | – | s.105: «Støtte hovedprinsippene i langtidsplanen» og «for en eventuell styrking av langtidsplanen». Lett positiv er forsvarlig, 0 også mulig. |
| def_nato_exit | Ap | -3 HIGH 176 | OK | (ref 167,176) | s.176: «NATO er en hjørnestein for norsk sikkerhet» |
| def_nato_exit | H | -3 HIGH 5 | OK | – | s.5: «NATO er bærebjelken i norsk forsvars- og sikkerhetspolitikk» |
| def_nato_exit | FrP | -3 HIGH 18 | OK | – | s.18: «NATO er hjørnesteinen i norsk sikkerhets- og forsvarspolitikk» |
| def_nato_exit | Sp | -3 HIGH 45 | OK | – | s.45: «NATO er sikkerhetsgarantien vår» |
| def_nato_exit | SV | -1 MEDIUM 47-48 | OK | (LOW kan vurderes) | s.47: samarbeid «både i og utenfor NATO»; s.48: NATO «ren forsvarsallianse». Ingen krav om utmelding, men heller ikke noe uttrykt ønske om å bli. |
| def_nato_exit | R | 3 HIGH 86 | OK | – | s.86: «Melde Norge ut av NATO» |
| def_nato_exit | V | -3 HIGH 65 | OK | – | s.65: «NATO er i dag Norges klart viktigste sikkerhetsgaranti» |
| def_nato_exit | KrF | -3 HIGH 75 | OK | – | s.75: «Sikre fortsatt norsk medlemskap i NATO» |
| def_nato_exit | MDG | -3 HIGH 100 | OK | (ref 100,105) | s.100: «støtter De Grønne norsk NATOmedlemskap»; s.105: «videreføre norsk medlemskap i NATO» |
| def_allied_bases | Ap | U | OK | – | s.177: bare «legge til rette for alliert trening og øving i Norge» |
| def_allied_bases | H | U | OK | – | s.7: «praktiseringen av retningslinjene for militær aktivitet og tilstedeværelse» er tvetydig. U er riktig. |
| def_allied_bases | FrP | 3 HIGH 19 | OK | – | s.19: «legge til rette for etablering av faste baser i Norge for våre allierte» |
| def_allied_bases | Sp | U | **FRA_U** | -3 HIGH, ref 48 | s.48: «Sikre at NATO-soldater i Norge forblir rotasjonsbasert og ikke har permanent tilstedeværelse» og «videreføre vår historiske basestrategi». Eksplisitt nei til faste baser. |
| def_allied_bases | SV | -3 HIGH 47 | OK | – | s.47: «avvikle utenlandske baser» |
| def_allied_bases | R | -3 HIGH 88 | OK | – | s.88: «ikke skal være utenlandske militærbaser på norsk jord» |
| def_allied_bases | V | U | **FRA_U** | 2 MEDIUM, ref 66 | s.66: «Oppdatere basepolitikken for å åpne for større nærvær av allierte styrker på norsk territorium, særlig for å muliggjøre fast samarbeid» |
| def_allied_bases | KrF | 3 HIGH 75 | OK | – | s.75: «Åpne for allierte baser på norsk jord» (står ikke «faste», men formuleringen svarer direkte på påstanden) |
| def_allied_bases | MDG | U | **FRA_U** | 1 MEDIUM, ref 105 | s.105: «tettere samarbeid med europeiske allierte om omforente områder for utstasjonering av allierte tropper på norsk jord. Norge skal alltid ha en utvetydig rett til oppsigelse» (forbeholdet trekker ned fra 2 til 1) |
| def_ukraine | Ap | 1 MEDIUM 167 | OK | – | s.167: «følge opp Nansen-programmet … så lenge det er behov for det» |
| def_ukraine | H | 3 HIGH 6 | OK | – | s.6: «øke den økonomiske støtten til Ukraina betydelig» og «gi betydelig våpenstøtte» |
| def_ukraine | FrP | U | OK | – | Ukraina nevnes bare som trusselbilde (s.12, 18, 19) |
| def_ukraine | Sp | U | OK | – | Ingen treff på støtte |
| def_ukraine | SV | 1 MEDIUM 45 | OK | – | s.45: «fortsette den militære og humanitære støtten» |
| def_ukraine | R | U | OK | – | s.87/94: støtter «motstandskamp» og «oppbyggingen», men sier ikke noe om omfanget av støtten |
| def_ukraine | V | 3 HIGH 65 | OK | – | s.65: «Videreføre og betydelig øke støtten til Ukraina» |
| def_ukraine | KrF | 3 HIGH 76 | OK | – | s.76: «betydelig trapper opp den militære og sivile støtten» |
| def_ukraine | MDG | U | **FRA_U** | 2 MEDIUM, ref 110 | s.110: «Styrke Nansenprogrammet med Norges ekstrainntekter som følger av Russlands invasjon av Ukraina, for å støtte Ukrainas forsvar og gjenoppbygging» (s.6 også: «Ukraina … fritt») |
| for_aid | Ap | 3 HIGH 173 | OK | – | s.173: «bruke én prosent av brutto nasjonalinntekt på bistand» |
| for_aid | H | U | OK | – | s.9: bare «den humanitære bistanden må økes». Ingen BNI-treff. |
| for_aid | FrP | -3 HIGH 12,15 | OK | – | s.12: «Bistandsbudsjettet skal reduseres kraftig»; s.15: «maksimalt 0,7% av BNI» |
| for_aid | Sp | 3 HIGH 137 | OK | – | s.137: «minst 1 prosent av BNI til utviklingshjelp» |
| for_aid | SV | 3 HIGH 10,46 | OK | – | s.46: «minst 1 prosent av BNI» |
| for_aid | R | U | **FRA_U** | 3 HIGH, ref 93 | s.93: «At minst 1 prosent av bruttonasjonalinntekten (BNI) brukes til samfunnsutvikling i fattige land». Begrunnelsen «angir ikke et nivå» er feil. |
| for_aid | V | 3 HIGH 67 | OK | – | s.67: «minst 1% av bruttonasjonalinntekten (BNI) skal brukes på bistand» |
| for_aid | KrF | 3 HIGH 80 | OK | – | s.80: «minst 1 prosent av norsk BNI» |
| for_aid | MDG | 3 HIGH 110 | OK | – | s.110: «minst én prosent av Norges brutto nasjonalinntekt» |
| for_nuclear_ban | Ap | 1 MEDIUM 171 | ENDRE_VERDI (OMSTRIDT) | 0 MEDIUM; tekst: «… men mener det i dagens situasjon ikke er mulig for Norge å undertegne» | s.171: «I dagens sikkerhetspolitiske situasjon er det ikke mulig for NATO-land som Norge å undertegne … Det bør være et mål …». Påstanden gjelder å signere, og Ap sier eksplisitt nei nå og ja som mål. Det er en dokumentert mellomposisjon. Begrunnelsen utelater «ikke mulig». Bør behandles likt med eu_membership\|Ap og for_nuclear_ban\|Sp. |
| for_nuclear_ban | H | U | OK | – | s.6: bare «gjensidig kjernefysisk nedrustning» |
| for_nuclear_ban | FrP | U | OK | – | Ingen treff |
| for_nuclear_ban | Sp | U | **FRA_U** | 0 MEDIUM (eller samme verdi som Ap), ref 134 | s.134: «Det er et mål på sikt at Norge skal signere FN-traktaten om forbud mot kjernevåpen, noe som forutsetter at vi lykkes med gjensidige og verifiserbare avtaler om nedrustning». |
| for_nuclear_ban | SV | 3 HIGH 45 | OK | – | s.45: «at Norge signerer og ratifiserer atomvåpenforbudet» |
| for_nuclear_ban | R | 2 MEDIUM 86 | **ENDRE_VERDI + ENDRE_CONF + ENDRE_TEKST** | 3 HIGH; tekst: «Rødt vil at Norge umiddelbart ratifiserer avtalen om forbud mot atomvåpen» | s.86: «Norge må arbeide for full atomnedrustning og umiddelbart ratifisere den internasjonale avtalen om forbud mot atomvåpen» |
| for_nuclear_ban | V | U | OMSTRIDT / FRA_U | -1 LOW, ref 65 | s.65: «prioritere Norges innsats for å styrke eksisterende avtaler der atomvåpenstatene også er parter … Målet på sikt bør være en forpliktende forbudsavtale som inkluderer alle dagens atommakter». V foretrekker en annen avtale enn TPNW, men sier ikke direkte nei. |
| for_nuclear_ban | KrF | 3 HIGH 78 | OK | – | s.78: «jobbe for at Norge signerer atomvåpenforbudet» |
| for_nuclear_ban | MDG | U | OK | (ref 100,102) | s.102: «folkerettslig forpliktende og balansert global nedrustning, herunder atomnedrustning». Forbudsavtalen nevnes ikke. |
| for_israel_sanctions | Ap | U | OK | – | s.170: bare «tydelig stemme mot ulovlig okkupasjon» |
| for_israel_sanctions | H | U | OK | – | s.6: tostatsløsning |
| for_israel_sanctions | FrP | -3 HIGH 12 | OK | – | s.12: «økt samarbeid og samhandel med Israel» |
| for_israel_sanctions | Sp | U | OK | – | Ingen treff |
| for_israel_sanctions | SV | 3 HIGH 45 | ENDRE_VERDI | 2 HIGH | s.45: «trekke oljefondet ut av selskaper FN har svartelistet …» og «forbud mot økonomisk virksomhet … på okkuperte områder». Dette er målrettede tiltak mot okkupasjonsøkonomien, ikke sanksjoner eller boikott av Israel som sådan. Da blir nivået likt MDG (+2). |
| for_israel_sanctions | R | 3 HIGH 7,93 | OK | – | s.93: «økonomisk, akademisk og kulturell boikott av Israel»; s.7: «Trekke oljefondet ut av Israel» |
| for_israel_sanctions | V | U | FRA_U (svak) | 1 LOW, ref 64-65 | s.64: SPU skal ikke investeres i selskaper som bidrar «til å opprettholde ulovlig okkupasjon»; s.65: okkupasjonen «må opphøre». Generell formulering, derfor bare LOW. |
| for_israel_sanctions | KrF | -3 HIGH 78 | OK | – | s.78: «Si nei til boikott av Israel» |
| for_israel_sanctions | MDG | 2 MEDIUM 103 | OK | – | s.103: «Norsk handel med parter fra den okkuperende makten i ulovlig okkuperte områder må regnes som lovstridig» |

## Oppsummering
90 linjer (27 i 13_eu, 63 i 14_forsvar_utenriks).
- OK: 72
- FRA_U: 8 (Sp/V/MDG def_allied_bases, MDG def_ukraine, R for_aid, Sp for_nuclear_ban, V for_nuclear_ban [OMSTRIDT], V for_israel_sanctions [svak])
- ENDRE_VERDI: 3 (Ap for_nuclear_ban [OMSTRIDT], R for_nuclear_ban [også conf/tekst], SV for_israel_sanctions)
- ENDRE_SIDE: 2 (Ap eu_membership [også tekst, OMSTRIDT], FrP def_budget)
- ENDRE_TEKST: 1 (Ap def_budget [OMSTRIDT])
- TIL_U: 1 (KrF eu_reservation)
- OMSTRIDT (bare): 3 (Sp, R og V def_budget)
- ENDRE_CONF: 0 som egen kategori (R for_nuclear_ban får HIGH sammen med verdiendringen)

Metodenotat: g.py stopper etter 12 treff per parti. Søk som «medlemskap» og «baser» blir derfor fylt opp av NATO- og «basert»-treff. Flere av U-feilene kommer trolig av det.
