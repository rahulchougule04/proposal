import { useEffect, useState } from "react";

export default function Player({ audio, onDone }) {
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
      } catch (e) {
        console.warn("Audio blocked:", e);
      }
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="glass player">
      <div className={`disc ${playing ? "spin" : ""}`} />
      <h3 className="track">Us 🧡</h3>
      <small className="sub">Our Story</small>

      <div className={`eq ${playing ? "on" : ""}`}>
        <i /><i /><i /><i /><i />
      </div>
      <div className="bar thin">
        <i style={{ width: `${progress}%` }} />
      </div>

      <button className="btn" onClick={toggle}>
        {playing ? "❤ Playing..." : "▶ Play Love"}
      </button>

      {started && (
        <>
          <p className="lyric fade-in">
            Tum sirf meri favourite person nahi ho...
            <br />
            Tum meri favourite feeling ho. 💗
          </p>
          <button className="btn small fade-in" onClick={onDone}>
            Continue
          </button>
        </>
      )}
    </div>
  );
}
