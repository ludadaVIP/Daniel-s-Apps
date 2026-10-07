import { useEffect, useRef, useState } from 'react';
export function useAnimation(duration: number, onFinish?: () => void) {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [runId, setRunId] = useState(0);
  const run = useRef({ duration, onFinish });
  useEffect(() => {
    if (!runId) return;
    const { duration: runDuration, onFinish: finish } = run.current;
    const start = performance.now();
    let frame = 0;
    const tick = () => {
      const elapsed = (performance.now() - start) / 1000;
      setTime(Math.min(runDuration, elapsed));
      if (elapsed < runDuration) frame = requestAnimationFrame(tick);
      else {
        setRunning(false);
        finish?.();
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [runId]);
  return {
    time,
    running,
    reset: () => {
      setTime(0);
      setRunning(false);
      setRunId(0);
    },
    start: () => {
      run.current = { duration, onFinish };
      setTime(0);
      setRunning(true);
      setRunId((x) => x + 1);
    },
  };
}
