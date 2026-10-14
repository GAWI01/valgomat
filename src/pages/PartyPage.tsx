import type { Answers } from '../lib/types';
import { party, pct, position, question, source, themeLabel, valueLabel } from '../lib/data';
import { topAgreements, topDisagreements, type QuestionContribution } from '../lib/scoring';
import { href } from '../lib/router';
import { ConfidenceBadge, PageTitle, PartySwatch, ScaleDots, Section, Stars } from '../components/ui';
import { useResults } from './ResultsPage';

export function PartyPage({ partyId, answers }: { partyId: string; answers: Answers }) {
  const { summary } = useResults(answers);
  const r = summary.ranking.find((x) => x.party === partyId);
  const p = party(partyId);
  if (!r || !p) return <p>Fant ikke partiet.</p>;
  const rank = summary.ranking.indexOf(r) + 1;
  const agree = topAgreements(r, 8);
  const disagree = topDisagreements(r, 8);
  const important = r.contributions.filter((c) => c.importance > 0).sort((a, b) => b.importance - a.importance);
  const unknown = r.contributions.filter((c) => c.agreement === null);
  const prog = source(p.programSource);

  return (
    <div className="mx-auto max-w-3xl">
      <a href={href({ name: 'results' })} className="text-sm">
        ← Tilbake til resultatet
      </a>
      <div className="mt-4 flex items-center gap-4">
        <PartySwatch id={partyId} size="lg" />
        <PageTitle kicker={`Nr. ${rank} av ${summary.ranking.length}`}>{p.name}</PageTitle>
      </div>

      <div className="card grid grid-cols-3 divide-x divide-sand-200 text-center dark:divide-white/10">
        <Stat label="Matchscore" value={pct(r.score)} />
        <Stat label="Øverst i simuleringer" value={pct(summary.uncertainty.topShare[partyId])} />
        <Stat label="Datagrunnlag" value={pct(r.coverage)} />
      </div>
      <p className="muted mt-2 text-sm">
        Datagrunnlag viser hvor stor andel av vekten bak dine svar vi har et kjent, kildebelagt standpunkt for {p.short} på. {unknown.length > 0 && <>På {unknown.length} av dine svar er partiets standpunkt ukjent; de teller verken for eller mot.</>}
      </p>

      <Section title="Dere er mest enige om" id="enige">
        <ContribList items={agree} partyId={partyId} empty="Ingen spørsmål med tydelig enighet." />
      </Section>

      <Section title="Dere er mest uenige om" id="uenige">
        <ContribList items={disagree} partyId={partyId} empty="Ingen spørsmål med tydelig uenighet." />
      </Section>

      <Section title="Viktige saker for deg" id="viktige" lead="Spørsmål du markerte med ★ eller ★★.">
        {important.length === 0 ? <p className="muted">Du har ikke markert noen saker som viktige.</p> : <ContribList items={important} partyId={partyId} empty="" />}
      </Section>

      <Section title="Match per tema" id="tema">
        <ul className="card divide-y divide-sand-200 dark:divide-white/10">
          {r.themes.map((t) => (
            <li key={t.theme} className="flex items-center gap-3 p-3">
              <span className="w-40 shrink-0 text-sm sm:w-56">{themeLabel(t.theme)}</span>
              <span className="relative h-2.5 flex-1 rounded-full bg-sand-100 dark:bg-white/10" aria-hidden="true">
                {t.score !== null && <span className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${t.score * 100}%`, backgroundColor: p.color }} />}
              </span>
              <span className="w-12 text-right text-sm font-semibold tabular-nums">{t.score === null ? '–' : pct(t.score)}</span>
            </li>
          ))}
        </ul>
      </Section>

      {prog && (
        <p className="muted mt-8 text-sm">
          Hovedkilde: <a href={prog.url} target="_blank" rel="noopener noreferrer">{prog.title}</a>. {prog.adopted}
        </p>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3">
      <p className="text-xl font-extrabold tabular-nums sm:text-2xl">{value}</p>
      <p className="muted text-xs">{label}</p>
    </div>
  );
}

function ContribList({ items, partyId, empty }: { items: QuestionContribution[]; partyId: string; empty: string }) {
  if (items.length === 0) return <p className="muted">{empty}</p>;
  const color = party(partyId).color;
  return (
    <ul className="space-y-2">
      {items.map((c) => {
        const q = question(c.questionId);
        const pos = position(c.questionId, partyId)!;
        return (
          <li key={c.questionId} className="card p-4">
            <a href={href({ name: 'question', id: q.id })} className="font-semibold">
              {q.text}
            </a>{' '}
            <Stars n={c.importance} />
            <dl className="mt-2 grid gap-1 text-sm sm:grid-cols-2">
              <div>
                <dt className="muted text-xs">Ditt svar</dt>
                <dd>
                  <ScaleDots value={c.user} color="#14162b" />
                </dd>
              </div>
              <div>
                <dt className="muted text-xs">{party(partyId).short}</dt>
                <dd className="flex flex-wrap items-center gap-2">
                  <ScaleDots value={c.party} color={color} label={valueLabel(c.party)} />
                  <ConfidenceBadge c={c.confidence} />
                </dd>
              </div>
            </dl>
            <p className="muted mt-2 text-sm">{pos.reasoning}</p>
          </li>
        );
      })}
    </ul>
  );
}
