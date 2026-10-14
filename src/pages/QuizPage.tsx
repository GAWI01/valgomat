import { useEffect, useId, useState } from 'react';
import type { Answers, Importance } from '../lib/types';
import { SCALE_LABELS, orderedQuestions, questionsByTheme, themeLabel } from '../lib/data';
import { href, navigate } from '../lib/router';
import { MIN_ANSWERS_FOR_RESULT } from '../lib/scoring';

interface Props {
  index: number;
  answers: Answers;
  setAnswer: (id: string, patch: { value: number | null; importance?: Importance }) => void;
  setImportance: (id: string, imp: Importance) => void;
  clearAnswer: (id: string) => void;
  setIndex: (i: number) => void;
}

export function QuizPage({ index, answers, setAnswer, setImportance, clearAnswer, setIndex }: Props) {
  const total = orderedQuestions.length;
  const i = Math.min(Math.max(index, 0), total - 1);
  const q = orderedQuestions[i];
  const a = answers[q.id];
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const answeredCount = Object.values(answers).filter((x) => x.value !== null).length;
  const touchedCount = Object.keys(answers).length;

  const group = questionsByTheme.find((g) => g.theme.id === q.theme)!;
  const posInTheme = group.questions.findIndex((x) => x.id === q.id) + 1;

  useEffect(() => {
    setIndex(i);
    setOpen(false);
    document.getElementById('question-text')?.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
  }, [i, setIndex]);

  const go = (n: number) => {
    if (n >= total) navigate({ name: 'results' });
    else navigate({ name: 'quiz', index: Math.max(0, n) });
  };

  const choose = (value: number) => setAnswer(q.id, { value, importance: a?.importance ?? 0 });
  const dontKnow = () => setAnswer(q.id, { value: null, importance: 0 });
  const toggleImportance = (level: 1 | 2) => {
    if (!a || a.value === null) return;
    setImportance(q.id, a.importance === level ? 0 : level);
  };

  // Tastatursnarveier (desktop): 1–7 velger svar, 0/V = vet ikke, ←/→ navigerer, H = forklaring, I = viktighet
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (/^[1-7]$/.test(e.key)) {
        e.preventDefault();
        choose(Number(e.key) - 4);
      } else if (e.key === '0' || e.key.toLowerCase() === 'v') {
        e.preventDefault();
        dontKnow();
      } else if (e.key === 'ArrowRight' && !(e.target as HTMLElement)?.closest('[role=radiogroup]')) {
        go(i + 1);
      } else if (e.key === 'ArrowLeft' && !(e.target as HTMLElement)?.closest('[role=radiogroup]')) {
        go(i - 1);
      } else if (e.key.toLowerCase() === 'h') {
        setOpen((o) => !o);
      } else if (e.key.toLowerCase() === 'i') {
        if (a && a.value !== null) setImportance(q.id, ((a.importance + 1) % 3) as Importance);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const selected = a?.value ?? undefined;

  return (
    <div className="mx-auto max-w-2xl animate-rise" key={q.id}>
      {/* Fremdrift */}
      <div className="mb-5">
        <div className="flex items-baseline justify-between gap-3 text-sm">
          <p className="shrink-0 whitespace-nowrap font-semibold">
            Spørsmål {i + 1} <span className="muted font-normal">av {total}</span>
          </p>
          <p className="muted truncate">
            {themeLabel(q.theme)} · {posInTheme}/{group.questions.length}
          </p>
        </div>
        <div
          className="mt-2 h-2 overflow-hidden rounded-full bg-sand-200 dark:bg-white/10"
          role="progressbar"
          aria-label="Fremdrift i testen"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={touchedCount}
          aria-valuetext={`${touchedCount} av ${total} spørsmål besvart`}
        >
          <div className="h-full rounded-full bg-brand-600 transition-all dark:bg-brand-400" style={{ width: `${(touchedCount / total) * 100}%` }} />
        </div>
        <ThemeProgress answers={answers} current={q.theme} />
      </div>

      <div className="card p-4 sm:p-7">
        <h1 id="question-text" tabIndex={-1} className="text-[1.35rem] font-bold leading-snug outline-none sm:text-2xl">
          {q.text}
        </h1>

        <button
          type="button"
          className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-lg text-left font-semibold text-brand-700 hover:underline dark:text-brand-200"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((o) => !o)}
        >
          <span aria-hidden="true" className={`inline-block transition-transform ${open ? 'rotate-90' : ''}`}>
            ▸
          </span>
          <span>
            Hva handler dette om?
            <span className="muted block text-sm font-normal">Bakgrunn og argumenter for og mot</span>
          </span>
        </button>
        {open && (
          <div id={panelId} className="mt-3 animate-rise rounded-xl bg-sand-100 p-4 text-[0.97rem] dark:bg-white/5">
            <h2 className="text-sm font-bold uppercase tracking-wide">Bakgrunn</h2>
            <p className="mt-1 leading-relaxed">{q.background}</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wide">Argumenter for</h2>
                <ul className="mt-1 list-disc space-y-1.5 pl-5 leading-relaxed">
                  {q.pro.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wide">Argumenter mot</h2>
                <ul className="mt-1 list-disc space-y-1.5 pl-5 leading-relaxed">
                  {q.con.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="muted mt-3 text-xs">
              Argumentene er skrevet av valgomatens redaksjon for å forklare saken. De er ikke sitater fra partiene.
            </p>
          </div>
        )}

        <ScaleInput value={selected} onChange={choose} labelledBy="question-text" />

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={dontKnow}
            aria-pressed={a !== undefined && a.value === null}
            className={a !== undefined && a.value === null ? 'btn-primary' : 'btn-outline'}
          >
            Vet ikke / vil ikke svare
          </button>
          {a !== undefined && (
            <button type="button" className="btn-ghost text-sm" onClick={() => clearAnswer(q.id)}>
              Fjern svar
            </button>
          )}
        </div>

        <fieldset className="mt-5 border-t border-sand-200 pt-4 dark:border-white/10" disabled={!a || a.value === null}>
          <legend className="sr-only">Hvor viktig er saken for deg?</legend>
          <div className="flex flex-wrap gap-2">
            <button type="button" aria-pressed={a?.importance === 1} onClick={() => toggleImportance(1)} className={`btn-outline ${a?.importance === 1 ? '!border-amber-500 !bg-amber-100 dark:!bg-amber-500/25' : ''}`}>
              <span aria-hidden="true" className="text-amber-500">★</span> Viktig for meg
            </button>
            <button type="button" aria-pressed={a?.importance === 2} onClick={() => toggleImportance(2)} className={`btn-outline ${a?.importance === 2 ? '!border-amber-500 !bg-amber-100 dark:!bg-amber-500/25' : ''}`}>
              <span aria-hidden="true" className="text-amber-500">★★</span> En av mine viktigste saker
            </button>
          </div>
          {(!a || a.value === null) && <p className="muted mt-2 text-xs">Velg et standpunkt først for å kunne markere saken som viktig.</p>}
        </fieldset>
      </div>

      <nav className="mt-5 flex items-center justify-between gap-2" aria-label="Navigasjon mellom spørsmål">
        <button type="button" className="btn-outline" onClick={() => go(i - 1)} disabled={i === 0}>
          <span aria-hidden="true">←</span> Forrige
        </button>
        <a className="btn-ghost text-sm" href={href({ name: 'overview' })}>
          Alle spørsmål
        </a>
        <button type="button" className="btn-primary" onClick={() => go(i + 1)}>
          {i === total - 1 ? 'Se resultat' : a ? 'Neste' : 'Hopp over'} <span aria-hidden="true">→</span>
        </button>
      </nav>

      <div className="mt-6 flex flex-col items-center gap-2 text-center text-sm">
        {answeredCount >= MIN_ANSWERS_FOR_RESULT ? (
          <a href={href({ name: 'results' })} className="font-semibold">
            Se foreløpig resultat ({answeredCount} svar)
          </a>
        ) : (
          <p className="muted">Resultatet blir tilgjengelig etter {MIN_ANSWERS_FOR_RESULT} besvarte spørsmål.</p>
        )}
        <p className="muted hidden sm:block">
          Tastatur: <kbd>1</kbd>–<kbd>7</kbd> velger svar, <kbd>0</kbd> vet ikke, <kbd>I</kbd> viktighet, <kbd>H</kbd> forklaring, <kbd>←</kbd>/<kbd>→</kbd> bla.
        </p>
      </div>
    </div>
  );
}

function ScaleInput({ value, onChange, labelledBy }: { value: number | undefined; onChange: (v: number) => void; labelledBy: string }) {
  const values = [-3, -2, -1, 0, 1, 2, 3];
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key)) return;
    e.preventDefault();
    e.stopPropagation();
    const cur = value ?? 0;
    let next = cur;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') next = Math.min(3, cur + 1);
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') next = Math.max(-3, cur - 1);
    if (e.key === 'Home') next = -3;
    if (e.key === 'End') next = 3;
    onChange(next);
    requestAnimationFrame(() => document.getElementById(`opt-${next}`)?.focus());
  };
  return (
    <div className="mt-6">
      <div role="radiogroup" aria-labelledby={labelledBy} className="grid grid-cols-7 gap-1 sm:gap-3" onKeyDown={onKeyDown}>
        {values.map((v, idx) => {
          const checked = value === v;
          const tab = value === undefined ? (v === 0 ? 0 : -1) : checked ? 0 : -1;
          const size = Math.abs(v) === 3 ? 'h-9 w-9 sm:h-14 sm:w-14' : Math.abs(v) === 2 ? 'h-8 w-8 sm:h-12 sm:w-12' : Math.abs(v) === 1 ? 'h-7 w-7 sm:h-11 sm:w-11' : 'h-6 w-6 sm:h-10 sm:w-10';
          const tone = v < 0 ? 'border-rose-400 dark:border-rose-400/70' : v > 0 ? 'border-emerald-500 dark:border-emerald-400/70' : 'border-slate-400 dark:border-slate-500';
          const fill = v < 0 ? 'bg-rose-500' : v > 0 ? 'bg-emerald-600' : 'bg-slate-500';
          return (
            <button
              key={v}
              id={`opt-${v}`}
              type="button"
              role="radio"
              aria-checked={checked}
              aria-label={`${SCALE_LABELS[idx]}`}
              tabIndex={tab}
              onClick={() => onChange(v)}
              className="group flex min-h-[56px] items-center justify-center rounded-xl"
            >
              <span className={`flex items-center justify-center rounded-full border-2 transition-all ${size} ${tone} ${checked ? `${fill} scale-105 shadow-md` : 'bg-white group-hover:scale-105 dark:bg-transparent'}`}>
                {checked && <span aria-hidden="true" className="text-sm font-bold text-white sm:text-lg">✓</span>}
              </span>
            </button>
          );
        })}
      </div>
      <div className="mt-1 flex justify-between text-sm font-semibold" aria-hidden="true">
        <span className="text-rose-700 dark:text-rose-300">Helt uenig</span>
        <span className="text-emerald-700 dark:text-emerald-300">Helt enig</span>
      </div>
      <p className="mt-2 min-h-[1.5rem] text-center text-base font-semibold" aria-live="polite">
        {value !== undefined ? SCALE_LABELS[value + 3] : <span className="muted font-normal">Velg hvor enig du er</span>}
      </p>
    </div>
  );
}

function ThemeProgress({ answers, current }: { answers: Answers; current: string }) {
  return (
    <ol className="mt-3 flex gap-1" aria-label="Fremdrift per tema">
      {questionsByTheme.map((g) => {
        const done = g.questions.filter((q) => answers[q.id] !== undefined).length;
        const isCur = g.theme.id === current;
        return (
          <li key={g.theme.id} className="flex-1" title={`${g.theme.label}: ${done}/${g.questions.length}`}>
            <span className="sr-only">
              {g.theme.label}: {done} av {g.questions.length}
            </span>
            <span className={`block h-1.5 overflow-hidden rounded-full ${isCur ? 'bg-brand-200 dark:bg-brand-800' : 'bg-sand-200 dark:bg-white/10'}`} aria-hidden="true">
              <span className="block h-full bg-brand-500 dark:bg-brand-400" style={{ width: `${(done / g.questions.length) * 100}%` }} />
            </span>
          </li>
        );
      })}
    </ol>
  );
}
