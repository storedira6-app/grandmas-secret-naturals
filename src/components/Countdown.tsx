import { useEffect, useState } from "react";

/**
 * Simple numeric countdown shown next to loading states so the user always
 * knows roughly how long is left instead of staring at animated dots.
 */
export function Countdown({ seconds = 20 }: { seconds?: number }) {
  const [left, setLeft] = useState(seconds);

  useEffect(() => {
    setLeft(seconds);
    const id = setInterval(() => setLeft((v) => (v > 1 ? v - 1 : 1)), 1000);
    return () => clearInterval(id);
  }, [seconds]);

  return (
    <span className="gradient-gold rounded-full px-2 py-0.5 text-[11px] font-bold text-gold-foreground tabular-nums">
      00:{String(left).padStart(2, "0")}
    </span>
  );
}
