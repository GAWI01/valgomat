export type Confidence = 'HIGH' | 'MEDIUM' | 'LOW';

export interface Theme { id: string; label: string }
export interface Dimension { id: string; label: string; left: string; right: string }
export interface Party { id: string; name: string; short: string; color: string; programSource: string }

export interface Source {
  id: string;
  party: string | null;
  type: string;
  title: string;
  url: string;
  landingPage?: string;
  mirror?: string;
  adopted: string | null;
  accessed: string;
  pages?: number;
  sha256?: string;
  note?: string;
}

export interface Question {
  id: string;
  theme: string;
  /** Tema-lokal klynge av sterkt korrelerte spørsmål, brukt mot dobbelttelling. */
  cluster: string;
  short: string;
  text: string;
  background: string;
  pro: string[];
  con: string[];
  /** Akse → +1/-1. +1: «enig» trekker mot høyre pol på aksen. */
  dims: Record<string, 1 | -1>;
}

export interface SourceRef { source: string; pages: string | null }

export interface Position {
  question: string;
  party: string;
  /** -3..3, eller null når standpunktet er ukjent («unknown»). */
  position: number | null;
  confidence: Confidence | null;
  reasoning: string;
  refs: SourceRef[];
}

export interface Dataset {
  meta: { lastUpdated: string; scale: { min: number; max: number } };
  themes: Theme[];
  dimensions: Dimension[];
  parties: Party[];
  sources: Source[];
  questions: Question[];
  positions: Position[];
}

/** 0 = vanlig, 1 = ⭐ viktig, 2 = ⭐⭐ en av mine viktigste saker */
export type Importance = 0 | 1 | 2;

export interface Answer {
  /** -3..3, eller null for «Vet ikke / ønsker ikke å svare». */
  value: number | null;
  importance: Importance;
}

export type Answers = Record<string, Answer>;
