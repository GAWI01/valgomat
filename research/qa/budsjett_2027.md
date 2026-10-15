# Statsbudsjettet 2027 (Prop. 1 S / Prop. 1 LS (2026–2027)) via andre offisielle kanaler

Hentet 2026-10-14. regjeringen.no / statsbudsjettet.no ble IKKE forsøkt omgått. Ingen proxy/cache/stealth brukt.
Nedlastede kilder: /tmp/claude-0/budsjett2027/{stortinget,statsforvalteren,ap,parti,bransje}/ (upålitelige data, kun lest som tekst).

## Kanaler – hva virket

| Kanal | Status | Merknad |
|---|---|---|
| data.stortinget.no `/eksport/publikasjoner?publikasjontype=referat&sesjonid=2026-2027` (+ `&format=json`) | VIRKER | Lister refs-202627-10-01 … 10-14 |
| data.stortinget.no `/eksport/publikasjon?publikasjonid=refs-202627-10-07` | VIRKER | Full XML av referat; også 10-02 (trontale), 10-05/10-06 (trontaledebatt + voteringer), 10-13, 10-14 (muntlig spørretime med finansministeren) |
| stortinget.no referat-HTML (…/Referater/Stortinget/2026-2027/refs-202627-10-07/) | 200 OK | Samme innhold |
| data.stortinget.no `/eksport/sak?sakid=200434/200450/200451` | VIRKER | Gir bare lenker til regjeringen.no (sperret) for selve Prop. 1 S/LS |
| data.stortinget.no `/eksport/skriftligesporsmal?sesjonid=2026-2027` | VIRKER | 90 spørsmål, stort sett ubesvart ennå – ikke nyttig |
| statsforvalteren.no (Innlandet, Rogaland, Vestland, Trøndelag) | VIRKER | Sammendrag av kommuneopplegget + Grønt hefte 2027 (KDDs berekningsteknisk dokumentasjon til Prop. 1 S) som PDF |
| arbeiderpartiet.no/aktuelt/regjerings-forslag-til-statsbudsjett-2027/ | VIRKER | Kort partisammendrag |
| sv.no, krf.no, hoyre.no | VIRKER | Partikilder |
| senterpartiet.no, mdg.no | 200, men fant ingen budsjettsak 2027 på forsiden | |
| rodt.no | Connection reset | |
| ks.no, udi.no, elbil.no | 403 | ikke forsøkt omgått |
| skatteetaten.no/satser | VIRKER, men har bare 2025/2026-satser (2027 publiseres etter vedtak) | |
| bilimportorene.no (BIL – bransjeforening) | VIRKER | Konkrete bilavgiftssatser fra Prop. 1 LS (bransjekilde, ikke offisiell) |
| ofv.no (Opplysningsrådet for veitrafikken) | VIRKER | Bransjekilde; siterer Samferdselsdep.s Prop. 1 S om fylkesvei |
| nav.no, imdi.no, vegvesen.no, forsvaret.no, helsedirektoratet.no | 200, men ingen budsjett-2027-sider funnet | |

Hovedkilde (primær, offisiell): **Stortingets referat 7. oktober 2026, sak 1 «Finansministerens redegjørelse om regjeringens forslag til statsbudsjett og om nasjonalbudsjettet for 2027»**, finansminister Jens Stoltenberg.
- HTML: https://www.stortinget.no/no/Saker-og-publikasjoner/Publikasjoner/Referater/Stortinget/2026-2027/refs-202627-10-07/
- XML: https://data.stortinget.no/eksport/publikasjon?publikasjonid=refs-202627-10-07

Andre referater:
- Trontaledebatt 5. okt.: https://www.stortinget.no/no/Saker-og-publikasjoner/Publikasjoner/Referater/Stortinget/2026-2027/refs-202627-10-05/
- Trontaledebatt + voteringer 6. okt.: …/refs-202627-10-06/
- Muntlig spørretime 14. okt.: …/refs-202627-10-14/
- Trontalen 2. okt.: …/refs-202627-10-02/

---

## Funn per tema

### econ_top_tax – «Personer med høye inntekter bør betale mer i skatt enn i dag»
- **Kilde:** Stortingets referat 7.10.2026, finansminister Jens Stoltenberg (redegjørelse).
  Sitat: «foreslår vi brede lettelser i inntektsskatten på 6,4 mrd. kr neste år. Dette er den største reduksjonen i inntektsskatten i et budsjett på 20 år.»
