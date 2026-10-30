import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";

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
 * Saves or updates each quiz question answer in real-time
 */
export async function saveQuestionAnswer({ sessionId, question, answer, allAnswers }) {
  try {
    const docRef = doc(db, "responses", sessionId);
    await setDoc(
      docRef,
      {
        sessionId,
        answers: allAnswers,
        lastAnswered: { question, answer },
        status: "QUIZ_IN_PROGRESS",
        updatedAt: serverTimestamp(),
        clientTime: new Date().toLocaleString(),
      },
      { merge: true }
    );
    console.log(`[Firebase] Saved answer: "${question}" -> "${answer}"`);
  } catch (error) {
    console.error("[Firebase] Error saving quiz question:", error);
  }
}

/**
 * Saves proposal rejection / NO when the user leaves, goes back, or refuses on the proposal question page
 */
export async function saveProposalNo({ sessionId, answers = {}, reason = "Left or went back on proposal page" }) {
  try {
    const docRef = doc(db, "responses", sessionId);
    await setDoc(
      docRef,
      {
        sessionId,
        answers: {
          ...answers,
          proposal: "NO 💔",
        },
        proposalResponse: "NO 💔",
        status: "REJECTED_OR_BACK",
        rejectionReason: reason,
        updatedAt: serverTimestamp(),
        clientTime: new Date().toLocaleString(),
        userAgent: navigator.userAgent,
      },
      { merge: true }
    );
    console.log(`[Firebase] Proposal recorded as NO in Firestore (${reason})`);
  } catch (error) {
    console.error("[Firebase] Error recording proposal NO:", error);
  }
}

/**
 * Saves final proposal response (YES) and number of times 'No' was avoided
 */
export async function saveProposalResponse({ sessionId, answers = {}, proposalTries = 0 }) {
  try {
    const docRef = doc(db, "responses", sessionId);
    await setDoc(
      docRef,
      {
        sessionId,
        answers,
        proposalTries,
        proposalResponse: "YES! 💗💍",
        status: "PROPOSAL_ACCEPTED",
        acceptedAt: serverTimestamp(),
        clientTime: new Date().toLocaleString(),
        userAgent: navigator.userAgent,
      },
      { merge: true }
    );
    console.log("[Firebase] Proposal response saved successfully to Firestore!");
  } catch (error) {
    console.error("[Firebase] Error saving proposal response:", error);
  }
}
