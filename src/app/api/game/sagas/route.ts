import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

/** GET /api/game/sagas — List all active sagas (public). */
export async function GET() {
  try {
    const supabase = await getSupabaseServer();

    const { data, error } = await supabase
      .from("sagas")
      .select(
        "id, title, subtitle, description, city, country, prize_amount_usd, max_participants, saga_type, total_levels, difficulty, is_featured, cover_image_url, starts_at, ends_at",
      )
      .or("status.eq.active,is_active.eq.true")
      .order("starts_at", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
