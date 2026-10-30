import { useEffect, useRef } from "react";

const DIGITS = ["3", "2", "1"];
const STEP_MS = 1100; // time per digit

// Falling "matrix" rain + particle countdown 3 → 2 → 1
export default function Intro({ onDone }) {
  const ref = useRef(null);

  useEffect(() => {
    const c = ref.current;
    const ctx = c.getContext("2d");
    const w = (c.width = innerWidth);
    const h = (c.height = innerHeight);
    const gap = Math.max(6, Math.round(w / 55));

    const drops = Array.from({ length: Math.floor(w / 12) }, () => ({
      y: Math.random() * h,
      v: 1 + Math.random() * 3,
    }));

    // Turn a character into a cloud of dot targets
    const sample = (ch) => {
      const o = document.createElement("canvas");
      o.width = w;
      o.height = h;
      const x = o.getContext("2d");
      x.fillStyle = "#fff";
      x.font = `900 ${Math.min(w, h) * 0.6}px Outfit, sans-serif`;
      x.textAlign = "center";
      x.textBaseline = "middle";
      x.fillText(ch, w / 2, h / 2);
      const d = x.getImageData(0, 0, w, h).data;
      const pts = [];
      for (let y = 0; y < h; y += gap)
        for (let xx = 0; xx < w; xx += gap)
          if (d[(y * w + xx) * 4 + 3] > 128) pts.push({ x: xx, y });
      return pts;
    };

    let idx = 0;
    let particles = [];
    let exploded = false;
    const load = (i) => {
      exploded = false;
      particles = sample(DIGITS[i]).map((p) => ({
        tx: p.x,
        ty: p.y,
        x: Math.random() * w,
        y: Math.random() * h,
      }));
    };
    load(0);

    const explode = () => {
      exploded = true;
      particles.forEach((p) => {
        p.tx = p.x + (Math.random() - 0.5) * w * 0.8;
        p.ty = p.y + (Math.random() - 0.5) * h * 0.8;
      });
    };

    const t0 = performance.now();
    let raf;
    let finished = false;

    const tick = (now) => {
      const el = now - t0;
      const i = Math.floor(el / STEP_MS);
      if (i >= DIGITS.length) {
        if (!finished) {
          finished = true;
          onDone();
        }
        return;
      }
      if (i !== idx) {
        idx = i;
        load(idx);
      }
      if (!exploded && el % STEP_MS > STEP_MS * 0.72) explode();

      ctx.fillStyle = "rgba(10,6,14,0.28)";
      ctx.fillRect(0, 0, w, h);

      // rain
      ctx.fillStyle = "rgba(255,92,122,0.55)";
      drops.forEach((d, k) => {
        ctx.fillRect(k * 12, d.y, 2, 10);
        d.y += d.v;
        if (d.y > h) d.y = -20;
      });

      // dots
      ctx.fillStyle = "#f4efc4";
      particles.forEach((p) => {
        p.x += (p.tx - p.x) * 0.14;
        p.y += (p.ty - p.y) * 0.14;
        ctx.beginPath();
        ctx.arc(p.x, p.y, gap * 0.36, 0, Math.PI * 2);
        ctx.fill();
      });

      raf = requestAnimationFrame(tick);
    };
    ctx.fillStyle = "#0a060e";
    ctx.fillRect(0, 0, w, h);
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  return <canvas ref={ref} className="intro-canvas" />;
}
