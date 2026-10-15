import type { Answers } from '../lib/types';
import { data, orderedQuestions, party, position, question, themeLabel, valueLabel } from '../lib/data';
import { href } from '../lib/router';
import { ConfidenceBadge, PageTitle, PartySwatch, ScaleDots, SourceLinks, Stars } from '../components/ui';

/** Ett spørsmål med brukerens svar og alle partiers standpunkt, begrunnelse og kilde. */
export function QuestionPage({ id, answers }: { id: string; answers: Answers }) {
  const q = question(id);
  if (!q)
    return (
      <div>
        <h1 className="text-2xl font-bold">Fant ikke saken</h1>
        <p className="mt-2">
          Lenken peker til et spørsmål som ikke finnes. <a href={href({ name: 'overview' })}>Se alle spørsmål</a>
        </p>
      </div>
    );
  const a = answers[id];
  const idx = orderedQuestions.findIndex((x) => x.id === id);
  const sorted = [...data.parties].sort((x, y) => (position(id, y.id)?.position ?? -99) - (position(id, x.id)?.position ?? -99));

  return (
    <div className="mx-auto max-w-3xl">
      <a href={href({ name: 'results', tab: 'sporsmal' })} className="text-sm">
        ← Alle spørsmål
      </a>
      <div className="mt-4">
        <PageTitle kicker={themeLabel(q.theme)}>{q.text}</PageTitle>
      </div>

      <div className="card p-4">
        <p className="muted text-xs font-semibold uppercase tracking-wide">Ditt svar</p>
        {a === undefined ? (
          <p className="mt-1">
            Ikke besvart. <a href={href({ name: 'quiz', index: idx })}>Svar på spørsmålet</a>
          </p>
        ) : a.value === null ? (
          <p className="mt-1">
            Vet ikke / vil ikke svare (holdes utenfor beregningen). <a href={href({ name: 'quiz', index: idx })}>Endre</a>
          </p>
        ) : (
          <p className="mt-1 flex flex-wrap items-center gap-3">
            <ScaleDots value={a.value} color="#14162b" /> <Stars n={a.importance} /> <a href={href({ name: 'quiz', index: idx })}>Endre</a>
          </p>
        )}
      </div>

      <h2 className="mt-8 text-xl font-bold">Partienes standpunkter</h2>
      <p className="muted mt-1 text-sm">
        Kodet på en skala fra helt uenig (−3) til helt enig (+3) ut fra partienes vedtatte programmer for 2025–2029. Begrunnelsene er våre parafraser, ikke sitater.
      </p>
      <ul className="mt-4 space-y-2">
        {sorted.map((p) => {
          const pos = position(id, p.id)!;
          return (
            <li key={p.id} className="card p-4">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <PartySwatch id={p.id} />
                <span className="font-semibold">{p.name}</span>
                <span className="ml-auto flex flex-wrap items-center gap-2">
                  <ScaleDots value={pos.position} color={party(p.id).color} label={valueLabel(pos.position)} />
                  <ConfidenceBadge c={pos.confidence} />
                </span>
              </div>
              <p className="mt-2 text-[0.95rem] leading-relaxed">{pos.reasoning}</p>
              <SourceLinks refs={pos.refs} />
            </li>
          );
        })}
      </ul>

      <details className="card mt-8 p-4">
        <summary className="cursor-pointer font-semibold">Bakgrunn og argumenter for og mot</summary>
        <p className="mt-3 leading-relaxed">{q.background}</p>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide">For</h3>
            <ul className="mt-1 list-disc space-y-1 pl-5">{q.pro.map((t) => <li key={t}>{t}</li>)}</ul>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide">Mot</h3>
            <ul className="mt-1 list-disc space-y-1 pl-5">{q.con.map((t) => <li key={t}>{t}</li>)}</ul>
          </div>
        </div>
      </details>

      <nav className="mt-6 flex justify-between gap-2 text-sm" aria-label="Bla mellom spørsmål">
        {idx > 0 ? <a href={href({ name: 'question', id: orderedQuestions[idx - 1].id })}>← Forrige sak</a> : <span />}
        {idx < orderedQuestions.length - 1 ? <a href={href({ name: 'question', id: orderedQuestions[idx + 1].id })}>Neste sak →</a> : <span />}
      </nav>
    </div>
  );
}

/** Oversikt over alle spørsmål med brukerens svar og partienes standpunkter i kompakt form. */
export function AllQuestionsPage({ answers }: { answers: Answers }) {
  return (
    <div className="mx-auto max-w-4xl">
      <a href={href({ name: 'results' })} className="text-sm">
        ← Tilbake til resultatet
      </a>
      <div className="mt-4">
        <PageTitle kicker="Kilder i resultatet">Alle spørsmål og partienes standpunkter</PageTitle>
      </div>
      <p className="muted -mt-3 mb-6 max-w-prose">Trykk på et spørsmål for å se begrunnelse og kilde for hvert parti.</p>
      {data.themes.map((t) => (
        <section key={t.id} className="mb-8">
          <h2 className="mb-2 text-lg font-bold">{t.label}</h2>
          <ul className="space-y-2">
            {data.questions
              .filter((q) => q.theme === t.id)
              .map((q) => {
                const a = answers[q.id];
                return (
                  <li key={q.id}>
                    <a href={href({ name: 'question', id: q.id })} className="card block p-3 text-ink no-underline hover:border-brand-400 dark:text-slate-100">
                      <span className="font-medium">{q.text}</span> <Stars n={a?.importance ?? 0} />
                      <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                        <span className="muted">Du: {a === undefined ? 'ikke besvart' : a.value === null ? 'vet ikke' : valueLabel(a.value).toLowerCase()}</span>
                        {data.parties.map((p) => {
                          const v = position(q.id, p.id)?.position ?? null;
                          return (
                            <span key={p.id} className="inline-flex items-center gap-1" title={`${p.name}: ${valueLabel(v)}`}>
                              <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: p.color }} />
                              <span className="font-bold">{p.short}</span>
                              <span className="tabular-nums">{v === null ? '?' : v > 0 ? `+${v}` : v}</span>
                            </span>
                          );
                        })}
                      </span>
                    </a>
                  </li>
                );
              })}
          </ul>
        </section>
      ))}
    </div>
  );
}
