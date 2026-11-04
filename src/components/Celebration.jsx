import Confetti from "./Confetti.jsx";

export default function Celebration({ onDone, onAction }) {
  const handleClick = () => {
    onAction?.(
      "Clicked 'Aaplya Story Madhe Swagat Ahe 🧡' (Celebration Completed -> Entering Story)"
    );
    onDone();
  };

  return (
    <>
      <Confetti count={200} loop />
      <h1 className="grad-title yay">Yayyyyyyyy ❤️</h1>
      <p className="line">
        Officially...
        <br />
        Aata tu mazi saglyat favourite notification ahes.
      </p>
      <p className="line">
        I Promise...
        <br />
        Tuzya pratyek smile ch kaaran bannyacha purna prayatna karen.
      </p>
      <div className="ring" />
      <button className="btn" onClick={handleClick}>
        Aaplya Story Madhe Swagat Ahe 🧡
      </button>
    </>
  );
}
