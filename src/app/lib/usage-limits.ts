/**
 * @fileOverview Gerencia os limites de uso diário da Clima IA.
 */

const USAGE_KEY = 'clima_ia_usage_v2';

export type UsageType = 'analysis' | 'guides';

interface UsageData {
  date: string;
  analysisCount: number;
  guidesCount: number;
}

const LIMITS = {
  analysis: {
    authenticated: 15,
    anonymous: 3,
  },
  guides: {
    authenticated: 8,
    anonymous: 1,
  },
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

export function checkLimit(type: UsageType, isAnonymous: boolean): { allowed: boolean; remaining: number; limit: number } {
  const usage = getUsage();
  const currentCount = type === 'analysis' ? usage.analysisCount : usage.guidesCount;
  const limit = isAnonymous ? LIMITS[type].anonymous : LIMITS[type].authenticated;
  
  return {
    allowed: currentCount < limit,
    remaining: Math.max(0, limit - currentCount),
    limit,
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