- **Kilde:** Referat 14.10.2026 (muntlig spørretime), Stoltenberg [10:30:01], svar til Marthe Hammer (SV):
  «Det ene er en flat reduksjon i trygdeavgiften – det er likt prosentvis, men det er større kronebeløp for dem med høye inntekter, det er helt åpenbart.»
  Samme svar: «Vi finansierer det gjennom f.eks. reduserte elbilfordeler. Det treffer klart mest dem som har høyest inntekt.»
- **Kilde:** Referat 14.10.2026, Stoltenberg [10:31:40]: «Så strammer vi også inn på måter som gjør at de som har mest, betaler mest.»
- Partikilde (SV, 7.10.2026, https://www.sv.no/blog/2026/10/07/bergsto-om-budsjettforslaget-oker-forskjellene-i-norge/): «personer med inntekt over 1,2 millioner kroner får tre ganger så mye i skattekutt som folk med 500 000 kroner i årslønn.»
- Ingen omtale av trinnskatt-økning funnet.
- **Vurdering:** Budsjettet gir skattelette (også i kroner mest til høye inntekter) via flat trygdeavgiftsreduksjon. Ingen økt skatt på høye inntekter foreslås. Regjeringen sier at de rikeste bærer mer av *innstrammingene* (elbil, skattehull). Dette peker mot «uenig/nøytral» på påstanden, men det er ikke en tydelig standpunkt-formulering. **LOW–MEDIUM**, tolkes forsiktig.

### econ_property_tax – «Kommunene bør fortsatt kunne kreve eiendomsskatt på boliger»
- **Kilde (offisiell):** Grønt hefte 2027 (KDD, berekningsteknisk dokumentasjon til Prop. 1 S), lastet ned via Statsforvalteren i Rogaland: https://www.statsforvalteren.no/siteassets/rogaland/samfunn/kommuneokonomi/gront-hefte-2027.pdf
  Linje: «Kompensasjon for endringar i regelverket for eigedomsskatt 300 000» (gjelder bortfall av eiendomsskatt på produksjonsutstyr, ikke boliger).
- Ingen forslag i budsjettet om å fjerne eller endre eiendomsskatt på bolig funnet.
- **Ap-retning (partipolitikk, ikke budsjett):** Trontaledebatt 5.10.2026, Tonje Brenna (A) [10:50:03]: «å gi lettelser i eiendomsskatten til de aller dyreste boligene, samtidig som man kutter i barnehage og skole» (kalt «brutalt og hjerterått»). Også Farukh Qureshi (A) og Agnes Nærland Viljugrein (A) kritiserer Høyre-byrådets fjerning av boligskatten i Oslo.
- **Vurdering:** Budsjettet foreslår ingen endring i kommunenes rett til eiendomsskatt på bolig (status quo). Ap-representanter forsvarer eiendomsskatten på bolig i Oslo. Retningen er «enig», men stoltes på debattinnlegg. **MEDIUM**.

### transport_fuel_tax – «Avgiftene på bensin og diesel bør settes ned»
- **Kilde:** Referat 7.10.2026, Stoltenberg: «Regjeringen har derfor valgt å fortsette opptrappingen av klimaavgiftene i tråd med planen» … «Derfor skjermer vi veitrafikken ved å redusere veibruksavgiften slik at avgiftsendringene samlet ikke påvirker pumpeprisen.»
- **Bransjekilde (BIL, 7.10.2026)** https://www.bilimportorene.no/nyheter/dette-betyr-statsbudsjettet-for-norske-bilimportorer : «Veibruksavgiften på mineralolje og biodiesel reduseres med 50 øre per liter» … «Samtidig øker CO2-avgiften fra 3,80,- til 4,40,- per liter for bensin og fra 4,42,- per til 5,13.- for diesel.»
- **Votering 6.10.2026** (referat refs-202627-10-06, forslag nr. 27 fra FrP, Sp og KrF om å sette veibruksavgiften til kr 0 fra 1. nov. til 31. des. 2026): «ble med 58 mot 43 stemmer ikke vedtatt» (bare Rødt varslet støtte i tillegg; Ap stemte altså mot). Bekreftet av FrP-innlegg 7.10: «Flertallet kunne stemt for forslaget om å forlenge avgiftsfritaket på drivstoff, men det ville ikke flertallet, heller ikke Arbeiderpartiet.»
- **Vurdering:** Regjeringen vil holde pumpeprisen omtrent lik (CO₂-avgift opp, veibruksavgift ned) og Ap stemte mot å forlenge kuttet i drivstoffavgiftene. Retningen er «uenig» i at avgiftene skal settes ned. **MEDIUM**.

### transport_toll – bompenger fjernes / statsfinansiering
- Ingen budsjettomtale av statlige bompengereduksjoner funnet i finanstalen, statsforvalter-sammendragene eller Grønt hefte.
- Ap i trontaledebatten: Tonje Brenna (A) 5.10. [10:43:54]: «De lovte å fjerne bompengene, men antall bomstasjoner økte kraftig.» (angrep på FrP, ikke eget standpunkt). Even H. Eriksen (A) [19:40:51] om et forslag om ett bompengeprosjekt: «Derfor kommer Arbeiderpartiet til å stemme imot forslaget, som i praksis blir en løsning med mer bompenger til folket».
- **Vurdering:** Ikke nok belegg fra budsjettet. Ikke fyll ut fra dette.

### fam_cash_benefit – «Kontantstøtten bør beholdes»
- **Kilde:** Referat 13.10.2026 (Innst. 1 S, fordeling til komiteene): budsjettet har «844 Kontantstøtte» og romertallsvedtak «VI Satser for kontantstøtte» – ordningen ligger altså i forslaget.
- KrF (opposisjon), referat 14.10.2026, Jorunn Gleditsch Lossius [11:06:35]: «regjeringen ikke prisjustert barnetrygden eller kontantstøtten». Jørgen H. Kristiansen (KrF) 7.10.: «det er reelt kutt i kontantstøtten».
- **Vurdering:** Regjeringen beholder kontantstøtten (satsene står i forslaget), men ifølge KrF uten prisjustering. Det dokumenterer at ordningen *beholdes*, men ikke noe aktivt verdistandpunkt. **LOW–MEDIUM**, «enig»-retning.

### fam_child_benefit_tax – «Barnetrygden bør gjøres skattepliktig og samtidig økes»
- **Kilde:** Referat 7.10.2026, Stoltenberg: «I budsjettforslaget videreføres maksprisen på 1 200 kr og barnetrygden på over 2 000 kr.» (Samme tekst på arbeiderpartiet.no/aktuelt/regjerings-forslag-til-statsbudsjett-2027/.)
- Ingen forslag om skatteplikt. MDG (Ingrid Liland, 5.10.) vil «doble og skattlegge barnetrygden» – det er MDGs krav, ikke regjeringens.
- **Vurdering:** Regjeringen viderefører barnetrygden uten skatteplikt, men har ikke tatt stilling til modellen. Ikke nok belegg for et standpunkt. **LOW**.

### transport_rail_vs_road – prioritering av jernbane vs. store motorveier
- **Kilde:** Referat 7.10.2026, Stoltenberg: «vedlikehold vil som regel være mer samfunnsøkonomisk lønnsomt, gi mer nytte, enn å bygge nytt.» … «Med regjeringens budsjettforslag øker vi bevilgningene til drift og vedlikehold på både riksvei og jernbane.» … «og først bygge nytt når vi må.»
- Referat 14.10.2026, Stoltenberg [11:03:16]: «Vi er opptatt av jernbanen, og det viktigste her er drift og vedlikehold av det vi har».
- **Vurdering:** Prioriterer vedlikehold på *både* vei og jernbane, ikke jernbane framfor motorvei. Dokumenterer ikke retning på påstanden. **Ikke fyll ut.**

### work_activity_duty – aktivitetsplikt for sosialhjelp
- Ingen omtale i finanstalen. Grønt hefte 2027 har «Forsøk med aktivitetspengar for unge -25 000» og «Auka behov for sosialhjelp ved utfasing av stønadar til einsleg mor eller far 55 166». Ingenting om aktivitetsplikten.
- Finanstalen: forslag på høring om å legge om «stønaden til nyankomne flyktninger, slik at de får mer igjen for å komme i arbeid» (arbeidslinje, ikke aktivitetsplikt).
- **Vurdering:** Ikke belegg. Ikke fyll ut.

### imm_temporary – midlertidig beskyttelse / permanent opphold
- **Kilde:** Trontaledebatt 5.10.2026, statsråd Kjersti Stenseng [16:10:43]: «Vi ønsker at enda flere skal komme i jobb og foreslår derfor at ukrainere som er i jobb og må forsørge seg selv, skal få muligheten til å søke om permanent opphold.»
  Samme innlegg: «over 86 000 er fortsatt bosatt i Norge med midlertidig kollektiv beskyttelse.»
- **Vurdering:** Regjeringen åpner for at ukrainere i jobb kan få permanent opphold, en oppmyking av det midlertidige for én gruppe. Det taler *mot* en strengt midlertidig linje, men gjelder bare ukrainere i arbeid. Statsrådens innlegg, ikke Prop. 1 S-tekst. **LOW–MEDIUM**. Hvilken retning dette gir avhenger av hvordan påstanden er formulert.

### imm_offshore – asylbehandling i tredjeland
- Ingenting funnet i finanstalen, trontalen eller statsrådsinnlegg. Trontalen nevner at Stortinget har vedtatt regelverk «i samsvar med EUs pakt for migrasjon og asyl». **Ikke belegg.**

### def_allied_bases – allierte baser
- Finanstalen: forsvarsbudsjettet «øker i tråd med langtidsplanen»; Norge «svært nær NATOs byrdefordelingsmål på 3,5 pst.» Statsministeren 6.10.: «NATO er rammen for vår sikkerhet». Ingenting om baser. **Ikke belegg.**

### Kommunesammenslåing (bekreftelse) – BEKREFTET
- **Kilde (offisiell):** Statsforvalteren i Innlandet, «Statsbudsjettet 2027», publisert 7.10.2026: https://www.statsforvalteren.no/nb/innlandet/nyheter/2026/10/statsbudsjettet-2027/
  «For å legge til rette for frivillige kommunesammenslåinger foreslår regjeringen mer forutsigbare økonomiske virkemidler: et samlet utredningstilskudd, standardisert kompensasjon for engangskostnader og et nytt standardisert oppstartstilskudd.»
- Statsforvalteren i Vestland, brev til kommunane: https://www.statsforvalteren.no/contentassets/0a4c1e3505fb4cb2b288986393f45662/statsbudsjett-2027brev-til-kommunane.pdf
  «Regjeringa gjer framlegg om å etablere ei ny tilskotsordning for frivillige kommunesamanslåingar.» Ordningen finansieres ved at rammetilskuddet trekkes 70 mill. kr.
- Grønt hefte 2027: «Finansiering av ordningar for frivillige kommunesamanslåingar -70 000» (1000 kr).
- **Vurdering:** Bekreftet. Retningen er frivillige sammenslåinger med økonomiske insentiver, ikke tvang. **MEDIUM**.

### Elbil-moms – beløpsgrense 150 000 i 2027 – BEKREFTET (bransjekilde + offisiell retning)
- **Offisiell:** Referat 7.10.2026, Stoltenberg: «Regjeringen foreslår å trappe ytterligere ned momsfritaket for elbiler.» (beløpet nevnes ikke i talen)
- **Bransjekilde (BIL, 7.10.2026)**: «Momsgrensen for elbiler reduseres til 150 000,- fra 2027, med varsel om full avvikling fra 2028.»
- BIL 12.10.2026 (https://www.bilimportorene.no/nyheter/bil-moter-finanskomiteen-om-statsbudsjettet): «økes momsen på elbiler med inntil 37 500,- fra neste år» (stemmer med en grense som går fra 300 000 til 150 000: 25 % × 150 000).
- **Vurdering:** 150 000 er bekreftet av BIL. Talen bekrefter at fritaket trappes ned. Beløpet bør helst sjekkes mot Prop. 1 LS når den blir tilgjengelig. **MEDIUM**.

---

## Andre budsjettfakta (bakgrunn)
- Frie inntekter for kommunesektoren: +3,2 mrd. (2,6 til kommunene, 0,6 til fylkene). Den kommunale skattøren er 13,40 % (Statsforvalteren i Innlandet/Rogaland).
- Halvering av tollen på klær. Norgespris er 45 øre. Strømstøtten er 90 % over 79 øre (finanstalen).
- Forsvaret får +6,5 mrd. Ukraina får 85 mrd. (arbeiderpartiet.no).
- Firmabilbeskatningen legges om fra 2027 (BIL).
- Engangsstønaden kuttes med 25 000 kr (KrF i spørretimen 14.10., Stoltenberg bekreftet reduksjonen).
