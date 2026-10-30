import Confetti from "./Confetti.jsx";

export default function Celebration({ onDone }) {
  return (
    <>
      <Confetti count={200} loop />
      <h1 className="grad-title yay">Yayyyyyyyy ❤️</h1>
      <p className="line">
        Officially...
        <br />
        Ab tum meri favourite notification ho.
      </p>
      <p className="line">
        I Promise...
        <br />
        Har smile ki wajah banne ki puri koshish karunga.
      </p>
      <div className="ring" />
      <button className="btn" onClick={onDone}>
        Welcome to Our Story
      </button>
    </>
  );
}
