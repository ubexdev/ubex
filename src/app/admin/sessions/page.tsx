"use client";

import { useEffect, useState, useCallback } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import {
  CircleNotch,
  GameController,
  Funnel,
  CaretDown,
  CaretRight,
  CheckCircle,
  XCircle,
  X,
} from "@phosphor-icons/react";

type GameSession = {
  id: string;
  current_level: number;
  score: number;
  difficulty: "libre" | "explorador";
  status: "active" | "completed" | "abandoned";
  started_at: string;
  completed_at: string | null;
  user: { display_name: string | null } | null;
  saga: { title: string } | null;
};

type LevelAttempt = {
  id: string;
  answer_given: string;
  is_correct: boolean;
  distance_to_target_m: number | null;
  time_spent_seconds: number;
  attempted_at: string;
  level: { number: number; title: string } | null;
};

const statusConfig = {
  active: { label: "Activa", dot: "bg-emerald-400", bg: "bg-emerald-400/10", text: "text-emerald-300" },
  completed: { label: "Completada", dot: "bg-blue-400", bg: "bg-blue-400/10", text: "text-blue-300" },
  abandoned: { label: "Abandonada", dot: "bg-zinc-400", bg: "bg-zinc-400/10", text: "text-zinc-400" },
};

const diffLabels = { libre: "Libre", explorador: "Explorador" };

