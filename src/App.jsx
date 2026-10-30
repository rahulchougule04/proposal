import { useCallback, useEffect, useRef, useState } from "react";
import Background from "./components/Background.jsx";
import Loader from "./components/Loader.jsx";
import Envelope from "./components/Envelope.jsx";
import Quiz from "./components/Quiz.jsx";
import Player from "./components/Player.jsx";
import Question from "./components/Question.jsx";
import Celebration from "./components/Celebration.jsx";
import Story from "./components/Story.jsx";
import { saveProposalNo, saveProposalResponse, saveQuestionAnswer } from "./firebase.js";

const STAGES = [
  "loader",
  "envelope",
  "quiz",
  "player",
  "question",
  "celebration",
  "story",
];

export default function App() {
  const [stage, setStage] = useState("loader");
  const [yesAt, setYesAt] = useState(null);
  const [proposalTries, setProposalTries] = useState(0);
  const [answers, setAnswers] = useState({
    "Coffee Date?": "YES",
    "Late Night Talks?": "100%",
    "Movie Nights?": "YES",
    proposal: "YES! 💗💍",
  });

  // Unique session ID for each visit so responses are grouped together
  const sessionIdRef = useRef("proposal_" + Date.now());

  // One shared <audio> so the song keeps playing across screens
  const audioRef = useRef(null);
  if (!audioRef.current) {
    audioRef.current = new Audio(`${import.meta.env.BASE_URL}love-song.mp3`);
    audioRef.current.loop = true;
  }

  const next = useCallback(() => {
    setStage((s) => STAGES[Math.min(STAGES.indexOf(s) + 1, STAGES.length - 1)]);
  }, []);

  const handleQuizAnswer = useCallback((question, ans) => {
    setAnswers((prev) => {
      const updated = { ...prev, [question]: ans };
      // Save each answer immediately in real time to Firebase Firestore
      saveQuestionAnswer({
        sessionId: sessionIdRef.current,
        question,
        answer: ans,
        allAnswers: updated,
      });
      return updated;
    });
  }, []);

  const handleNo = useCallback(
    (tries = 1) => {
      setProposalTries(tries);
      saveProposalNo({
        sessionId: sessionIdRef.current,
        answers,
        reason: `Clicked 'NO' on proposal screen (${tries} attempt${tries > 1 ? "s" : ""})`,
      });
    },
    [answers]
  );

  // If the user goes back on phone/browser or exits while on the proposal screen,
  // automatically record the proposal as NO in Firebase Firestore
  useEffect(() => {
    if (stage === "question") {
      window.history.pushState({ stage: "question" }, "");

      // Immediately log that question stage was reached without saying YES yet
      saveProposalNo({
        sessionId: sessionIdRef.current,
        answers,
        reason: "Reached proposal screen (Awaiting YES or left page)",
      });

      const handlePopState = () => {
        saveProposalNo({
          sessionId: sessionIdRef.current,
          answers,
          reason: "Pressed back button on proposal page",
        });
      };

      const handlePageLeave = () => {
        saveProposalNo({
          sessionId: sessionIdRef.current,
          answers,
          reason: "Closed or navigated away from proposal page",
        });
      };

      window.addEventListener("popstate", handlePopState);
      window.addEventListener("pagehide", handlePageLeave);
      window.addEventListener("beforeunload", handlePageLeave);

      return () => {
        window.removeEventListener("popstate", handlePopState);
        window.removeEventListener("pagehide", handlePageLeave);
        window.removeEventListener("beforeunload", handlePageLeave);
      };
    }
  }, [stage, answers]);

  const sayYes = useCallback(
    (tries = 0) => {
      const updatedAnswers = { ...answers, proposal: "YES! 💗💍" };
      setYesAt(Date.now());
      setProposalTries(tries);
      setAnswers(updatedAnswers);

      // Save final acceptance and attempts to Firebase Firestore
      saveProposalResponse({
        sessionId: sessionIdRef.current,
        answers: updatedAnswers,
        proposalTries: tries,
      });

      next();
    },
    [answers, next]
  );

  return (
    <div className="app">
      <Background />
      <div className="stage" key={stage}>
        {stage === "loader" && <Loader onDone={next} />}
        {stage === "envelope" && <Envelope onDone={next} />}
        {stage === "quiz" && <Quiz onDone={next} onAnswer={handleQuizAnswer} />}
        {stage === "player" && <Player audio={audioRef.current} onDone={next} />}
        {stage === "question" && <Question onYes={sayYes} onNo={handleNo} />}
        {stage === "celebration" && <Celebration onDone={next} />}
        {stage === "story" && (
          <Story
            since={yesAt ?? Date.now()}
            quizAnswers={answers}
            proposalTries={proposalTries}
          />
        )}
      </div>
    </div>
  );
}
