import { useMemo } from 'react';
import type { Answers } from '../lib/types';
import { data, orderedQuestions, party, pct, question, themeLabel, valueLabel } from '../lib/data';
import { computeResults, isModestFit, partyDimensions, userDimensions, MIN_ANSWERS_FOR_RESULT, type PartyResult, type ResultSummary } from '../lib/scoring';
import { buildInsights, type Insight } from '../lib/insights';
import { href } from '../lib/router';
import { PageTitle, PartySwatch, Section, Stars } from '../components/ui';

export function useResults(answers: Answers) {
  return useMemo(() => {
    const summary = computeResults(data, answers);
    return { summary, insights: buildInsights(data, answers, summary) };
  }, [answers]);
}

export function ResultsPage({ answers }: { answers: Answers }) {
  const { summary, insights } = useResults(answers);

  if (summary.answeredCount < MIN_ANSWERS_FOR_RESULT) {
    return (
      <div className="mx-auto max-w-2xl">
        <PageTitle kicker="Resultat">Litt flere svar trengs</PageTitle>
        <div className="card p-6">
          <p>
            Du har svart på {summary.answeredCount} spørsmål. For å gi et meningsfullt resultat trenger vi minst {MIN_ANSWERS_FOR_RESULT} svar
            («Vet ikke» teller ikke). Jo flere spørsmål du svarer på, desto sikrere blir sammenligningen.
          </p>
          <a className="btn-primary mt-4" href={href({ name: 'quiz', index: firstUnanswered(answers) })}>
            Fortsett testen
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <PageTitle kicker="Ditt resultat">Slik matcher partiene dine svar</PageTitle>
      <Verdict summary={summary} />

      <Section
        id="rangering"
        title="Alle partier rangert"
        lead={
          <>
            Prosenten er en <strong>matchscore</strong>: hvor nær partienes vedtatte standpunkter ligger dine svar, på en skala der 100 % betyr identiske svar
            og 0 % maksimal uenighet. Det er <strong>ikke</strong> sannsynligheten for at du bør stemme på partiet. <a href={href({ name: 'method' })}>Slik beregnes den</a>.
          </>
        }
      >
        <Ranking summary={summary} />
      </Section>

      {insights.length > 0 && (
        <Section id="innsikt" title="Verdt å merke seg" lead="Automatisk generert ut fra dine svar og partienes kodede standpunkter.">
          <Insights insights={insights} />
        </Section>
      )}

      <Section
        id="tema"
        title="Match per politikkområde"
        lead="Dette forklarer ofte hvorfor ulike valgomater gir ulike svar: et parti kan ligge nær deg på noen områder og langt unna på andre. Kolonnen «vekt» viser hvor mye hvert område betyr i din totalscore."
      >
        <ThemeTable summary={summary} />
      </Section>

      <Section
        id="profil"
        title="Din politiske profil"
        lead="Profilen er beregnet fra dine egne svar, uavhengig av partiene. Partiene er plassert ut fra sine kodede standpunkter på de samme spørsmålene. Akser med for få svar vises ikke."
      >
        <Profile answers={answers} />
      </Section>

      <Section id="videre" title="Gå dypere">
        <div className="grid gap-3 sm:grid-cols-3">
          <a className="card block p-4 no-underline hover:border-brand-400" href={href({ name: 'results', tab: 'sporsmal' })}>
            <span className="font-semibold text-ink dark:text-slate-100">Alle spørsmål og kilder</span>
            <span className="muted mt-1 block text-sm">Se ditt svar og hvert partis standpunkt, begrunnelse og kilde.</span>
          </a>
          <a className="card block p-4 no-underline hover:border-brand-400" href={href({ name: 'why' })}>
            <span className="font-semibold text-ink dark:text-slate-100">Hvorfor ulikt fra andre valgomater?</span>
            <span className="muted mt-1 block text-sm">Hva som gjør at resultatene kan variere.</span>
          </a>
          <a className="card block p-4 no-underline hover:border-brand-400" href={href({ name: 'overview' })}>
            <span className="font-semibold text-ink dark:text-slate-100">Endre svar</span>
            <span className="muted mt-1 block text-sm">Gå tilbake til spørsmålene. Svarene dine er lagret.</span>
          </a>
        </div>
      </Section>
    </div>
  );
}

export function firstUnanswered(answers: Answers): number {
  const idx = orderedQuestions.findIndex((q) => answers[q.id] === undefined);
  return idx < 0 ? 0 : idx;
}

function Verdict({ summary }: { summary: ResultSummary }) {
  const [a, b] = summary.ranking;
  const names = (ids: string[]) => {
    const n = ids.map((id) => party(id).name);
    return n.length <= 1 ? n.join('') : `${n.slice(0, -1).join(', ')} og ${n[n.length - 1]}`;
  };
  const conf = {
    clear: { label: 'Klar match', cls: 'border-emerald-300 bg-emerald-50 dark:border-emerald-500/40 dark:bg-emerald-500/10', text: <>{party(a.party).name} ligger tydelig nærmest dine svar i denne testen, og er øverst i {pct(summary.uncertainty.topShare[a.party])} av simuleringene der spørsmålsutvalget varieres.</> },
    close: { label: 'Nær match', cls: 'border-amber-300 bg-amber-50 dark:border-amber-500/40 dark:bg-amber-500/10', text: <>{party(a.party).name} ligger øverst, men {party(b.party).name} er ikke langt unna ({Math.round(summary.gap ?? 0)} prosentpoeng). Små endringer i hvilke spørsmål som er med, kan endre rekkefølgen.</> },
    uncertain: { label: 'Usikkert mellom flere partier', cls: 'border-sky-300 bg-sky-50 dark:border-sky-500/40 dark:bg-sky-500/10', text: <>{names(summary.contenders)} ligger i praksis svært nær hverandre i denne testen. Ingen av dem bør regnes som en klar vinner.</> },
    weak: { label: 'Ingen parti passer spesielt godt', cls: 'border-slate-300 bg-slate-50 dark:border-white/20 dark:bg-white/5', text: <>{party(a.party).name} ligger øverst med {pct(a.score)}, men det er ikke høyere enn det beste partiet typisk får når de samme svarene dine stokkes tilfeldig mellom spørsmålene ({pct(summary.baseline)}). Svarene dine går på tvers av partiene – se temaoversikten for hvor hvert parti passer deg.</> },
    insufficient: { label: 'For få svar', cls: 'border-sand-200 bg-white dark:border-white/10', text: <>Svar på flere spørsmål for å få et mer pålitelig resultat.</> },
  }[summary.verdict];
  return (
    <div className={`rounded-2xl border-2 p-5 ${conf.cls}`} role="status">
      <p className="text-sm font-bold uppercase tracking-wide">{conf.label}</p>
      <p className="mt-1 text-lg leading-snug">{conf.text}</p>
      {isModestFit(summary) && (
        <p className="mt-2">
          Merk: {party(a.party).name} er enig med deg i {pct(a.score)}, men en stor del av dette ville det beste partiet typisk fått også om de samme svarene
          dine ble stokket tilfeldig mellom spørsmålene ({pct(summary.baseline)}). Treffet er derfor mindre presist enn prosenten tilsier.
        </p>
      )}
      <p className="muted mt-3 text-sm">
        Basert på {summary.answeredCount} besvarte spørsmål{summary.dontKnowCount ? ` (${summary.dontKnowCount} «vet ikke» er holdt utenfor)` : ''}.
      </p>
    </div>
  );
}

function Ranking({ summary }: { summary: ResultSummary }) {
  return (
    <ol className="space-y-2">
      {summary.ranking.map((r, i) => (
        <li key={r.party}>
          <RankRow r={r} rank={i + 1} summary={summary} />
        </li>
      ))}
    </ol>
  );
}

function RankRow({ r, rank, summary }: { r: PartyResult; rank: number; summary: ResultSummary }) {
  const p = party(r.party);
  const [lo, hi] = summary.uncertainty.interval[r.party] ?? [NaN, NaN];
  const top = summary.uncertainty.topShare[r.party] ?? 0;
  const lowCov = r.coverage < 0.6;
  return (
    <a href={href({ name: 'results', party: r.party })} className="card group block p-3 text-ink no-underline transition hover:border-brand-400 dark:text-slate-100 sm:p-4" aria-label={`${rank}. ${p.name}, ${pct(r.score)} match. Se forklaring.`}>
      <div className="flex items-center gap-3">
        <span className="w-6 text-right text-sm font-bold tabular-nums text-ink-soft dark:text-slate-400">{rank}.</span>
        <PartySwatch id={r.party} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <span className="min-w-0 font-semibold leading-tight">{p.name}</span>
            <span className="shrink-0 whitespace-nowrap text-xl font-extrabold tabular-nums">{pct(r.score)}</span>
          </div>
          <div className="relative mt-1.5 h-3 rounded-full bg-sand-100 dark:bg-white/10" aria-hidden="true">
            <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${(r.score ?? 0) * 100}%`, backgroundColor: p.color, opacity: 0.85 }} />
            {Number.isFinite(lo) && (
              <div className="absolute top-1/2 h-[3px] -translate-y-1/2 rounded bg-ink/60 dark:bg-white/70" style={{ left: `${lo * 100}%`, width: `${Math.max(0.5, (hi - lo) * 100)}%` }} />
            )}
          </div>
          <p className="muted mt-1.5 text-xs">
            Øverst i {pct(top)} av simuleringene · Datagrunnlag {pct(r.coverage)}
            {lowCov && <span className="ml-1 font-semibold text-amber-700 dark:text-amber-300">· usikkert grunnlag</span>}
            <span className="ml-1 text-brand-700 group-hover:underline dark:text-brand-200">· Se hvorfor →</span>
          </p>
        </div>
      </div>
    </a>
  );
}

function Insights({ insights }: { insights: Insight[] }) {
  return (
    <ul className="space-y-3">
      {insights.map((ins, i) => (
        <li key={i} className="card p-4">
          <InsightText ins={ins} />
        </li>
      ))}
    </ul>
  );
}

const list = (items: string[]) => (items.length <= 1 ? items.join('') : `${items.slice(0, -1).join(', ')} og ${items[items.length - 1]}`);

function InsightText({ ins }: { ins: Insight }) {
  switch (ins.kind) {
    case 'dealbreaker': {
      const q = question(ins.questionId);
      return (
        <p>
          <strong>{party(ins.party).name}</strong> er din høyeste totalmatch, men dere er tydelig uenige om en sak du markerte som{' '}
          {ins.importance === 2 ? 'en av dine viktigste' : 'viktig'} <Stars n={ins.importance} />: <a href={href({ name: 'question', id: q.id })}>«{q.short}»</a>. Du svarte «{valueLabel(ins.user).toLowerCase()}», partiet er kodet som «
          {valueLabel(ins.partyPos).toLowerCase()}».
        </p>
      );
    }
    case 'closePair':
      return (
        <p>
          <strong>{party(ins.a).name}</strong> og <strong>{party(ins.b).name}</strong> ligger nesten likt totalt ({Math.round(ins.gap * 10) / 10} prosentpoeng).{' '}
          {ins.aBetter.length > 0 && (
            <>
              {party(ins.a).short} matcher deg bedre på {list(ins.aBetter.map((t) => themeLabel(t).toLowerCase()))}
              {ins.bBetter.length > 0 ? ', mens ' : '.'}
            </>
          )}
          {ins.bBetter.length > 0 && (
            <>
              {party(ins.b).short} matcher deg bedre på {list(ins.bBetter.map((t) => themeLabel(t).toLowerCase()))}.
            </>
          )}
        </p>
      );
    case 'themeWinner':
      return (
        <p>
          <strong>{party(ins.party).name}</strong> ligger bare som nummer {ins.rank} totalt, men er partiet som matcher deg best på{' '}
          <strong>{themeLabel(ins.theme).toLowerCase()}</strong>.
        </p>
      );
    case 'lowCoverage':
      return (
        <p>
          For <strong>{party(ins.party).name}</strong> har vi bare kjente standpunkter på {pct(ins.coverage)} av vekten bak dine svar. Resten er ukjent i
          partiets program og holdes utenfor. Resultatet for dette partiet er derfor mer usikkert.
        </p>
      );
  }
}

function heat(score: number | null): string {
  if (score === null) return 'transparent';
  // 0.3 → lys, 1 → mettet. Fargen er nøytral (ikke rød/grønn) for å fungere ved fargeblindhet.
  const t = Math.max(0, Math.min(1, (score - 0.3) / 0.7));
  return `rgba(88, 71, 201, ${0.08 + t * 0.55})`;
}

function ThemeTable({ summary }: { summary: ResultSummary }) {
  const parties = summary.ranking.map((r) => r.party);
  const themes = summary.ranking[0].themes;
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <caption className="sr-only">Matchscore per tema og parti</caption>
          <thead>
            <tr className="border-b border-sand-200 dark:border-white/10">
              <th scope="col" className="sticky left-0 z-10 bg-white p-2 text-left font-semibold dark:bg-[#17182e]">
                Tema
              </th>
              <th scope="col" className="p-2 text-right font-semibold">
                Vekt
              </th>
              {parties.map((p) => (
                <th key={p} scope="col" className="p-2 text-center">
                  <a href={href({ name: 'results', party: p })} className="no-underline" title={party(p).name}>
                    <PartySwatch id={p} size="sm" />
                  </a>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {themes.map((t) => (
              <tr key={t.theme} className="border-b border-sand-100 last:border-0 dark:border-white/5">
                <th scope="row" className="sticky left-0 z-10 bg-white p-2 text-left font-medium dark:bg-[#17182e]">
                  {themeLabel(t.theme)}
                  <span className="muted block text-xs font-normal">{t.answered} svar</span>
                </th>
                <td className="muted p-2 text-right tabular-nums">{pct(t.share)}</td>
                {parties.map((p) => {
                  const ts = summary.ranking.find((r) => r.party === p)!.themes.find((x) => x.theme === t.theme)!;
                  return (
                    <td key={p} className="p-1 text-center tabular-nums">
                      <span className="block rounded-md px-1 py-1.5" style={{ backgroundColor: heat(ts.score) }} title={ts.known < ts.answered ? `${party(p).short}: kjent standpunkt på ${ts.known} av ${ts.answered} spørsmål` : undefined}>
                        {ts.score === null ? <span className="muted">–</span> : Math.round(ts.score * 100)}
                        {ts.score !== null && ts.known < ts.answered && <sup className="muted">*</sup>}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="muted border-t border-sand-200 p-3 text-xs dark:border-white/10">
        Tall i prosent. – betyr at partiets standpunkt er ukjent på alle dine svar i temaet. * betyr at standpunktet er ukjent på noen av spørsmålene. Mørkere farge = bedre match.
      </p>
    </div>
  );
}

function Profile({ answers }: { answers: Answers }) {
  const user = userDimensions(data, answers);
  const partyDims = useMemo(() => Object.fromEntries(data.parties.map((p) => [p.id, partyDimensions(data, p.id)])), []);
  return (
    <div className="card divide-y divide-sand-200 dark:divide-white/10">
      {data.dimensions.map((d, i) => {
        const u = user[i];
        return (
          <div key={d.id} className="p-4">
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="font-semibold">{d.label}</h3>
              <span className="muted text-xs">{u.n} av dine svar</span>
            </div>
            {u.value === null ? (
              <p className="muted mt-2 text-sm">For få svar til å plassere deg på denne aksen (minst 3 trengs).</p>
            ) : (
              <>
                <div className="relative mt-8 h-2 rounded-full bg-gradient-to-r from-sand-200 via-sand-100 to-sand-200 dark:from-white/10 dark:via-white/5 dark:to-white/10">
                  <span className="absolute left-1/2 top-1/2 h-4 w-px -translate-y-1/2 bg-ink/20 dark:bg-white/20" aria-hidden="true" />
                  {data.parties.map((p) => {
                    const v = partyDims[p.id][i].value;
                    if (v === null) return null;
                    return (
                      <span key={p.id} className="absolute -top-7 -translate-x-1/2" style={{ left: `${((v + 1) / 2) * 100}%` }} aria-hidden="true" title={`${p.name}`}>
                        <span className="block rounded px-0.5 text-[9px] font-bold leading-4 text-white" style={{ backgroundColor: p.color }}>
                          {p.short}
                        </span>
                      </span>
                    );
                  })}
                  <span
                    className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white bg-ink shadow dark:border-[#17182e] dark:bg-white"
                    style={{ left: `${((u.value + 1) / 2) * 100}%` }}
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-2 flex justify-between gap-4 text-xs">
                  <span className="muted max-w-[45%]">{d.left}</span>
                  <span className="muted max-w-[45%] text-right">{d.right}</span>
                </div>
                <p className="sr-only">
                  Din plassering: {Math.round(u.value * 100)} på en skala fra -100 ({d.left}) til 100 ({d.right}).
                </p>
              </>
            )}
          </div>
        );
      })}
      <p className="muted p-4 text-xs">
        Den svarte prikken er deg. Partimerkene viser partienes plassering beregnet fra kodede standpunkter. Aksene er grove forenklinger og bør ikke leses som
        merkelapper på deg.
      </p>
    </div>
  );
}

