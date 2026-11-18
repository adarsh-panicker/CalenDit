import type { GameStats } from '../types/game';

const STATS_KEY = 'calenDit_stats';

export function loadStats(): GameStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }

  return {
    completedDates: [],
    streak: 0,
    lastPlayedDate: '',
    bestTimeSeconds: null,
    totalGamesPlayed: 0,
  };
}

export function saveStats(stats: GameStats): void {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    // ignore
  }
}

export function recordGameWin(dateKey: string, timeSeconds: number): GameStats {
  const stats = loadStats();

  if (!stats.completedDates.includes(dateKey)) {
    stats.completedDates.push(dateKey);
    stats.totalGamesPlayed += 1;

    // Check streak
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

    if (stats.lastPlayedDate === yKey) {
      stats.streak += 1;
    } else if (stats.lastPlayedDate === dateKey) {
      // already played today
    } else {
      stats.streak = 1;
    }

    stats.lastPlayedDate = dateKey;

    if (stats.bestTimeSeconds === null || timeSeconds < stats.bestTimeSeconds) {
      stats.bestTimeSeconds = timeSeconds;
    }

    saveStats(stats);
  }

  return stats;
}
