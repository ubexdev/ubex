import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import {
  checkAnswer,
  haversineMeters,
  calculateScore,
} from "@/lib/game/validation";

const TOTAL_LEVELS = 12;

/** POST /api/game/sessions/[sessionId]/validate — Validate an answer (auth required). */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> },
) {
  try {
    const { sessionId } = await params;
    const supabase = await getSupabaseServer();

    // Auth check
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch session and verify ownership
    const { data: session, error: sessionError } = await supabase
      .from("game_sessions")
      .select("*")
      .eq("id", sessionId)
      .single();

    if (sessionError || !session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 },
      );
    }

    if (session.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (session.status !== "active") {
      return NextResponse.json(
        { error: "Session is no longer active" },
        { status: 400 },
      );
    }

    // Parse request body
    const body = await request.json();
    const {
      level_id,
      answer,
      player_lat,
      player_lng,
      hint_used = false,
      time_spent_seconds = 0,
    } = body as {
      level_id?: string;
      answer?: string;
      player_lat?: number;
      player_lng?: number;
      hint_used?: boolean;
      time_spent_seconds?: number;
    };

    if (!level_id || !answer) {
      return NextResponse.json(
        { error: "level_id and answer are required" },
        { status: 400 },
      );
    }

    // Fetch the level (server-side only — includes correct_answers & target coords)
    const { data: level, error: levelError } = await supabase
      .from("levels")
      .select("*")
      .eq("id", level_id)
      .single();

    if (levelError || !level) {
      return NextResponse.json({ error: "Level not found" }, { status: 404 });
    }

    // Validate the level belongs to the session's saga
    if (level.saga_id !== session.saga_id) {
      return NextResponse.json(
        { error: "Level does not belong to this saga" },
        { status: 400 },
      );
    }

    // --- Core validation logic ---
    const answerCorrect = checkAnswer(answer, level.correct_answers);

    // Proximity check for "explorador" mode
    let distanceToTarget: number | null = null;
    let proximityPassed = true;

    if (session.difficulty === "explorador") {
      if (player_lat == null || player_lng == null) {
        return NextResponse.json(
          {
            error:
              "player_lat and player_lng are required in explorador mode",
          },
          { status: 400 },
        );
      }

      distanceToTarget = haversineMeters(
        player_lat,
        player_lng,
        level.target_lat,
        level.target_lng,
      );

      proximityPassed = distanceToTarget <= level.proximity_radius_m;
    }

    const isCorrect = answerCorrect && proximityPassed;

    // Record the attempt
    await supabase.from("level_attempts").insert({
      session_id: sessionId,
      level_id,
      answer_given: answer,
      is_correct: isCorrect,
      distance_to_target_m: distanceToTarget,
      time_spent_seconds,
    });

    // Build response
    const response: Record<string, unknown> = { correct: isCorrect };

    if (isCorrect) {
      // Calculate score
      const scoreEarned = calculateScore(
        level.difficulty,
        session.difficulty === "explorador",
        time_spent_seconds,
        hint_used,
      );

      const newTotalScore = session.score + scoreEarned;
      const newLevel = session.current_level + 1;
      const isCompleted = newLevel > TOTAL_LEVELS;

      // Update session
      await supabase
        .from("game_sessions")
        .update({
          current_level: isCompleted ? TOTAL_LEVELS : newLevel,
          score: newTotalScore,
          ...(isCompleted
            ? { status: "completed" as const, completed_at: new Date().toISOString() }
            : {}),
        })
        .eq("id", sessionId);

      response.explanation = level.explanation;
      response.score_earned = scoreEarned;
      response.total_score = newTotalScore;
      response.completed = isCompleted;

      // Fetch next level if not completed
      if (!isCompleted) {
        const { data: nextLevel } = await supabase
          .from("levels")
          .select(
            "id, number, title, clue_text, hint, difficulty, spawn_lat, spawn_lng, spawn_heading, spawn_pitch, proximity_radius_m",
          )
          .eq("saga_id", session.saga_id)
          .eq("number", newLevel)
          .single();

        response.next_level = nextLevel;
      }
    }

    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
