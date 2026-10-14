# Politisk QA – red-team-gjennomgang av partistandpunktene

**Dato:** 14. oktober 2026 · **Omfang:** alle 720 kodinger (572 kodede + 148 ukjente i versjonen før gjennomgangen) · **Status etter gjennomgangen:** 603 kodet, 117 ukjent.

Denne gjennomgangen ble gjort for å finne feil, ikke for å bekrefte tidligere arbeid. Ingen standpunkter er endret for å oppnå en bestemt rangering. Alle endringer bygger på et ordrett sitat fra kilden, og sitatet står i arbeidsrapportene i `research/qa/`.

## 1. Metode

1. **Uavhengig ny lesning av hver linje.** De 15 kodefilene ble delt i seks bolker. Hver bolk ble lest på nytt fra bunnen av mot PDF-tekstene, side for side. For hver kodet linje ble sju ting kontrollert:
   - støtter kilden kodingen;
   - er sidetallet riktig;
   - endrer konteksten meningen;
   - er intensiteten riktig;
   - er confidence riktig;
   - er begrunnelsen en korrekt parafrase;
   - er saken omstridt.

   For hver ukjent linje ble programmet søkt på nytt med flere synonymer. Instruksen ligger i `research/qa/`, og arbeidsrapportene med verdikt, sitat og side for alle 720 linjer er `research/qa/faktasjekk_A.md` … `faktasjekk_F.md`.
2. **Etterkontroll.** Alle forslag om fortegnsskifte og et utvalg av forslagene om å fylle ut ukjente ble kontrollert på nytt mot PDF-teksten før de ble tatt inn. Det gjelder blant annet:
   - H sykelønn;
   - MDG kommunesammenslåing;
   - Sp barnetrygd;
   - Sp baser;
   - MDG kabler;
   - FrP havvind;
   - R bistand;
   - V og R alternative straffer;
   - KrF og R fylkeskommune;
   - FrP rovdyr.

   Alle bekreftet. Forslag som var tolkningsavhengige ble ikke tatt inn automatisk. Se §5.
3. **Konsistensregler.** Der to partier bruker (nesten) samme formulering, skal de ha samme verdi og confidence. Et standpunkt får ikke ±3 med MEDIUM eller LOW, fordi ±3 krever en eksplisitt og kategorisk formulering. Samme setning i programmet skal ikke brukes som belegg for to ulike spørsmål. Den siste regelen førte til at fem drivstoffkodinger ble satt til unknown (se §4).
4. **Endringene er sporbare.** Alle endringer står i `research/qa/changes_2026-10-14.txt` og brukes på dataene med `scripts/qa/apply-changes.py`. Den maskinlesbare loggen (før → etter) ligger i `research/qa/changes_log.tsv`.

## 2. Resultat i tall

Av de **572 standpunktene som var kodet før gjennomgangen**:

| Utfall | Antall |
|---|---:|
| Beholdt helt uendret | **466** |
| Beholdt verdi og confidence, bare side eller begrunnelse rettet | 14 |
| Verdi endret | **52** |
| – herav feil fortegn rettet | 3 |
| – herav intensitet opp / ned | 28 / 23 |
| Satt til unknown | **7** |
| Confidence opp | **18** |
| Confidence ned | **34** |
| Sidetall rettet | 33 |
| Begrunnelse omskrevet | 50 |

(En linje kan ha flere typer endring, så radene summerer ikke til 572.)

Av de **148 ukjente standpunktene**: 38 er nå kodet. 25 av dem kommer fra partiprogrammet, der vi hadde oversett noe, og 13 fra nyere offisielle kilder (se §6). 110 er beholdt som unknown.

**Andel OK i første lesning per bolk** (fra arbeidsrapportene):

| Bolk | Linjer | OK |
|---|---:|---:|
| A: Økonomi, arbeid, bolig | 126 | 106 |
| B: Helse og innvandring | 117 | 90 |
| C: Justis, rus, klima, skole | 126 | 102 |
| D: Energi og transport | 135 | 108 |
| E: Familie, verdier, distrikt | 126 | 98 |
| F: EU, forsvar og utenriks | 90 | 72 |
| **Sum** | **720** | **576 (80 %)** |

**Vurdering:** Feilraten var høyere enn forventet. Rundt hver femte linje trengte en justering, men de fleste gjaldt confidence, sidetall eller presisjon. Det systematisk viktigste funnet var **for mange falske unknowns**: programmet tok stilling, men søket hadde ikke funnet det. Søkeverktøyet viste bare de 12 første treffene per parti, så relevante avsnitt ble skjøvet ut av vanlige ord som «NATO» og «basert».

## 3. De alvorligste feilene

