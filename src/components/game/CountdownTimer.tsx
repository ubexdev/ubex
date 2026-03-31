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
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-green-500/10 border border-green-500/20">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-base font-bold text-green-400">
            ¡LA BÚSQUEDA HA COMENZADO!
          </span>
        </div>
      </div>
    );
  }

  const segments = [
    { value: timeLeft.d, label: "DÍAS" },
    { value: timeLeft.h, label: "HRS" },
    { value: timeLeft.m, label: "MIN" },
    { value: timeLeft.s, label: "SEG" },
  ];

  return (
    <div className="text-center">
      <p className="text-[10px] tracking-[0.2em] text-amber-400/50 mb-5 font-medium uppercase">
        {label}
      </p>
      <div className="flex justify-center gap-3">
        {segments.map(({ value, label: segLabel }, i) => (
          <div key={segLabel} className="flex items-center gap-3">
            <div className="flex flex-col items-center">
              <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 min-w-[72px] backdrop-blur-sm">
                <span className="text-3xl font-extrabold text-white font-[family-name:var(--font-mono)] tabular-nums leading-none">
                  {String(value).padStart(2, "0")}
                </span>
              </div>
              <span className="text-[9px] tracking-[0.15em] text-white/20 mt-2 font-medium">
                {segLabel}
              </span>
            </div>
            {i < segments.length - 1 && (
              <span className="text-xl font-bold text-white/10 mb-5">:</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
