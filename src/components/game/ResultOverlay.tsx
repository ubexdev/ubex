"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/i18n";

interface ResultOverlayProps {
  type: "correct" | "incorrect" | "winner";
  message: string;
  explanation?: string;
  onDismiss?: () => void;
}

export default function ResultOverlay({
  type,
  message,
  explanation,
  onDismiss,
}: ResultOverlayProps) {
  const { t } = useLocale();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const config = {
    correct: {
      emoji: "✅",
      bg: "rgba(34,197,94,0.12)",
      border: "rgba(34,197,94,0.3)",
      titleColor: "#22c55e",
    },
    incorrect: {
      emoji: "❌",
      bg: "rgba(239,68,68,0.12)",
      border: "rgba(239,68,68,0.3)",
      titleColor: "#ef4444",
    },
    winner: {
      emoji: "🏆",
      bg: "rgba(251,191,36,0.12)",
      border: "rgba(251,191,36,0.3)",
      titleColor: "#fbbf24",
    },
  }[type];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(8px)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.3s ease",
      }}
      onClick={type === "incorrect" ? onDismiss : undefined}
    >
      <div
        style={{
          background: config.bg,
          border: `1px solid ${config.border}`,
          borderRadius: 20,
          padding: "40px 48px",
          maxWidth: 460,
          textAlign: "center",
          transform: visible ? "scale(1)" : "scale(0.9)",
          transition: "transform 0.3s ease",
        }}
      >
        <span style={{ fontSize: 64, display: "block", marginBottom: 20 }}>
          {config.emoji}
        </span>

        <h2
          style={{
            fontSize: type === "winner" ? 32 : 24,
            fontWeight: 800,
            color: config.titleColor,
            marginBottom: 12,
          }}
        >
          {message}
        </h2>

        {explanation && (
          <p
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.5)",
              lineHeight: 1.7,
              marginBottom: 24,
            }}
          >
            {explanation}
          </p>
        )}

        {type === "correct" && (
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>
            {t("game.loadingNextMission")}
          </p>
        )}

        {type === "incorrect" && onDismiss && (
          <button
            onClick={onDismiss}
            style={{
              marginTop: 8,
              padding: "10px 28px",
              fontSize: 14,
              fontWeight: 600,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10,
              color: "rgba(255,255,255,0.6)",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {t("game.tryAgain")}
          </button>
        )}

        {type === "winner" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
            <p style={{ fontSize: 40 }}>🎉🎊🎉</p>
            <a
              href="/"
              style={{
                display: "inline-block",
                padding: "12px 32px",
                fontSize: 15,
                fontWeight: 700,
                background: "#f59e0b",
                color: "#000",
                borderRadius: 10,
                textDecoration: "none",
              }}
            >
              {t("game.backToHome")}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
