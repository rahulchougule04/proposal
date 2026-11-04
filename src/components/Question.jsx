import { useState } from "react";

const NO_LABELS = [
  "💔 NAKO",
  "🙈 KADACHIT NAHI",
  "Please Vichar Kar Na 🧡",
  "Ajun Ekda Vichar Kar 😭",
  "Itka Nako Vichar Karu 🥺",
  "Pakka Ho Ch Mhanyachay 😌",
];

// Predefined safe non-overlapping positions (never overlaps YES, never touches card edges)
const SAFE_DODGE_SPOTS = [
  { x: -50, y: 12 },
  { x: 50, y: 12 },
  { x: -35, y: 28 },
  { x: 35, y: 28 },
  { x: -55, y: 5 },
  { x: 55, y: 5 },
  { x: 0, y: 24 },
  { x: -28, y: 18 },
  { x: 28, y: 18 },
];

export default function Question({ onYes, onNo, onAction }) {
  const [asked, setAsked] = useState(false);
  const [tries, setTries] = useState(0);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  if (!asked) {
    return (
      <div className="glass ask">
        <p className="soft">Aika na...</p>
        <h2>Ek Prashna Vicharu?</h2>
        <button
          className="btn small"
          onClick={() => {
            onAction?.("Clicked 'Ho Vichara 🙈' (Unlocked Proposal Question Screen)");
            setAsked(true);
          }}
        >
          Ho Vichara 🙈
        </button>
      </div>
    );
  }

  // the "No" button runs away within safe non-overlapping bounds
  const dodge = (e) => {
    if (e && e.cancelable) {
      e.preventDefault();
    }
    const nextTries = tries + 1;
    setTries(nextTries);

    const spot = SAFE_DODGE_SPOTS[nextTries % SAFE_DODGE_SPOTS.length];
    const scale = Math.min(1, Math.max(0.65, (window.innerWidth - 60) / 360));
    setPos({
      x: Math.round(spot.x * scale),
      y: Math.round(spot.y * scale),
    });

    const label = NO_LABELS[tries % NO_LABELS.length];
    onAction?.(`Clicked/dodged 'NAKO' button (Attempt #${nextTries}: "${label}")`);
    // Notify parent that 'No' was clicked / dodged
    onNo?.(nextTries, label);
  };

  return (
    <div className="glass proposal">
      <h1 className="grad-title">Tu Mazi Girlfriend Hoshil Ka?</h1>
      <div className="big-heart">💜</div>

      <div className="btn-zone">
        <button
          className="btn yes"
          onClick={() => {
            onAction?.(
              `Clicked '💗 HO NAKKI!' (Said YES to Proposal! Total 'Nako' attempts: ${tries})`
            );
            onYes(tries);
          }}
        >
          💗 HO NAKKI!
        </button>
        <button
          className="btn ghost no"
          style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
          onMouseEnter={dodge}
          onTouchStart={dodge}
          onClick={dodge}
        >
          {NO_LABELS[tries % NO_LABELS.length]}
        </button>
      </div>
    </div>
  );
}
