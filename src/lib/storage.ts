import { useCallback, useEffect, useState } from 'react';
import type { Answer, Answers, Importance } from './types';

const KEY = 'valgomat2027:v1';

interface Saved { answers: Answers; index: number; updated: number }

function load(): Saved {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Saved;
      if (parsed && typeof parsed === 'object' && parsed.answers) return { answers: parsed.answers, index: parsed.index ?? 0, updated: parsed.updated ?? 0 };
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
