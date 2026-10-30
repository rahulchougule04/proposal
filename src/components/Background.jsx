import { useMemo } from "react";

const rand = (a, b) => a + Math.random() * (b - a);

export default function Background() {
  const hearts = useMemo(
    () =>
      Array.from({ length: 16 }, () => ({
        left: rand(0, 100),
        size: rand(14, 34),
        dur: rand(8, 16),
        delay: rand(-16, 0),
      })),
    []
  );
  const sparkles = useMemo(
    () =>
      Array.from({ length: 45 }, () => ({
        left: rand(0, 100),
        top: rand(0, 100),
        size: rand(2, 5),
        dur: rand(2, 6),
        delay: rand(-6, 0),
      })),
    []
  );

  return (
    <div className="bg" aria-hidden>
      {sparkles.map((s, i) => (
        <span
          key={"s" + i}
          className="sparkle"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            animationDuration: `${s.dur}s`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
      {hearts.map((h, i) => (
        <span
          key={"h" + i}
          className="heart"
          style={{
            left: `${h.left}%`,
            fontSize: h.size,
            animationDuration: `${h.dur}s`,
            animationDelay: `${h.delay}s`,
          }}
        >
          ♥
        </span>
      ))}
    </div>
  );
}
