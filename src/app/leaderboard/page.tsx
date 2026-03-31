"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Trophy,
  CaretLeft,
  CaretRight,
  SpinnerGap,
  UsersThree,
  CalendarBlank,
  MapPin,
  CaretDown,
  GameController,
} from "@phosphor-icons/react";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";

type TabId = "global" | "saga" | "weekly";

interface LeaderboardEntry {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  total_score: number;
  sagas_completed: number;
  rank: number;
}

interface Saga {
  id: string;
  title: string;
  city: string;
}

const PAGE_SIZE = 25;

function getInitials(name: string | null): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatScore(score: number): string {
  return score.toLocaleString("es-ES");
}

function Avatar({
  url,
  name,
  size = 40,
}: {
  url: string | null;
  name: string | null;
  size?: number;
}) {
  if (url) {
    return (
      <img
        src={url}
        alt={name ?? "Avatar"}
        width={size}
        height={size}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          objectFit: "cover",
        }}
      />
    );
  }
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "linear-gradient(135deg, #fbbf24, #d97706)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.35,
        fontWeight: 700,
        color: "#18181b",
        flexShrink: 0,
      }}
    >
      {getInitials(name)}
    </div>
  );
}

function TopThreeCard({
  entry,
  position,
  isCurrentUser,
}: {
  entry: LeaderboardEntry;
  position: 1 | 2 | 3;
  isCurrentUser: boolean;
}) {
  const borderColor =
    position === 1 ? "#d97706" : position === 2 ? "#a1a1aa" : "#92400e";
  const bgGlow =
    position === 1
      ? "rgba(217,119,6,0.06)"
      : position === 2
        ? "rgba(161,161,170,0.04)"
        : "rgba(146,64,14,0.04)";

  return (
    <div
      style={{
        position: "relative",
        padding: 24,
        borderRadius: 16,
        border: `1px solid ${borderColor}`,
        background: bgGlow,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        transition: "all 300ms cubic-bezier(0.4,0,0.2,1)",
        outline: isCurrentUser ? "2px solid #d97706" : "none",
        outlineOffset: 2,
      }}
    >
      {/* Rank badge */}
      <div
        style={{
          position: "absolute",
          top: -12,
          left: "50%",
          transform: "translateX(-50%)",
          padding: "4px 14px",
          borderRadius: 999,
          fontSize: 12,
          fontWeight: 700,
          background: borderColor,
          color: "#18181b",
          letterSpacing: "0.05em",
        }}
      >
        #{position}
      </div>

      <Avatar url={entry.avatar_url} name={entry.display_name} size={56} />

      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: "#fafafa",
            marginBottom: 4,
          }}
        >
          {entry.display_name ?? "Anónimo"}
        </div>
        <div
          className="tabular-nums"
          style={{ fontSize: 20, fontWeight: 800, color: borderColor }}
        >
          {formatScore(entry.total_score)}
        </div>
        <div style={{ fontSize: 11, color: "#71717a", marginTop: 4 }}>
          {entry.sagas_completed} sagas completadas
        </div>
      </div>
    </div>
  );
}

