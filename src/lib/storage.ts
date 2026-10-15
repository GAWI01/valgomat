import { useCallback, useEffect, useState } from 'react';
import type { Answer, Answers, Importance } from './types';
import raw from '../data/data.json';

const QUESTION_IDS = new Set((raw as { questions: Array<{ id: string }> }).questions.map((q) => q.id));

const KEY = 'valgomat2027:v1';

interface Saved { answers: Answers; index: number; updated: number }

/**
 * Lagrede data kan være endret for hånd eller komme fra en eldre versjon. Vi beholder bare svar på kjente
 * spørsmål med gyldig verdi (−3…3 eller «vet ikke») og viktighet (0/1/2), slik at scoringen aldri får søppel.
 */
export function sanitizeAnswers(input: unknown): Answers {
  const out: Answers = {};
  if (!input || typeof input !== 'object') return out;
  for (const [id, a] of Object.entries(input as Record<string, unknown>)) {
    if (!QUESTION_IDS.has(id) || !a || typeof a !== 'object') continue;
    const { value, importance } = a as { value?: unknown; importance?: unknown };
    const okValue = value === null || (typeof value === 'number' && Number.isInteger(value) && value >= -3 && value <= 3);
    if (!okValue) continue;
    const imp: Importance = importance === 1 || importance === 2 ? importance : 0;
    out[id] = { value: value as number | null, importance: imp };
  }
  return out;
}

function load(): Saved {
  try {
    const stored = localStorage.getItem(KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<Saved>;
      if (parsed && typeof parsed === 'object') {
        const index = typeof parsed.index === 'number' && Number.isInteger(parsed.index) && parsed.index >= 0 ? parsed.index : 0;
        const updated = typeof parsed.updated === 'number' ? parsed.updated : 0;
        return { answers: sanitizeAnswers(parsed.answers), index, updated };
      }
    }
  } catch {
    /* privat modus eller blokkert lagring: start tomt */
  }
  return { answers: {}, index: 0, updated: 0 };
}

function save(s: Saved) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* ignorer – siden fungerer uten lagring */
  }
}

/** Svarene lagres kun lokalt i nettleseren. Ingenting sendes til noen server. */
export function useAnswers() {
  const [state, setState] = useState<Saved>(load);

  useEffect(() => save(state), [state]);

  const setAnswer = useCallback((id: string, patch: Partial<Answer>) => {
    setState((s) => {
      const prev: Answer = s.answers[id] ?? { value: null, importance: 0 };
      // Uten eksplisitt verdi regnes et spørsmål som ubesvart; «Vet ikke» settes med value: null + dontKnow.
      const next = { ...prev, ...patch };
      return { ...s, answers: { ...s.answers, [id]: next }, updated: Date.now() };
    });
  }, []);

  const setImportance = useCallback((id: string, importance: Importance) => {
    setState((s) => {
      const prev = s.answers[id];
      if (!prev) return s; // viktighet kan bare settes på besvarte spørsmål
      return { ...s, answers: { ...s.answers, [id]: { ...prev, importance } }, updated: Date.now() };
    });
  }, []);

  const clearAnswer = useCallback((id: string) => {
    setState((s) => {
      const rest = { ...s.answers };
      delete rest[id];
      return { ...s, answers: rest, updated: Date.now() };
    });
  }, []);

  const setIndex = useCallback((index: number) => setState((s) => ({ ...s, index })), []);
  const reset = useCallback(() => setState({ answers: {}, index: 0, updated: Date.now() }), []);

  return { answers: state.answers, index: state.index, setAnswer, setImportance, clearAnswer, setIndex, reset };
}

export function useTheme() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    try {
      localStorage.setItem('valgomat2027:theme', dark ? 'dark' : 'light');
    } catch {
      /* ignorer */
    }
  }, [dark]);
  return { dark, toggle: () => setDark((d) => !d) };
}
