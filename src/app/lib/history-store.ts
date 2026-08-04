
export type AnalysisEntry = {
  id: string;
  type: 'text' | 'image' | 'guide';
  timestamp: number;
  input: string; // descrição do problema ou marca do aparelho
  output: any; // Resultado da IA (Clima IA)
};

const HISTORY_KEY = 'clima_ia_history';

export function saveAnalysis(entry: Omit<AnalysisEntry, 'id' | 'timestamp'>) {
  if (typeof window === 'undefined') return;
  const history = getHistory();
  const newEntry: AnalysisEntry = {
    ...entry,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  };
  const updated = [newEntry, ...history].slice(0, 50);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  return newEntry;
}

export function getHistory(): AnalysisEntry[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(HISTORY_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function clearHistory() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(HISTORY_KEY);
}
