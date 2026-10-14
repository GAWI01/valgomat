import type { ReactNode } from 'react';
import type { Confidence, SourceRef } from '../lib/types';
import { CONFIDENCE_HELP, CONFIDENCE_LABEL, party, refLabel, refUrl, valueLabel } from '../lib/data';

export function PartySwatch({ id, size = 'md' }: { id: string; size?: 'sm' | 'md' | 'lg' }) {
  const p = party(id);
  const cls = size === 'sm' ? 'h-6 min-w-6 text-[10px] leading-5' : size === 'lg' ? 'h-11 min-w-11 text-sm' : 'h-8 min-w-8 text-xs';
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-lg px-1 font-bold text-white ${cls}`}
      style={{ backgroundColor: p.color }}
    >
      {p.short}
    </span>
  );
}

export function PartyName({ id, full = false }: { id: string; full?: boolean }) {
  const p = party(id);
  return (
    <span className="inline-flex items-center gap-2">
      <PartySwatch id={id} size="sm" />
      <span className="font-semibold">{full ? p.name : p.short}</span>
    </span>
  );
}

export function ConfidenceBadge({ c }: { c: Confidence | null }) {
  if (!c) return <span className="chip bg-sand-100 text-ink-soft dark:bg-white/10 dark:text-slate-300">Ukjent</span>;
  const cls =
    c === 'HIGH'
      ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-500/20 dark:text-emerald-200'
      : c === 'MEDIUM'
        ? 'bg-amber-100 text-amber-900 dark:bg-amber-500/20 dark:text-amber-200'
        : 'bg-rose-100 text-rose-900 dark:bg-rose-500/20 dark:text-rose-200';
  return (
    <span className={`chip ${cls}`} title={CONFIDENCE_HELP[c]}>
      {CONFIDENCE_LABEL[c]}
    </span>
  );
}

/** Viser en verdi på skalaen -3..3 som en liten punktrekke, med tekstlig etikett for skjermlesere. */
export function ScaleDots({ value, label, color }: { value: number | null; label?: string; color?: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="inline-flex gap-[3px]" aria-hidden="true">
        {[-3, -2, -1, 0, 1, 2, 3].map((v) => (
          <span
            key={v}
            className={`h-2.5 w-2.5 rounded-full ${v === value ? '' : 'bg-sand-200 dark:bg-white/15'}`}
            style={v === value ? { backgroundColor: color ?? '#5847c9' } : undefined}
          />
        ))}
      </span>
      <span className="text-sm">{label ?? valueLabel(value)}</span>
    </span>
  );
}

export function SourceLinks({ refs }: { refs: SourceRef[] }) {
  return (
    <ul className="mt-1 space-y-1 text-sm">
      {refs.map((r, i) => {
        const url = refUrl(r);
        return (
          <li key={i}>
            Kilde:{' '}
            {url ? (
              <a href={url} target="_blank" rel="noopener noreferrer">
                {refLabel(r)}
              </a>
            ) : (
              refLabel(r)
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function Stars({ n }: { n: number }) {
  if (!n) return null;
  return (
    <span className="text-amber-500" aria-label={n === 2 ? 'En av dine viktigste saker' : 'Viktig for deg'} title={n === 2 ? 'En av dine viktigste saker' : 'Viktig for deg'}>
      {'★'.repeat(n)}
    </span>
  );
}

export function Section({ title, children, id, lead }: { title: string; children: ReactNode; id?: string; lead?: ReactNode }) {
  return (
    <section id={id} className="mt-10 scroll-mt-20" aria-labelledby={id ? `${id}-h` : undefined}>
      <h2 id={id ? `${id}-h` : undefined} className="text-xl font-bold sm:text-2xl">
        {title}
      </h2>
      {lead && <p className="muted mt-1 max-w-prose">{lead}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function PageTitle({ children, kicker }: { children: ReactNode; kicker?: ReactNode }) {
  return (
    <header className="mb-6">
      {kicker && <p className="text-sm font-semibold uppercase tracking-wide text-brand-700 dark:text-brand-200">{kicker}</p>}
      <h1 className="mt-1 text-3xl font-extrabold leading-tight sm:text-4xl sm:leading-10">{children}</h1>
    </header>
  );
}
