/**
 * @fileOverview Gerencia os limites de uso diário da Vet IA.
 */

const USAGE_KEY = 'vet_ia_daily_usage';

export type UsageType = 'analysis' | 'guides';

interface UsageData {
  date: string;
  analysisCount: number;
  guidesCount: number;
}

const LIMITS = {
  analysis: 6,
  guides: 2,
};

function getTodayStr(): string {
  return new Date().toISOString().split('T')[0];
}

function getUsage(): UsageData {
  if (typeof window === 'undefined') return { date: getTodayStr(), analysisCount: 0, guidesCount: 0 };
  
  const stored = localStorage.getItem(USAGE_KEY);
  const today = getTodayStr();

  if (!stored) {
    return { date: today, analysisCount: 0, guidesCount: 0 };
  }

  try {
    const data: UsageData = JSON.parse(stored);
    if (data.date !== today) {
      return { date: today, analysisCount: 0, guidesCount: 0 };
    }
    return data;
  } catch {
    return { date: today, analysisCount: 0, guidesCount: 0 };
  }
}

export function checkLimit(type: UsageType): { allowed: boolean; remaining: number } {
  const usage = getUsage();
  const currentCount = type === 'analysis' ? usage.analysisCount : usage.guidesCount;
  const limit = LIMITS[type];
  
  return {
    allowed: currentCount < limit,
    remaining: Math.max(0, limit - currentCount),
  };
}

export function incrementUsage(type: UsageType) {
  if (typeof window === 'undefined') return;
  
  const usage = getUsage();
  if (type === 'analysis') {
    usage.analysisCount += 1;
  } else {
    usage.guidesCount += 1;
  }
  
  localStorage.setItem(USAGE_KEY, JSON.stringify(usage));
}
