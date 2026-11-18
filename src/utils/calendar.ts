import { MONTH_NAMES } from '../constants/board';
import type { PuzzleDate } from '../types/game';

/**
 * Returns today's local puzzle date
 */
export function getTodayDate(): PuzzleDate {
  const now = new Date();
  return {
    month: now.getMonth(), // 0-11
    day: now.getDate(), // 1-31
  };
}

/**
 * Convert PuzzleDate to date string key: "YYYY-MM-DD"
 */
export function toDateKey(date: PuzzleDate, year: number = new Date().getFullYear()): string {
  const m = String(date.month + 1).padStart(2, '0');
  const d = String(date.day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Generate a Reddit comment spoiler share card
 */
export function generateShareText(
  date: PuzzleDate,
  timeSeconds: number,
  moves: number,
  hintsUsed: number,
  streak: number
): string {
  const monthName = MONTH_NAMES[date.month];
  const timeFormatted = formatTime(timeSeconds);

  return [
    `CalenDit — ${monthName} ${date.day} 🧩`,
    `⏱️ Time: ${timeFormatted} | 🔄 Moves: ${moves}${hintsUsed > 0 ? ` | 💡 Hints: ${hintsUsed}` : ''}`,
    `🔥 Streak: ${streak} day${streak === 1 ? '' : 's'}`,
    `[ 🟧 🟦 🟩 🟨 🟪 🟫 🟥 ⬜ ]`,
    `Play today's puzzle in the post!`,
  ].join('\n');
}
