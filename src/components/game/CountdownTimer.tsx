"use client";

import { useEffect, useRef, useState } from "react";
import { differenceInSeconds } from "date-fns";

interface CountdownTimerProps {
  targetDate: Date;
  onComplete?: () => void;
  label?: string;
}

export default function CountdownTimer({
  targetDate,
  onComplete,
  label = "PRÓXIMA PISTA EN",
}: CountdownTimerProps) {
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
      <div className="text-center animate-pulse">
        <p className="text-2xl font-bold text-green-400">
          ¡LA BÚSQUEDA HA COMENZADO!
        </p>
      </div>
    );
  }

  const segments = [
    { value: timeLeft.d, label: "DÍAS" },
    { value: timeLeft.h, label: "HORAS" },
    { value: timeLeft.m, label: "MIN" },
    { value: timeLeft.s, label: "SEG" },
  ];

  return (
    <div className="text-center">
      <p className="text-sm tracking-widest text-amber-400 mb-4 font-semibold">
        {label}
      </p>
      <div className="flex justify-center gap-3">
        {segments.map(({ value, label: segLabel }) => (
          <div
            key={segLabel}
            className="flex flex-col items-center bg-black/60 border border-amber-500/30 rounded-xl px-4 py-3 min-w-[70px] backdrop-blur-sm"
          >
            <span className="text-3xl font-mono font-bold text-white tabular-nums">
              {String(value).padStart(2, "0")}
            </span>
            <span className="text-[10px] tracking-wider text-amber-400/70 mt-1">
              {segLabel}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
