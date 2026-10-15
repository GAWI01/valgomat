import { useState } from 'react';
import type { Answers } from '../lib/types';
import { data, formatDate, orderedQuestions, questionsByTheme, valueLabel } from '../lib/data';
import { href, navigate } from '../lib/router';
import { BASELINE_DRAWS, BOOTSTRAP_DRAWS, MODEST_FIT_MARGIN, CONFIDENCE_WEIGHT, IMPORTANCE_WEIGHT, MIN_ANSWERS_FOR_RESULT, MIN_ANSWERS_PER_DIMENSION } from '../lib/scoring';
import { CLOSE_PAIR_GAP, DEALBREAKER_DISTANCE, LOW_COVERAGE } from '../lib/insights';
import { PageTitle, PartySwatch, Stars } from '../components/ui';
import { firstUnanswered } from './ResultsPage';

const lastUpdated = formatDate(data.meta.lastUpdated);

export function HomePage({ answers, onReset }: { answers: Answers; onReset: () => void }) {
  const touched = Object.keys(answers).length;
  const total = orderedQuestions.length;
  const known = data.positions.filter((p) => p.position !== null).length;
  return (
    <div className="mx-auto max-w-3xl">
      <div className="animate-rise">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-700 dark:text-brand-200">Uavhengig · kildebasert · åpen metode</p>
        <h1 className="mt-2 text-4xl font-extrabold leading-tight sm:text-5xl sm:leading-none">Hvilke partier står nærmest deg – og hvorfor?</h1>
        <p className="mt-4 max-w-prose text-lg leading-relaxed">
          Valgomat 2027 sammenligner dine svar på {total} politiske spørsmål med de ni største partienes <strong>vedtatte programmer</strong>. Hvert
          partistandpunkt er knyttet til en kilde og merket med hvor sikker kodingen er. Du ser ikke bare hvem du matcher, men <em>hvorfor</em>.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {touched === 0 ? (
            <a className="btn-primary px-6 text-lg" href={href({ name: 'quiz', index: 0 })}>
              Start testen <span aria-hidden="true">→</span>
            </a>
          ) : (
            <>
              <a className="btn-primary px-6 text-lg" href={href({ name: 'quiz', index: firstUnanswered(answers) })}>
                Fortsett ({touched}/{total}) <span aria-hidden="true">→</span>
              </a>
              <a className="btn-outline" href={href({ name: 'results' })}>
                Se resultat
              </a>
              <ResetButton onReset={onReset} />
            </>
          )}
        </div>
        <p className="muted mt-3 text-sm">Tar rundt 15–20 minutter. Du kan hoppe over spørsmål, gå tilbake og fortsette senere – svarene lagres bare i din nettleser.</p>
      </div>

      <div className="mt-10 grid gap-3 sm:grid-cols-3">
        <Feature title="Kildebelagt" text={`${known} kodede partistandpunkter, hvert med sidehenvisning til partiets eget program.`} />
        <Feature title="Ærlig om usikkerhet" text="Ukjente standpunkter teller ikke. Nære resultater blir presentert som nære, ikke som en vinner." />
        <Feature title="Åpen metode" text="Hele beregningen er dokumentert, og du kan se hvilke svar som trakk resultatet i hvilken retning." />
      </div>

      <div className="card mt-8 p-5">
        <h2 className="font-bold">Partiene som er med</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {data.parties.map((p) => (
            <li key={p.id} className="flex items-center gap-2 rounded-lg bg-sand-100 px-2 py-1 text-sm dark:bg-white/5">
              <PartySwatch id={p.id} size="sm" /> {p.name}
            </li>
          ))}
        </ul>
        <p className="muted mt-4 text-sm">
          Standpunktene bygger på programmene for stortingsperioden 2025–2029, som er de nyeste vedtatte programmene. Sist oppdatert: <strong>{lastUpdated}</strong>.
          Programmer for valget i 2029 er ennå ikke vedtatt. <a href={href({ name: 'sources' })}>Om kildene</a>
        </p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <a className="card block p-4 no-underline hover:border-brand-400" href={href({ name: 'method' })}>
          <span className="font-semibold text-ink dark:text-slate-100">Hvordan beregnes resultatet?</span>
          <span className="muted mt-1 block text-sm">Avstand, vekting, temanormalisering og usikkerhet forklart.</span>
        </a>
        <a className="card block p-4 no-underline hover:border-brand-400" href={href({ name: 'why' })}>
          <span className="font-semibold text-ink dark:text-slate-100">Hvorfor får jeg et annet resultat enn i andre valgomater?</span>
          <span className="muted mt-1 block text-sm">Ulike valgomater gjør ulike valg. Her er de viktigste.</span>
        </a>
      </div>
    </div>
  );
}

