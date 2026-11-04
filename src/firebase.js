import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, serverTimestamp, arrayUnion } from "firebase/firestore";

// Firebase credentials for project "new-232ec"
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyALa5pCR5nGID78j8-6lMdBYCbPKbIhd4w",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "new-232ec.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "new-232ec",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "new-232ec.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "912775649439",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:912775649439:web:6a6ba62b46393c8962aaaa",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-9N2XS89JHX",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

/**
 * Initializes session entry in Firebase as soon as the user opens the page
 */
export async function initSession({ sessionId, initialStage = "loader" }) {
  try {
    const docRef = doc(db, "responses", sessionId);
    await setDoc(
      docRef,
      {
        sessionId,
        currentStage: initialStage,
        status: "VISITED",
        startedAt: serverTimestamp(),
        clientStartTime: new Date().toLocaleString(),
        clientTime: new Date().toLocaleString(),
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
        screenSize:
          typeof window !== "undefined" ? `${window.innerWidth}x${window.innerHeight}` : "",
        answers: {
          "Coffee Date?": "Pending...",
          "Late Night Talks?": "Pending...",
          "Movie Nights?": "Pending...",
          proposal: "Pending...",
        },
        proposalTries: 0,
        proposalResponse: "Pending...",
        lastAction: "Opened page (Session Started)",
        lastActionTime: new Date().toLocaleTimeString(),
        history: [
          {
            action: "Opened page (Session Started)",
            stage: initialStage,
            time: new Date().toLocaleTimeString(),
            timestamp: Date.now(),
          },
        ],
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    console.log(`[Firebase] Session initialized: ${sessionId}`);
  } catch (error) {
    console.error("[Firebase] Error initializing session:", error);
  }
}

/**
 * Logs any button click or user action to Firebase
 */
export async function logButtonAction({ sessionId, stage, action, extra = {} }) {
  try {
    const docRef = doc(db, "responses", sessionId);
    await setDoc(
      docRef,
      {
        sessionId,
        currentStage: stage,
        lastAction: action,
        lastActionTime: new Date().toLocaleTimeString(),
        clientTime: new Date().toLocaleString(),
        updatedAt: serverTimestamp(),
        history: arrayUnion({
          action,
          stage,
          time: new Date().toLocaleTimeString(),
          timestamp: Date.now(),
        }),
        ...extra,
      },
      { merge: true }
    );
    console.log(`[Firebase Action] [${stage}] ${action}`);
  } catch (error) {
    console.error("[Firebase] Error logging button action:", error);
  }
}

/**
 * Logs transition between stages
 */
export async function logStageTransition({ sessionId, fromStage, toStage }) {
  const action = `Proceeded from '${fromStage}' to '${toStage}'`;
  await logButtonAction({
    sessionId,
    stage: toStage,
    action,
    extra: { currentStage: toStage, status: "IN_PROGRESS" },
  });
}

/**
 * Logs when a user hits browser/phone back button or exits/leaves the page without seeing the next step
 */
export async function logUserBackOrExit({
  sessionId,
  stage,
  reason,
  eventType,
  answers = {},
  proposalTries = 0,
}) {
  try {
    const docRef = doc(db, "responses", sessionId);
    const action = `[DROP-OFF / BACK] ${reason}`;
    await setDoc(
      docRef,
      {
        sessionId,
        abandonedStage: stage,
        dropOffReason: reason,
        dropOffEventType: eventType,
        status: "LEFT_OR_BACK_WITHOUT_SEEING_NEXT_STEP",
        lastAction: action,
        lastActionTime: new Date().toLocaleTimeString(),
        clientTime: new Date().toLocaleString(),
        proposalResponse: "NAKO (Exited Early / Back) 💔",
        proposalTries,
        answers: {
          ...answers,
          proposal: "NAKO (Exited Early / Back) 💔",
        },
        updatedAt: serverTimestamp(),
        history: arrayUnion({
          action,
          stage,
          eventType,
          time: new Date().toLocaleTimeString(),
          timestamp: Date.now(),
        }),
      },
      { merge: true }
    );
    console.log(`[Firebase Drop-Off] Recorded exit/back on stage '${stage}': ${reason}`);
  } catch (error) {
    console.error("[Firebase] Error recording drop-off/back event:", error);
  }
}

/**
 * Saves or updates each quiz question answer in real-time
 */
export async function saveQuestionAnswer({ sessionId, question, answer, allAnswers }) {
  try {
    const docRef = doc(db, "responses", sessionId);
    const action = `Quiz answer: "${question}" -> "${answer}"`;
    await setDoc(
      docRef,
      {
        sessionId,
        answers: allAnswers,
        lastAnswered: { question, answer },
        lastAction: action,
        lastActionTime: new Date().toLocaleTimeString(),
        status: "QUIZ_IN_PROGRESS",
        updatedAt: serverTimestamp(),
        clientTime: new Date().toLocaleString(),
        history: arrayUnion({
          action,
          stage: "quiz",
          question,
          answer,
          time: new Date().toLocaleTimeString(),
          timestamp: Date.now(),
        }),
      },
      { merge: true }
    );
    console.log(`[Firebase] Saved answer: "${question}" -> "${answer}"`);
  } catch (error) {
    console.error("[Firebase] Error saving quiz question:", error);
  }
}

/**
 * Saves dodge/rejection click on the proposal question page
 */
export async function saveProposalNo({
  sessionId,
  answers = {},
  reason = "Clicked 'NAKO' on proposal",
  tries = 1,
  label = "NAKO",
}) {
  try {
    const docRef = doc(db, "responses", sessionId);
    const action = `Dodged/Clicked 'NAKO' button (Attempt #${tries}: "${label}")`;
    await setDoc(
      docRef,
      {
        sessionId,
        proposalTries: tries,
        lastNakoLabel: label,
        lastAction: action,
        lastActionTime: new Date().toLocaleTimeString(),
        updatedAt: serverTimestamp(),
        clientTime: new Date().toLocaleString(),
        history: arrayUnion({
          action,
          stage: "question",
          attempt: tries,
          label,
          time: new Date().toLocaleTimeString(),
          timestamp: Date.now(),
        }),
      },
      { merge: true }
    );
    console.log(`[Firebase] Proposal dodge recorded in Firestore (${action})`);
  } catch (error) {
    console.error("[Firebase] Error recording proposal NO/dodge:", error);
  }
}

/**
 * Saves final proposal response (YES) and number of times 'No' was dodged
 */
export async function saveProposalResponse({ sessionId, answers = {}, proposalTries = 0 }) {
  try {
    const docRef = doc(db, "responses", sessionId);
    const action = `Clicked '💗 HO NAKKI!' (Said YES! Dodges: ${proposalTries})`;
    await setDoc(
      docRef,
      {
        sessionId,
        answers,
        proposalTries,
        proposalResponse: "HO! 💗💍",
        status: "PROPOSAL_ACCEPTED",
        lastAction: action,
        lastActionTime: new Date().toLocaleTimeString(),
        acceptedAt: serverTimestamp(),
        clientTime: new Date().toLocaleString(),
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
        history: arrayUnion({
          action,
          stage: "question",
          time: new Date().toLocaleTimeString(),
          timestamp: Date.now(),
        }),
      },
      { merge: true }
    );
    console.log("[Firebase] Proposal response saved successfully to Firestore!");
  } catch (error) {
    console.error("[Firebase] Error saving proposal response:", error);
  }
}
