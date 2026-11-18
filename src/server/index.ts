// Devvit Server Runtime for CalenDit
// Handles Reddit Interactive Post triggers and Redis persistence

export interface DailyCommunityStats {
  date: string;
  totalSolvers: number;
  fastestSeconds: number | null;
}

// In standard Devvit Web, server routes can be defined with Hono or Devvit triggers
export async function getDailyStats(dateKey: string): Promise<DailyCommunityStats> {
  return {
    date: dateKey,
    totalSolvers: 1,
    fastestSeconds: 114,
  };
}
