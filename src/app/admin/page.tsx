import { getSupabaseServer } from "@/lib/supabase/server";
import {
  Users,
  MapTrifold,
  GameController,
  Target,
  CheckCircle,
  XCircle,
} from "@phosphor-icons/react/dist/ssr";

async function getStats() {
  const supabase = await getSupabaseServer();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayISO = todayStart.toISOString();

  const [usersRes, sagasRes, sessionsRes, attemptsRes] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase
      .from("sagas")
      .select("id", { count: "exact", head: true })
      .eq("status", "active"),
    supabase
      .from("game_sessions")
      .select("id", { count: "exact", head: true })
      .gte("started_at", todayISO),
    supabase
      .from("level_attempts")
      .select("id", { count: "exact", head: true })
      .gte("attempted_at", todayISO),
  ]);

  return {
    totalUsers: usersRes.count ?? 0,
    activeSagas: sagasRes.count ?? 0,
    sessionsToday: sessionsRes.count ?? 0,
    attemptsToday: attemptsRes.count ?? 0,
  };
}

async function getRecentActivity() {
  const supabase = await getSupabaseServer();

  const { data } = await supabase
    .from("level_attempts")
    .select(
      `
      id,
      answer_given,
      is_correct,
      attempted_at,
      session:game_sessions!session_id (
        user:profiles!user_id ( display_name ),
        saga:sagas!saga_id ( title )
      ),
      level:levels!level_id ( number, title )
    `
    )
    .order("attempted_at", { ascending: false })
    .limit(10);

  return data ?? [];
}

const statCards = [
  {
    label: "Total usuarios",
    key: "totalUsers" as const,
    icon: Users,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    label: "Sagas activas",
    key: "activeSagas" as const,
    icon: MapTrifold,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
  },
  {
    label: "Sesiones hoy",
    key: "sessionsToday" as const,
    icon: GameController,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
  },
  {
    label: "Intentos hoy",
    key: "attemptsToday" as const,
    icon: Target,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
];

export default async function AdminDashboard() {
  const [stats, recentActivity] = await Promise.all([
    getStats(),
    getRecentActivity(),
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Dashboard</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Resumen general de la plataforma
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.key}
              className="rounded-xl border border-zinc-800 bg-zinc-900 p-5"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-500">{card.label}</span>
                <div className={`p-2 rounded-lg ${card.bg}`}>
                  <Icon size={20} weight="duotone" className={card.color} />
                </div>
              </div>
              <p className="mt-3 text-3xl font-bold text-zinc-100 tabular-nums">
                {stats[card.key].toLocaleString("es-ES")}
              </p>
            </div>
          );
        })}
      </div>

      {/* Recent activity */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900">
        <div className="px-5 py-4 border-b border-zinc-800">
          <h2 className="font-semibold text-zinc-100">Actividad reciente</h2>
        </div>

        {recentActivity.length === 0 ? (
          <div className="px-5 py-12 text-center text-zinc-500 text-sm">
            No hay actividad reciente
          </div>
        ) : (
          <div className="divide-y divide-zinc-800">
            {recentActivity.map((attempt: Record<string, unknown>) => {
              const session = attempt.session as Record<string, unknown> | null;
              const user = session?.user as Record<string, unknown> | null;
              const saga = session?.saga as Record<string, unknown> | null;
              const level = attempt.level as Record<string, unknown> | null;

              return (
                <div
                  key={attempt.id as string}
                  className="flex items-center gap-3 px-5 py-3"
                >
                  <div className="shrink-0">
                    {attempt.is_correct ? (
                      <CheckCircle
                        size={20}
                        weight="duotone"
                        className="text-emerald-400"
                      />
                    ) : (
                      <XCircle
                        size={20}
                        weight="duotone"
                        className="text-red-400"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-zinc-200 truncate">
                      <span className="font-medium">
                        {(user?.display_name as string) ?? "Anónimo"}
                      </span>{" "}
                      respondió{" "}
                      <span
                        className={
                          attempt.is_correct
                            ? "text-emerald-400"
                            : "text-red-400"
                        }
                      >
                        {attempt.is_correct ? "correctamente" : "incorrectamente"}
                      </span>
                    </p>
                    <p className="text-xs text-zinc-500 truncate">
                      {(saga?.title as string) ?? "Saga"} — Nivel{" "}
                      {(level?.number as number) ?? "?"}: {(level?.title as string) ?? ""}
                    </p>
                  </div>
                  <time className="text-xs text-zinc-600 shrink-0">
                    {new Date(attempt.attempted_at as string).toLocaleTimeString(
                      "es-ES",
                      { hour: "2-digit", minute: "2-digit" }
                    )}
                  </time>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