| Spørsmål | Parti | Feil | Rettet |
|---|---|---|---|
| `work_sickpay` | H | **Feil fortegn.** H vil beholde dagens kompensasjon («Dagens kompensasjon … inntil 6 G beholdes», s.57) og bare endre kostnadsfordelingen. | +1 LOW → −2 HIGH |
| `dist_municipal_merge` | MDG | **Feil fortegn.** MDG vil «gi insentiver til frivillige kommunesammenslåinger, men ikke bruke tvang» (s.77). | −1 → +2 MEDIUM |
| `energy_hydro` | KrF | **Feil fortegn.** KrF vil legge til rette for ny vannkraft «der dette kan forsvares ut fra naturhensyn» (s.46), samme formulering som Ap (+1). | −1 → +1 LOW |
| `fam_child_benefit_tax` | Sp | Begrunnelsen sa at Sp ikke tar stilling. Programmet sier «uten behovsprøving eller beskatning» (s.33). | U → −3 HIGH |
| `def_allied_bases` | Sp, V, MDG | Alle tre tar stilling, men var unknown. Sp: «ikke … permanent tilstedeværelse», s.48. | U → −3 / +2 / +1 |
| `for_aid` | R | Begrunnelsen sa «angir ikke et nivå». Programmet sier «minst 1 prosent av BNI», s.93. | U → +3 HIGH |
| `energy_offshore_wind` | FrP | FrP vil «fjerne alle direkte og indirekte subsidier til utbygging av vindkraft» (s.84). | −1 LOW → −3 HIGH |
| `energy_cables` | MDG | MDG vil «beholde, fornye og øke antallet mellomlandsforbindelser» (s.17). | U → −3 HIGH |
| `just_alt_sentences` | V | Et eksplisitt punkt var oversett: «Øke bruken av soning med … fotlenke» (s.46). | +1 LOW → +3 HIGH |
| `imm_level` | R | Begrunnelsen var feil parafrasert. «Ta et langt større ansvar» gjaldt flyktningleirene, ikke antallet til Norge. | Ny begrunnelse, HIGH → MEDIUM |
| `health_free_choice` | Ap | Begrunnelsen viste til et regjeringsvedtak som ikke står i kilden. Programmet vil videreføre fritt sykehusvalg, også til private med avtale. | −2 → −1 MEDIUM |
| `def_budget` | Ap | Begrunnelsen la til «uten å gå utover planen», som ikke står i kilden. | Begrunnelse rettet |
| `econ_oil_money` | R | «Omplassere deler av fondet» ble feiltolket som økt bruk. | +1 LOW → unknown |
| `eu_membership` | Ap | Begrunnelsen sa at programmet ikke tar stilling. S.169 omtaler EU-spørsmålet («rom for ulike syn … ny landsmøtebehandling»). | Verdien beholdt (−1 MEDIUM), programmet lagt til som kilde |

## 4. Endringer på grunn av dobbelttelling

Fire partier var kodet på `transport_fuel_tax` («Avgiftene på bensin og diesel bør settes ned») bare fordi de vil øke **CO₂-avgiften**: KrF (−1 LOW), V (−2 MEDIUM), og forslagene for Ap, H og R. Den samme setningen er allerede belegget for `cli_co2_tax`. Å bruke den på nytt betyr at én programsetning teller to ganger. Disse er derfor satt til **unknown**. Bare partier som omtaler bil- og drivstoffavgiftene direkte (FrP, Sp, MDG) er kodet.

## 5. Omstridte kodinger (beholdt, men flagget)

Her er det rimelig uenighet om tolkningen. Vi har valgt den mest forsiktige lesningen som kilden gir grunnlag for. Partiene bør gjerne få bekrefte disse standpunktene.

| Spørsmål | Parti | Kodet | Alternativ | Hvorfor omstridt |
|---|---|---|---|---|
| `eu_membership` | Ap | −1 MEDIUM | 0 | Ap «ikke nå», men har tidligere anbefalt ja. Påstanden gjelder å søke, og Ap vil ikke søke i perioden. |
| `for_nuclear_ban` | Ap, Sp | 0 MEDIUM | +1 / −1 | Begge sier at målet er å signere, men at det ikke er mulig nå. Kodet som dokumentert mellomposisjon. Forskjell fra `eu_membership`: der sier Ap ikke at medlemskap er et mål. |
| `energy_nuclear` | Ap, Sp | 0 MEDIUM | +1 LOW | Begge vil bare utrede. |
| `energy_cables` | Ap | +3 HIGH | +2 | Neiet gjelder «kommende stortingsperiode». |
| `energy_price_control` | Ap | +2 HIGH | +3 | Norgespris er en frivillig statlig fastpris. |
| `oil_explore` | KrF | −1 MEDIUM | −2 | Lisenser bare ved eksisterende produksjon. |
| `oil_end_date` | KrF | −1 LOW | 0 | Programmet peker i begge retninger. |
| `drug_decrim` | H | +1 MEDIUM | 0 | Avhenger av om gebyr ved manglende oppmøte regnes som straff. |
| `cli_target` | H | −1 LOW | unknown | Programmet nevner bare 2030 og ikke 2035. |
| `work_sickpay` | KrF | +1 LOW | +2 | «Følge opp Sysselsettingsutvalget» uten å nevne kompensasjonsnivå. |
| `work_activity_duty` | Sp | +1 MEDIUM | +2 | «Prøve ut» aktivitetsplikt over 30 år, og «etter hvert» for alle. |
| `just_sentences` | R | unknown | 0 LOW | Vil skjerpe noen strafferammer, men holde fast ved lave fengselsrater. |
| `agri_tariffs` | V | unknown | −1 LOW | Mindre prisstøtte, men tollvern nevnes ikke. |
| `def_budget` | Sp | +2 MEDIUM | +3 | «Minimum 3 % av BNP», men også «i tråd med Langtidsplanen». |
| `imm_labour` | R | 0 LOW | +1 | Strengere vilkår om tariff, men ny vei for asylsøkere med avslag. |