export default function SessionsPage() {
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Detail expansion
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [attempts, setAttempts] = useState<LevelAttempt[]>([]);
  const [loadingAttempts, setLoadingAttempts] = useState(false);

  const supabase = getSupabaseBrowser();

  const loadSessions = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from("game_sessions")
        .select(
          `
          id, current_level, score, difficulty, status, started_at, completed_at,
          user:profiles!user_id ( display_name ),
          saga:sagas!saga_id ( title )
        `
        )
        .order("started_at", { ascending: false })
        .limit(100);

      if (statusFilter !== "all") {
        query = query.eq(
          "status",
          statusFilter as "active" | "completed" | "abandoned"
        );
      }

      const { data, error: err } = await query;

      if (err) {
        setError(err.message);
      } else {
        setSessions((data as unknown as GameSession[]) ?? []);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error cargando sesiones");
    }
    setLoading(false);
  }, [supabase, statusFilter]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  async function toggleExpand(sessionId: string) {
    if (expandedId === sessionId) {
      setExpandedId(null);
      setAttempts([]);
      return;
    }

    setExpandedId(sessionId);
    setLoadingAttempts(true);

    if (supabase) {
      const { data } = await supabase
        .from("level_attempts")
        .select(
          `
          id, answer_given, is_correct, distance_to_target_m, time_spent_seconds, attempted_at,
          level:levels!level_id ( number, title )
        `
        )
        .eq("session_id", sessionId)
        .order("attempted_at", { ascending: true });

      setAttempts((data as unknown as LevelAttempt[]) ?? []);
    }
    setLoadingAttempts(false);
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">
          Sesiones de juego
        </h1>
        <p className="text-base text-zinc-500 mt-2">
          Monitorea las partidas de los jugadores
        </p>
        {!loading && (
          <p className="text-sm text-zinc-600 mt-1">
            {sessions.length} sesion{sessions.length !== 1 ? "es" : ""}{" "}
            encontrada{sessions.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* Filter */}
      <div className="relative inline-block">
        <Funnel
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="appearance-none rounded-xl border border-zinc-800 bg-zinc-900 pl-11 pr-10 py-3 text-sm text-zinc-200 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 focus:outline-none transition-colors cursor-pointer"
        >
          <option value="all">Todos los estados</option>
          <option value="active">Activas</option>
          <option value="completed">Completadas</option>
          <option value="abandoned">Abandonadas</option>
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-900 bg-red-950 px-6 py-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-28">
          <CircleNotch size={36} className="text-zinc-600 animate-spin" />
        </div>
      )}

      {/* Empty */}
      {!loading && !error && sessions.length === 0 && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 py-24 text-center">
          <GameController
            size={52}
            weight="duotone"
            className="mx-auto text-zinc-700"
          />
          <p className="mt-4 text-zinc-500 text-base">
            No hay sesiones registradas
          </p>
        </div>
      )}

      {/* Table */}
      {!loading && sessions.length > 0 && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="w-14 px-4 py-4" />
                  <th className="text-left px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    Jugador
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    Saga
                  </th>
                  <th className="text-center px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    Nivel
                  </th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    Puntos
                  </th>
                  <th className="text-center px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    Modo
                  </th>
                  <th className="text-center px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    Inicio
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {sessions.map((session) => {
                  const st = statusConfig[session.status];
                  const isExpanded = expandedId === session.id;

                  return (
                    <Fragment key={session.id}>
                      <tr
                        onClick={() => toggleExpand(session.id)}
                        className="hover:bg-zinc-800/50 cursor-pointer transition-colors"
                      >
                        <td className="pl-6 py-4">
                          <div className="h-8 w-8 rounded-lg flex items-center justify-center text-zinc-500 transition-colors hover:text-zinc-300">
                            {isExpanded ? (
                              <CaretDown size={18} weight="bold" />
                            ) : (
                              <CaretRight size={18} weight="bold" />
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-base font-medium text-zinc-200">
                            {session.user?.display_name || "Anónimo"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-zinc-400">
                            {session.saga?.title || "—"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center text-base text-zinc-300 tabular-nums">
                          {session.current_level}
                        </td>
                        <td className="px-6 py-4 text-right tabular-nums">
                          <span className="text-base font-semibold text-zinc-200">
                            {session.score.toLocaleString("es-ES")}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-sm text-zinc-400">
                            {diffLabels[session.difficulty]}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${st.bg} ${st.text}`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${st.dot}`}
                            />
                            {st.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-sm text-zinc-500 whitespace-nowrap">
                          {new Date(session.started_at).toLocaleString(
                            "es-ES",
                            {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </td>
                      </tr>

                      {/* Expanded detail */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={8} className="bg-zinc-950 px-10 py-6">
                            {loadingAttempts ? (
                              <div className="flex items-center justify-center py-6">
                                <CircleNotch
                                  size={24}
                                  className="text-zinc-600 animate-spin"
                                />
                              </div>
                            ) : attempts.length === 0 ? (
                              <p className="text-base text-zinc-600 text-center py-6">
                                No hay intentos registrados
                              </p>
                            ) : (
                              <div className="space-y-3">
                                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">
                                  Intentos ({attempts.length})
                                </p>
                                {attempts.map((attempt) => (
                                  <div
                                    key={attempt.id}
                                    className="flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-3.5"
                                  >
                                    {attempt.is_correct ? (
                                      <CheckCircle
                                        size={22}
                                        weight="duotone"
                                        className="text-emerald-400 shrink-0"
                                      />
                                    ) : (
                                      <XCircle
                                        size={22}
                                        weight="duotone"
                                        className="text-red-400 shrink-0"
                                      />
                                    )}
                                    <span className="text-sm text-zinc-500 font-mono shrink-0">
                                      Nivel {attempt.level?.number ?? "?"}
                                    </span>
                                    <span className="text-base text-zinc-300 flex-1 truncate">
                                      &ldquo;{attempt.answer_given}&rdquo;
                                    </span>
                                    <span className="text-sm text-zinc-600 shrink-0 tabular-nums">
                                      {attempt.time_spent_seconds}s
                                    </span>
                                    {attempt.distance_to_target_m != null && (
                                      <span className="text-sm text-zinc-600 shrink-0 tabular-nums">
                                        {Math.round(
                                          attempt.distance_to_target_m
                                        )}
                                        m
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// Need Fragment import
import { Fragment } from "react";
