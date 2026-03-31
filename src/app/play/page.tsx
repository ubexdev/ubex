"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { DEMO_SAGA, DEMO_LEVELS, type DemoLevel } from "@/data/demo-saga";
import StreetViewExplorer from "@/components/maps/StreetViewExplorer";
import ClueCard from "@/components/game/ClueCard";
import LevelProgress from "@/components/game/LevelProgress";
import GameHeader from "@/components/game/GameHeader";
import ResultOverlay from "@/components/game/ResultOverlay";

type GamePhase = "intro" | "playing" | "completed";
type Feedback = { type: "correct" | "incorrect"; levelIndex: number } | null;

/** Normalize text for fuzzy comparison */
function normalize(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ");
}

function checkAnswer(playerAnswer: string, level: DemoLevel): boolean {
  const input = normalize(playerAnswer);
  if (!input) return false;
  return level.correctAnswers.some((correct) => {
    const norm = normalize(correct);
    return input.includes(norm) || norm.includes(input);
  });
}

/* ─── Simulated live participants ─── */
function useSimulatedParticipants(currentLevel: number) {
  const [count, setCount] = useState(4832);
  const baseRef = useRef(4832);

  useEffect(() => {
    // Drop participants as levels increase
    baseRef.current = Math.max(200, 4832 - currentLevel * 380 + Math.floor(Math.random() * 100));
    setCount(baseRef.current);
  }, [currentLevel]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((c) => {
        const delta = Math.floor(Math.random() * 7) - 3;
        return Math.max(100, c + delta);
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return count;
}

/* ═══════════════════════════════════════════
   INTRO SCREEN
   ═══════════════════════════════════════════ */
function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#ededed",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          height: 600,
          background: "radial-gradient(circle, rgba(245,158,11,0.08), transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Back link */}
      <Link
        href="/"
        style={{
          position: "absolute",
          top: 24,
          left: 24,
          fontSize: 14,
          color: "rgba(255,255,255,0.3)",
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        ← Volver
      </Link>

      <div style={{ position: "relative", zIndex: 10, maxWidth: 600 }}>
        <span style={{ fontSize: 72, display: "block", marginBottom: 24 }}>
          {DEMO_SAGA.coverEmoji}
        </span>

        <h1
          style={{
            fontSize: "clamp(32px, 6vw, 56px)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            marginBottom: 8,
            color: "#fff",
          }}
        >
          {DEMO_SAGA.title}
        </h1>

        <p
          style={{
            fontSize: 16,
            color: "rgba(251,191,36,0.6)",
            fontWeight: 500,
            marginBottom: 32,
            letterSpacing: "0.05em",
          }}
        >
          {DEMO_SAGA.subtitle}
        </p>

        <p
          style={{
            fontSize: 16,
            color: "rgba(255,255,255,0.4)",
            lineHeight: 1.8,
            marginBottom: 48,
          }}
        >
          {DEMO_SAGA.description}
        </p>

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 32,
            marginBottom: 48,
            flexWrap: "wrap",
          }}
        >
          {[
            { icon: "🗺️", value: "12", label: "Niveles" },
            { icon: "🏆", value: "$1,000", label: "Premio USD" },
            { icon: "👥", value: "5,000", label: "Exploradores" },
            { icon: "📍", value: "RD", label: "Santo Domingo" },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <span style={{ fontSize: 24, display: "block", marginBottom: 4 }}>{s.icon}</span>
              <span style={{ fontSize: 20, fontWeight: 700, color: "#fff", display: "block" }}>
                {s.value}
              </span>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Rules */}
        <div
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 16,
            padding: 24,
            textAlign: "left",
            marginBottom: 40,
          }}
        >
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#fbbf24", marginBottom: 16, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Cómo jugar
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              "Explora las calles de la Zona Colonial usando Google Street View",
              "Lee cada pista con atención — la respuesta está en lo que ves",
              "Escribe tu respuesta y envíala para avanzar al siguiente nivel",
              "Completa los 12 niveles para reclamar el tesoro",
            ].map((rule, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    background: "rgba(251,191,36,0.1)",
                    border: "1px solid rgba(251,191,36,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#fbbf24",
                    flexShrink: 0,
                    marginTop: 1,
                  }}
                >
                  {i + 1}
                </span>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>
                  {rule}
                </p>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onStart}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "16px 48px",
            fontSize: 17,
            fontWeight: 700,
            background: "#f59e0b",
            color: "#000",
            borderRadius: 12,
            border: "none",
            cursor: "pointer",
            transition: "all 0.2s",
            boxShadow: "0 0 40px rgba(245,158,11,0.2)",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.boxShadow = "0 0 60px rgba(245,158,11,0.35)";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.boxShadow = "0 0 40px rgba(245,158,11,0.2)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          COMENZAR EXPLORACIÓN
          <span style={{ fontSize: 20 }}>🧭</span>
        </button>

        <p style={{ marginTop: 16, fontSize: 12, color: "rgba(255,255,255,0.2)" }}>
          Demo gratuito — 12 niveles jugables
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   WINNER SCREEN
   ═══════════════════════════════════════════ */
