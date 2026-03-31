import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

/** GET /api/game/leaderboard — Public leaderboard. */
export async function GET(request: NextRequest) {
  try {
    const supabase = await getSupabaseServer();
    const { searchParams } = new URL(request.url);

    const sagaId = searchParams.get("saga_id");
    const limit = Math.min(
      Number(searchParams.get("limit")) || 50,
      100,
    );

    if (sagaId) {
      // Saga-specific leaderboard: rank by score within that saga's sessions
      const { data, error } = await supabase
        .from("game_sessions")
        .select(
          "user_id, score, profiles!inner(display_name, avatar_url, sagas_completed)",
        )
        .eq("saga_id", sagaId)
        .eq("status", "completed")
        .order("score", { ascending: false })
        .limit(limit);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      const leaderboard = (data ?? []).map((row, index) => {
        const profile = row.profiles as unknown as {
          display_name: string | null;
          avatar_url: string | null;
          sagas_completed: number;
        };
        return {
          rank: index + 1,
          display_name: profile.display_name,
          avatar_url: profile.avatar_url,
          score: row.score,
          sagas_completed: profile.sagas_completed,
        };
      });

      return NextResponse.json(leaderboard);
    }

    // Global leaderboard from the DB view
    const { data, error } = await supabase
      .from("leaderboard")
      .select("*")
      .order("rank", { ascending: true })
      .limit(limit);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const leaderboard = (data ?? []).map((row) => ({
      rank: row.rank,
      display_name: row.display_name,
      avatar_url: row.avatar_url,
      score: row.total_score,
      sagas_completed: row.sagas_completed,
    }));

    return NextResponse.json(leaderboard);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
