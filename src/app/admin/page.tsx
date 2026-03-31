import { getSupabaseServer } from "@/lib/supabase/server";
import Link from "next/link";
import {
  Users,
  MapTrifold,
  GameController,
  Target,
  CheckCircle,
  XCircle,
  Plus,
  Trophy,
  Export,
  CalendarBlank,
  Lightning,
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
    accent: "border-l-blue-400",
  },
  {
    label: "Sagas activas",
    key: "activeSagas" as const,
    icon: MapTrifold,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    accent: "border-l-emerald-400",
  },
  {
    label: "Sesiones hoy",
    key: "sessionsToday" as const,
    icon: GameController,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    accent: "border-l-amber-400",
  },
  {
    label: "Intentos hoy",
    key: "attemptsToday" as const,
    icon: Target,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    accent: "border-l-purple-400",
  },
];

function getInitials(name: string): string {
  if (!name || name === "Anónimo") return "AN";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default async function AdminDashboard() {
  const [stats, recentActivity] = await Promise.all([
    getStats(),
    getRecentActivity(),
  ]);

  const now = new Date();
  const dateStr = now.toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-12">
      {/* Welcome header */}
      <div>
        <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">
          Bienvenido al panel
        </h1>
        <div className="flex items-center gap-2 mt-2">
          <CalendarBlank size={16} weight="duotone" className="text-zinc-500" />
          <p className="text-sm text-zinc-500 capitalize">{dateStr}</p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.key}
              className={`rounded-xl border border-zinc-800 border-l-2 ${card.accent} bg-zinc-900 px-6 py-5`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-500">
                  {card.label}
                </span>
                <div className={`p-2.5 rounded-lg ${card.bg}`}>
                  <Icon size={22} weight="duotone" className={card.color} />
                </div>
              </div>
              <p className="mt-4 text-4xl font-bold text-zinc-100 tabular-nums tracking-tight">
                {stats[card.key].toLocaleString("es-ES")}
              </p>
            </div>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-5">
        <Link
          href="/admin/sagas"
          className="inline-flex items-center gap-3 px-7 py-4 rounded-xl bg-amber-600 text-zinc-950 text-base font-semibold hover:bg-amber-500 transition-colors"
          style={{ minHeight: 48 }}
        >
          <Plus size={20} weight="bold" />
          Crear Saga
        </Link>
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-3 px-7 py-4 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-300 text-base font-semibold hover:bg-zinc-800 transition-colors"
          style={{ minHeight: 48 }}
        >
          <Trophy size={18} weight="duotone" />
          Ver Leaderboard
        </Link>
        <Link
          href="/admin/sessions"
          className="inline-flex items-center gap-3 px-7 py-4 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-300 text-base font-semibold hover:bg-zinc-800 transition-colors"
          style={{ minHeight: 48 }}
        >
          <Export size={18} weight="duotone" />
          Exportar Datos
        </Link>
      </div>

      {/* Recent activity */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900">
        <div className="px-6 py-5 border-b border-zinc-800 flex items-center gap-3">
          <Lightning size={20} weight="duotone" className="text-amber-600" />
          <h2 className="text-lg font-semibold text-zinc-100">
            Actividad reciente
          </h2>
        </div>

        {recentActivity.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <GameController
              size={48}
              weight="duotone"
              className="text-zinc-700 mx-auto mb-4"
            />
            <p className="text-zinc-400 text-sm font-medium">
              No hay actividad reciente
            </p>
            <p className="text-zinc-600 text-xs mt-1">
              Los intentos de los exploradores aparecerán aquí
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800">
            {recentActivity.map((attempt: Record<string, unknown>) => {
              const session = attempt.session as Record<string, unknown> | null;
              const user = session?.user as Record<string, unknown> | null;
              const saga = session?.saga as Record<string, unknown> | null;
              const level = attempt.level as Record<string, unknown> | null;
              const displayName =
                (user?.display_name as string) ?? "Anónimo";
              const initials = getInitials(displayName);

              return (
                <div
                  key={attempt.id as string}
                  className="flex items-center gap-4 px-6 py-4"
                >
                  {/* Avatar */}
                  <div
                    className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${
                      attempt.is_correct
                        ? "bg-emerald-400/10 text-emerald-400"
                        : "bg-red-400/10 text-red-400"
                    }`}
                  >
                    {initials}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-zinc-200 truncate">
                        <span className="font-semibold">{displayName}</span>
                      </p>
                      <span
                        className={`shrink-0 inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                          attempt.is_correct
                            ? "bg-emerald-400/10 text-emerald-400"
                            : "bg-red-400/10 text-red-400"
                        }`}
                      >
                        {attempt.is_correct ? (
                          <CheckCircle size={12} weight="fill" />
                        ) : (
                          <XCircle size={12} weight="fill" />
                        )}
                        {attempt.is_correct ? "Validado" : "Fallido"}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 truncate mt-0.5">
                      {(saga?.title as string) ?? "Saga"} — Misión{" "}
                      {(level?.number as number) ?? "?"}: {(level?.title as string) ?? ""}
                    </p>
                  </div>

                  {/* Time */}
                  <time className="text-xs text-zinc-600 shrink-0 tabular-nums">
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
