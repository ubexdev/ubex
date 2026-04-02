"use client";

import { useState, useCallback, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { DEMO_SAGA, DEMO_LEVELS, type DemoLevel } from "@/data/demo-saga";
import StreetViewExplorer from "@/components/maps/StreetViewExplorer";
import ClueCard from "@/components/game/ClueCard";
import LevelProgress from "@/components/game/LevelProgress";
import GameHeader from "@/components/game/GameHeader";
import ResultOverlay from "@/components/game/ResultOverlay";
import HudBootSequence from "@/components/game/HudBootSequence";
import HudSystemMessage from "@/components/game/HudSystemMessage";

type GamePhase = "boot" | "intro" | "playing" | "completed";
type Feedback = { type: "correct" | "incorrect" | "too-far"; levelIndex: number } | null;
type Difficulty = "libre" | "explorador";

const PROXIMITY_RADIUS_M = 100;

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

/** Haversine distance in meters between two lat/lng points */
function haversineMeters(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/* ─── DB types & mapping ─── */

interface DbLevel {
  id: string;
  number: number;
  level_number: number | null;
  title: string;
  clue_text: string;
  hint: string | null;
  hints: string[] | null;
  difficulty: string;
  spawn_lat: number;
  spawn_lng: number;
  spawn_heading: number | null;
  spawn_pitch: number | null;
  target_lat: number;
  target_lng: number;
  correct_answers: string[];
  answer: string | null;
  explanation: string | null;
  proximity_radius_m: number | null;
  proximity_radius: number | null;
  points: number | null;
  time_limit: number | null;
}

interface DbSaga {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  city: string;
  country: string;
  prize_amount_usd: number | null;
  saga_type: string;
  total_levels: number;
  difficulty: string;
  levels: DbLevel[];
}

function mapDbLevelToDemoLevel(dbLevel: DbLevel): DemoLevel {
  const answers =
    Array.isArray(dbLevel.correct_answers) && dbLevel.correct_answers.length > 0
      ? dbLevel.correct_answers
      : dbLevel.answer
        ? [dbLevel.answer]
        : [];

  return {
    id: dbLevel.id,
    number: dbLevel.number ?? dbLevel.level_number ?? 1,
    title: dbLevel.title,
    clue: {
      text: dbLevel.clue_text,
      hint: dbLevel.hint ?? undefined,
      difficulty: dbLevel.difficulty as DemoLevel["clue"]["difficulty"],
    },
    lat: dbLevel.spawn_lat,
    lng: dbLevel.spawn_lng,
    heading: dbLevel.spawn_heading ?? 0,
    pitch: dbLevel.spawn_pitch ?? 0,
    targetLat: dbLevel.target_lat,
    targetLng: dbLevel.target_lng,
    correctAnswers: answers,
    explanation: dbLevel.explanation ?? "",
  };
}

function mapDbSagaToDemo(dbSaga: DbSaga) {
  return {
    id: dbSaga.id,
    title: dbSaga.title,
    subtitle: dbSaga.subtitle,
    description: dbSaga.description,
    city: dbSaga.city,
    country: dbSaga.country,
    prizeAmountUSD: dbSaga.prize_amount_usd ?? 0,
    maxParticipants: 5000,
    coverEmoji: "🌍",
  };
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
function IntroScreen({ onStart, saga, totalLevels }: { onStart: (difficulty: Difficulty) => void; saga: typeof DEMO_SAGA; totalLevels: number }) {
  const [selectedDiff, setSelectedDiff] = useState<Difficulty>("libre");

  const difficulties: { id: Difficulty; icon: string; label: string; desc: string }[] = [
    {
      id: "libre",
      icon: "🟢",
      label: "Libre",
      desc: "Responde desde cualquier posición. Solo necesitas el dato exacto.",
    },
    {
      id: "explorador",
      icon: "🟠",
      label: "Explorador",
      desc: `Debes estar a menos de ${PROXIMITY_RADIUS_M}m del lugar de la señal para poder responder. ¡Navega hasta el sitio!`,
    },
  ];

  return (
    <div
      className="play-intro"
      style={{
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

      <div className="play-intro-content" style={{ position: "relative", zIndex: 10 }}>
        <span className="play-intro-emoji" style={{ display: "block", marginBottom: 24 }}>
          {saga.coverEmoji}
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
          {saga.title}        </h1>

        <p
          style={{
            fontSize: 16,
            color: "rgba(251,191,36,0.6)",
            fontWeight: 500,
            marginBottom: 32,
            letterSpacing: "0.05em",
          }}
        >
          {saga.subtitle}
        </p>

        <p
          style={{
            fontSize: 16,
            color: "rgba(255,255,255,0.4)",
            lineHeight: 1.8,
            marginBottom: 48,
          }}
        >
          {saga.description}
        </p>

        {/* Stats row */}
        <div
          className="play-intro-stats"
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 32,
            marginBottom: 48,
            flexWrap: "wrap",
          }}
        >
          {[
            { icon: "🗺️", value: String(totalLevels), label: "Misiones" },
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
            Protocolo de exploración
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              "Explora las calles de la Zona Colonial usando Google Street View",
              "Lee cada señal de radar con atención — la respuesta está en lo que ves",
              "Ingresa el dato exacto para avanzar a la siguiente misión",
              `Completa las ${totalLevels} misiones para reclamar el tesoro`,
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

        {/* Difficulty selector */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            marginBottom: 40,
            textAlign: "left",
          }}
        >
          <h3
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#fbbf24",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              textAlign: "center",
            }}
          >
            Elige tu dificultad
          </h3>
          {difficulties.map((d) => {
            const isSelected = selectedDiff === d.id;
            return (
              <button
                key={d.id}
                onClick={() => setSelectedDiff(d.id)}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  padding: "14px 16px",
                  background: isSelected ? "rgba(251,191,36,0.06)" : "rgba(255,255,255,0.02)",
                  border: `1.5px solid ${isSelected ? "rgba(251,191,36,0.4)" : "rgba(255,255,255,0.06)"}`,
                  borderRadius: 12,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  textAlign: "left",
                  color: "inherit",
                }}
              >
                <span style={{ fontSize: 20, flexShrink: 0, marginTop: 2 }}>{d.icon}</span>
                <div>
                  <span
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: isSelected ? "#fbbf24" : "rgba(255,255,255,0.6)",
                      display: "block",
                      marginBottom: 4,
                    }}
                  >
                    {d.label}
                  </span>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", lineHeight: 1.5, display: "block" }}>
                    {d.desc}
                  </span>
                </div>
                {/* Radio indicator */}
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    border: `2px solid ${isSelected ? "#fbbf24" : "rgba(255,255,255,0.15)"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginLeft: "auto",
                    marginTop: 4,
                  }}
                >
                  {isSelected && (
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fbbf24" }} />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onStart(selectedDiff)}
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
          {`Demo gratuito — ${totalLevels} misiones explorables`}
        </p>
      </div>

    </div>
  );
}

/* ═══════════════════════════════════════════
   WINNER SCREEN
   ═══════════════════════════════════════════ */
function WinnerScreen({ totalTime, saga, totalLevels }: { totalTime: number; saga: typeof DEMO_SAGA; totalLevels: number }) {
  const minutes = Math.floor(totalTime / 60000);
  const seconds = Math.floor((totalTime % 60000) / 1000);

  return (
    <div
      className="play-winner"
      style={{
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

      <div className="play-winner-content" style={{ position: "relative", zIndex: 10 }}>
        <span className="play-winner-emoji" style={{ display: "block", marginBottom: 24 }}>🏆</span>

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
          {`Has completado las ${totalLevels} misiones de la ${saga.title} y recorrido ${saga.city} como un verdadero arqueólogo digital.`}
        </p>

        <div
          className="play-winner-stats"
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 24,
            marginBottom: 40,
            flexWrap: "wrap",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <span style={{ fontSize: 28, fontWeight: 700, color: "#fbbf24", display: "block" }}>
              {`${totalLevels}/${totalLevels}`}
            </span>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Misiones
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
            Explorar de nuevo
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN PLAY PAGE CONTENT
   ═══════════════════════════════════════════ */
function PlayPageContent() {
  const searchParams = useSearchParams();
  const sagaId = searchParams.get("saga");

  const [sagaData, setSagaData] = useState<{ saga: typeof DEMO_SAGA; levels: DemoLevel[] } | null>(null);
  const [sagaLoading, setSagaLoading] = useState(true);
  const [sagaError, setSagaError] = useState<string | null>(null);

  const [phase, setPhase] = useState<GamePhase>("boot");
  const [difficulty, setDifficulty] = useState<Difficulty>("libre");
  const [levelIndex, setLevelIndex] = useState(0);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [answer, setAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [shakeInput, setShakeInput] = useState(false);
  const [startTime] = useState(Date.now());
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [playerPos, setPlayerPos] = useState<{ lat: number; lng: number } | null>(null);
  const [hudMessage, setHudMessage] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);

  const [isMobile, setIsMobile] = useState(false);
  const [noCoverage, setNoCoverage] = useState(false);

  /* ── Fetch saga data ── */
  useEffect(() => {
    if (!sagaId || sagaId === "demo") {
      setSagaData({ saga: DEMO_SAGA, levels: DEMO_LEVELS });
      setSagaLoading(false);
      return;
    }

    let cancelled = false;
    setSagaLoading(true);
    setSagaError(null);

    fetch(`/api/game/sagas/${sagaId}/play`)
      .then((res) => {
        if (!res.ok) throw new Error(res.status === 404 ? "Saga no encontrada" : `Error ${res.status}`);
        return res.json();
      })
      .then((dbSaga: DbSaga) => {
        if (cancelled) return;
        const mappedSaga = mapDbSagaToDemo(dbSaga);
        const mappedLevels = dbSaga.levels.map(mapDbLevelToDemoLevel);
        setSagaData({ saga: mappedSaga, levels: mappedLevels });
        setSagaLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setSagaError(err instanceof Error ? err.message : "Error desconocido");
        setSagaLoading(false);
      });

    return () => { cancelled = true; };
  }, [sagaId]);

  /* Detect mobile viewport for sidebar drawer pattern */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    if (window.innerWidth < 768) setSidebarOpen(false);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const activeSaga = sagaData?.saga ?? DEMO_SAGA;
  const activeLevels = sagaData?.levels ?? DEMO_LEVELS;

  const level = activeLevels[levelIndex];
  const participants = useSimulatedParticipants(levelIndex);

  // Reset no-coverage flag when level changes
  useEffect(() => {
    setNoCoverage(false);
  }, [levelIndex]);

  // Distance from player to TARGET location (not spawn)
  const distanceToTarget =
    playerPos
      ? haversineMeters(playerPos.lat, playerPos.lng, level.targetLat, level.targetLng)
      : null;
  const isCloseEnough = distanceToTarget !== null && distanceToTarget <= PROXIMITY_RADIUS_M;
  const proximityBlocked = difficulty === "explorador" && !isCloseEnough;

  const handlePositionChange = useCallback((lat: number, lng: number) => {
    setPlayerPos({ lat, lng });
  }, []);

  const handleNoCoverage = useCallback(() => {
    setNoCoverage(true);
  }, []);

  const handleSkipMission = useCallback(() => {
    setNoCoverage(false);
    setAnswer("");
    setFeedback(null);
    setHudMessage({ type: "info", message: "[SALTO] Misión sin cobertura — avanzando" });
    if (levelIndex < activeLevels.length - 1) {
      setLevelIndex((i) => i + 1);
    } else {
      setPhase("completed");
    }
    setTimeout(() => setHudMessage(null), 2500);
  }, [levelIndex, activeLevels.length]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!answer.trim() || submitting) return;

      // Block if explorador mode and too far
      if (proximityBlocked) {
        setFeedback({ type: "too-far", levelIndex });
        setHudMessage({ type: "info", message: "Acércate a las coordenadas objetivo para validar datos" });
        setShakeInput(true);
        setTimeout(() => setShakeInput(false), 600);
        setTimeout(() => { setFeedback(null); setHudMessage(null); }, 3000);
        return;
      }

      setSubmitting(true);

      // Simulate network delay
      setTimeout(() => {
        const isCorrect = checkAnswer(answer, level);
        setSubmitting(false);

        if (isCorrect) {
          setFeedback({ type: "correct", levelIndex });
          setHudMessage({ type: "success", message: "[DATA LOCK] Coordenadas verificadas — avanzando a siguiente misión" });
          const newCompleted = [...completedLevels, level.number];
          setCompletedLevels(newCompleted);

          // Advance after delay
          setTimeout(() => {
            setFeedback(null);
            setHudMessage(null);
            setAnswer("");

            if (levelIndex < activeLevels.length - 1) {
              setLevelIndex((i) => i + 1);
            } else {
              setPhase("completed");
            }
          }, 2500);
        } else {
          setFeedback({ type: "incorrect", levelIndex });
          setHudMessage({ type: "error", message: "[DATO IMPRECISO] Respuesta incorrecta — intenta de nuevo" });
          setShakeInput(true);
          setTimeout(() => setShakeInput(false), 600);
          setTimeout(() => { setFeedback(null); setHudMessage(null); }, 2000);
        }
      }, 600);
    },
    [answer, submitting, level, levelIndex, completedLevels, proximityBlocked]
  );

  const dismissFeedback = useCallback(() => {
    setFeedback(null);
    setHudMessage(null);
    setAnswer("");
  }, []);

  /* ── Render: Loading ── */
  if (sagaLoading && phase === "boot") {
    return (
      <div
        style={{
          background: "#09090b",
          color: "#ededed",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "fixed",
          inset: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            fontSize: 16,
            fontFamily: "monospace",
            color: "#d97706",
            letterSpacing: "0.15em",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        >
          CARGANDO MISIÓN...
        </div>
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
          }
        `}</style>
      </div>
    );
  }

  /* ── Render: Error ── */
  if (sagaError) {
    return (
      <div
        style={{
          background: "#09090b",
          color: "#ededed",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "fixed",
          inset: 0,
          zIndex: 50,
          gap: 24,
          padding: 24,
          textAlign: "center",
        }}
      >
        <span style={{ fontSize: 48 }}>⚠️</span>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#ef4444" }}>
          Error al cargar la saga
        </h1>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.4)", maxWidth: 400 }}>
          {sagaError}
        </p>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            padding: "12px 32px",
            fontSize: 15,
            fontWeight: 700,
            background: "#f59e0b",
            color: "#000",
            borderRadius: 10,
            textDecoration: "none",
          }}
        >
          Volver al inicio
        </Link>
      </div>
    );
  }

  /* ── Render: Boot ── */
  if (phase === "boot") {
    return (
      <HudBootSequence
        explorerName="Agente"
        onComplete={() => setPhase("intro")}
      />
    );
  }

  /* ── Render: Intro ── */
  if (phase === "intro") {
    return <IntroScreen onStart={(diff) => { setDifficulty(diff); setPhase("playing"); }} saga={activeSaga} totalLevels={activeLevels.length} />;
  }

  /* ── Render: Winner ── */
  if (phase === "completed") {
    return <WinnerScreen totalTime={Date.now() - startTime} saga={activeSaga} totalLevels={activeLevels.length} />;
  }

  /* ── Render: Game ── */
  return (
    <div className="play-game" style={{ display: "flex", flexDirection: "column", background: "#000", color: "#ededed" }}>
      {hudMessage && (
        <HudSystemMessage
          key={`${hudMessage.type}-${hudMessage.message}`}
          type={hudMessage.type}
          message={hudMessage.message}
          onDismiss={() => setHudMessage(null)}
        />
      )}
      <GameHeader
        sagaTitle={activeSaga.title}
        currentLevel={level.number}
        totalLevels={activeLevels.length}
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
            onPositionChange={handlePositionChange}
            onNoCoverage={handleNoCoverage}
          />

          {/* Skip mission button when no Street View coverage */}
          {noCoverage && (
            <button
              onClick={handleSkipMission}
              style={{
                position: "absolute",
                bottom: 24,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 30,
                padding: "12px 28px",
                borderRadius: 12,
                background: "#d97706",
                border: "none",
                color: "#fff",
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "var(--font-outfit)",
                boxShadow: "0 4px 20px rgba(217,119,6,0.4)",
              }}
            >
              Saltar misión →
            </button>
          )}

          {/* Toggle sidebar button */}
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            style={{
              position: "absolute",
              top: 12,
              right: isMobile ? 12 : (sidebarOpen ? 392 : 12),
              zIndex: 30,
              width: 44,
              height: 44,
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

        {/* Mobile sidebar backdrop */}
        {isMobile && sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.6)",
              zIndex: 20,
            }}
          />
        )}

        {/* Sidebar */}
        <aside
          style={{
            ...(isMobile
              ? {
                  position: "absolute",
                  top: 0,
                  right: 0,
                  bottom: 0,
                  width: sidebarOpen ? "100%" : 0,
                  maxWidth: sidebarOpen ? 420 : 0,
                  zIndex: 25,
                }
              : {
                  width: sidebarOpen ? 380 : 0,
                  minWidth: sidebarOpen ? 380 : 0,
                }),
            overflow: "hidden",
            transition: "all 0.3s ease",
            borderLeft: sidebarOpen ? "1px solid rgba(255,255,255,0.06)" : "none",
            background: "rgba(0,0,0,0.95)",
          }}
        >
          <div
            className="play-sidebar-inner"
            style={{
              height: "100%",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            {/* Clue */}
            <ClueCard
              levelNumber={level.number}
              totalLevels={activeLevels.length}
              title={level.title}
              clueText={level.clue.text}
              hint={level.clue.hint}
              difficulty={level.clue.difficulty}
            />

            {/* Proximity indicator (explorador mode) */}
            {difficulty === "explorador" && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 14px",
                  borderRadius: 10,
                  background: isCloseEnough
                    ? "rgba(34,197,94,0.08)"
                    : "rgba(239,68,68,0.06)",
                  border: `1px solid ${isCloseEnough ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.15)"}`,
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: isCloseEnough ? "#22c55e" : "#ef4444",
                    boxShadow: isCloseEnough
                      ? "0 0 8px rgba(34,197,94,0.4)"
                      : "0 0 8px rgba(239,68,68,0.3)",
                    animation: isCloseEnough ? "none" : "blink-dot 1.5s ease-in-out infinite",
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1 }}>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: isCloseEnough ? "#22c55e" : "#ef4444",
                      display: "block",
                    }}
                  >
                    {isCloseEnough
                      ? "📍 En zona de respuesta"
                      : "📍 Fuera de rango"}
                  </span>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
                    {distanceToTarget !== null
                      ? distanceToTarget < 1000
                        ? `${Math.round(distanceToTarget)}m del objetivo`
                        : `${(distanceToTarget / 1000).toFixed(1)}km del objetivo`
                      : "Calculando posición..."}
                    {!isCloseEnough && ` · Necesitas ≤${PROXIMITY_RADIUS_M}m`}
                  </span>
                </div>
              </div>
            )}

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
                  placeholder={
                    proximityBlocked
                      ? "Acércate al lugar para responder..."
                      : "Escribe lo que encontraste..."
                  }
                  disabled={submitting || feedback?.type === "correct"}
                  autoFocus
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    fontSize: 15,
                    background: "rgba(255,255,255,0.04)",
                    border: `1.5px solid ${
                      feedback?.type === "too-far"
                        ? "rgba(245,158,11,0.5)"
                        : feedback?.type === "incorrect"
                          ? "rgba(239,68,68,0.5)"
                          : feedback?.type === "correct"
                            ? "rgba(34,197,94,0.5)"
                            : proximityBlocked
                              ? "rgba(255,255,255,0.05)"
                              : "rgba(255,255,255,0.1)"
                    }`,
                    borderRadius: 10,
                    color: "#fff",
                    outline: "none",
                    transition: "border-color 0.2s",
                    opacity: proximityBlocked ? 0.5 : 1,
                  }}
                  onFocus={(e) => {
                    if (!feedback && !proximityBlocked)
                      e.currentTarget.style.borderColor = "rgba(251,191,36,0.4)";
                  }}
                  onBlur={(e) => {
                    if (!feedback && !proximityBlocked)
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  }}
                />
                <button
                  type="submit"
                  disabled={submitting || !answer.trim() || feedback?.type === "correct"}
                  style={{
                    padding: "12px 20px",
                    fontSize: 14,
                    fontWeight: 700,
                    background: proximityBlocked
                      ? "rgba(245,158,11,0.3)"
                      : submitting
                        ? "rgba(245,158,11,0.5)"
                        : "#f59e0b",
                    color: "#000",
                    borderRadius: 10,
                    border: "none",
                    cursor: submitting || proximityBlocked ? "not-allowed" : "pointer",
                    transition: "all 0.2s",
                    opacity: !answer.trim() ? 0.5 : 1,
                    whiteSpace: "nowrap",
                  }}
                >
                  {submitting ? "⏳" : proximityBlocked ? "🔒" : "ENVIAR →"}
                </button>
              </div>

              {/* Inline feedback */}
              {feedback?.type === "too-far" && (
                <p style={{ fontSize: 13, color: "#f59e0b", fontWeight: 500 }}>
                  📍 ¡Estás demasiado lejos! Navega hasta las coordenadas de la señal ({Math.round(distanceToTarget || 0)}m)
                </p>
              )}
              {feedback?.type === "incorrect" && (
                <p style={{ fontSize: 13, color: "#ef4444", fontWeight: 500 }}>
                  ❌ Respuesta incorrecta — sigue explorando
                </p>
              )}
              {feedback?.type === "correct" && (
                <p style={{ fontSize: 13, color: "#22c55e", fontWeight: 500 }}>
                  ✅ [DATA LOCK] ¡Dato validado! Avanzando...
                </p>
              )}
            </form>

            {/* Separator */}
            <div style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />

            {/* Level progress */}
            <LevelProgress
              currentLevel={level.number}
              totalLevels={activeLevels.length}
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
          message="[DATA LOCK] ¡Misión completada!"
          explanation={activeLevels[feedback.levelIndex].explanation}
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
        @keyframes blink-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PAGE WRAPPER WITH SUSPENSE
   ═══════════════════════════════════════════ */
export default function PlayPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            background: "#09090b",
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontSize: 16,
              fontFamily: "monospace",
              color: "#d97706",
              letterSpacing: "0.15em",
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          >
            CARGANDO MISIÓN...
          </div>
          <style>{`
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.4; }
            }
          `}</style>
        </div>
      }
    >
      <PlayPageContent />
    </Suspense>
  );
}
