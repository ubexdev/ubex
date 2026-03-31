"use client";

import { useState } from "react";

interface ClueCardProps {
  levelNumber: number;
  totalLevels: number;
  title: string;
  clueText: string;
  hint?: string;
  difficulty: "easy" | "medium" | "hard" | "extreme";
}

const difficultyConfig = {
  easy: { label: "FÁCIL", color: "#22c55e", bg: "rgba(34,197,94,0.1)" },
  medium: { label: "MEDIO", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
  hard: { label: "DIFÍCIL", color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
  extreme: { label: "EXTREMO", color: "#a855f7", bg: "rgba(168,85,247,0.1)" },
};

export default function ClueCard({
  levelNumber,
  totalLevels,
  title,
  clueText,
  hint,
  difficulty,
}: ClueCardProps) {
  const [showHint, setShowHint] = useState(false);
  const diff = difficultyConfig[difficulty];

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16,
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#fbbf24",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            MISIÓN {levelNumber}/{totalLevels}
          </span>
        </div>
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: diff.color,
            background: diff.bg,
            padding: "4px 10px",
            borderRadius: 999,
            letterSpacing: "0.1em",
          }}
        >
          {diff.label}
        </span>
      </div>

      {/* Title */}
      <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>
        {title}
      </h3>

      {/* Clue text */}
      <div
        style={{
          background: "rgba(251,191,36,0.04)",
          border: "1px solid rgba(251,191,36,0.12)",
          borderRadius: 12,
          padding: 16,
        }}
      >
        <p
          style={{
            fontSize: 15,
            color: "rgba(255,255,255,0.75)",
            lineHeight: 1.7,
            fontStyle: "italic",
          }}
        >
          &ldquo;{clueText}&rdquo;
        </p>
      </div>

      {/* Hint */}
      {hint && (
        <div>
          {!showHint ? (
            <button
              onClick={() => setShowHint(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 13,
                color: "rgba(255,255,255,0.3)",
                background: "none",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 8,
                padding: "8px 14px",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = "rgba(251,191,36,0.3)";
                e.currentTarget.style.color = "rgba(251,191,36,0.6)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                e.currentTarget.style.color = "rgba(255,255,255,0.3)";
              }}
            >
              📡 Activar radar
            </button>
          ) : (
            <div
              style={{
                background: "rgba(168,85,247,0.06)",
                border: "1px solid rgba(168,85,247,0.15)",
                borderRadius: 8,
                padding: "10px 14px",
              }}
            >
              <p style={{ fontSize: 13, color: "rgba(168,85,247,0.8)", lineHeight: 1.5 }}>
                💡 {hint}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
