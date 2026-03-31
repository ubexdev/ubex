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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Sesiones de juego</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Monitorea las partidas de los jugadores
        </p>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        <Funnel size={16} className="text-zinc-500" />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 focus:outline-none transition-colors"
        >
          <option value="all">Todos los estados</option>
          <option value="active">Activas</option>
          <option value="completed">Completadas</option>
          <option value="abandoned">Abandonadas</option>
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-900 bg-red-950 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <CircleNotch size={32} className="text-zinc-600 animate-spin" />
        </div>
      )}

      {/* Empty */}
      {!loading && !error && sessions.length === 0 && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 py-16 text-center">
          <GameController
            size={40}
            weight="duotone"
            className="mx-auto text-zinc-700"
          />
          <p className="mt-3 text-zinc-500 text-sm">
            No hay sesiones registradas
          </p>
        </div>
      )}

      {/* Table */}
      {!loading && sessions.length > 0 && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="w-8" />
                  <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    Jugador
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    Saga
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    Nivel
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    Puntos
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    Modo
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
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
                        <td className="pl-4 py-3 text-zinc-600">
                          {isExpanded ? (
                            <CaretDown size={14} />
                          ) : (
                            <CaretRight size={14} />
                          )}
                        </td>
                        <td className="px-4 py-3 font-medium text-zinc-200">
                          {session.user?.display_name || "Anónimo"}
                        </td>
                        <td className="px-4 py-3 text-zinc-400">
                          {session.saga?.title || "—"}
                        </td>
                        <td className="px-4 py-3 text-center text-zinc-300 tabular-nums">
                          {session.current_level}
                        </td>
                        <td className="px-4 py-3 text-right text-zinc-300 tabular-nums">
                          {session.score.toLocaleString("es-ES")}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-xs text-zinc-400">
                            {diffLabels[session.difficulty]}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${st.bg} ${st.text}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${st.dot}`}
                            />
                            {st.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-zinc-500">
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
                          <td colSpan={8} className="bg-zinc-950 px-8 py-4">
                            {loadingAttempts ? (
                              <div className="flex items-center justify-center py-4">
                                <CircleNotch
                                  size={20}
                                  className="text-zinc-600 animate-spin"
                                />
                              </div>
                            ) : attempts.length === 0 ? (
                              <p className="text-sm text-zinc-600 text-center py-4">
                                No hay intentos registrados
                              </p>
                            ) : (
                              <div className="space-y-2">
                                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                                  Intentos ({attempts.length})
                                </p>
                                {attempts.map((attempt) => (
                                  <div
                                    key={attempt.id}
                                    className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5"
                                  >
                                    {attempt.is_correct ? (
                                      <CheckCircle
                                        size={16}
                                        weight="duotone"
                                        className="text-emerald-400 shrink-0"
                                      />
                                    ) : (
                                      <XCircle
                                        size={16}
                                        weight="duotone"
                                        className="text-red-400 shrink-0"
                                      />
                                    )}
                                    <span className="text-xs text-zinc-500 font-mono shrink-0">
                                      Nivel {attempt.level?.number ?? "?"}
                                    </span>
                                    <span className="text-sm text-zinc-300 flex-1 truncate">
                                      &ldquo;{attempt.answer_given}&rdquo;
                                    </span>
                                    <span className="text-xs text-zinc-600 shrink-0">
                                      {attempt.time_spent_seconds}s
                                    </span>
                                    {attempt.distance_to_target_m != null && (
                                      <span className="text-xs text-zinc-600 shrink-0">
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
