import raw from '../data/data.json';
import type { Dataset, Party, Position, Question, Source, SourceRef } from './types';
import { getPosition } from './scoring';

export const data = raw as Dataset;

export const SCALE_LABELS = ['Helt uenig', 'Uenig', 'Litt uenig', 'Nøytral', 'Litt enig', 'Enig', 'Helt enig'] as const;

export function valueLabel(v: number | null | undefined): string {
  if (v === null || v === undefined) return 'Ukjent standpunkt';
  return SCALE_LABELS[v + 3];
}

export const CONFIDENCE_LABEL = { HIGH: 'Høy sikkerhet', MEDIUM: 'Middels sikkerhet', LOW: 'Lav sikkerhet' } as const;
export const CONFIDENCE_HELP = {
  HIGH: 'Direkte og tydelig formulert i vedtatt program.',
  MEDIUM: 'Utledet tydelig fra ett eller flere offisielle standpunkter.',
  LOW: 'Indirekte eller uklart. Teller mindre i beregningen.',
} as const;

const partyById = new Map(data.parties.map((p) => [p.id, p]));
const questionById = new Map(data.questions.map((q) => [q.id, q]));
const sourceById = new Map(data.sources.map((s) => [s.id, s]));
const themeById = new Map(data.themes.map((t) => [t.id, t]));

export const party = (id: string): Party => partyById.get(id)!;
export const question = (id: string): Question => questionById.get(id)!;
export const source = (id: string): Source | undefined => sourceById.get(id);
export const themeLabel = (id: string): string => themeById.get(id)?.label ?? id;
export const position = (q: string, p: string): Position | undefined => getPosition(data, q, p);

/** Lenke til kilden, med #page= for PDF-er slik at de fleste PDF-lesere åpner riktig side. */
export function refUrl(ref: SourceRef): string | null {
  const s = source(ref.source);
  if (!s) return null;
  const first = ref.pages?.split(/[,\-–]/)[0]?.trim();
  if (first && /\.pdf|download|dl=/.test(s.url)) return `${s.url}#page=${first}`;
  return s.url;
}

export function refLabel(ref: SourceRef): string {
  const s = source(ref.source);
  if (!s) return ref.source;
  return ref.pages ? `${s.title}, PDF-side ${ref.pages}` : s.title;
}

export const questionsByTheme = data.themes.map((t) => ({ theme: t, questions: data.questions.filter((q) => q.theme === t.id) }));
/** Spørsmålsrekkefølgen i testen: gruppert per tema. */
export const orderedQuestions: Question[] = questionsByTheme.flatMap((g) => g.questions);

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const months = ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'desember'];
  return `${d}. ${months[m - 1]} ${y}`;
}

export const pct = (x: number | null | undefined): string => (x === null || x === undefined ? '–' : `${Math.round(x * 100)} %`);

/** Velger svart eller hvit tekst på en partifarge, etter hva som gir best kontrast (WCAG). */
export function textOn(hex: string): string {
  const c = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => {
    const v = parseInt(c.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  const L = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const contrastWhite = 1.05 / (L + 0.05);
  const contrastDark = (L + 0.05) / (0.0094 + 0.05); // #111827
  return contrastDark > contrastWhite ? '#111827' : '#ffffff';
}
