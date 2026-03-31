/**
 * Auto-generated Supabase Database types.
 * Replace with `supabase gen types typescript` once project is created.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          avatar_url: string | null;
          role: "player" | "admin";
          team_id: string | null;
          total_score: number;
          sagas_completed: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          avatar_url?: string | null;
          role?: "player" | "admin";
          team_id?: string | null;
          total_score?: number;
          sagas_completed?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          role?: "player" | "admin";
          team_id?: string | null;
          total_score?: number;
          sagas_completed?: number;
          updated_at?: string;
        };
      };
      sagas: {
        Row: {
          id: string;
          title: string;
          subtitle: string | null;
          description: string | null;
          city: string;
          country: string;
          prize_amount_usd: number;
          max_participants: number;
          status: "draft" | "active" | "completed";
          starts_at: string | null;
          ends_at: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          subtitle?: string | null;
          description?: string | null;
          city: string;
          country: string;
          prize_amount_usd?: number;
          max_participants?: number;
          status?: "draft" | "active" | "completed";
          starts_at?: string | null;
          ends_at?: string | null;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          subtitle?: string | null;
          description?: string | null;
          city?: string;
          country?: string;
          prize_amount_usd?: number;
          max_participants?: number;
          status?: "draft" | "active" | "completed";
          starts_at?: string | null;
          ends_at?: string | null;
          updated_at?: string;
        };
      };
      levels: {
        Row: {
          id: string;
          saga_id: string;
          number: number;
          title: string;
          clue_text: string;
          hint: string | null;
          difficulty: "easy" | "medium" | "hard" | "extreme";
          spawn_lat: number;
          spawn_lng: number;
          spawn_heading: number;
          spawn_pitch: number;
          target_lat: number;
          target_lng: number;
          correct_answers: string[];
          explanation: string | null;
          proximity_radius_m: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          saga_id: string;
          number: number;
          title: string;
          clue_text: string;
          hint?: string | null;
          difficulty?: "easy" | "medium" | "hard" | "extreme";
          spawn_lat: number;
          spawn_lng: number;
          spawn_heading?: number;
          spawn_pitch?: number;
          target_lat: number;
          target_lng: number;
          correct_answers: string[];
          explanation?: string | null;
          proximity_radius_m?: number;
          created_at?: string;
        };
        Update: {
          number?: number;
          title?: string;
          clue_text?: string;
          hint?: string | null;
          difficulty?: "easy" | "medium" | "hard" | "extreme";
          spawn_lat?: number;
          spawn_lng?: number;
          spawn_heading?: number;
          spawn_pitch?: number;
          target_lat?: number;
          target_lng?: number;
          correct_answers?: string[];
          explanation?: string | null;
          proximity_radius_m?: number;
        };
      };
      game_sessions: {
        Row: {
          id: string;
          saga_id: string;
          user_id: string;
          current_level: number;
          score: number;
          difficulty: "libre" | "explorador";
          status: "active" | "completed" | "abandoned";
          started_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          saga_id: string;
          user_id: string;
          current_level?: number;
          score?: number;
          difficulty?: "libre" | "explorador";
          status?: "active" | "completed" | "abandoned";
          started_at?: string;
          completed_at?: string | null;
        };
        Update: {
          current_level?: number;
          score?: number;
          status?: "active" | "completed" | "abandoned";
          completed_at?: string | null;
        };
      };
      level_attempts: {
        Row: {
          id: string;
          session_id: string;
          level_id: string;
          answer_given: string;
          is_correct: boolean;
          distance_to_target_m: number | null;
          time_spent_seconds: number;
          attempted_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          level_id: string;
          answer_given: string;
          is_correct: boolean;
          distance_to_target_m?: number | null;
          time_spent_seconds: number;
          attempted_at?: string;
        };
        Update: never;
      };
      teams: {
        Row: {
          id: string;
          name: string;
          invite_code: string;
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          invite_code?: string;
          created_by: string;
          created_at?: string;
        };
        Update: {
          name?: string;
        };
      };
    };
    Views: {
      leaderboard: {
        Row: {
          user_id: string;
          display_name: string | null;
          avatar_url: string | null;
          total_score: number;
          sagas_completed: number;
          rank: number;
        };
      };
    };
    Functions: Record<string, never>;
    Enums: {
      user_role: "player" | "admin";
      saga_status: "draft" | "active" | "completed";
      difficulty_mode: "libre" | "explorador";
      session_status: "active" | "completed" | "abandoned";
      level_difficulty: "easy" | "medium" | "hard" | "extreme";
    };
  };
}
