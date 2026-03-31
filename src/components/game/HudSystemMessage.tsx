"use client";

import { useState, useEffect, useCallback } from "react";
import {
  X,
  CheckCircle,
  WarningOctagon,
  Info,
} from "@phosphor-icons/react";

/* ─────────────────────────────────────────────────────────────
   HudSystemMessage
   ─────────────────────────────────────────────────────────────
   Monospace, HUD-style toast for in-game feedback.
   Auto-dismisses after 3 s or can be closed manually.
   Positioned fixed at top-center of viewport.
   ─────────────────────────────────────────────────────────── */

interface HudSystemMessageProps {
  type: "success" | "error" | "info";
  message: string;
  onDismiss?: () => void;
}

const TYPE_CONFIG = {
  success: {
    label: "DATA LOCK: SINCRONIZACIÓN EXITOSA",
    Icon: CheckCircle,
    color: "#10b981",
    borderColor: "rgba(16,185,129,0.35)",
    textColor: "text-emerald-400",
    glowShadow:
      "0 0 20px rgba(16,185,129,0.15), 0 0 4px rgba(16,185,129,0.1), 0 4px 12px rgba(0,0,0,0.4)",
    glowShadowBright:
      "0 0 28px rgba(16,185,129,0.25), 0 0 8px rgba(16,185,129,0.15), 0 4px 12px rgba(0,0,0,0.4)",
  },
  error: {
    label: "ERROR: DATO IMPRECISO",
    Icon: WarningOctagon,
    color: "#ef4444",
    borderColor: "rgba(239,68,68,0.35)",
    textColor: "text-red-400",
    glowShadow:
      "0 0 20px rgba(239,68,68,0.15), 0 0 4px rgba(239,68,68,0.1), 0 4px 12px rgba(0,0,0,0.4)",
    glowShadowBright:
      "0 0 28px rgba(239,68,68,0.25), 0 0 8px rgba(239,68,68,0.15), 0 4px 12px rgba(0,0,0,0.4)",
  },
  info: {
    label: "SISTEMA",
    Icon: Info,
    color: "#d97706",
    borderColor: "rgba(217,119,6,0.35)",
    textColor: "text-amber-500",
    glowShadow:
      "0 0 20px rgba(217,119,6,0.15), 0 0 4px rgba(217,119,6,0.1), 0 4px 12px rgba(0,0,0,0.4)",
    glowShadowBright:
      "0 0 28px rgba(217,119,6,0.25), 0 0 8px rgba(217,119,6,0.15), 0 4px 12px rgba(0,0,0,0.4)",
  },
} as const;

const AUTO_DISMISS_MS = 3000;
const EXIT_DURATION = 280;

export default function HudSystemMessage({
  type,
  message,
  onDismiss,
}: HudSystemMessageProps) {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  const config = TYPE_CONFIG[type];
  const IconComponent = config.Icon;

  /* ── dismiss logic ── */
  const dismiss = useCallback(() => {
    setExiting(true);
    const id = setTimeout(() => {
      setVisible(false);
      onDismiss?.();
    }, EXIT_DURATION);
    return () => clearTimeout(id);
  }, [onDismiss]);

  /* auto-dismiss timer */
  useEffect(() => {
    const id = setTimeout(dismiss, AUTO_DISMISS_MS);
    return () => clearTimeout(id);
  }, [dismiss]);

  if (!visible) return null;

  return (
    <div
      className="fixed left-1/2 z-50 font-mono"
      style={{
        top: "16px",
        width: "480px",
        maxWidth: "90vw",
        transform: exiting
          ? "translateX(-50%) translateY(-20px)"
          : "translateX(-50%) translateY(0)",
        opacity: exiting ? 0 : 1,
        transition: `all ${EXIT_DURATION}ms ease-out`,
        animation: exiting ? "none" : "sysMessageIn 280ms ease-out",
      }}
      role="alert"
    >
      <div
        className="relative overflow-hidden rounded-lg bg-zinc-900"
        style={{
          border: `1px solid ${config.borderColor}`,
          boxShadow: config.glowShadow,
          animation: exiting
            ? "none"
            : "sysMessageGlow 2.4s ease-in-out infinite",
          /* glow values for the keyframe */
          ...({
            "--msg-glow": config.glowShadow,
            "--msg-glow-bright": config.glowShadowBright,
          } as React.CSSProperties),
        }}
      >
        {/* top accent line */}
        <div
          style={{
            height: "1px",
            background: `linear-gradient(90deg, transparent, ${config.color}, transparent)`,
          }}
          aria-hidden="true"
        />

        <div className="flex items-start gap-3 px-4 py-3">
          {/* icon */}
          <IconComponent
            size={18}
            weight="bold"
            style={{
              color: config.color,
              flexShrink: 0,
              marginTop: "2px",
            }}
          />

          {/* copy */}
          <div className="min-w-0 flex-1">
            <div
              style={{
                color: config.color,
                fontSize: "10px",
                letterSpacing: "0.15em",
                marginBottom: "4px",
              }}
            >
              [{config.label}]
            </div>
            <p className={`text-sm leading-snug ${config.textColor}`}>
              {message}
            </p>
          </div>

          {/* close button — 44 × 44 touch target */}
          <button
            onClick={dismiss}
            className="flex shrink-0 items-center justify-center text-zinc-600 transition-colors hover:text-zinc-300"
            style={{
              width: "44px",
              height: "44px",
              margin: "-8px -8px -8px 0",
            }}
            aria-label="Cerrar mensaje del sistema"
          >
            <X size={14} weight="bold" />
          </button>
        </div>
      </div>

      {/* ── keyframe definitions ── */}
      <style>{`
        @keyframes sysMessageIn {
          0% {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        @keyframes sysMessageGlow {
          0%, 100% {
            box-shadow: var(--msg-glow);
          }
          50% {
            box-shadow: var(--msg-glow-bright);
          }
        }
      `}</style>
    </div>
  );
}