function WinnerScreen({ totalTime }: { totalTime: number }) {
  const minutes = Math.floor(totalTime / 60000);
  const seconds = Math.floor((totalTime % 60000) / 1000);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#ededed",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 800,
          height: 800,
          background: "radial-gradient(circle, rgba(251,191,36,0.1), transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 10, maxWidth: 500 }}>
        <span style={{ fontSize: 96, display: "block", marginBottom: 24 }}>🏆</span>

        <h1
          style={{
            fontSize: "clamp(32px, 6vw, 52px)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            marginBottom: 12,
          }}
        >
          <span style={{ color: "#fbbf24" }}>¡TESORO</span>{" "}
          <span style={{ color: "#fff" }}>ENCONTRADO!</span>
        </h1>

        <p style={{ fontSize: 17, color: "rgba(255,255,255,0.4)", lineHeight: 1.7, marginBottom: 32 }}>
          Has completado los 12 niveles de la Saga de Colón y recorrido la Zona Colonial de Santo Domingo como un verdadero arqueólogo digital.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 24,
            marginBottom: 40,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <span style={{ fontSize: 28, fontWeight: 700, color: "#fbbf24", display: "block" }}>
              12/12
            </span>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Niveles
            </span>
          </div>
          <div style={{ width: 1, background: "rgba(255,255,255,0.1)" }} />
          <div style={{ textAlign: "center" }}>
            <span style={{ fontSize: 28, fontWeight: 700, color: "#22c55e", display: "block" }}>
              {minutes}:{String(seconds).padStart(2, "0")}
            </span>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Tiempo total
            </span>
          </div>
          <div style={{ width: 1, background: "rgba(255,255,255,0.1)" }} />
          <div style={{ textAlign: "center" }}>
            <span style={{ fontSize: 28, fontWeight: 700, color: "#a855f7", display: "block" }}>
              $1,000
            </span>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Premio USD
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              padding: "14px 40px",
              fontSize: 15,
              fontWeight: 700,
              background: "#f59e0b",
              color: "#000",
              borderRadius: 10,
              textDecoration: "none",
              transition: "all 0.2s",
            }}
          >
            Volver al inicio
          </Link>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "10px 24px",
              fontSize: 14,
              fontWeight: 500,
              background: "none",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10,
              color: "rgba(255,255,255,0.4)",
              cursor: "pointer",
            }}
          >
            Jugar otra vez
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN PLAY PAGE
   ═══════════════════════════════════════════ */
