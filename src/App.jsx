import { useCallback, useEffect, useRef, useState } from "react";
import Background from "./components/Background.jsx";
import Loader from "./components/Loader.jsx";
import Envelope from "./components/Envelope.jsx";
import Quiz from "./components/Quiz.jsx";
import Player from "./components/Player.jsx";
import Question from "./components/Question.jsx";
import Celebration from "./components/Celebration.jsx";
import Story from "./components/Story.jsx";
import {
  initSession,
  logButtonAction,
  logStageTransition,
  logUserBackOrExit,
  saveProposalNo,
  saveProposalResponse,
  saveQuestionAnswer,
} from "./firebase.js";

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
    "Coffee Date?": "HO NAKKI",
    "Late Night Talks?": "100% HO",
    "Movie Nights?": "HO CHALEL",
    proposal: "HO! 💗💍",
  });

  // Unique session ID for each visit so responses are grouped together
  const sessionIdRef = useRef("proposal_" + Date.now());

  // Tracks current stage for real-time window back / pagehide event handlers
  const stageRef = useRef(stage);
  stageRef.current = stage;

  // Tracks whether proposal has been accepted so exits afterwards aren't marked as rejections
  const hasAcceptedRef = useRef(false);

  // One shared <audio> so the song keeps playing across screens
  const audioRef = useRef(null);
  if (!audioRef.current) {
    audioRef.current = new Audio(`${import.meta.env.BASE_URL}love-song.mp3`);
    audioRef.current.loop = true;
  }

  // 1. Initialize session in Firebase on initial page load
  useEffect(() => {
    initSession({ sessionId: sessionIdRef.current, initialStage: "loader" });
    try {
      window.history.replaceState({ stage: "loader", index: 0 }, "");
    } catch {
      // Safe fallback if history API is restricted in sandbox
    }
  }, []);

  // Generic button click / user action logger for all child components
  const handleAction = useCallback((actionDescription) => {
    logButtonAction({
      sessionId: sessionIdRef.current,
      stage: stageRef.current,
      action: actionDescription,
    });
  }, []);

  const next = useCallback(() => {
    setStage((prev) => {
      const currentIndex = STAGES.indexOf(prev);
      const nextIndex = Math.min(currentIndex + 1, STAGES.length - 1);
      const nextStage = STAGES[nextIndex];
      if (nextStage !== prev) {
        try {
          window.history.pushState({ stage: nextStage, index: nextIndex }, "");
        } catch {
          // Safe fallback
        }
        logStageTransition({
          sessionId: sessionIdRef.current,
          fromStage: prev,
          toStage: nextStage,
        });
      }
      return nextStage;
    });
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
    (tries = 1, label = "NAKO") => {
      setProposalTries(tries);
      saveProposalNo({
        sessionId: sessionIdRef.current,
        answers,
        tries,
        label,
        reason: `Clicked 'NAKO' dodge #${tries}: "${label}"`,
      });
    },
    [answers]
  );

  const sayYes = useCallback(
    (tries = 0) => {
      hasAcceptedRef.current = true;
      const updatedAnswers = { ...answers, proposal: "HO! 💗💍" };
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

  // Record if user presses browser/phone Back button or leaves the page without seeing next step
  useEffect(() => {
    const handlePopState = () => {
      const current = stageRef.current;
      logUserBackOrExit({
        sessionId: sessionIdRef.current,
        stage: current,
        reason: `Pressed browser/phone BACK button on step '${current}' without seeing next step`,
        eventType: "BACK_BUTTON",
        answers,
        proposalTries,
      });

      try {
        window.history.pushState(
          { stage: current, index: STAGES.indexOf(current) },
          ""
        );
      } catch {
        // Safe fallback
      }
    };

    const handlePageHide = () => {
      const current = stageRef.current;
      if (!hasAcceptedRef.current && current !== "story") {
        logUserBackOrExit({
          sessionId: sessionIdRef.current,
          stage: current,
          reason: `Closed or navigated away from page on step '${current}' without seeing next step`,
          eventType: "PAGE_HIDE",
          answers,
          proposalTries,
        });
      }
    };

    const handleBeforeUnload = () => {
      const current = stageRef.current;
      if (!hasAcceptedRef.current && current !== "story") {
        logUserBackOrExit({
          sessionId: sessionIdRef.current,
          stage: current,
          reason: `Browser tab closed or refreshed during step '${current}' without seeing next step`,
          eventType: "BEFORE_UNLOAD",
          answers,
          proposalTries,
        });
      }
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [answers, proposalTries]);

  return (
    <div className="app">
      <Background />
      <div className="stage" key={stage}>
        {stage === "loader" && <Loader onDone={next} onAction={handleAction} />}
        {stage === "envelope" && (
          <Envelope onDone={next} onAction={handleAction} />
        )}
        {stage === "quiz" && (
          <Quiz
            onDone={next}
            onAnswer={handleQuizAnswer}
            onAction={handleAction}
          />
        )}
        {stage === "player" && (
          <Player
            audio={audioRef.current}
            onDone={next}
            onAction={handleAction}
          />
        )}
        {stage === "question" && (
          <Question onYes={sayYes} onNo={handleNo} onAction={handleAction} />
        )}
        {stage === "celebration" && (
          <Celebration onDone={next} onAction={handleAction} />
        )}
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
