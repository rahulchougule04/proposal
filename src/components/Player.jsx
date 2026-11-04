import { useEffect, useState } from "react";

export default function Player({ audio, onDone, onAction }) {
  const [playing, setPlaying] = useState(!audio.paused);
  const [progress, setProgress] = useState(0);
  const [started, setStarted] = useState(!audio.paused);

  useEffect(() => {
    const onTime = () => {
      if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100);
    };
    audio.addEventListener("timeupdate", onTime);
    return () => audio.removeEventListener("timeupdate", onTime);
  }, [audio]);

  const toggle = async () => {
    if (audio.paused) {
      try {
        await audio.play();
        setPlaying(true);
        setStarted(true);
        onAction?.("Clicked '▶ Play Song 🎵' (Audio Started Playing)");
      } catch (e) {
        console.warn("Audio blocked:", e);
      }
    } else {
      audio.pause();
      setPlaying(false);
      onAction?.("Clicked 'Pause Song' (Audio Paused)");
    }
  };

  return (
    <div className="glass player">
      <div className={`disc ${playing ? "spin" : ""}`} />
      <h3 className="track">Aapan Doghe 🧡</h3>
      <small className="sub">Aapli Love Story</small>

      <div className={`eq ${playing ? "on" : ""}`}>
        <i /><i /><i /><i /><i />
      </div>
      <div className="bar thin">
        <i style={{ width: `${progress}%` }} />
      </div>

      <button className="btn" onClick={toggle}>
        {playing ? "❤ Playing..." : "▶ Play Song 🎵"}
      </button>

      {started && (
        <>
          <p className="lyric fade-in">
            Tu fakt mazi favourite person nahis...
            <br />
            Tu mazi saglyat favourite feeling ahes. 💗
          </p>
          <button
            className="btn small fade-in"
            onClick={() => {
              onAction?.("Clicked 'Pudhe Chala 🧡' on Player (Proceeding to Proposal Question)");
              onDone();
            }}
          >
            Pudhe Chala 🧡
          </button>
        </>
      )}
    </div>
  );
}