export default function PlayPage() {
  const [phase, setPhase] = useState<GamePhase>("intro");
  const [levelIndex, setLevelIndex] = useState(0);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [answer, setAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [shakeInput, setShakeInput] = useState(false);
  const [startTime] = useState(Date.now());
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const level = DEMO_LEVELS[levelIndex];
  const participants = useSimulatedParticipants(levelIndex);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!answer.trim() || submitting) return;

      setSubmitting(true);

      // Simulate network delay
      setTimeout(() => {
        const isCorrect = checkAnswer(answer, level);
        setSubmitting(false);

        if (isCorrect) {
          setFeedback({ type: "correct", levelIndex });
          const newCompleted = [...completedLevels, level.number];
          setCompletedLevels(newCompleted);

          // Advance after delay
          setTimeout(() => {
            setFeedback(null);
            setAnswer("");

            if (levelIndex < DEMO_LEVELS.length - 1) {
              setLevelIndex((i) => i + 1);
            } else {
              setPhase("completed");
            }
          }, 2500);
        } else {
          setFeedback({ type: "incorrect", levelIndex });
          setShakeInput(true);
          setTimeout(() => setShakeInput(false), 600);
          setTimeout(() => setFeedback(null), 2000);
        }
      }, 600);
    },
    [answer, submitting, level, levelIndex, completedLevels]
  );

  const dismissFeedback = useCallback(() => {
    setFeedback(null);
    setAnswer("");
  }, []);

  /* ── Render: Intro ── */
  if (phase === "intro") {
    return <IntroScreen onStart={() => setPhase("playing")} />;
  }

  /* ── Render: Winner ── */
  if (phase === "completed") {
    return <WinnerScreen totalTime={Date.now() - startTime} />;
  }

  /* ── Render: Game ── */
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#000", color: "#ededed" }}>
      <GameHeader
        sagaTitle={DEMO_SAGA.title}
        currentLevel={level.number}
        totalLevels={DEMO_LEVELS.length}
        activeParticipants={participants}
      />

      <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>
        {/* Street View */}
        <div style={{ flex: 1, position: "relative" }}>
          <StreetViewExplorer
            lat={level.lat}
            lng={level.lng}
            heading={level.heading}
            pitch={level.pitch}
          />

          {/* Toggle sidebar button (mobile) */}
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            style={{
              position: "absolute",
              top: 12,
              right: sidebarOpen ? 392 : 12,
              zIndex: 30,
              width: 40,
              height: 40,
              borderRadius: 10,
              background: "rgba(0,0,0,0.7)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "#fff",
              fontSize: 18,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "right 0.3s ease",
              backdropFilter: "blur(8px)",
            }}
          >
            {sidebarOpen ? "→" : "📋"}
          </button>
        </div>

        {/* Sidebar */}
        <aside
          style={{
            width: sidebarOpen ? 380 : 0,
            minWidth: sidebarOpen ? 380 : 0,
            overflow: "hidden",
            transition: "all 0.3s ease",
            borderLeft: sidebarOpen ? "1px solid rgba(255,255,255,0.06)" : "none",
            background: "rgba(0,0,0,0.95)",
          }}
        >
          <div
            style={{
              width: 380,
              height: "100%",
              overflowY: "auto",
              padding: 24,
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            {/* Clue */}
            <ClueCard
              levelNumber={level.number}
              totalLevels={DEMO_LEVELS.length}
              title={level.title}
              clueText={level.clue.text}
              hint={level.clue.hint}
              difficulty={level.clue.difficulty}
            />

            {/* Answer input */}
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: 10 }}
            >
              <label
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.3)",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                }}
              >
                TU RESPUESTA
              </label>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  animation: shakeInput ? "shake 0.4s ease-in-out" : "none",
                }}
              >
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Escribe lo que encontraste..."
                  disabled={submitting || feedback?.type === "correct"}
                  autoFocus
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    fontSize: 15,
                    background: "rgba(255,255,255,0.04)",
                    border: `1.5px solid ${
                      feedback?.type === "incorrect"
                        ? "rgba(239,68,68,0.5)"
                        : feedback?.type === "correct"
                          ? "rgba(34,197,94,0.5)"
                          : "rgba(255,255,255,0.1)"
                    }`,
                    borderRadius: 10,
                    color: "#fff",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => {
                    if (!feedback) e.currentTarget.style.borderColor = "rgba(251,191,36,0.4)";
                  }}
                  onBlur={(e) => {
                    if (!feedback) e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  }}
                />
                <button
                  type="submit"
                  disabled={submitting || !answer.trim() || feedback?.type === "correct"}
                  style={{
                    padding: "12px 20px",
                    fontSize: 14,
                    fontWeight: 700,
                    background: submitting ? "rgba(245,158,11,0.5)" : "#f59e0b",
                    color: "#000",
                    borderRadius: 10,
                    border: "none",
                    cursor: submitting ? "wait" : "pointer",
                    transition: "all 0.2s",
                    opacity: !answer.trim() ? 0.5 : 1,
                    whiteSpace: "nowrap",
                  }}
                >
                  {submitting ? "⏳" : "ENVIAR →"}
                </button>
              </div>

              {/* Inline feedback */}
              {feedback?.type === "incorrect" && (
                <p style={{ fontSize: 13, color: "#ef4444", fontWeight: 500 }}>
                  ❌ Respuesta incorrecta — sigue explorando
                </p>
              )}
              {feedback?.type === "correct" && (
                <p style={{ fontSize: 13, color: "#22c55e", fontWeight: 500 }}>
                  ✅ ¡Correcto! Avanzando...
                </p>
              )}
            </form>

            {/* Separator */}
            <div style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />

            {/* Level progress */}
            <LevelProgress
              currentLevel={level.number}
              totalLevels={DEMO_LEVELS.length}
              completedLevels={completedLevels}
            />

            {/* Tips */}
            <div
              style={{
                marginTop: "auto",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: 10,
                padding: 14,
              }}
            >
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", lineHeight: 1.6 }}>
                💡 <strong style={{ color: "rgba(255,255,255,0.35)" }}>Consejo:</strong> Navega con el mouse por Street View. Haz clic en las flechas del suelo para moverte. Busca señales, placas y detalles arquitectónicos.
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* Overlays */}
      {feedback?.type === "correct" && (
        <ResultOverlay
          type="correct"
          message="¡Nivel completado!"
          explanation={DEMO_LEVELS[feedback.levelIndex].explanation}
        />
      )}

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
}
