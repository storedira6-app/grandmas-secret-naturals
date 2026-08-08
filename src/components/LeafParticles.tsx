const PARTICLES = [
  { left: "6%", delay: "0s", duration: "9s", size: 10, opacity: 0.35 },
  { left: "22%", delay: "1.4s", duration: "11s", size: 7, opacity: 0.28 },
  { left: "41%", delay: "2.8s", duration: "8.5s", size: 12, opacity: 0.22 },
  { left: "58%", delay: "0.7s", duration: "12s", size: 8, opacity: 0.3 },
  { left: "74%", delay: "3.6s", duration: "10s", size: 11, opacity: 0.25 },
  { left: "90%", delay: "2s", duration: "9.5s", size: 6, opacity: 0.32 },
];

export function LeafParticles() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {PARTICLES.map((p) => (
        <span
          key={p.left}
          className="animate-drift absolute top-full rounded-full bg-gold"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  );
}
