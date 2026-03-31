/**
 * Server-side game validation helpers.
 * These run ONLY on the server — answers never reach the client bundle.
 */

/** Strip accents, lowercase, and trim whitespace. */
export function normalizeAnswer(answer: string): string {
  return answer
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/** Check if a given answer matches any of the correct answers. */
export function checkAnswer(given: string, correctAnswers: string[]): boolean {
  const normalized = normalizeAnswer(given);
  return correctAnswers.some((ca) => normalizeAnswer(ca) === normalized);
}

/** Haversine distance in metres between two lat/lng points. */
export function haversineMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6_371_000; // Earth radius in metres
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const DIFFICULTY_BASE_SCORE: Record<string, number> = {
  easy: 100,
  medium: 200,
  hard: 300,
  extreme: 500,
};

/** Calculate total score earned for a single level completion. */
export function calculateScore(
  difficulty: string,
  isExplorer: boolean,
  timeSpentSeconds: number,
  hintUsed: boolean,
): number {
  let score = DIFFICULTY_BASE_SCORE[difficulty] ?? 100;

  if (isExplorer) {
    score = Math.round(score * 1.5);
  }

  // Time bonus: faster = more points (max 300)
  score += Math.max(0, 300 - timeSpentSeconds);

  // Hint penalty
  if (hintUsed) {
    score -= 50;
  }

  return Math.max(0, score);
}