## 6. Aps ukjente standpunkter (og andre nyere offisielle kilder)

Ap hadde 30 unknowns fordi 2025–2029-programmet er generelt formulert. Vi søkte etter nyere offisielle kilder i denne rekkefølgen:

1. arbeiderpartiet.no;
2. landsmøtevedtak fra 2025;
3. Stortingets innstillinger med Aps merknader;
4. regjeringens budsjett.

Kilder fra før 2025 ble ikke brukt. regjeringen.no var utilgjengelig fra researchmiljøet (HTTP 403). Det samme gjaldt lovdata.no (HTTP 405).

**Regel for confidence:**
- Partiets egne politikksider og landsmøtevedtak gir HIGH når de svarer direkte på påstanden.
- Stortingsmerknader, regjeringsforslag og sekundærkilder gir høyst MEDIUM.

**Kodet ut fra nyere kilder (13):**

| Spørsmål | Ny koding | Kilde (kontrollert ordrett) |
|---|---|---|
| `econ_wealth_working` | −2 MEDIUM | arbeiderpartiet.no/politikken/skatt: «Beholde den omfordelende og rettferdige formuesskatten» |
| `econ_inheritance` | −3 HIGH | arbeiderpartiet.no/politikken/arveavgift: «Arveavgiften skal ikke gjeninnføres» |
| `just_police_arms` | +3 HIGH | Landsmøtevedtak 2025: «Arbeiderpartiet mener derfor at det bør innføres generell bevæpning av politiet, med en tydelig innramming» |
| `just_surveillance` | +1 MEDIUM | Innst. 368 L (2025–2026) om Prop. 59 L: skjult kameraovervåking med mobilt kamera og droner |
| `drug_cannabis` | −3 HIGH | arbeiderpartiet.no/politikken/rus: «narkotika fortsatt være forbudt i Norge» |
| `transport_ev` | −2 HIGH | arbeiderpartiet.no (budsjettavtalen 2026): «tiden er moden for å fase ut elbilfordelene i merverdiavgiftssystemet» |
| `edu_absence_limit` | +2 HIGH | arbeiderpartiet.no/politikken/fravarsregler: «Dagens fraværsgrense består» |
| `edu_national_tests` | −2 MEDIUM | Innst. 236 S (2025–2026): flertallet (A, SV, Sp, R, KrF) mener det er «på høy tid med endring» og gikk imot å beholde prøvene |
| `fam_leave_quota` | −3 HIGH | arbeiderpartiet.no/politikken/foreldrepermisjon-og-pappaperm: «beholde dagens vellykkede fedrekvote» |
| `dist_municipal_merge` | +2 MEDIUM | NTB 7.10.2026 om regjeringens forslag i statsbudsjettet for 2027: nye virkemidler for frivillige sammenslåinger (sekundærkilde) |
| `dist_county` | −3 MEDIUM | Innst. 196 S (2025–2026): «Flertallet ønsker derfor ikke å avvikle fylkeskommunen» (A, SV, Sp, R, MDG) |
| `for_israel_sanctions` | +1 MEDIUM | arbeiderpartiet.no/politikken/palestina: «innføre handelsforbud med varer som er produsert i de folkerettsstridige israelske bosetningene» |
| `edu_national_tests` (KrF) | −2 MEDIUM | Samme innstilling. KrF er med i flertallet. |

I tillegg ble `imm_labour` for Ap kodet +1 LOW ut fra programmet (s.36: godkjenningsprosessen for arbeidstillatelser skal kortes ned til tre dager).

**Beholdt som unknown, selv om det fantes noe (for svakt eller tvetydig):**
- `econ_top_tax`: en liten økning i toppskatten kom gjennom budsjettforlik med andre partier, ikke som Aps eget krav.
- `econ_property_tax`: bare implisitt, i en partiledertale.
- `imm_offshore`: regjeringen «vurderer», og kilden er bare sekundær.
- `imm_residence`: Ap mener kravene til statsborgerskap ligger «på et riktig nivå», men har skjerpet norskkravet for permanent opphold, så kildene peker i hver sin retning.
- `transport_fuel_tax`: dobbelttelling, se §4.
- `transport_toll`: Ap vil «utrede» alternativer på sikt.
- `transport_rail_vs_road`: Ap rangerer ikke mellom dem.
- `eu_energy_package`: Aps utsettelse gjaldt forrige periode.
- `eu_reservation`.
- `fam_cash_benefit`.
- `fam_child_benefit_tax`: kildene sier ikke noe om skatt.
- `imm_temporary`: gjelder bare ukrainere.
- `work_activity_duty`.
- `def_allied_bases`.
- `val_assisted_dying`, `val_surrogacy`, `val_sex_purchase`: landsmøtet 2025 sendte forslagene videre uten vedtak.

Aps antall unknowns er redusert fra 30 til 17. Ap har fortsatt lavest dekning av partiene (se FINAL_VALIDATION_REPORT.md).

Den fullstendige gjennomgangen med URL-er og sitater ligger i `research/qa/ap_ukjente.md`.

## 7. Rødt: kontroll av kilden

