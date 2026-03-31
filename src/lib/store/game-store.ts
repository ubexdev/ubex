import { create } from "zustand";
import type { GameSession, PlayerProgress } from "@/types";

interface GameStore {
  // Current game session (real-time synced)
  session: GameSession | null;
  setSession: (session: GameSession | null) => void;

  // Current player progress
  progress: PlayerProgress | null;
  setProgress: (progress: PlayerProgress | null) => void;

  // Countdown timer
  countdownSeconds: number;
  setCountdownSeconds: (seconds: number) => void;

  // Active participants count (live)
  liveParticipantCount: number;
  setLiveParticipantCount: (count: number) => void;

  // UI state
  isSubmitting: boolean;
  setIsSubmitting: (v: boolean) => void;

  // Reset
  reset: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  session: null,
  setSession: (session) => set({ session }),

  progress: null,
  setProgress: (progress) => set({ progress }),

  countdownSeconds: 0,
  setCountdownSeconds: (countdownSeconds) => set({ countdownSeconds }),

  liveParticipantCount: 0,
  setLiveParticipantCount: (liveParticipantCount) =>
    set({ liveParticipantCount }),

  isSubmitting: false,
  setIsSubmitting: (isSubmitting) => set({ isSubmitting }),

  reset: () =>
    set({
      session: null,
      progress: null,
      countdownSeconds: 0,
      liveParticipantCount: 0,
      isSubmitting: false,
    }),
}));
