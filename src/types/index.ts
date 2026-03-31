// UBEX - Core TypeScript Types

// ─── User & Auth ───
export interface UbexUser {
  uid: string;
  alphanumericId: string; // Generated membership ID
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  city: string;
  country: string;
  role: "player" | "admin";
  subscriptionTier: SubscriptionTier | null;
  acceptedTerms: boolean; // Must accept publicity clause
  createdAt: Date;
  updatedAt: Date;
}

export type SubscriptionTier =
  | "single" // 1 game
  | "triple" // 3 games
  | "six_pack" // 6 games
  | "saga_complete"; // 12 levels (full saga)

// ─── Saga & Levels ───
export interface Saga {
  id: string;
  title: string; // e.g. "Saga de Colón"
  description: string;
  city: string; // Target city for exploration
  country: string;
  totalLevels: 12;
  prizeAmountUSD: number; // e.g. 1000
  status: "draft" | "scheduled" | "active" | "completed";
  startsAt: Date;
  createdAt: Date;
  sponsorId?: string; // e.g. "Saga FedEx del Oro"
  maxParticipants: number; // e.g. 5000
  coverImageUrl?: string;
}

export interface Level {
  id: string;
  sagaId: string;
  number: number; // 1-12
  title: string;
  clue: Clue;
  startsAt: Date; // When the countdown reaches zero
  status: "locked" | "countdown" | "active" | "completed";
  correctAnswer: string; // The exact data/code to find
  answersCount: number; // How many got it right
  googleMapsUrl?: string; // Optional starting point
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Clue {
  text: string; // The riddle/instruction shown to the player
  hint?: string; // Optional paid hint (power-up)
  imageUrl?: string; // Visual clue
  streetViewPanoId?: string; // Specific Street View panorama
  difficulty: "easy" | "medium" | "hard" | "extreme";
}

// ─── Game State ───
export interface PlayerProgress {
  odette: string;
  sagaId: string;
  currentLevel: number;
  status: "active" | "eliminated" | "winner";
  completedLevels: CompletedLevel[];
  joinedAt: Date;
}

export interface CompletedLevel {
  levelNumber: number;
  answeredAt: Date;
  answer: string;
  isCorrect: boolean;
  timeToSolveMs: number; // Milliseconds from level start
}

export interface GameSession {
  sagaId: string;
  currentLevel: number;
  totalParticipants: number;
  activeParticipants: number;
  eliminatedCount: number;
  winnerId: string | null;
  countdownEndsAt: Date | null; // Next level unlock time
  status: "waiting" | "countdown" | "playing" | "completed";
}

// ─── Power-ups (Micro-transactions) ───
export type PowerUpType = "magnifying_glass" | "compass" | "time_freeze";

export interface PowerUp {
  id: string;
  type: PowerUpType;
  name: string;
  description: string;
  priceUSD: number;
  effect: string; // What it does in-game
}

// ─── Payments ───
export interface Payment {
  id: string;
  odette: string;
  amount: number;
  currency: "USD";
  provider: "paypal" | "google_pay";
  type: "subscription" | "power_up";
  status: "pending" | "completed" | "failed" | "refunded";
  metadata: Record<string, string>;
  createdAt: Date;
}

// ─── Real-time Events ───
export interface LiveGameEvent {
  type:
    | "player_joined"
    | "level_started"
    | "answer_submitted"
    | "player_eliminated"
    | "winner_declared"
    | "countdown_update";
  sagaId: string;
  levelNumber?: number;
  playerId?: string;
  timestamp: Date;
  data: Record<string, unknown>;
}

// ─── Admin ───
export interface AdminClueInput {
  sagaId: string;
  levelNumber: number;
  clueText: string;
  correctAnswer: string;
  googleMapsUrl?: string;
  coordinates?: { lat: number; lng: number };
  hint?: string;
  imageUrl?: string;
  startsAt: Date;
}
