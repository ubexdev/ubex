import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

/** GET /api/game/sagas — List all active sagas (public). */
export async function GET() {
  try {
    const supabase = await getSupabaseServer();

    const { data, error } = await supabase
      .from("sagas")
      .select(
        "id, title, subtitle, description, city, country, prize_amount_usd, max_participants, starts_at, ends_at",
      )
      .eq("status", "active")
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
