"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Trophy,
  SpinnerGap,
  ArrowRight,
  Confetti,
  GameController,
} from "@phosphor-icons/react";
import { getSupabaseBrowser } from "@/lib/supabase/client";

interface NearbyPlayer {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  total_score: number;
  rank: number;
}

interface GameOverLeaderboardProps {
  playerId: string;
  playerScore: number;
  sagaTitle?: string;
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

export default function GameOverLeaderboard({
  playerId,
  playerScore,
  sagaTitle,
}: GameOverLeaderboardProps) {
  const supabase = getSupabaseBrowser();
  const [loading, setLoading] = useState(true);
  const [playerRank, setPlayerRank] = useState<number | null>(null);
  const [nearbyPlayers, setNearbyPlayers] = useState<NearbyPlayer[]>([]);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    async function fetchRankData() {
      try {
        // Get player's rank from the leaderboard view
        const { data: rankData } = await supabase!
          .from("leaderboard")
          .select("user_id, display_name, avatar_url, total_score, rank")
          .eq("user_id", playerId)
          .single();

        if (!rankData) {
          setLoading(false);
          return;
        }

        const currentRank = (rankData as NearbyPlayer).rank;
        setPlayerRank(currentRank);

        // Get nearby players (+/- 2 ranks)
        const minRank = Math.max(1, currentRank - 2);
        const maxRank = currentRank + 2;

        const { data: nearbyData } = await supabase!
          .from("leaderboard")
          .select("user_id, display_name, avatar_url, total_score, rank")
          .gte("rank", minRank)
          .lte("rank", maxRank)
          .order("rank", { ascending: true });

        setNearbyPlayers((nearbyData ?? []) as NearbyPlayer[]);
      } catch {
        // Silently handle — empty state is fine
      } finally {
        setLoading(false);
      }
    }

    fetchRankData();
  }, [supabase, playerId]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 0",
          gap: 12,
        }}
      >
        <SpinnerGap
          size={28}
          weight="bold"
          color="#d97706"
          className="compass-rotate"
        />
        <span style={{ fontSize: 13, color: "#71717a" }}>
          Calculando tu posición...
        </span>
      </div>
    );
  }

  return (
    <div
      style={{
        borderRadius: 16,
        border: "1px solid rgba(217,119,6,0.2)",
        background: "rgba(217,119,6,0.03)",
        overflow: "hidden",
        maxWidth: 480,
        margin: "0 auto",
      }}
    >
      {/* Congrats header */}
      <div
        style={{
          padding: "28px 24px 20px",
          textAlign: "center",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <Confetti
          size={40}
          weight="duotone"
          color="#d97706"
          style={{ marginBottom: 12 }}
        />
        <h3
          style={{
            fontSize: 20,
            fontWeight: 800,
            color: "#fafafa",
            marginBottom: 4,
          }}
        >
          {playerRank !== null && playerRank <= 3
            ? "¡Increíble!"
            : "¡Felicidades!"}
        </h3>
        {sagaTitle && (
          <p style={{ fontSize: 13, color: "#71717a", marginBottom: 8 }}>
            {sagaTitle}
          </p>
        )}
        <div style={{ display: "flex", justifyContent: "center", gap: 24 }}>
          <div>
            <div
              className="tabular-nums"
              style={{ fontSize: 28, fontWeight: 800, color: "#d97706" }}
            >
              #{playerRank ?? "—"}
            </div>
            <div style={{ fontSize: 11, color: "#71717a", marginTop: 2 }}>
              Tu posición
            </div>
          </div>
          <div
            style={{
              width: 1,
              background: "rgba(255,255,255,0.08)",
            }}
          />
          <div>
            <div
              className="tabular-nums"
              style={{ fontSize: 28, fontWeight: 800, color: "#fafafa" }}
            >
              {formatScore(playerScore)}
            </div>
            <div style={{ fontSize: 11, color: "#71717a", marginTop: 2 }}>
              XP de Datos
            </div>
          </div>
        </div>
      </div>

      {/* Nearby players */}
      {nearbyPlayers.length > 0 && (
        <div style={{ padding: "8px 0" }}>
          {nearbyPlayers.map((player) => {
            const isCurrentPlayer = player.user_id === playerId;
            return (
              <div
                key={player.user_id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 24px",
                  background: isCurrentPlayer
                    ? "rgba(217,119,6,0.08)"
                    : "transparent",
                  transition: "background 300ms cubic-bezier(0.4,0,0.2,1)",
                }}
              >
                {/* Rank */}
                <span
                  className="tabular-nums"
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: isCurrentPlayer ? "#d97706" : "#71717a",
                    width: 28,
                    textAlign: "center",
                    flexShrink: 0,
                  }}
                >
                  {player.rank}
                </span>

                {/* Avatar */}
                {player.avatar_url ? (
                  <img
                    src={player.avatar_url}
                    alt={player.display_name ?? ""}
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
                      background: isCurrentPlayer
                        ? "linear-gradient(135deg, #fbbf24, #d97706)"
                        : "rgba(255,255,255,0.06)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 700,
                      color: isCurrentPlayer ? "#18181b" : "#71717a",
                      flexShrink: 0,
                    }}
                  >
                    {getInitials(player.display_name)}
                  </div>
                )}

                {/* Name */}
                <span
                  style={{
                    flex: 1,
                    fontSize: 13,
                    fontWeight: isCurrentPlayer ? 700 : 500,
                    color: isCurrentPlayer ? "#fafafa" : "#a1a1aa",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {player.display_name ?? "Anónimo"}
                  {isCurrentPlayer && (
                    <span
                      style={{
                        marginLeft: 6,
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#d97706",
                        textTransform: "uppercase",
                      }}
                    >
                      (Tú)
                    </span>
                  )}
                </span>

                {/* Score */}
                <span
                  className="tabular-nums"
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: isCurrentPlayer ? "#d97706" : "#71717a",
                    flexShrink: 0,
                  }}
                >
                  {formatScore(player.total_score)}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Actions */}
      <div
        style={{
          display: "flex",
          gap: 12,
          padding: "16px 24px 20px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <Link
          href="/play"
          className="btn-press"
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "12px 16px",
            fontSize: 13,
            fontWeight: 700,
            background: "#d97706",
            color: "#09090b",
            borderRadius: 10,
            textDecoration: "none",
            minHeight: 44,
          }}
        >
          <GameController size={18} weight="bold" />
          Explorar otra saga
        </Link>
        <Link
          href="/leaderboard"
          className="btn-press"
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "12px 16px",
            fontSize: 13,
            fontWeight: 600,
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#a1a1aa",
            borderRadius: 10,
            textDecoration: "none",
            background: "transparent",
            minHeight: 44,
          }}
        >
          <Trophy size={16} weight="bold" />
          Ver clasificación
          <ArrowRight size={14} weight="bold" />
        </Link>
      </div>
    </div>
  );
}
