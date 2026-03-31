"use client";

import { useEffect, useState, useCallback } from "react";

interface UseCountdownOptions {
  targetDate: Date | null;
  onComplete?: () => void;
}

export function useCountdown({ targetDate, onComplete }: UseCountdownOptions) {
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const stableOnComplete = useCallback(() => onComplete?.(), [onComplete]);

  useEffect(() => {
    if (!targetDate) return;

    function tick() {
      const diff = Math.max(
        0,
        Math.floor((targetDate!.getTime() - Date.now()) / 1000)
      );
      setSecondsLeft(diff);
      if (diff <= 0) {
        setIsComplete(true);
        stableOnComplete();
      }
    }

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [targetDate, stableOnComplete]);

  return {
    secondsLeft,
    isComplete,
    days: Math.floor(secondsLeft / 86400),
    hours: Math.floor((secondsLeft % 86400) / 3600),
    minutes: Math.floor((secondsLeft % 3600) / 60),
    seconds: secondsLeft % 60,
  };
}
