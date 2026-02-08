export type Tab = 'mission' | 'editor' | 'report' | 'manual' | 'history';

export interface Theme {
  eixo: string;
  titulo: string;
  frase: string;
}

export interface Repertorio {
  fonte: string;
  texto: string;
}

export interface ConnectiveSet {
  inter: string[];
  intra: string[];
}

export interface Mission {
  id: number;
  type: 'static' | 'ai';
  tema: Theme;
  conectivos: ConnectiveSet;
  repertorio: Repertorio;
  status: 'pending' | 'completed';
}

export interface ConnectiveUsage {
  word: string;
  used: boolean;
}

export interface Report {
  score: number;
  usedInter: ConnectiveUsage[];
  paragraphs: number;
  violation: string | null;
  feedback: string;
  checklist_c5: boolean;
  lineCount?: number;
  date?: string;
  type?: 'local' | 'ai';
}

export interface HistoryItem {
  mission: Mission;
  result: Report;
  text: string;
}

export interface HelpContent {
  title: string;
  text: string;
}

export interface ManualConnectives {
  [key: string]: string[];
}