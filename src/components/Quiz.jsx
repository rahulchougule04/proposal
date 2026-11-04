import { useState } from "react";

const CARDS = [
  { icon: "☕", q: "Coffee Date?", a: ["HO NAKKI", "KADHIPPAN"] },
  { icon: "🌙", q: "Late Night Talks?", a: ["100% HO", "KAYAMCH"] },
  { icon: "🎬", q: "Movie Nights?", a: ["HO CHALEL", "NEHEMICH"] },
];

export default function Quiz({ onDone, onAnswer, onAction }) {
  const [i, setI] = useState(0);
  const card = CARDS[i];

  const answer = (choice) => {
    const isLast = i === CARDS.length - 1;
    onAction?.(
      `Quiz Question ${i + 1}/${CARDS.length} ("${card.q}"): Clicked "${choice}"${
        isLast ? " (Quiz Completed -> Moving to Music Player)" : ""
      }`
    );
    onAnswer?.(card.q, choice);
    if (isLast) {
      onDone();
    } else {
      setI(i + 1);
    }
  };

  return (
    <div className="glass quiz" key={i}>
      <div className="quiz-icon">{card.icon}</div>
      <h2>{card.q}</h2>
      <div className="row">
        <button className="btn small" onClick={() => answer(card.a[0])}>
          {card.a[0]}
        </button>
        <button className="btn small alt" onClick={() => answer(card.a[1])}>
          {card.a[1]}
        </button>
      </div>
      <div className="dots">
        {CARDS.map((_, k) => (
          <span key={k} className={k === i ? "on" : ""} />
        ))}
      </div>
    </div>
  );
}
