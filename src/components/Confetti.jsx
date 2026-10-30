import { useEffect, useRef } from "react";

const COLORS = ["#ff5c7a", "#ff9ab0", "#c9b6ff", "#ffffff", "#ff3d6e"];

export default function Confetti({ count = 160, loop = true }) {
  const ref = useRef(null);

  useEffect(() => {
    const c = ref.current;
    const ctx = c.getContext("2d");
    const resize = () => {
      c.width = innerWidth;
      c.height = innerHeight;
    };
    resize();
    addEventListener("resize", resize);

    const make = (fromTop) => ({
      x: Math.random() * c.width,
      y: fromTop ? -10 : -Math.random() * c.height,
      w: 5 + Math.random() * 6,
      h: 8 + Math.random() * 8,
      vy: 2 + Math.random() * 3,
      vx: -1 + Math.random() * 2,
      r: Math.random() * 6,
      vr: -0.2 + Math.random() * 0.4,
      color: COLORS[(Math.random() * COLORS.length) | 0],
      round: Math.random() < 0.35,
      dead: false,
    });
    const ps = Array.from({ length: count }, () => make(false));

    let raf;
    const tick = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      for (const p of ps) {
        if (p.dead) continue;
        p.x += p.vx + Math.sin(p.y / 40);
        p.y += p.vy;
        p.r += p.vr;
        if (p.y > c.height + 20) {
          if (loop) Object.assign(p, make(true));
          else p.dead = true;
          continue;
        }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.r);
        ctx.fillStyle = p.color;
        if (p.round) {
          ctx.beginPath();
          ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        }
        ctx.restore();
      }
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("resize", resize);
    };
  }, [count, loop]);

  return <canvas ref={ref} className="confetti" />;
}
