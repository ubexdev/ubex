import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

/** GET /api/game/sagas/[sagaId] — Saga details + levels (without answers). */
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
        "id, title, subtitle, description, city, country, prize_amount_usd, max_participants, starts_at, ends_at, status",
      )
      .eq("id", sagaId)
      .single();

    if (sagaError || !saga) {
      return NextResponse.json({ error: "Saga not found" }, { status: 404 });
    }

    // Fetch levels — NEVER expose correct_answers, target_lat, target_lng, explanation
    const { data: levels, error: levelsError } = await supabase
      .from("levels")
      .select(
        "id, number, title, clue_text, hint, difficulty, spawn_lat, spawn_lng, spawn_heading, spawn_pitch, proximity_radius_m",
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
