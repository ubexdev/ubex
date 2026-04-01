import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

/** GET /api/game/sagas/[sagaId]/play — Full saga + levels for gameplay (including answers). */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ sagaId: string }> },
) {
  try {
    const { sagaId } = await params;
    const supabase = await getSupabaseServer();

    // Fetch saga
    const { data: saga, error: sagaError } = await supabase
      .from("sagas")
      .select(
        "id, title, subtitle, description, city, country, prize_amount_usd, max_participants, saga_type, total_levels, difficulty, cover_image_url, starts_at, ends_at",
      )
      .eq("id", sagaId)
      .single();

    if (sagaError || !saga) {
      return NextResponse.json({ error: "Saga not found" }, { status: 404 });
    }

    // Fetch levels WITH answers and target coordinates for gameplay
    const { data: levels, error: levelsError } = await supabase
      .from("levels")
      .select(
        "id, number, level_number, title, clue_text, hint, hints, difficulty, spawn_lat, spawn_lng, spawn_heading, spawn_pitch, target_lat, target_lng, correct_answers, answer, explanation, proximity_radius_m, proximity_radius, points, time_limit",
      )
      .eq("saga_id", sagaId)
      .order("number", { ascending: true });

    if (levelsError) {
      return NextResponse.json(
        { error: levelsError.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ ...saga, levels: levels ?? [] });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