- **Forsøkt hentet fra Rødt:** `roedt.no/arbeidsprogram` og PDF-en `roedt.no/fil/a75af…pdf` (også via `xn--rdt-0na.no`) ga HTTP 429 eller tilbakestilt forbindelse, både med curl og WebFetch. Wayback Machine er blokkert i dette miljøet. Byte-for-byte-sammenligning mot Rødts egen fil var derfor **ikke mulig**.
- **Kontroller av speilet (Norges idrettsforbund):**
  - **Identitet:** tittelen på s.1 er «Rødts arbeidsprogram 2025–2029». S.2 sier «Dette programmet er vedtatt på Rødts landsmøte 28. februar til 2. mars 2025».
  - **Produksjon:** Adobe InDesign, laget 6. juni 2025. Det er etter landsmøtet og passer med en endelig trykkversjon. Filnavnet er «rodt-endelig-program-2025-2029».
  - **Omfang:** 106 sider. Teksten er sammenhengende og har ingen tegn til utdrag eller redigering.
  - **Sidetall:** sidetallet i bunnteksten er lik PDF-sideindeksen (s.2 = «2 RØDTS ARBEIDSPROGRAM 2025–2029», s.10, 50 og 100 er stikkprøvekontrollert). Sidehenvisningene våre er derfor de samme som de trykte sidetallene, og en lenke til Rødts egen PDF vil normalt treffe samme side.
- **Konklusjon:** det er sannsynlig at speilet er det vedtatte programmet, men det er ikke verifisert mot Rødts egen fil. Merkingen i `research/sources.json` og i RESEARCH_AUDIT.md beholdes. Dette er en **UNKNOWN** i sluttrapporten, ikke en BLOCKER.

## 8. Endringer i spørsmålstekstene (bias-review)

Alle 80 påstander ble lest fra perspektivet til en velger av hvert av de ni partiene (rapport: `research/qa/bias_steelman_review.md`). Det ble funnet **ingen systematisk skjevhet mot én blokk**. Disse endringene ble gjort:

| Spørsmål | Problem | Endring | Påvirker kodingen? |
|---|---|---|---|
| `work_sickpay` | Innebygd premiss: «for å få ned sykefraværet» forutsetter at tiltaket virker | Premisset er fjernet fra påstanden | Nei |
| `fam_child_benefit_tax` | Kan leses som to påstander (øke + skattlegge) | Ordlyden er strammet inn. Bakgrunnen sier nå eksplisitt at påstanden gjelder kombinasjonen, og at den som vil øke uten skatt, er uenig. | Nei: alle partier var kodet på kombinasjonen |
| `imm_offshore` | Faktafeil: Albania omtalt som om landet ligger utenfor Europa | Bakgrunnen er rettet: Albania ligger utenfor EU, og Rwanda-avtalen er lagt til | Nei |
| `eu_energy_package` | Utdatert: tre av rettsaktene ble innlemmet i juni 2025 | Bakgrunnen er oppdatert; spørsmålet gjelder resten av pakken | Nei (programmene ble vedtatt før juni 2025) |
| `energy_cables` | Bakgrunnen gjenga en omstridt påstand uten motvekt | Bakgrunnen beskriver nå uenigheten | Nei |
| `econ_wealth_working`, `work_min_benefits`, `imm_quota`, `imm_residence`, `imm_temporary` | Manglende kontekst eller upresist ordvalg | Bakgrunnen er presisert (verdsettingsrabatt, «lavinntektsgrense», hvordan kvoten fastsettes, krav om selvforsørgelse, midlertidig tillatelse i dag) | Nei |
| Steelman: `imm_amnesty`, `val_assisted_dying`, `val_sex_purchase`, `def_nato_exit`, `for_israel_sanctions` | Emosjonelt språk på én side («inhumant»), overdrivelse («mange»), omstridt effekt framstilt som fakta, svakere side eller manglende hovedargument | Argumentene er omskrevet eller supplert | Nei |

## 9. Fullstendig endringslogg

Generert fra `research/qa/changes_log.tsv`. «Før» og «etter» er verdi, confidence og kildehenvisning.