function Feature({ title, text }: { title: string; text: string }) {
  return (
    <div className="card p-4">
      <h2 className="font-bold">{title}</h2>
      <p className="muted mt-1 text-sm leading-relaxed">{text}</p>
    </div>
  );
}

export function ResetButton({ onReset }: { onReset: () => void }) {
  const [confirm, setConfirm] = useState(false);
  if (!confirm)
    return (
      <button type="button" className="btn-ghost" onClick={() => setConfirm(true)}>
        Start på nytt
      </button>
    );
  return (
    <div role="alertdialog" aria-labelledby="reset-q" className="flex flex-wrap items-center gap-2 rounded-xl border border-rose-300 bg-rose-50 p-2 dark:border-rose-500/40 dark:bg-rose-500/10">
      <span id="reset-q" className="px-1 text-sm font-semibold">
        Slette alle svar?
      </span>
      <button
        type="button"
        className="btn bg-rose-600 text-white hover:bg-rose-700"
        onClick={() => {
          onReset();
          setConfirm(false);
          navigate({ name: 'home' });
        }}
      >
        Ja, slett
      </button>
      <button type="button" className="btn-outline" onClick={() => setConfirm(false)} autoFocus>
        Avbryt
      </button>
    </div>
  );
}

export function OverviewPage({ answers, onReset }: { answers: Answers; onReset: () => void }) {
  const answered = Object.values(answers).filter((a) => a.value !== null).length;
  return (
    <div className="mx-auto max-w-3xl">
      <PageTitle kicker="Oversikt">Alle spørsmål</PageTitle>
      <p className="muted -mt-3 mb-4">
        {Object.keys(answers).length} av {orderedQuestions.length} spørsmål har svar ({answered} med standpunkt). Trykk på et spørsmål for å svare eller endre.
      </p>
      <div className="mb-6 flex flex-wrap gap-2">
        <a className="btn-primary" href={href({ name: 'results' })}>
          Se resultat
        </a>
        <ResetButton onReset={onReset} />
      </div>
      {questionsByTheme.map((g) => (
        <section key={g.theme.id} className="mb-6">
          <h2 className="mb-2 text-lg font-bold">{g.theme.label}</h2>
          <ol className="card divide-y divide-sand-200 dark:divide-white/10">
            {g.questions.map((q) => {
              const idx = orderedQuestions.indexOf(q);
              const a = answers[q.id];
              return (
                <li key={q.id}>
                  <a href={href({ name: 'quiz', index: idx })} className="flex items-start gap-3 p-3 text-ink no-underline hover:bg-sand-100 dark:text-slate-100 dark:hover:bg-white/5">
                    <span className="muted w-7 shrink-0 pt-0.5 text-right text-sm tabular-nums">{idx + 1}.</span>
                    <span className="flex-1">
                      {q.text} <Stars n={a?.importance ?? 0} />
                      <span className={`mt-0.5 block text-xs ${a ? 'text-brand-700 dark:text-brand-200' : 'muted'}`}>
                        {a === undefined ? 'Ikke besvart' : a.value === null ? 'Vet ikke' : valueLabel(a.value)}
                      </span>
                    </span>
                  </a>
                </li>
              );
            })}
          </ol>
        </section>
      ))}
    </div>
  );
}

