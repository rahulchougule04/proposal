import { useState } from "react";

const PAGES = [
  [
    "Mahit ahe... Mi he sagla normally bolu shakat nahi...",
    "Pan aaj manane sangitla... Risk gheun bagh...",
    "Karan kahi loka aayushyat punha punha nahi bhetat.",
  ],
  [
    "Jevha pan tu online yetes na...",
    "Maza mood automatically khup changla hoto.",
  ],
  [
    "Honestly...",
    "Tu mazya life madhla saglyat sundar coincidence ahes.",
  ],
];

export default function Envelope({ onDone, onAction }) {
  const [open, setOpen] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [page, setPage] = useState(0);

  const openEnvelope = () => {
    if (open) return;
    setOpen(true);
    onAction?.("Tapped and opened the envelope");
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
        <p className="hint">Chiththi ughadnyasathi tap kara 💌</p>
      </>
    );
  }

  const last = page === PAGES.length - 1;
  const handleNext = () => {
    if (last) {
      onAction?.("Finished reading Letter, clicked 'Pudhe Chala 🧡' (Proceeding to Quiz)");
      onDone();
    } else {
      onAction?.(`Read Letter Page ${page + 1}/${PAGES.length}, clicked 'Pudhe →' (Viewing Page ${page + 2})`);
      setPage(page + 1);
    }
  };

  return (
    <div className="letter">
      <h3>Fakt Tuzyasathi ❤️</h3>
      <div className="letter-body" key={page}>
        {PAGES[page].map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
      <button className="btn" onClick={handleNext}>
        {last ? "Pudhe Chala 🧡" : "Pudhe →"}
      </button>
    </div>
  );
}
