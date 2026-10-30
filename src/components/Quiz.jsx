import { useState } from "react";

const CARDS = [
  { icon: "❤️", q: "Coffee Date?", a: ["YES", "OF COURSE"] },
  { icon: "🌙", q: "Late Night Talks?", a: ["100%", "FOREVER"] },
  // third card isn't visible in the video — edit freely
  { icon: "🎬", q: "Movie Nights?", a: ["YES", "ALWAYS"] },
];

export default function Quiz({ onDone, onAnswer }) {
  const [i, setI] = useState(0);
  const card = CARDS[i];

  const answer = (choice) => {
    onAnswer?.(card.q, choice);
    if (i === CARDS.length - 1) {
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