export function MethodPage() {
  const nQ = data.questions.length;
  return (
    <article className="prose-v mx-auto max-w-3xl">
      <PageTitle kicker="Metode">Hvordan beregnes resultatet?</PageTitle>
      <p>
        Valgomaten sammenligner dine svar med partienes kodede standpunkter på de samme {nQ} påstandene. Her er hele metoden, slik den er implementert i koden (
        <code>src/lib/scoring.ts</code>). Målet er at du skal kunne forstå – og være uenig i – hvert valg vi har tatt.
      </p>

      <h2>1. Svar og partistandpunkter på samme skala</h2>
      <p>
        Du svarer på en sjudelt skala fra «helt uenig» (−3) til «helt enig» (+3). Partiene er kodet på samme skala ut fra sine vedtatte programmer. Et parti som
        ikke tar stilling i programmet, er kodet som <strong>ukjent</strong> – ikke som nøytralt (0). Null brukes bare når partiet faktisk har en mellomposisjon.
      </p>

      <h2>2. Enighet per spørsmål</h2>
      <p>
        For hvert spørsmål beregnes enigheten som <code>1 − |ditt svar − partiets standpunkt| / 6</code>. Helt likt gir 100 %, «helt enig» mot «helt uenig» gir
        0 %, og ett steg fra hverandre gir 83 %. Vi bruker lineær avstand fordi den er lett å forstå og ikke straffer store avvik uforholdsmessig.
      </p>

      <h2>3. Vekting</h2>
      <ul>
        <li>
          <strong>Viktighet:</strong> ★ gir vekt {IMPORTANCE_WEIGHT[1]}, ★★ gir vekt {IMPORTANCE_WEIGHT[2]}, ellers {IMPORTANCE_WEIGHT[0]}. Vektingen er bevisst
          moderat slik at én sak ikke kan avgjøre hele resultatet alene.
        </li>
        <li>
          <strong>Sikkerhet i kodingen:</strong> standpunkter med høy sikkerhet teller {CONFIDENCE_WEIGHT.HIGH}, middels {CONFIDENCE_WEIGHT.MEDIUM} og lav{' '}
          {CONFIDENCE_WEIGHT.LOW}. Usikre kodinger påvirker altså mindre.
        </li>
        <li>
          <strong>Mot dobbelttelling:</strong> sterkt beslektede spørsmål (for eksempel bompenger, drivstoffavgift og elbilfordeler) er gruppert i en{' '}
          <em>klynge</em>. Hvis du svarer på <em>k</em> spørsmål i samme klynge, får hvert av dem vekt <code>1/√k</code>. Tre spørsmål om bilkostnader teller
          dermed som om lag 1,7 spørsmål, ikke 3.
        </li>
        <li>
          <strong>Temanormalisering:</strong> hvert tema får en samlet innflytelse proporsjonal med kvadratroten av hvor mange (klyngejusterte) spørsmål du har
          svart på i temaet. Et tema med ni spørsmål får derfor tre ganger så stor vekt som et tema med ett spørsmål – ikke ni ganger. Slik dominerer ikke
          temaer bare fordi de har mange spørsmål, samtidig som flere svar gir et mer nyansert bilde.
        </li>
      </ul>

      <h2>4. Matchscore</h2>
      <p>
        Partiets matchscore er det vektede gjennomsnittet av enigheten, <code>Σ vekt × enighet / Σ vekt</code>, over spørsmål der <em>både</em> du har et svar{' '}
        <em>og</em> partiets standpunkt er kjent.
      </p>
      <ul>
        <li>«Vet ikke / vil ikke svare» fjernes helt fra beregningen. Det behandles ikke som et nøytralt svar.</li>
        <li>Ukjente partistandpunkter fjernes for det partiet. De verken trekker opp eller ned.</li>
        <li>
          Fordi ukjente standpunkter fjernes, viser vi også <strong>datagrunnlag</strong>: hvor stor andel av vekten bak dine svar vi har kjente standpunkter for
          partiet på. Under {Math.round(LOW_COVERAGE * 100)} % markeres resultatet som usikkert.
        </li>
      </ul>
      <p>
        Prosenten er ikke en sannsynlighet og ikke en anbefaling. Fordi svar sjelden er helt motsatte, havner de fleste partier for de fleste brukere et sted
        mellom 40 og 85 %. Selv helt tilfeldige svar gir typisk rundt 55 % til hvert parti og rundt 64 % til det beste partiet (se STRESS_TEST.md i
        kildekoden). Det er derfor rekkefølgen og avstanden mellom partiene, ikke prosenten alene, som er mest informativ.
      </p>

      <h2>5. Hvor sikkert er resultatet?</h2>
      <p>
        Vi gjør {BOOTSTRAP_DRAWS} simuleringer der hvert av dine svar får en tilfeldig vekt («bayesiansk bootstrap»). Det etterligner at en valgomat kunne valgt
        litt andre spørsmål. Vi viser hvor ofte hvert parti havner øverst, og et intervall (10.–90. persentil) for scoren som en strek i søylen.
      </p>
      <ul>
        <li>
          <strong>Klar match:</strong> minst 6 prosentpoeng foran nummer to, øverst i minst 80 % av simuleringene og minst {Math.round(LOW_COVERAGE * 100)} %
          datagrunnlag.
        </li>
        <li>
          <strong>Nær match:</strong> minst 2,5 prosentpoeng foran og øverst i minst halvparten av simuleringene.
        </li>
        <li>
          <strong>Usikkert mellom flere partier:</strong> ellers. Da nevnes alle partier som ligger innen 3 prosentpoeng av toppen eller er øverst i minst 15 % av
          simuleringene.
        </li>
        <li>
          <strong>Ingen parti passer spesielt godt:</strong> vi stokker dine egne svar tilfeldig mellom spørsmålene du har besvart ({BASELINE_DRAWS} ganger) og
          regner ut hvor høyt det beste partiet da scorer. Er det beste partiets faktiske score lavere enn 90-persentilen av dette, kunne like høy enighet
          oppstått med tilfeldig sammensatte svar. Da sier vi det rett ut i stedet for å kåre en vinner. Dette går foran de tre kategoriene over. Ligger beste parti over tilfeldighetsnivået, men med mindre enn {Math.round(MODEST_FIT_MARGIN * 100)} prosentpoeng, viser vi en egen merknad om at treffet er mindre presist enn prosenten tilsier, også når ett parti ligger klart foran de andre.
        </li>
        <li>Med færre enn {MIN_ANSWERS_FOR_RESULT} svar vises ikke noe resultat.</li>
      </ul>

      <h2>6. Forklaringene</h2>
      <ul>
        <li>«Mest enige» er spørsmål der du og partiet er høyst ett skalasteg fra hverandre, eller to steg på samme side av midten (f.eks. «litt enig» og «helt enig»), sortert etter vekt × enighet.</li>
        <li>«Mest uenige» er spørsmål der du og partiet står på hver side av midten med minst tre stegs avstand, eller er minst fire steg fra hverandre, sortert etter vekt × uenighet. Et nøytralt svar mot et ytterpunkt regnes ikke som uenighet.</li>
        <li>
          Vi varsler om en mulig «dealbreaker» når ditt toppparti ligger minst {DEALBREAKER_DISTANCE} skalasteg fra deg, på motsatt side av midten (eller minst fire steg unna), på en sak du har markert som viktig.
        </li>
        <li>
          Når de to øverste ligger innenfor {CLOSE_PAIR_GAP} prosentpoeng, viser vi hvilke temaer som skiller dem (minst 10 prosentpoengs forskjell i temaet).
        </li>
        <li>Vi trekker fram partier lenger ned på lista som likevel matcher deg best på et helt tema (minst to svar i temaet).</li>
      </ul>

      <h2>7. Politisk profil</h2>
      <p>
        Profilen beregnes bare fra dine svar. Hvert spørsmål kan være knyttet til én eller flere akser (for eksempel «mer stat ↔ mer marked»), med en retning.
        Plasseringen er gjennomsnittet av dine svar på aksens spørsmål, skalert til −100…100. Akser med færre enn {MIN_ANSWERS_PER_DIMENSION} svar vises ikke.
        Partiene plasseres på samme måte ut fra sine kodede standpunkter, vektet med sikkerhet. Aksene er grove forenklinger og ikke merkelapper.
      </p>

      <h2>8. Kjente begrensninger</h2>
      <ul>
        <li>Kodingen av partistandpunkter krever skjønn. Alle begrunnelser og kilder er åpne slik at du kan vurdere dem selv.</li>
        <li>Programmer er ikke alltid det samme som det partiene gjør i praksis i Stortinget eller i regjering.</li>
        <li>Noen partier har mer detaljerte programmer enn andre. Det gir flere ukjente standpunkter for noen partier, særlig Arbeiderpartiet.</li>
        <li>Spørsmålsutvalget er et valg. Andre valg kan gi andre resultater – se <a href={href({ name: 'why' })}>hvorfor resultatene kan variere</a>.</li>
      </ul>
    </article>
  );
}

