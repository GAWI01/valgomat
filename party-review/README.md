# Partigjennomgang – rutine og følgebrev

Mappen inneholder én pakke per parti, generert fra dataene med `node scripts/party-review.mjs`:

- `<parti>.md`: alle 80 standpunkter med kodet verdi, sikkerhet, begrunnelse og lenke til kilden (med sidetall);
- `<parti>.csv`: samme innhold som regneark, med tomme kolonner der partiet kan foreslå endringer og oppgi kilde. Fila åpnes direkte i Excel og Numbers (UTF-8 med BOM).

Partikodene i filnavnene er Ap, H, FrP, Sp, SV, R (Rødt), V (Venstre), KrF og MDG.

## Rutine

1. **Send** pakken til hvert parti samtidig og med samme frist, f.eks. tre uker. Bruk partienes offisielle kontaktpunkt (sentralt partikontor eller stortingsgruppens sekretariat). Send ikke til enkeltpolitikere alene. Samme tekst til alle.
2. **Registrer** hver tilbakemelding som en linje i `research/qa/partisvar.txt`. Format: `dato|parti|qid|partiets forslag|kilde partiet oppga|vår vurdering`.
3. **Vurder** hver tilbakemelding etter samme kildehierarki som resten av valgomaten (RESEARCH_PLAN.md §2):
   - Endre bare når partiet viser til en vedtatt, datert kilde som svarer direkte på påstanden.
   - Et standpunkt som bare finnes i en e-post fra partiet, gir **ikke** en koding. Det blir stående som det er, og dialogen logges.
4. **Gjennomfør** godkjente endringer som nye linjer i en endringsliste (`research/qa/changes_<dato>.txt`). Merk dem «etter tilbakemelding fra partiet». Kjør så `scripts/qa/reapply.sh`, testene og `npm run audit`.
5. **Likebehandling:** et parti som ikke svarer, beholder kodingen sin. Ingen parti får se andre partiers svar før alle er ferdigbehandlet.
6. **Spørsmålsformulering** endres ikke på oppfordring fra ett parti. Innspill om skjeve spørsmål vurderes samlet etter fristen, og en endring krever ny koding for alle ni partier.

## Utkast til følgebrev

> **Emne:** Valgomat 2027 – kontroll av hvordan [PARTI] er kodet (svarfrist [DATO])
>
> Hei,
>
> Vi utvikler *Valgomat 2027*, en uavhengig og åpen valgomat som sammenligner velgernes svar med de ni stortingspartienes vedtatte programmer for 2025–2029. Hvert standpunkt er knyttet til en kilde, i hovedsak partiprogrammet med sidetall, og er merket med hvor sikker kodingen er. Metode og kildekode er åpne.
>
> Før valgomaten publiseres, gir vi alle partiene samme mulighet til å kontrollere sine egne standpunkter. Vedlagt finner dere:
>
> - en oversikt over alle 80 påstander med vår koding av [PARTI], begrunnelse og kilde;
> - et regneark der dere kan foreslå endringer.
>
> Vi endrer et standpunkt når endringen kan dokumenteres i en vedtatt kilde: partiprogrammet, et landsmøte- eller landsstyrevedtak, partiets publiserte politikksider, eller partiets egne forslag og merknader i Stortinget. For spørsmål der vi ikke har funnet et standpunkt, tar vi gjerne imot en henvisning til en slik kilde. Alle endringer som følge av tilbakemeldinger blir logget offentlig. Ordlyden i spørsmålene er lik for alle partier og endres ikke etter innspill fra enkeltpartier.
>
> Vi ber om svar innen [DATO]. Alle partiene får den samme henvendelsen samtidig.
>
> Spørsmål kan rettes til [NAVN, E-POST].
>
> Med vennlig hilsen
> [NAVN]
> [Valgomat 2027]
