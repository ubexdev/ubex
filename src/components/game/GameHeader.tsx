"use client";

import Link from "next/link";

interface GameHeaderProps {
  sagaTitle: string;
  currentLevel: number;
  totalLevels: number;
  activeParticipants: number;
  onExit?: () => void;
}

export default function GameHeader({
  sagaTitle,
  currentLevel,
  totalLevels,
  activeParticipants,
  onExit,
}: GameHeaderProps) {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 20px",
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        zIndex: 50,
        flexShrink: 0,
      }}
    >
      {/* Left: Logo + Saga */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Link
          href="/"
          onClick={(e) => {
            if (onExit) {
              e.preventDefault();
              onExit();
            }
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: "linear-gradient(135deg, #fbbf24, #d97706)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: "#000", fontWeight: 800, fontSize: 12 }}>U</span>
          </div>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>
            {sagaTitle}
          </span>
          <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#fbbf24" }}>
            Misión {currentLevel}/{totalLevels}
          </span>
        </div>
      </div>

      {/* Right: Stats */}
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        {/* Participants */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#22c55e",
              animation: "blink 2s ease-in-out infinite",
            }}
          />
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
            <span style={{ fontWeight: 700, color: "#fff", fontVariantNumeric: "tabular-nums" }}>
              {activeParticipants.toLocaleString()}
            </span>{" "}
            exploradores
          </span>
        </div>

        {/* Prize */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            background: "rgba(251,191,36,0.08)",
            border: "1px solid rgba(251,191,36,0.15)",
            borderRadius: 8,
            padding: "5px 12px",
          }}
        >
          <span style={{ fontSize: 12, color: "#fbbf24", fontWeight: 700 }}>🏆 $1,000 USD</span>
        </div>
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </header>
  );
}
