import { useEffect, useState } from "react";

const MESSAGES = [
  { at: 0, text: "Love.exe suru hot ahe..." },
  { at: 60, text: "Saglyat sundar smile cha shodh suru ahe..." },
  { at: 95, text: "1 Result Milala 🧡" },
];

export default function Loader({ onDone, onAction }) {
  const [progress, setProgress] = useState(0);
  const [typed, setTyped] = useState("");

  // fake progress bar
  useEffect(() => {
    const id = setInterval(() => {
      setProgress((p) => Math.min(100, p + 0.8 + Math.random() * 1.4));
    }, 90);
    return () => clearInterval(id);
  }, []);

  const current = [...MESSAGES].reverse().find((m) => progress >= m.at);

  // typewriter effect each time the message changes
  useEffect(() => {
    setTyped("");
    let i = 0;
    const chars = Array.from(current.text); // keeps emoji intact
    const id = setInterval(() => {
      i += 1;
      setTyped(chars.slice(0, i).join(""));
      if (i >= chars.length) clearInterval(id);
    }, 45);
    return () => clearInterval(id);
  }, [current.text]);

  const done = progress >= 100;

  return (
    <div className="loader">
      <p className="loader-text">{typed}</p>
      <div className="bar">
        <i style={{ width: `${progress}%` }} />
      </div>
      <small className="pct">{Math.floor(progress)}%</small>
      {done && (
        <button
          className="btn ghost fade-in"
          onClick={() => {
            onAction?.("Clicked '1 Result Milala 🧡' (Completed Loader)");
            onDone();
          }}
        >
          1 Result Milala 🧡
        </button>
      )}
    </div>
  );
}