| Spørsmål | Parti | Før (verdi conf side) | Etter | Type | Merknad |
|---|---|---|---|---|---|
| `econ_tax_level` | V | 2 HIGH 42 | 3 HIGH 42 | Verdi | Ordrett samme påstand («redusere det samlede skatte- og avgiftstrykket»), kategorisk. |
| `econ_wealth_working` | SV | -3 HIGH 4 | -3 MEDIUM 4 | Conf ↓ | Programmet sier «økt skatt på større formuer», nevner ikke arbeidende kapital spesifikt. |
| `econ_top_tax` | KrF | 2 HIGH 50 | 3 HIGH 50 | Verdi | «øke bruttobeskatningen av de høyeste inntektene» er like eksplisitt som SV/R/MDG (3). |
| `econ_property_tax` | Sp | 0 LOW 109 | 1 LOW 109 | Verdi | Tidligere 0: begrunnelsen blandet statlig og kommunal eiendomsskatt. |
| `econ_oil_money` | FrP | 1 MEDIUM 41-42 | 1 LOW 42-43 | Conf ↓, Side | Programmet nevner ikke handlingsregelen; slutning fra at handlingsrommet skal brukes til investeringer og et infrastrukturfond. |
| `econ_oil_money` | R | 1 LOW 7 | U - - | Til unknown | Omplassering ≠ økt bruk. |
| `econ_oil_money` | V | -2 MEDIUM 43 | -3 HIGH 43 | Verdi, Conf ↑ | Konkret innstramming. |
| `econ_state_owner` | V | 2 MEDIUM 43 | 2 HIGH 43 | Conf ↑ | Eksplisitt kulepunkt s.43. |
| `welfare_commercial` | Ap | -1 LOW 50,53,70 | -1 LOW 50,70,95 | Side | s.95 (offentlig og ideelt barnevern) er relevant; s.53 gjaldt privatskoler. |
| `work_sickpay` | H | 1 LOW 57-58 | -2 HIGH 57 | Fortegn rettet, Conf ↑, Side | FEIL FORTEGN rettet (var +1 LOW). |
| `work_temp_agency` | KrF | U - - | -2 MEDIUM 49 | Fra unknown | Fra U. |
| `work_temp_agency` | MDG | U - - | 1 LOW 22-23 | Fra unknown | Fra U; blandet → LOW. |
| `work_min_benefits` | Ap | 1 MEDIUM 25 | 1 LOW 25 | Conf ↓ | Programmet sier at minstenivåene skal følge utviklingen – regulering, ikke økning. |
| `work_min_benefits` | V | 1 MEDIUM 24 | 2 MEDIUM 24 | Verdi |  |
| `work_min_benefits` | MDG | 2 MEDIUM 21 | 3 HIGH 21,25 | Verdi, Conf ↑, Side |  |
| `housing_nonprofit` | Ap | 2 HIGH 29 | 2 MEDIUM 29 | Conf ↓ | Begrunnelsen utelot næringsliv. |
| `housing_nonprofit` | V | -1 MEDIUM 25 | -1 LOW 25 | Conf ↓ | Prioritering av det ordinære markedet, ikke avvisning. |
| `housing_nonprofit` | MDG | 3 HIGH 24 | 2 HIGH 24 | Verdi | «Legge til rette» ≠ statlig finansiering av mange flere. |
| `health_free_choice` | Ap | -2 MEDIUM 70 | -1 MEDIUM 70 | Verdi | Var -2; påstand om regjeringsvedtak hentet utenfor kilden er fjernet. |
| `health_free_choice` | FrP | 3 MEDIUM 59 | 3 HIGH 59-60 | Conf ↑, Side | Eksplisitt: tjenestene finansieres av det offentlige uansett utfører. |
| `health_free_choice` | SV | -3 HIGH 15,17 | -3 MEDIUM 15,17 | Conf ↓ | Retningen er klar, men fritt behandlingsvalg nevnes ikke. |
| `health_free_choice` | R | -3 MEDIUM 16 | -3 HIGH 13-14 | Conf ↑, Side | Riktig side (s.16 gjaldt helseforsikring). |
| `health_trusts` | FrP | 2 MEDIUM 59 | 1 MEDIUM 59 | Verdi | Bare første del av påstanden oppfylt. |
| `imm_level` | Sp | 1 MEDIUM 63-64 | 1 MEDIUM 63-64 | Begrunnelse | Parafrase rettet. |
| `imm_level` | R | -3 HIGH 95 | -3 MEDIUM 95 | Conf ↓ | Feil parafrase rettet («større ansvar» gjaldt flyktningleirene). |
| `imm_level` | MDG | -2 MEDIUM 103 | -2 MEDIUM 103-104 | Side | Grunnlovsfesting av asylretten står på s.104. |
| `imm_quota` | R | 3 HIGH 95 | 3 MEDIUM 95 | Conf ↓ | Kildene gjelder å styrke kvoteordningen, ikke kvotetallet direkte. |
| `imm_offshore` | H | 2 MEDIUM 76-77 | 1 MEDIUM 76-77 | Verdi | Bare beslektet tiltak. |
| `imm_family` | H | 3 HIGH 76 | 3 HIGH 76 | Begrunnelse | «vurdere» var gjengitt som vedtatt krav. |
| `imm_family` | Sp | 2 HIGH 65 | 3 HIGH 65 | Verdi | Samme eksplisitte formulering som Høyre («Stramme inn vilkårene for familieinnvandring»). |
| `imm_family` | R | U - - | -2 MEDIUM 69 | Fra unknown | Fra U. |
| `imm_family` | V | U - 48 | -1 LOW 27,48 | Fra unknown | Fra U. |
| `imm_residence` | V | U - - | -1 LOW 27 | Fra unknown | Fra U; smal gruppe → LOW. |
| `imm_residence` | KrF | -2 MEDIUM 36 | -2 MEDIUM 36,38 | Side |  |
| `imm_labour` | Ap | U - 112 | 1 LOW 36 | Fra unknown | Fra U; raskere behandling, ikke lempeligere vilkår → LOW. |
| `imm_labour` | R | 1 LOW 96 | 0 LOW 11,96 | Verdi, Side | Var +1. |
| `imm_labour` | MDG | U - - | 2 MEDIUM 23 | Fra unknown | Fra U. |
| `imm_amnesty` | H | -2 HIGH 76-77 | -2 MEDIUM 76-77 | Conf ↓ | Svarer ikke direkte på lengeværende. |
| `imm_amnesty` | Sp | -2 HIGH 64 | -2 MEDIUM 64 | Conf ↓ | Også «gjennomgå situasjonen for ureturnerbare». |
| `imm_amnesty` | R | 2 MEDIUM 96 | 3 HIGH 96,98 | Verdi, Conf ↑, Side |  |
| `imm_amnesty` | KrF | 1 LOW 36-37 | 1 LOW 36-38 | Side |  |
| `imm_temporary` | R | -2 MEDIUM 96 | -1 LOW 96 | Verdi, Conf ↓ | «Begrensede» tillatelser er en egen kategori, ikke midlertidig beskyttelse. |
| `imm_temporary` | KrF | -1 LOW 37 | -1 LOW 36-37 | Side |  |
| `imm_integration_req` | Ap | 2 MEDIUM 111 | 1 MEDIUM 111 | Verdi | Bare «vurdere», bare familieinnvandrere. |
| `imm_integration_req` | V | 1 LOW 26 | U - - | Til unknown | Kilden svarte ikke på påstanden. |
| `just_sentences` | Sp | 1 LOW 83,88 | 1 LOW 83,85,88 | Side |  |
| `just_surveillance` | FrP | 1 MEDIUM 33-34 | 2 MEDIUM 33-34 | Verdi | Påstanden gjelder alvorlig kriminalitet. |
| `just_surveillance` | V | -2 MEDIUM 47 | -2 MEDIUM 45,61 | Side | Riktig side. |
| `just_surveillance` | KrF | -1 MEDIUM 39 | -1 LOW 39,85 | Conf ↓, Side | Forbudet gjelder kommersiell bruk, ikke politiet. |
| `just_alt_sentences` | R | U - - | 2 HIGH 97-98 | Fra unknown | Fra U. |
| `just_alt_sentences` | V | 1 LOW 46 | 3 HIGH 46 | Verdi, Conf ↑ | Eksplisitt punkt var oversett. |
| `drug_alcohol` | FrP | 3 MEDIUM 56 | 3 HIGH 56-57 | Conf ↑, Side |  |
| `drug_alcohol` | V | 3 HIGH 32-33 | 2 HIGH 32-33 | Verdi | Konteksten demper. |
| `drug_alcohol` | MDG | -1 MEDIUM 41 | -2 MEDIUM 41 | Verdi | Vil beholde Vinmonopolet og en restriktiv omsetningspolitikk – samme kombinasjon som Ap (-2). |
| `cli_target` | FrP | -3 HIGH 92-93 | -3 MEDIUM 92-93 | Conf ↓ | Sterk retning, men ikke direkte om 2035-målet. |
| `cli_target` | V | 1 MEDIUM 6 | 1 LOW 6 | Conf ↓ | Bare 2030/2050-tall; 2035 er slutning. |
| `cli_target` | KrF | 2 HIGH 41 | 3 HIGH 41 | Verdi | «minst 80 prosent innen 2035» er like eksplisitt som SV/MDG. |
| `cli_domestic` | Ap | -1 MEDIUM 121 | 0 MEDIUM 121 | Verdi | Begrunnelsen utelot halve setningen. |
| `cli_domestic` | V | 3 HIGH 6 | 2 HIGH 6 | Verdi | Mindre kategorisk enn SV/R. |
| `cli_co2_tax` | R | 1 MEDIUM 39 | 1 LOW 39 | Conf ↓ | Sier «gradvis», ikke raskere enn planen. |
| `cli_co2_tax` | KrF | 1 MEDIUM 41 | 1 LOW 41 | Conf ↓ | Sier «gradvis økning», ikke raskere enn planen. |
| `nature_protect` | Sp | -1 MEDIUM 24 | -2 MEDIUM 19,24,78 | Verdi, Side |  |
| `edu_private_schools` | SV | U - 26 | -2 MEDIUM 27 | Fra unknown | Fra U. |
| `edu_absence_limit` | FrP | 3 HIGH 69 | 3 MEDIUM 69 | Conf ↓ | Sier «innføre fraværsgrense på ungdomsskolen», ikke eksplisitt «beholde» i vgs. |
| `edu_national_tests` | SV | U - - | -1 LOW 26 | Fra unknown | Fra U. |
| `edu_national_tests` | R | -2 MEDIUM 26 | -3 HIGH 26,28 | Verdi, Conf ↑, Side |  |
| `oil_end_date` | H | -3 MEDIUM 40 | -2 MEDIUM 40 | Verdi | H sier ikke «ikke avvikle»; tydelig retning. |
| `oil_end_date` | FrP | -3 HIGH 80 | -3 MEDIUM 80 | Conf ↓ | Sluttdato nevnes ikke direkte. |
| `oil_end_date` | Sp | -3 HIGH 105 | -3 MEDIUM 105 | Conf ↓ | Samme formulering som Ap (MEDIUM). |
| `oil_lofoten` | Ap | 2 HIGH 119 | 2 MEDIUM 119 | Conf ↓ | Gjelder perioden, ikke permanent vern. |
| `energy_nuclear` | MDG | 1 MEDIUM 17 | 2 MEDIUM 17 | Verdi |  |
| `energy_onshore_wind` | Sp | -1 LOW 44 | 0 MEDIUM 43-44 | Verdi, Conf ↑, Side | Mellomposisjon, ikke nei. |
| `energy_onshore_wind` | SV | -3 HIGH 34 | -2 HIGH 34 | Verdi |  |
| `energy_onshore_wind` | MDG | -1 MEDIUM 5,17 | 0 MEDIUM 5,16 | Verdi, Side | Mellomposisjon, ikke nei. |
| `energy_offshore_wind` | FrP | -1 LOW 84,92 | -3 HIGH 84 | Verdi, Conf ↑, Side | Eksplisitt. |
| `energy_offshore_wind` | SV | 1 MEDIUM 34 | 1 LOW 34 | Conf ↓ | SV vil at oljeselskapene finansierer havvind. |
| `energy_offshore_wind` | R | -1 LOW 58-59 | U - - | Til unknown | Sitatene svarte ikke på påstanden. |
| `energy_hydro` | H | 1 LOW 40 | 2 MEDIUM 41 | Verdi, Conf ↑, Side | Begrunnelsen «nevner ikke vernede vassdrag» var feil. |
| `energy_hydro` | FrP | 3 HIGH 81 | 3 HIGH 82 | Side | Riktig side. |
| `energy_hydro` | KrF | -1 LOW 46 | 1 LOW 46 | Fortegn rettet | Var -1; samme formulering som Ap (+1 LOW). |
| `energy_cables` | FrP | 3 HIGH 85-86 | 2 MEDIUM 85 | Verdi, Conf ↓, Side | Betinget nei. |
| `energy_cables` | MDG | U - - | -3 HIGH 17 | Fra unknown | Fra U. |
| `energy_price_control` | MDG | -1 MEDIUM 6,15 | 0 MEDIUM 6,15,17 | Verdi, Side | Var -1. |
| `transport_rail_vs_road` | KrF | U - - | -1 LOW 63 | Fra unknown | Fra U; samme grunnlag som Sp. |
| `transport_fuel_tax` | KrF | -1 LOW 50 | U - - | Til unknown | Var -1 LOW. Eneste belegg var CO₂-avgiften, som allerede teller i cli_co2_tax – å bruke samme setning to ganger er dobbelttelling. |
| `transport_fuel_tax` | Ap | U - 12 | U - 12,121 | Unknown beholdt (ny begrunnelse/side) | Beholdt U: eneste belegg ville vært CO₂-avgiften (dobbelttelling med cli_co2_tax). |
| `transport_fuel_tax` | V | -2 MEDIUM 42 | U - 42 | Til unknown | Var -2 MEDIUM. «noe som øker drivstoffkostnadene» var vår slutning; samme belegg teller allerede i cli_co2_tax (dobbelttelling). |
| `fam_leave_quota` | Sp | -2 HIGH 33 | -3 HIGH 33 | Verdi | «Minst opprettholde mødre-/fedrekvote på 15 uker» – eksplisitt. |
| `fam_leave_quota` | R | -2 MEDIUM 35 | -3 HIGH 35 | Verdi, Conf ↑ | Eksplisitte øremerkede kvoter. |
| `fam_leave_quota` | MDG | -2 HIGH 26 | -3 HIGH 26 | Verdi | «Bevare … foreldrekvoter på 15 uker hver». |
| `fam_child_benefit_tax` | FrP | -1 MEDIUM 115-116 | -1 LOW 115-116 | Conf ↓ | Skatt og økning nevnes ikke. |
| `fam_child_benefit_tax` | Sp | U - 33 | -3 HIGH 33 | Fra unknown | Fra U; begrunnelsen var feil. |
| `fam_abortion` | SV | -3 HIGH 19 | -3 MEDIUM 19 | Conf ↓ | Uke-grensen nevnes ikke. |
| `fam_abortion` | MDG | -3 HIGH 62 | -3 MEDIUM 62 | Conf ↓ | Uke-grensen nevnes ikke. |
| `val_sunday` | Sp | -3 HIGH 100 | -2 HIGH 100 | Verdi | Harmonisert med Ap (samme formulering). |
| `val_sunday` | V | 3 HIGH 52 | 3 MEDIUM 52 | Conf ↓ | Full liberalisering, ikke kommunalt valg. |
| `val_sunday` | KrF | -3 MEDIUM 56 | -2 MEDIUM 56 | Verdi | Butikker nevnes ikke; -3 MEDIUM bryter konvensjonen. |
| `econ_nrk` | Ap | -2 HIGH 141 | -2 MEDIUM 141 | Conf ↓ | Finansieringsnivå nevnes ikke. |
| `econ_nrk` | H | 1 MEDIUM 72 | 1 LOW 72 | Conf ↓ | Sier ikke at NRK skal få mindre. |
| `econ_nrk` | Sp | -2 HIGH 92-93 | -2 MEDIUM 92-93 | Conf ↓ | Finansieringsnivå nevnes ikke. |
| `econ_nrk` | KrF | -2 HIGH 85 | -2 MEDIUM 85 | Conf ↓ | Finansieringsnivå nevnes ikke. |
| `dist_municipal_merge` | R | -2 MEDIUM 73 | -2 LOW 73 | Conf ↓ | Kritiserer tvang; insentiver nevnes ikke. |
| `dist_municipal_merge` | KrF | U - - | 2 HIGH 54 | Fra unknown | Fra U. |
| `dist_municipal_merge` | MDG | -1 MEDIUM 75 | 2 MEDIUM 77 | Fortegn rettet, Side | FEIL FORTEGN rettet (var -1). |
| `dist_county` | R | U - - | -3 HIGH 76 | Fra unknown | Fra U. |
| `dist_county` | V | 1 LOW 59 | U - - | Til unknown | Kilden angir ingen retning. |
| `dist_county` | KrF | U - - | -3 HIGH 54 | Fra unknown | Fra U. |
| `agri_tariffs` | FrP | -3 HIGH 42,51 | -3 HIGH 42,44,51 | Side |  |
| `agri_tariffs` | SV | 1 LOW 46 | 2 MEDIUM 38,46 | Verdi, Conf ↑, Side |  |
| `agri_income` | H | U - 39 | -2 MEDIUM 39 | Fra unknown | Fra U. |
| `agri_income` | FrP | -2 MEDIUM 50-51 | -3 HIGH 50-51 | Verdi, Conf ↑ |  |
| `agri_income` | R | 2 MEDIUM 65-66 | 3 HIGH 66 | Verdi, Conf ↑, Side |  |
| `agri_income` | KrF | 2 HIGH 71 | 3 HIGH 71 | Verdi | Samme formulering som Sp («tette inntektsgapet … innen 2027»). |
| `agri_predators` | FrP | -3 HIGH 51 | -2 MEDIUM 51 | Verdi, Conf ↓ | Reduksjon sies ikke eksplisitt. |
| `eu_membership` | Ap | -1 MEDIUM src:altinget_ap_eu_2025 | -1 MEDIUM 169;src:altinget_ap_eu_2025 | Side | Begrunnelsen sa feilaktig at programmet ikke tar stilling. |
| `eu_reservation` | KrF | -1 LOW 76 | U - - | Til unknown |  |
| `def_budget` | Ap | 0 MEDIUM 176 | 0 MEDIUM 176 | Begrunnelse | «uten å gå utover planen» stod ikke i kilden. |
| `def_budget` | FrP | 3 HIGH 17 | 3 HIGH 19-20 | Side | Riktig side. |
| `def_budget` | Sp | 3 HIGH 48 | 2 MEDIUM 43,48 | Verdi, Conf ↓, Side | Mindre kategorisk enn KrF. |
| `def_budget` | R | -1 LOW 88 | 0 LOW 87-88 | Verdi, Side | Var -1. |
| `def_budget` | V | 0 MEDIUM 66 | 1 LOW 66 | Verdi, Conf ↓ |  |
| `def_allied_bases` | Sp | U - 46 | -3 HIGH 48 | Fra unknown | Fra U. |
| `def_allied_bases` | V | U - - | 2 MEDIUM 66 | Fra unknown | Fra U. |
| `def_allied_bases` | MDG | U - - | 1 MEDIUM 105 | Fra unknown | Fra U. |
| `def_ukraine` | MDG | U - 105 | 2 MEDIUM 110 | Fra unknown | Fra U. |
| `for_aid` | R | U - - | 3 HIGH 93 | Fra unknown | Fra U; begrunnelsen var feil. |
| `for_nuclear_ban` | Ap | 1 MEDIUM 171 | 0 MEDIUM 171 | Verdi | Dokumentert mellomposisjon. |
| `for_nuclear_ban` | Sp | U - - | 0 MEDIUM 134 | Fra unknown | Fra U. |
| `for_nuclear_ban` | R | 2 MEDIUM 86 | 3 HIGH 86 | Verdi, Conf ↑ |  |
| `for_nuclear_ban` | V | U - - | -1 LOW 65 | Fra unknown | Fra U. |
| `for_israel_sanctions` | SV | 3 HIGH 45 | 2 HIGH 45 | Verdi | Målrettet mot okkupasjonsøkonomien. |
| `for_israel_sanctions` | V | U - 65 | 1 LOW 64-65 | Fra unknown | Fra U. |
| `econ_wealth_working` | Ap | U - 12-13 | -2 MEDIUM src:ap_web_skatt | Fra unknown | Fra U. |
| `econ_inheritance` | Ap | U - - | -3 HIGH src:ap_web_arveavgift | Fra unknown | Fra U. |
| `just_police_arms` | Ap | U - - | 3 HIGH src:ap_lm2025_bevapning | Fra unknown | Fra U. |
| `just_surveillance` | Ap | U - 145 | 1 MEDIUM src:sting_innst_368l_2526 | Fra unknown | Fra U; ett tiltak → +1. |
| `drug_cannabis` | Ap | U - - | -3 HIGH src:ap_web_rus | Fra unknown | Fra U. |
| `transport_ev` | Ap | U - - | -2 HIGH src:ap_budsjettavtale_2026 | Fra unknown | Fra U. |
| `edu_absence_limit` | Ap | U - - | 2 HIGH src:ap_web_fravar | Fra unknown | Fra U. |
| `edu_national_tests` | Ap | U - 53 | -2 MEDIUM src:sting_innst_236s_2526 | Fra unknown | Fra U. |
| `edu_national_tests` | KrF | U - - | -2 MEDIUM src:sting_innst_236s_2526 | Fra unknown | Fra U (samme kilde som Ap). |
| `fam_leave_quota` | Ap | U - - | -3 HIGH src:ap_web_foreldrepermisjon | Fra unknown | Fra U. |
| `dist_municipal_merge` | Ap | U - - | 2 MEDIUM src:ntb_kommunesammenslaing_2027 | Fra unknown | Fra U; sekundærkilde. |
| `dist_county` | Ap | U - - | -3 MEDIUM src:sting_innst_196s_2526 | Fra unknown | Fra U. |
| `for_israel_sanctions` | Ap | U - - | 1 MEDIUM src:ap_web_palestina | Fra unknown | Fra U. |