export function WhyPage() {
  return (
    <article className="prose-v mx-auto max-w-3xl">
      <PageTitle kicker="Om resultatet">Hvorfor får jeg et annet resultat enn i andre valgomater?</PageTitle>
      <p>
        Det er helt vanlig at samme person får ulike partier på topp i ulike valgomater. Det betyr ikke nødvendigvis at én av dem er feil. Valgomater er analyseverktøy
        som bygger på mange valg – og ulike valg gir ulike svar.
      </p>
      <h2>Valgomater kan …</h2>
      <ul>
        <li>
          <strong>velge forskjellige spørsmål.</strong> Har en valgomat mange spørsmål om klima og få om innvandring, vil partier som skiller seg ut på klima få større
          utslag.
        </li>
        <li>
          <strong>vekte temaer forskjellig.</strong> Noen lar alle spørsmål telle likt, andre lar brukeren velge viktige temaer, og noen normaliserer per tema slik vi gjør.
        </li>
        <li>
          <strong>tolke partienes standpunkter forskjellig.</strong> Partiprogrammer er ofte generelle. Én redaksjon kan kode et standpunkt som «litt enig», en annen
          som «nøytral». Noen bruker partienes egne svar, andre programmene eller stemmegivning i Stortinget.
        </li>
        <li>
          <strong>bruke forskjellige avstandsfunksjoner.</strong> Noen teller bare om du og partiet er på samme side, andre måler hvor langt fra hverandre dere er, og
          noen straffer store avvik ekstra.
        </li>
        <li>
          <strong>velge forskjellige konfliktlinjer.</strong> Et spørsmål om «strengere innvandring» måler noe annet enn fem spørsmål om asyl, familiegjenforening og
          arbeidsinnvandring hver for seg.
        </li>
        <li>
          <strong>håndtere «vet ikke» og ukjente standpunkter ulikt.</strong> Behandles «vet ikke» som nøytralt, trekkes du mot sentrumspartier.
        </li>
      </ul>
      <h2>Hva gjør vi for å hjelpe deg å forstå forskjellene?</h2>
      <ul>
        <li>Vi viser match per tema, slik at du ser hvilke områder som trekker hvert parti opp eller ned.</li>
        <li>Vi viser hvor sikkert resultatet er, og sier tydelig fra når partier ligger nær hverandre.</li>
        <li>Hvert partistandpunkt har en begrunnelse og en kilde du selv kan sjekke.</li>
        <li>Vi skriver når et parti ikke har tatt stilling, i stedet for å gjette.</li>
      </ul>
      <p>
        Derfor er resultatet et utgangspunkt for å utforske egne standpunkter – ikke en objektiv fasit på hvilket parti noen «er». Les gjerne partienes egne programmer
        for sakene som betyr mest for deg.
      </p>
      <p className="muted text-sm">
        Valgomat 2027 er utviklet uavhengig. Spørsmål, tekster, design og beregningsmetode er laget fra bunnen av og er ikke kopiert fra andre valgomater.
      </p>
    </article>
  );
}

