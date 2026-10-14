/**
 * Datadrevne observasjoner om resultatet («dealbreakers» og interessante konflikter).
 * Ingen partifortellinger er hardkodet: alle setninger bygges fra brukerens svar og de kodede
 * standpunktene. Tersklene er bevisst konservative for å unngå støy.
 */
import type { Answers, Dataset } from './types';
import { isConflict, type ResultSummary } from './scoring';

export type Insight =
  | { kind: 'dealbreaker'; party: string; questionId: string; importance: 1 | 2; user: number; partyPos: number }
  | { kind: 'closePair'; a: string; b: string; gap: number; aBetter: string[]; bBetter: string[] }
  | { kind: 'themeWinner'; party: string; rank: number; theme: string; margin: number }
  | { kind: 'lowCoverage'; party: string; coverage: number };

export const DEALBREAKER_DISTANCE = 3; // f.eks. bruker +2, parti -1
export const THEME_DIFF = 0.1; // 10 prosentpoeng
export const CLOSE_PAIR_GAP = 3; // prosentpoeng
export const LOW_COVERAGE = 0.6;

export function buildInsights(data: Dataset, _answers: Answers, summary: ResultSummary): Insight[] {
  const out: Insight[] = [];
  const ranked = summary.ranking.filter((r) => r.score !== null);
  if (ranked.length === 0) return out;
  const top = ranked[0];

  // 1. Høyeste totalmatch, men tydelig uenig på en sak brukeren markerte som viktig.
  const conflicts = top.contributions
    .filter((c) => c.importance > 0 && c.party !== null && Math.abs(c.user - c.party) >= DEALBREAKER_DISTANCE && isConflict(c.user, c.party))
    .sort((a, b) => b.importance - a.importance || Math.abs(b.user - b.party!) - Math.abs(a.user - a.party!));
  for (const c of conflicts.slice(0, 3)) {
    out.push({ kind: 'dealbreaker', party: top.party, questionId: c.questionId, importance: c.importance as 1 | 2, user: c.user, partyPos: c.party! });
  }

  // 2. To partier nesten likt totalt – hvor skiller de seg for brukeren?
  if (ranked.length >= 2) {
    const [a, b] = ranked;
    const gap = (a.score! - b.score!) * 100;
    if (gap < CLOSE_PAIR_GAP) {
      const aBetter: string[] = [];
      const bBetter: string[] = [];
      for (const ta of a.themes) {
        const tb = b.themes.find((t) => t.theme === ta.theme);
        if (!tb || ta.score === null || tb.score === null || ta.known === 0 || tb.known === 0) continue;
        const d = ta.score - tb.score;
        if (d >= THEME_DIFF) aBetter.push(ta.theme);
        else if (-d >= THEME_DIFF) bBetter.push(ta.theme);
      }
      if (aBetter.length || bBetter.length) out.push({ kind: 'closePair', a: a.party, b: b.party, gap, aBetter, bBetter });
    }
  }

  // 3. Parti lenger ned på lista som likevel er best på et helt tema (med minst to besvarte spørsmål).
  //    Maks tre, de med størst margin, for å unngå støy.
  const winners: Insight[] = [];
  for (const theme of data.themes) {
    const scored = ranked
      .map((r, i) => ({ r, rank: i + 1, t: r.themes.find((t) => t.theme === theme.id) }))
      .filter((x) => x.t && x.t.score !== null && x.t.known >= 2 && x.t.answered >= 2)
      .sort((x, y) => y.t!.score! - x.t!.score!);
    if (scored.length < 2) continue;
    const [first, second] = scored;
    const margin = first.t!.score! - second.t!.score!;
    if (first.rank >= 3 && margin >= 0.05) {
      winners.push({ kind: 'themeWinner', party: first.r.party, rank: first.rank, theme: theme.id, margin });
    }
  }
  winners.sort((x, y) => (y.kind === 'themeWinner' ? y.margin : 0) - (x.kind === 'themeWinner' ? x.margin : 0));
  out.push(...winners.slice(0, 3));

  // 4. Partier der vi kjenner for lite av standpunktene bak brukerens svar.
  for (const r of ranked) if (r.coverage < LOW_COVERAGE) out.push({ kind: 'lowCoverage', party: r.party, coverage: r.coverage });

  return out;
}
