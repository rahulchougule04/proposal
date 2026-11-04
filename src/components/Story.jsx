import { useEffect, useState } from "react";
import Confetti from "./Confetti.jsx";

function diff(since) {
  const s = Math.max(0, Math.floor((Date.now() - since) / 1000));
  return {
    Divas: Math.floor(s / 86400),
    Taas: Math.floor((s % 86400) / 3600),
    Minute: Math.floor((s % 3600) / 60),
    Seconds: s % 60,
  };
}

// `since` = the moment she said YES. Replace with a fixed date if you like:
// new Date("2026-02-14T00:00:00").getTime()
export default function Story({ since }) {
  const [t, setT] = useState(() => diff(since));

  useEffect(() => {
    const id = setInterval(() => setT(diff(since)), 1000);
    return () => clearInterval(id);
  }, [since]);

  return (
    <>
      <Confetti count={90} loop />
      <h1 className="grad-title story-title">Aaplya Story Madhe Swagat Ahe ❤️</h1>
      <p className="since">SOBAT AAHOT TEVHAPASUN</p>
      <div className="timer">
        {Object.entries(t).map(([label, value]) => (
          <div className="tbox" key={label}>
            <b>{value}</b>
            <span>{label}</span>
          </div>
        ))}
      </div>
      <p className="script">Kahi Love Stories Fakt Eka Click Ne Suru Hotat.</p>
      <div className="orange-heart">🧡</div>
    </>
  );
}