export function SourcesPage() {
  const byParty = data.parties.map((p) => {
    const rows = data.positions.filter((x) => x.party === p.id);
    const c = (k: string | null) => rows.filter((r) => r.confidence === k).length;
    return { p, high: c('HIGH'), medium: c('MEDIUM'), low: c('LOW'), unknown: c(null), total: rows.length };
  });
  const weakest = data.questions
    .map((q) => ({ q, unknown: data.positions.filter((x) => x.question === q.id && x.position === null).length }))
    .sort((a, b) => b.unknown - a.unknown)
    .slice(0, 8);
  return (
    <article className="prose-v mx-auto max-w-4xl">
      <PageTitle kicker="Kilder og research">Kildene bak standpunktene</PageTitle>
      <p>
        <strong>Sist oppdatert: {lastUpdated}.</strong> Standpunktene er kodet ut fra partienes vedtatte programmer for stortingsperioden 2025–2029, som er de nyeste
        vedtatte programmene. Partiene har ennå ikke vedtatt programmer for valget i 2029. Der partiet har endret syn etter at programmet ble vedtatt, og dette er
        godt dokumentert, er det oppgitt som egen kilde.
      </p>
      <p>
        Hvert standpunkt har en kort begrunnelse skrevet av valgomatens redaksjon (parafrase, ikke sitat) og en henvisning til side i kildedokumentet. Lenkene
        åpner PDF-en på riktig side i de fleste nettlesere. Se også <code>RESEARCH_AUDIT.md</code> i kildekoden for full revisjon.
      </p>

      <h2>Kodingen i tall</h2>
      <div className="not-prose overflow-x-auto">
        <table className="w-full min-w-[520px] text-sm">
          <thead>
            <tr className="border-b border-sand-200 text-left dark:border-white/10">
              <th className="p-2">Parti</th>
              <th className="p-2 text-right">Høy</th>
              <th className="p-2 text-right">Middels</th>
              <th className="p-2 text-right">Lav</th>
              <th className="p-2 text-right">Ukjent</th>
              <th className="p-2 text-right">Andel kodet</th>
            </tr>
          </thead>
          <tbody>
            {byParty.map(({ p, high, medium, low, unknown, total }) => (
              <tr key={p.id} className="border-b border-sand-100 dark:border-white/5">
                <td className="p-2">
                  <span className="inline-flex items-center gap-2">
                    <PartySwatch id={p.id} size="sm" /> {p.name}
                  </span>
                </td>
                <td className="p-2 text-right tabular-nums">{high}</td>
                <td className="p-2 text-right tabular-nums">{medium}</td>
                <td className="p-2 text-right tabular-nums">{low}</td>
                <td className="p-2 text-right tabular-nums">{unknown}</td>
                <td className="p-2 text-right tabular-nums">{Math.round(((total - unknown) / total) * 100)} %</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Spørsmål med svakest datagrunnlag</h2>
      <ul>
        {weakest.map(({ q, unknown }) => (
          <li key={q.id}>
            <a href={href({ name: 'question', id: q.id })}>{q.short}</a> – {unknown} av {data.parties.length} partier har ikke tatt stilling i programmet
          </li>
        ))}
      </ul>

      <h2>Kildebibliotek</h2>
      <ul className="not-prose space-y-3">
        {data.sources.map((s) => (
          <li key={s.id} className="card p-4 text-sm">
            <p className="font-semibold">
              <a href={s.url} target="_blank" rel="noopener noreferrer">
                {s.title}
              </a>
            </p>
            <p className="muted mt-1">
              {s.type.charAt(0).toUpperCase() + s.type.slice(1)}
              {s.adopted ? ` · ${s.adopted}` : ''} · Hentet {formatDate(s.accessed)}
              {s.pages ? ` · ${s.pages} PDF-sider` : ''}
            </p>
            {s.note && <p className="mt-1">{s.note}</p>}
            {s.landingPage && (
              <p className="mt-1">
                Partiets side: <a href={s.landingPage} target="_blank" rel="noopener noreferrer">{s.landingPage}</a>
              </p>
            )}
          </li>
        ))}
      </ul>

      <h2>Slik kodes et standpunkt</h2>
      <ul>
        <li>
          <strong>Høy sikkerhet:</strong> standpunktet er direkte og tydelig formulert i vedtatt program.
        </li>
        <li>
          <strong>Middels:</strong> standpunktet kan utledes tydelig fra ett eller flere offisielle standpunkter.
        </li>
        <li>
          <strong>Lav:</strong> standpunktet er indirekte eller uklart. Det teller mindre i beregningen.
        </li>
        <li>
          <strong>Ukjent:</strong> programmet tar ikke stilling. Vi gjetter ikke, og standpunktet holdes utenfor beregningen.
        </li>
      </ul>
      <p>
        Fant du en feil? Alle data ligger i mappen <code>research/</code> i kildekoden, i et format som er lett å lese og rette.
      </p>
    </article>
  );
}
