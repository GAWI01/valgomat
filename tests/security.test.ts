import { describe, expect, it } from 'vitest';
import { parseHash } from '../src/lib/router';
import { sanitizeAnswers } from '../src/lib/storage';
import realData from '../src/data/data.json';

describe('URL-parametre', () => {
  it('ugyldig prosentkoding krasjer ikke', () => {
    expect(() => parseHash('#/sak/%E0%A4%A')).not.toThrow();
    expect(parseHash('#/sak/%E0%A4%A')).toEqual({ name: 'question', id: '' });
  });
  it('spørsmålsnummer valideres', () => {
    expect(parseHash('#/sporsmal/abc')).toEqual({ name: 'quiz', index: 0 });
    expect(parseHash('#/sporsmal/-5')).toEqual({ name: 'quiz', index: 0 });
    expect(parseHash('#/sporsmal/1e9')).toEqual({ name: 'quiz', index: 0 });
    expect(parseHash('#/sporsmal/3')).toEqual({ name: 'quiz', index: 2 });
  });
  it('dyplenke til en del av kildesiden', () => {
    expect(parseHash('#/kilder/andre-partier')).toEqual({ name: 'sources', section: 'andre-partier' });
    expect(parseHash('#/kilder')).toEqual({ name: 'sources', section: undefined });
  });
  it('ukjente ruter gir forsiden', () => {
    expect(parseHash('#/<script>alert(1)</script>')).toEqual({ name: 'home' });
  });
});

describe('Lagrede svar', () => {
  const id = realData.questions[0].id;
  it('beholder gyldige svar', () => {
    expect(sanitizeAnswers({ [id]: { value: 2, importance: 1 } })).toEqual({ [id]: { value: 2, importance: 1 } });
    expect(sanitizeAnswers({ [id]: { value: null, importance: 0 } })).toEqual({ [id]: { value: null, importance: 0 } });
  });
  it('forkaster ukjente spørsmål, ugyldige verdier og søppel', () => {
    expect(sanitizeAnswers({ ukjent: { value: 1, importance: 0 } })).toEqual({});
    expect(sanitizeAnswers({ [id]: { value: 9, importance: 0 } })).toEqual({});
    expect(sanitizeAnswers({ [id]: { value: '2', importance: 0 } })).toEqual({});
    expect(sanitizeAnswers({ [id]: { value: 1, importance: 7 } })).toEqual({ [id]: { value: 1, importance: 0 } });
    expect(sanitizeAnswers('tull')).toEqual({});
    expect(sanitizeAnswers(null)).toEqual({});
  });
});

describe('Kildelenker', () => {
  it('alle kilde-URL-er er https', () => {
    for (const s of realData.sources as unknown as Array<Record<string, string>>) {
      for (const k of ['url', 'landingPage', 'mirror']) if (s[k]) expect(s[k]).toMatch(/^https:\/\//);
    }
  });
});