export default function LeaderboardPage() {
  const { user } = useAuth();
  const supabase = getSupabaseBrowser();

  const [activeTab, setActiveTab] = useState<TabId>("global");
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  // Saga tab state
  const [sagas, setSagas] = useState<Saga[]>([]);
  const [selectedSagaId, setSelectedSagaId] = useState<string | null>(null);
  const [sagasLoading, setSagasLoading] = useState(false);

  // Load sagas list once
  useEffect(() => {
    if (!supabase) return;
    setSagasLoading(true);
    supabase
      .from("sagas")
      .select("id, title, city")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        const sagaList = (data ?? []) as Saga[];
        setSagas(sagaList);
        if (sagaList.length > 0 && !selectedSagaId) {
          setSelectedSagaId(sagaList[0].id);
        }
        setSagasLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  const fetchLeaderboard = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);

    const from = page * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    try {
      if (activeTab === "global") {
        const { data, count } = await supabase
          .from("leaderboard")
          .select("*", { count: "exact" })
          .order("rank", { ascending: true })
          .range(from, to);

        setEntries((data ?? []) as LeaderboardEntry[]);
        setTotalCount(count ?? 0);
      } else if (activeTab === "saga" && selectedSagaId) {
        const { data, count } = await supabase
          .from("game_sessions")
          .select(
            "user_id, score, profiles!inner(display_name, avatar_url, sagas_completed)",
            { count: "exact" }
          )
          .eq("saga_id", selectedSagaId)
          .eq("status", "completed")
          .order("score", { ascending: false })
          .range(from, to);

        const mapped: LeaderboardEntry[] = (data ?? []).map(
          (row: Record<string, unknown>, idx: number) => {
            const profile = row.profiles as {
              display_name: string | null;
              avatar_url: string | null;
              sagas_completed: number;
            };
            return {
              user_id: row.user_id as string,
              display_name: profile.display_name,
              avatar_url: profile.avatar_url,
              total_score: row.score as number,
              sagas_completed: profile.sagas_completed,
              rank: from + idx + 1,
            };
          }
        );
        setEntries(mapped);
        setTotalCount(count ?? 0);
      } else if (activeTab === "weekly") {
        const weekAgo = new Date(
          Date.now() - 7 * 24 * 60 * 60 * 1000
        ).toISOString();

        const { data, count } = await supabase
          .from("game_sessions")
          .select(
            "user_id, score, profiles!inner(display_name, avatar_url, sagas_completed)",
            { count: "exact" }
          )
          .eq("status", "completed")
          .gte("completed_at", weekAgo)
          .order("score", { ascending: false })
          .range(from, to);

        const mapped: LeaderboardEntry[] = (data ?? []).map(
          (row: Record<string, unknown>, idx: number) => {
            const profile = row.profiles as {
              display_name: string | null;
              avatar_url: string | null;
              sagas_completed: number;
            };
            return {
              user_id: row.user_id as string,
              display_name: profile.display_name,
              avatar_url: profile.avatar_url,
              total_score: row.score as number,
              sagas_completed: profile.sagas_completed,
              rank: from + idx + 1,
            };
          }
        );
        setEntries(mapped);
        setTotalCount(count ?? 0);
      }
    } catch {
      setEntries([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [supabase, activeTab, page, selectedSagaId]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  useEffect(() => {
    setPage(0);
  }, [activeTab, selectedSagaId]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const showTopThree = page === 0 && activeTab !== "saga";
  const topThree = showTopThree ? entries.slice(0, 3) : [];
  const tableEntries = showTopThree ? entries.slice(3) : entries;

  const tabs: { id: TabId; label: string; icon: typeof Trophy }[] = [
    { id: "global", label: "Global", icon: Trophy },
    { id: "saga", label: "Por Saga", icon: MapPin },
    { id: "weekly", label: "Semanal", icon: CalendarBlank },
  ];

  return (
    <div style={{ minHeight: "100dvh", background: "#09090b", color: "#e4e4e7" }}>
      {/* Header */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(16px)",
          background: "rgba(9,9,11,0.85)",
        }}
      >
        <div
          className="section-inner"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 56,
          }}
        >
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
              color: "#fafafa",
            }}
          >
            <CaretLeft size={18} weight="bold" color="#a1a1aa" />
            <Trophy size={22} weight="bold" color="#d97706" />
            <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.03em" }}>
              Tabla de Clasificación
            </span>
          </Link>
          <Link
            href="/play"
            className="btn-press"
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#09090b",
              background: "#d97706",
              padding: "7px 16px",
              borderRadius: 8,
              textDecoration: "none",
            }}
          >
            Jugar
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="section-inner" style={{ padding: "32px 24px 64px" }}>
        {/* Tab navigation */}
        <div
          style={{
            display: "flex",
            gap: 4,
            padding: 4,
            borderRadius: 12,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            marginBottom: 32,
            width: "fit-content",
          }}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="btn-press"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "10px 20px",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? "#fafafa" : "#71717a",
                  background: isActive ? "rgba(255,255,255,0.08)" : "transparent",
                  border: "none",
                  cursor: "pointer",
                  minHeight: 44,
                  transition: "all 300ms cubic-bezier(0.4,0,0.2,1)",
                }}
              >
                <tab.icon size={16} weight={isActive ? "bold" : "regular"} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Saga selector */}
        {activeTab === "saga" && (
          <div style={{ marginBottom: 24 }}>
            {sagasLoading ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#71717a" }}>
                <SpinnerGap size={16} className="compass-rotate" />
                <span style={{ fontSize: 13 }}>Cargando sagas...</span>
              </div>
            ) : sagas.length === 0 ? (
              <p style={{ fontSize: 13, color: "#71717a" }}>
                No hay sagas activas disponibles.
              </p>
            ) : (
              <div style={{ position: "relative", width: "fit-content" }}>
                <select
                  value={selectedSagaId ?? ""}
                  onChange={(e) => setSelectedSagaId(e.target.value)}
                  style={{
                    appearance: "none",
                    padding: "10px 40px 10px 14px",
                    borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "#18181b",
                    color: "#e4e4e7",
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: "pointer",
                    minHeight: 44,
                    minWidth: 240,
                  }}
                >
                  {sagas.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title} — {s.city}
                    </option>
                  ))}
                </select>
                <CaretDown
                  size={16}
                  weight="bold"
                  color="#71717a"
                  style={{
                    position: "absolute",
                    right: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "80px 0",
              gap: 12,
            }}
          >
            <SpinnerGap
              size={32}
              weight="bold"
              color="#d97706"
              className="compass-rotate"
            />
            <span style={{ fontSize: 14, color: "#71717a" }}>
              Cargando clasificación...
            </span>
          </div>
        )}

        {/* Empty state */}
        {!loading && entries.length === 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "80px 0",
              gap: 16,
            }}
          >
            <UsersThree size={48} weight="thin" color="#52525b" />
            <p style={{ fontSize: 15, color: "#71717a", textAlign: "center" }}>
              {activeTab === "weekly"
                ? "Aún no hay puntuaciones esta semana."
                : activeTab === "saga"
                  ? "No hay resultados para esta saga."
                  : "Aún no hay exploradores en la clasificación."}
            </p>
            <Link
              href="/play"
              className="btn-press"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 24px",
                fontSize: 14,
                fontWeight: 600,
                background: "#d97706",
                color: "#09090b",
                borderRadius: 10,
                textDecoration: "none",
                marginTop: 8,
              }}
            >
              <GameController size={18} weight="bold" />
              Jugar ahora
            </Link>
          </div>
        )}

        {/* Top 3 cards */}
        {!loading && topThree.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: topThree.length === 1
                ? "1fr"
                : topThree.length === 2
                  ? "1fr 1fr"
                  : "1fr 1fr 1fr",
              gap: 16,
              marginBottom: 32,
            }}
          >
            {topThree.map((entry, i) => (
              <TopThreeCard
                key={entry.user_id}
                entry={entry}
                position={(i + 1) as 1 | 2 | 3}
                isCurrentUser={user?.id === entry.user_id}
              />
            ))}
          </div>
        )}

        {/* Table */}
        {!loading && tableEntries.length > 0 && (
          <div
            style={{
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.06)",
              overflow: "hidden",
            }}
          >
            {/* Desktop header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "60px 1fr 120px 120px",
                padding: "12px 20px",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(255,255,255,0.02)",
                fontSize: 11,
                fontWeight: 600,
                color: "#52525b",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              <span>#</span>
              <span>Explorador</span>
              <span style={{ textAlign: "right" }}>Puntos</span>
              <span style={{ textAlign: "right" }}>Partidas</span>
            </div>

            {tableEntries.map((entry) => {
              const isCurrentUser = user?.id === entry.user_id;
              return (
                <div
                  key={entry.user_id + "-" + entry.rank}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "60px 1fr 120px 120px",
                    padding: "14px 20px",
                    alignItems: "center",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                    background: isCurrentUser
                      ? "rgba(217,119,6,0.06)"
                      : "transparent",
                    transition: "background 300ms cubic-bezier(0.4,0,0.2,1)",
                  }}
                >
                  <span
                    className="tabular-nums"
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: isCurrentUser ? "#d97706" : "#71717a",
                    }}
                  >
                    {entry.rank}
                  </span>

                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Avatar url={entry.avatar_url} name={entry.display_name} size={36} />
                    <div>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: isCurrentUser ? "#fafafa" : "#e4e4e7",
                        }}
                      >
                        {entry.display_name ?? "Anónimo"}
                        {isCurrentUser && (
                          <span
                            style={{
                              marginLeft: 8,
                              fontSize: 10,
                              fontWeight: 700,
                              color: "#d97706",
                              background: "rgba(217,119,6,0.12)",
                              padding: "2px 8px",
                              borderRadius: 999,
                              letterSpacing: "0.05em",
                              textTransform: "uppercase",
                            }}
                          >
                            Tú
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <span
                    className="tabular-nums"
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#fafafa",
                      textAlign: "right",
                    }}
                  >
                    {formatScore(entry.total_score)}
                  </span>

                  <span
                    className="tabular-nums"
                    style={{ fontSize: 13, color: "#71717a", textAlign: "right" }}
                  >
                    {entry.sagas_completed}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              marginTop: 32,
            }}
          >
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="btn-press"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 44,
                height: 44,
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "transparent",
                color: page === 0 ? "#3f3f46" : "#a1a1aa",
                cursor: page === 0 ? "not-allowed" : "pointer",
              }}
            >
              <CaretLeft size={18} weight="bold" />
            </button>
            <span className="tabular-nums" style={{ fontSize: 13, color: "#71717a" }}>
              {page + 1} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="btn-press"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 44,
                height: 44,
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "transparent",
                color: page >= totalPages - 1 ? "#3f3f46" : "#a1a1aa",
                cursor: page >= totalPages - 1 ? "not-allowed" : "pointer",
              }}
            >
              <CaretRight size={18} weight="bold" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
