import { useState } from "react";

const PAGES = [
  [
    "Hey Jaan...",
    "Pata hai... Main ye sab normally bol nahi pata...",
    "Lekin aaj dil ne kaha... Risk le le...",
    "Kyuki kuch log baar baar nahi milte.",
  ],
  ["Jab bhi tum online aati ho...", "Mera mood automatically better ho jata hai."],
  ["Honestly...", "Tum meri life ki sabse pyari coincidence ho."],
];

export default function Envelope({ onDone }) {
  const [open, setOpen] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [page, setPage] = useState(0);

  const openEnvelope = () => {
    if (open) return;
    setOpen(true);
    setTimeout(() => setShowLetter(true), 1000);
  };

  if (!showLetter) {
    return (
      <>
        <div className={`env ${open ? "open" : ""}`} onClick={openEnvelope}>
          <div className="back" />
          <div className="paper" />
          <div className="front" />
          <div className="flap" />
        </div>
        <p className="hint">tap the envelope to open it</p>
      </>
    );
  }

  const last = page === PAGES.length - 1;
  return (
    <div className="letter">
      <h3>for you</h3>
      <div className="letter-body" key={page}>
        {PAGES[page].map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
      <button className="btn" onClick={() => (last ? onDone() : setPage(page + 1))}>
        {last ? "Continue 🧡" : "Next"}
      </button>
    </div>
  );
}
