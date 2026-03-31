import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

/** POST /api/game/sessions — Start a new game session (auth required). */
export async function POST(request: NextRequest) {
  try {
    const supabase = await getSupabaseServer();

    // Auth check
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { saga_id, difficulty } = body as {
      saga_id?: string;
      difficulty?: string;
    };

    if (!saga_id) {
      return NextResponse.json(
        { error: "saga_id is required" },
        { status: 400 },
      );
    }

    if (difficulty !== "libre" && difficulty !== "explorador") {
      return NextResponse.json(
        { error: 'difficulty must be "libre" or "explorador"' },
        { status: 400 },
      );
    }

    // Verify saga exists and is active
    const { data: saga, error: sagaError } = await supabase
      .from("sagas")
      .select("id, status")
      .eq("id", saga_id)
      .single();

    if (sagaError || !saga) {
      return NextResponse.json({ error: "Saga not found" }, { status: 404 });
    }

    if (saga.status !== "active") {
      return NextResponse.json(
        { error: "Saga is not active" },
        { status: 400 },
      );
    }

    // Create game session (starts at level 1)
    const { data: session, error: sessionError } = await supabase
      .from("game_sessions")
      .insert({
        saga_id,
        user_id: user.id,
        difficulty,
        current_level: 1,
        score: 0,
        status: "active",
      })
      .select("id, current_level, score, difficulty, status, started_at")
      .single();

    if (sessionError || !session) {
      return NextResponse.json(
        { error: sessionError?.message ?? "Failed to create session" },
        { status: 500 },
      );
    }

    // Fetch level 1 data (without answers)
    const { data: firstLevel } = await supabase
      .from("levels")
      .select(
        "id, number, title, clue_text, hint, difficulty, spawn_lat, spawn_lng, spawn_heading, spawn_pitch, proximity_radius_m",
      )
      .eq("saga_id", saga_id)
      .eq("number", 1)
      .single();

    return NextResponse.json(
      { session, level: firstLevel ?? null },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
