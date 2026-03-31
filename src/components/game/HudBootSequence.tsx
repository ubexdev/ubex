"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { CaretDoubleRight } from "@phosphor-icons/react";

/* ─────────────────────────────────────────────────────────────
   HudBootSequence
   ─────────────────────────────────────────────────────────────
   Full-screen satellite-system boot animation.
   Plays once on mount, then fades out and fires `onComplete`.
   
   Timing budget ≈ 6 s
     350 ms  initial delay (idle cursor)
     ~1 s    line 1 typing + badge
     ~1.3 s  line 2 typing + badge
     ~1.2 s  line 3 typing + badge
     1.5 s   welcome hold
     700 ms  fade-out
   ─────────────────────────────────────────────────────────── */

interface HudBootSequenceProps {
  explorerName: string;
  onComplete: () => void;
}

interface CompletedLine {
  text: string;
  badge: string;
}

/* Animation constants (ms) */
const CHAR_SPEED = 14;
const BADGE_PAUSE = 400;
const WELCOME_HOLD = 1500;
const FADE_MS = 700;
const INITIAL_DELAY = 350;

export default function HudBootSequence({
  explorerName,
  onComplete,
}: HudBootSequenceProps) {
  /* ── visual state ── */
  const [completedLines, setCompletedLines] = useState<CompletedLine[]>([]);
  const [typingText, setTypingText] = useState("");
  const [showWelcome, setShowWelcome] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  /* ── stable refs ── */
  const cancelledRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  const nameRef = useRef(explorerName);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  /* ── main sequence ── */
  useEffect(() => {
    const sleep = (ms: number) =>
      new Promise<void>((resolve) => setTimeout(resolve, ms));

    const name = nameRef.current;

    const lines = [
      {
        text: "SISTEMA: Iniciando protocolo UBEX v2.6...",
        badge: "[OK]",
      },
      {
        text: "SISTEMA: Enlazando con constelación de satélites Google Maps...",
        badge: "[OK]",
      },
      {
        text: `SISTEMA: Localizando coordenadas de Explorador: ${name}...`,
        badge: "[ESTADO: ACTIVO]",
      },
    ];

    async function sequence() {
      /* idle cursor pause */
      await sleep(INITIAL_DELAY);

      for (const line of lines) {
        if (cancelledRef.current) return;

        /* type character-by-character */
        for (let i = 1; i <= line.text.length; i++) {
          if (cancelledRef.current) return;
          setTypingText(line.text.slice(0, i));
          await sleep(CHAR_SPEED);
        }

        if (cancelledRef.current) return;

        /* promote to completed + show badge */
        setCompletedLines((prev) => [
          ...prev,
          { text: line.text, badge: line.badge },
        ]);
        setTypingText("");
        await sleep(BADGE_PAUSE);
      }

      if (cancelledRef.current) return;

      /* welcome message */
      setShowWelcome(true);
      await sleep(WELCOME_HOLD);

      if (cancelledRef.current) return;

      /* fade out */
      setIsFading(true);
      await sleep(FADE_MS);

      if (!cancelledRef.current) {
        setIsDone(true);
        onCompleteRef.current();
      }
    }

    sequence();

    return () => {
      cancelledRef.current = true;
    };
    // Run once on mount — refs keep values fresh
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── skip handler ── */
  const handleSkip = useCallback(() => {
    cancelledRef.current = true;
    setIsDone(true);
    onCompleteRef.current();
  }, []);

  /* ── unmount after sequence ── */
  if (isDone) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950"
      style={{
        opacity: isFading ? 0 : 1,
        transition: `opacity ${FADE_MS}ms ease-out`,
      }}
      role="status"
      aria-label="Secuencia de inicio del sistema UBEX"
    >
      {/* ── scanline overlay ── */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.018) 2px, rgba(255,255,255,0.018) 4px)",
          animation: "hudFlicker 4s ease-in-out infinite",
        }}
        aria-hidden="true"
      />

      {/* ── vignette ── */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)",
        }}
        aria-hidden="true"
      />

      {/* ── terminal content ── */}
      <div
        className="relative z-10 w-full px-6"
        style={{ maxWidth: "700px" }}
      >
        {/* system header */}
        <div
          className="mb-8 font-mono text-zinc-600"
          style={{ fontSize: "11px", letterSpacing: "0.2em" }}
        >
          ━━━ UBEX SISTEMA SATELITAL v2.6 ━━━
        </div>

        {/* completed lines */}
        {completedLines.map((line, idx) => (
          <div
            key={idx}
            className="mb-3 flex flex-wrap items-baseline gap-2 font-mono text-sm"
          >
            <span className="select-none text-zinc-600">&gt;</span>
            <span className="text-zinc-400">{line.text}</span>
            <span
              className="font-bold"
              style={{
                color: "#10b981",
                textShadow:
                  "0 0 8px rgba(16,185,129,0.6), 0 0 24px rgba(16,185,129,0.25)",
                animation: "badgePulse 500ms ease-out both",
              }}
            >
              {line.badge}
            </span>
          </div>
        ))}

        {/* currently typing */}
        {typingText && (
          <div className="mb-3 flex items-baseline gap-2 font-mono text-sm">
            <span className="select-none text-zinc-600">&gt;</span>
            <span className="text-zinc-400">
              {typingText}
              <span
                className="inline-block bg-amber-600"
                style={{
                  width: "7px",
                  height: "14px",
                  marginLeft: "2px",
                  verticalAlign: "text-bottom",
                  animation: "cursorBlink 700ms step-end infinite",
                }}
                aria-hidden="true"
              />
            </span>
          </div>
        )}

        {/* idle cursor (before first character) */}
        {completedLines.length === 0 && !typingText && (
          <div className="mb-3 flex items-baseline gap-2 font-mono text-sm">
            <span className="select-none text-zinc-600">&gt;</span>
            <span
              className="inline-block bg-amber-600"
              style={{
                width: "7px",
                height: "14px",
                animation: "cursorBlink 700ms step-end infinite",
              }}
              aria-hidden="true"
            />
          </div>
        )}

        {/* welcome message */}
        {showWelcome && (
          <div
            className="mt-10 border-l-2 border-amber-600 pl-4"
            style={{ animation: "welcomeSlideIn 500ms ease-out both" }}
          >
            <div
              className="mb-2 font-mono text-amber-600"
              style={{ fontSize: "10px", letterSpacing: "0.2em" }}
            >
              HUD — TRANSMISIÓN ACTIVA
            </div>
            <p
              className="font-mono leading-relaxed text-amber-600"
              style={{ fontSize: "15px" }}
            >
              &ldquo;Bienvenido al tablero global,{" "}
              <span className="font-bold text-amber-500">
                {explorerName}
              </span>
              . El mundo es una base de datos. Tu misión es
              descifrarla.&rdquo;
            </p>
          </div>
        )}
      </div>

      {/* ── skip button ── */}
      <button
        onClick={handleSkip}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded border border-zinc-800 bg-zinc-900/80 px-4 font-mono text-zinc-500 transition-colors hover:border-zinc-600 hover:text-zinc-300"
        style={{
          minHeight: "44px",
          minWidth: "44px",
          fontSize: "11px",
          letterSpacing: "0.1em",
          backdropFilter: "blur(8px)",
        }}
        aria-label="Saltar secuencia de inicio"
      >
        SALTAR
        <CaretDoubleRight size={14} weight="bold" />
      </button>

      {/* ── keyframe definitions ── */}
      <style>{`
        @keyframes cursorBlink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }

        @keyframes badgePulse {
          0% {
            opacity: 0;
            transform: scale(0.85);
          }
          50% {
            opacity: 1;
            transform: scale(1.12);
            text-shadow: 0 0 14px rgba(16,185,129,0.9),
                         0 0 32px rgba(16,185,129,0.4);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes welcomeSlideIn {
          0% {
            opacity: 0;
            transform: translateY(12px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes hudFlicker {
          0%, 94%, 100% { opacity: 1; }
          95% { opacity: 0.82; }
          96% { opacity: 1; }
          97% { opacity: 0.9; }
        }
      `}</style>
    </div>
  );
}
