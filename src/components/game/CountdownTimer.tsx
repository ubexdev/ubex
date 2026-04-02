"use client";

import { useEffect, useRef, useState } from "react";
import { differenceInSeconds } from "date-fns";
import { useLocale } from "@/i18n";

interface CountdownTimerProps {
  targetDate: Date;
  onComplete?: () => void;
  label?: string;
}

export default function CountdownTimer({
  targetDate,
  onComplete,
  label,
}: CountdownTimerProps) {
  const { t } = useLocale();
  const resolvedLabel = label ?? t("game.nextSignalIn");
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [isComplete, setIsComplete] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    function tick() {
      const now = new Date();
      const totalSeconds = differenceInSeconds(targetDate, now);

      if (totalSeconds <= 0) {
        setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
        setIsComplete(true);
        onCompleteRef.current?.();
        return;
      }

      setTimeLeft({
        d: Math.floor(totalSeconds / 86400),
        h: Math.floor((totalSeconds % 86400) / 3600),
        m: Math.floor((totalSeconds % 3600) / 60),
        s: totalSeconds % 60,
      });
    }

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (isComplete) {
    return (
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 24px",
            borderRadius: 999,
            background: "rgba(34,197,94,0.08)",
            border: "1px solid rgba(34,197,94,0.15)",
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#22c55e",
              animation: "blink 2s ease-in-out infinite",
            }}
          />
          <span style={{ fontSize: 14, fontWeight: 700, color: "#22c55e" }}>
            {t("game.searchStarted")}
          </span>
        </div>
        <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
      </div>
    );
  }

  const segments = [
    { value: timeLeft.d, label: t("game.days") },
    { value: timeLeft.h, label: t("game.hours") },
    { value: timeLeft.m, label: t("game.minutes") },
    { value: timeLeft.s, label: t("game.seconds") },
  ];

  return (
    <div style={{ textAlign: "center" }}>
      <p
        style={{
          fontSize: 10,
          letterSpacing: "0.2em",
          color: "#92400e",
          marginBottom: 20,
          fontWeight: 600,
          textTransform: "uppercase",
        }}
      >
        {resolvedLabel}
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
        {segments.map(({ value, label: segLabel }, i) => (
          <div key={segLabel} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 10,
                  padding: "12px 16px",
                  minWidth: 64,
                }}
              >
                <span
                  className="tabular-nums"
                  style={{
                    fontSize: 28,
                    fontWeight: 800,
                    color: "#fafafa",
                    lineHeight: 1,
                    display: "block",
                    textAlign: "center",
                  }}
                >
                  {String(value).padStart(2, "0")}
                </span>
              </div>
              <span
                style={{
                  fontSize: 9,
                  letterSpacing: "0.15em",
                  color: "#3f3f46",
                  marginTop: 6,
                  fontWeight: 600,
                }}
              >
                {segLabel}
              </span>
            </div>
            {i < segments.length - 1 && (
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#27272a",
                  marginBottom: 16,
                }}
              >
                :
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
