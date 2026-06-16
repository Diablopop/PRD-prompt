/*
  Holds all wizard state: the user's answers and which step they're on.
  Answers persist to localStorage so a refresh or accidental close doesn't
  lose progress (PRD 4.2). No data ever leaves the browser.
*/

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { sectionCount } from "../data/sections.js";

const STORAGE_KEY = "prd-prompt-builder/v1";

// Step model is a single linear index:
//   0                 -> Welcome
//   1 .. sectionCount -> the question sections
//   sectionCount + 1  -> Review
//   sectionCount + 2  -> Output
export const STEP = {
  welcome: 0,
  firstSection: 1,
  lastSection: sectionCount,
  review: sectionCount + 1,
  output: sectionCount + 2,
};
export const LAST_STEP = STEP.output;

const WizardContext = createContext(null);

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    // Corrupt or unavailable storage shouldn't break the app — start fresh.
    return null;
  }
}

export function WizardProvider({ children }) {
  const saved = loadSaved();
  const [answers, setAnswers] = useState(() => saved?.answers ?? {});
  const [step, setStep] = useState(() => saved?.step ?? STEP.welcome);

  // Persist on every change. Cheap for this data size.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, step }));
    } catch {
      // Storage full or blocked (e.g. private mode): degrade silently.
    }
  }, [answers, step]);

  const value = useMemo(() => {
    const setAnswer = (questionId, val) =>
      setAnswers((prev) => ({ ...prev, [questionId]: val }));

    const next = () => setStep((s) => Math.min(s + 1, LAST_STEP));
    const back = () => setStep((s) => Math.max(s - 1, STEP.welcome));
    const goTo = (s) => setStep(Math.min(Math.max(s, STEP.welcome), LAST_STEP));

    const reset = () => {
      setAnswers({});
      setStep(STEP.welcome);
    };

    return { answers, setAnswer, step, next, back, goTo, reset };
  }, [answers, step]);

  return <WizardContext.Provider value={value}>{children}</WizardContext.Provider>;
}

export function useWizard() {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error("useWizard must be used inside <WizardProvider>");
  return ctx;
}
