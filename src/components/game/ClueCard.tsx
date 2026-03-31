"use client";

import { useState, useEffect } from "react";
import { Broadcast, CircleNotch } from "@phosphor-icons/react";

interface ClueCardProps {
  levelNumber: number;
  totalLevels: number;
  title: string;
  clueText: string;
  hint?: string;
  difficulty: "easy" | "medium" | "hard" | "extreme";
  answer?: string;
  city?: string;
  country?: string;
  onHintUsed?: () => void;
}

const difficultyConfig = {
  easy: { label: "FÁCIL", color: "#22c55e", bg: "rgba(34,197,94,0.1)" },
  medium: { label: "MEDIO", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
  hard: { label: "DIFÍCIL", color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
  extreme: { label: "EXTREMO", color: "#a855f7", bg: "rgba(168,85,247,0.1)" },
};

const HINT_BORDER_COLORS = [
  "#d97706", // amber-600 — level 1
  "#f59e0b", // amber-400 — level 2
  "#fcd34d", // amber-300 — level 3
];

const FALLBACK_HINTS = [
  "Señal débil detectada. Explora los alrededores.",
  "Datos parciales. El objetivo está cerca de un punto de referencia.",
  "Señal fuerte. Revisa los nombres visibles en tu entorno.",
];

export default function ClueCard({
  levelNumber,
  totalLevels,
  title,
  clueText,
  hint,
  difficulty,
  answer,
  city,
  country,
  onHintUsed,
}: ClueCardProps) {
  const [hints, setHints] = useState<string[]>([]);
  const [hintLevel, setHintLevel] = useState(0);
  const [loadingHint, setLoadingHint] = useState(false);
  const diff = difficultyConfig[difficulty];

  // Reset hints when the level changes
  useEffect(() => {
    setHints([]);
    setHintLevel(0);
    setLoadingHint(false);
  }, [levelNumber]);

  const requestHint = async () => {
    if (hintLevel >= 3 || loadingHint) return;
    setLoadingHint(true);
    const nextLevel = hintLevel + 1;

    try {
      if (answer && city && country) {
        const res = await fetch("/api/game/hints", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clue_text: clueText,
            answer,
            city,
            country,
            hint_level: nextLevel,
            existing_hints: hints,
          }),
        });
        const data = await res.json();
        if (data.hint) {
          setHints((prev) => [...prev, data.hint]);
          setHintLevel(nextLevel);
          onHintUsed?.();
        }
      } else if (hint) {
        // Fallback: use static hint prop
        setHints([hint]);
        setHintLevel(3);
        onHintUsed?.();
      }
    } catch {
      setHints((prev) => [...prev, FALLBACK_HINTS[nextLevel - 1]]);
      setHintLevel(nextLevel);
    } finally {
      setLoadingHint(false);
    }
  };

  /* ── Radar button label ── */
  const getButtonLabel = (): string => {
    if (hintLevel === 0) return "Activar Radar (Señal 1/3)";
    if (hintLevel === 1) return "Amplificar Señal (2/3)";
    if (hintLevel === 2) return "Señal Máxima (3/3)";
    return "Radar agotado";
  };

  const isExhausted = hintLevel >= 3;
  const canRequest = !isExhausted && !loadingHint;
  const showRadar = answer && city && country ? true : !!hint;

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
              fontFamily: "var(--font-sans), Outfit, sans-serif",
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
      <h3
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: "#fff",
          lineHeight: 1.3,
          fontFamily: "var(--font-sans), Outfit, sans-serif",
        }}
      >
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
            fontFamily: "var(--font-sans), Outfit, sans-serif",
          }}
        >
          &ldquo;{clueText}&rdquo;
        </p>
      </div>

      {/* Progressive hint system */}
      {showRadar && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Accumulated hints */}
          {hints.map((h, i) => (
            <div
              key={i}
              style={{
                background: "rgba(39,39,42,0.8)", // zinc-800
                borderLeft: `3px solid ${HINT_BORDER_COLORS[i] ?? "#fcd34d"}`,
                borderRadius: 8,
                padding: "12px 16px",
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: HINT_BORDER_COLORS[i] ?? "#fcd34d",
                  letterSpacing: "0.08em",
                  fontFamily: "var(--font-mono), monospace",
                }}
              >
                [SEÑAL {i + 1}]
              </span>
              <p
                style={{
                  fontSize: 14,
                  color: "rgba(255,255,255,0.78)",
                  lineHeight: 1.6,
                  margin: 0,
                  fontFamily: "var(--font-sans), Outfit, sans-serif",
                }}
              >
                {h}
              </p>
            </div>
          ))}

          {/* Loading state */}
          {loadingHint && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 16px",
                background: "rgba(39,39,42,0.5)",
                borderRadius: 8,
                animation: "radarPulse 1.5s ease-in-out infinite",
              }}
            >
              <CircleNotch
                size={18}
                weight="bold"
                color="#d97706"
                style={{ animation: "radarSpin 0.8s linear infinite" }}
              />
              <span
                style={{
                  fontSize: 13,
                  color: "#d97706",
                  fontWeight: 600,
                  fontFamily: "var(--font-sans), Outfit, sans-serif",
                }}
              >
                Calibrando señal…
              </span>
            </div>
          )}

          {/* Radar activation button */}
          {!loadingHint && (
            <button
              onClick={canRequest ? requestHint : undefined}
              disabled={!canRequest}
              aria-label={getButtonLabel()}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                minHeight: 44,
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "var(--font-sans), Outfit, sans-serif",
                color: isExhausted ? "rgba(255,255,255,0.3)" : "#fff",
                background: isExhausted ? "rgba(63,63,70,0.5)" : "#d97706", // zinc-700 vs amber-600
                border: "none",
                borderRadius: 10,
                padding: "10px 20px",
                cursor: isExhausted ? "default" : "pointer",
                transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                opacity: isExhausted ? 0.6 : 1,
              }}
              onMouseOver={(e) => {
                if (!canRequest) return;
                e.currentTarget.style.background = "#b45309";
                e.currentTarget.style.transform = "scale(1.03) translateY(-1px)";
              }}
              onMouseOut={(e) => {
                if (!canRequest) return;
                e.currentTarget.style.background = "#d97706";
                e.currentTarget.style.transform = "scale(1) translateY(0)";
              }}
            >
              <Broadcast
                size={20}
                weight="bold"
                style={
                  isExhausted
                    ? { opacity: 0.4 }
                    : { animation: "radarPulse 2s ease-in-out infinite" }
                }
              />
              {getButtonLabel()}
            </button>
          )}
        </div>
      )}

      {/* Inline keyframes — scoped via unique names */}
      <style>{`
        @keyframes radarSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes radarPulse {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.55; }
        }
      `}</style>
    </div>
  );
}
