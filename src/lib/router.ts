import { useEffect, useState } from 'react';

export type Route =
  | { name: 'home' }
  | { name: 'quiz'; index: number }
  | { name: 'overview' }
  | { name: 'results'; party?: string; tab?: string }
  | { name: 'question'; id: string }
  | { name: 'method' }
  | { name: 'why' }
  | { name: 'sources'; section?: string };

/** Ugyldig prosentkoding (f.eks. «%E0%A4») skal ikke krasje appen. */
function safeDecode(s: string): string {
  try {
    return decodeURIComponent(s);
  } catch {
    return '';
  }
}

export function parseHash(hash: string): Route {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(safeDecode);
  switch (parts[0]) {
    case 'sporsmal': {
      const n = Number(parts[1] ?? 1);
      return { name: 'quiz', index: Number.isInteger(n) && n >= 1 && n <= 1000 ? n - 1 : 0 };
    }
    case 'oversikt': return { name: 'overview' };
    case 'resultat': return { name: 'results', party: parts[1] === 'parti' ? parts[2] : undefined, tab: parts[1] !== 'parti' ? parts[1] : undefined };
    case 'sak': return { name: 'question', id: parts[1] ?? '' };
    case 'metode': return { name: 'method' };
    case 'hvorfor-ulikt': return { name: 'why' };
    case 'kilder': return { name: 'sources', section: parts[1] };
    default: return { name: 'home' };
  }
}

export function href(r: Route): string {
  switch (r.name) {
    case 'home': return '#/';
    case 'quiz': return `#/sporsmal/${r.index + 1}`;
    case 'overview': return '#/oversikt';
    case 'results': return r.party ? `#/resultat/parti/${r.party}` : r.tab ? `#/resultat/${r.tab}` : '#/resultat';
    case 'question': return `#/sak/${r.id}`;
    case 'method': return '#/metode';
    case 'why': return '#/hvorfor-ulikt';
    case 'sources': return r.section ? `#/kilder/${r.section}` : '#/kilder';
  }
}

export function navigate(r: Route) {
  window.location.hash = href(r);
}

export function useRoute(): Route {
  const [route, setRoute] = useState(() => parseHash(window.location.hash));
  useEffect(() => {
    const on = () => {
      setRoute(parseHash(window.location.hash));
    };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return route;
}
