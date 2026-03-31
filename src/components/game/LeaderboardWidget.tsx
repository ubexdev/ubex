"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trophy, SpinnerGap, ArrowRight, UsersThree } from "@phosphor-icons/react";
import { getSupabaseBrowser } from "@/lib/supabase/client";

interface LeaderboardEntry {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  total_score: number;
  rank: number;
}

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

export default function LeaderboardWidget() {
  const supabase = getSupabaseBrowser();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase
      .from("leaderboard")
      .select("user_id, display_name, avatar_url, total_score, rank")
      .order("rank", { ascending: true })
      .limit(5)
      .then(({ data }) => {
        setEntries((data ?? []) as LeaderboardEntry[]);
        setLoading(false);
      });
  }, [supabase]);

  const rankColors = ["#d97706", "#a1a1aa", "#92400e", "#52525b", "#52525b"];

  return (
    <div
      style={{
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(255,255,255,0.015)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Trophy size={18} weight="bold" color="#d97706" />
          <span style={{ fontSize: 14, fontWeight: 700, color: "#fafafa" }}>
            Mejores Exploradores
          </span>
        </div>
        <Link
          href="/leaderboard"
          className="btn-press"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            fontSize: 12,
            fontWeight: 600,
            color: "#d97706",
            textDecoration: "none",
          }}
        >
          Ver tabla completa
          <ArrowRight size={12} weight="bold" />
        </Link>
      </div>

      {/* Content */}
      <div style={{ padding: "8px 0" }}>
        {loading && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "32px 0",
              gap: 8,
            }}
          >
            <SpinnerGap
              size={20}
              weight="bold"
              color="#d97706"
              className="compass-rotate"
            />
            <span style={{ fontSize: 13, color: "#71717a" }}>Cargando...</span>
          </div>
        )}

        {!loading && entries.length === 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "32px 0",
              gap: 8,
            }}
          >
            <UsersThree size={28} weight="thin" color="#52525b" />
            <span style={{ fontSize: 13, color: "#71717a" }}>
              Aún no hay puntuaciones.
            </span>
          </div>
        )}

        {!loading &&
          entries.map((entry, i) => (
            <div
              key={entry.user_id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 20px",
                transition: "background 300ms cubic-bezier(0.4,0,0.2,1)",
              }}
            >
              {/* Rank */}
              <span
                className="tabular-nums"
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: rankColors[i] ?? "#52525b",
                  width: 24,
                  textAlign: "center",
                  flexShrink: 0,
                }}
              >
                {entry.rank}
              </span>

              {/* Avatar */}
              {entry.avatar_url ? (
                <img
                  src={entry.avatar_url}
                  alt={entry.display_name ?? ""}
                  width={32}
                  height={32}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    objectFit: "cover",
                    flexShrink: 0,
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #fbbf24, #d97706)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#18181b",
                    flexShrink: 0,
                  }}
                >
                  {getInitials(entry.display_name)}
                </div>
              )}

              {/* Name */}
              <span
                style={{
                  flex: 1,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#e4e4e7",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {entry.display_name ?? "Anónimo"}
              </span>

              {/* Score */}
              <span
                className="tabular-nums"
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: i === 0 ? "#d97706" : "#a1a1aa",
                  flexShrink: 0,
                }}
              >
                {formatScore(entry.total_score)}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}
