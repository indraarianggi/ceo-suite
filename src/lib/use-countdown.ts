"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Counts down from `seconds` to 0. The deadline is computed inside the effect so
 * nothing reads the clock during render (Cache Components prerender safe) and
 * background-tab timer throttling can't make it drift.
 */
export function useCountdown(seconds: number) {
  const [remaining, setRemaining] = useState(seconds);
  const [epoch, setEpoch] = useState(0);

  useEffect(() => {
    const deadline = Date.now() + seconds * 1000;
    const id = setInterval(() => {
      const left = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setRemaining(left);
      if (left === 0) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [seconds, epoch]);

  const restart = useCallback(() => {
    setRemaining(seconds);
    setEpoch((e) => e + 1);
  }, [seconds]);

  return { remaining, restart };
}
