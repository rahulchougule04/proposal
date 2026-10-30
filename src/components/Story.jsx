import { useEffect, useState } from "react";
import Confetti from "./Confetti.jsx";

function diff(since) {
  const s = Math.max(0, Math.floor((Date.now() - since) / 1000));
  return {
    Days: Math.floor(s / 86400),
    Hours: Math.floor((s % 86400) / 3600),
    Minutes: Math.floor((s % 3600) / 60),
    Seconds: s % 60,
  };
}

// `since` = the moment she said YES. Replace with a fixed date if you like:
// new Date("2026-02-14T00:00:00").getTime()
export default function Story({ since, quizAnswers = {}, proposalTries = 0 }) {
  const [t, setT] = useState(() => diff(since));

  useEffect(() => {
    const id = setInterval(() => setT(diff(since)), 1000);
    return () => clearInterval(id);
  }, [since]);

  return (
    <>
      <Confetti count={90} loop />
      <h1 className="grad-title story-title">Welcome to Our Story ❤️</h1>
      <p className="since">TOGETHER SINCE</p>
      <div className="timer">
        {Object.entries(t).map(([label, value]) => (
          <div className="tbox" key={label}>
            <b>{value}</b>
            <span>{label}</span>
          </div>
        ))}
      </div>
      <p className="script">Some Love Stories Start With One Click.</p>
      <div className="orange-heart">🧡</div>
    </>
  );
}
