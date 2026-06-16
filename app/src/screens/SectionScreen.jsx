import ScreenShell from "../components/ScreenShell.jsx";
import Button from "../components/Button.jsx";
import Note from "../components/Note.jsx";
import QuestionField from "../components/fields/QuestionField.jsx";
import { useWizard, STEP } from "../context/WizardContext.jsx";
import { sections, sectionCount } from "../data/sections.js";

/*
  Renders one question section. `step` (1..sectionCount) maps to a section.
  Every question is optional to advance — "I'm not sure" is always valid and
  users can skip (PRD 4.2 / 6.3).
*/
export default function SectionScreen() {
  const { step, answers, setAnswer, next, back } = useWizard();
  const section = sections[step - STEP.firstSection];

  // Conditional guidance: if the user picked features that require stored data,
  // flag on the backend screen that a backend is needed (PRD Section 4 rule).
  const features = Array.isArray(answers.features) ? answers.features : [];
  const backendImplied =
    section.id === "backend" &&
    (features.includes("auth") || features.includes("persist"));

  return (
    <ScreenShell
      progress={{ current: step, total: sectionCount }}
      title={section.title}
      blurb={section.blurb}
      footer={
        <>
          <Button variant="secondary" onClick={back}>
            Back
          </Button>
          <Button onClick={next}>Next</Button>
        </>
      }
    >
      {backendImplied && (
        <Note>
          Based on the features you chose (accounts/login or saving data), your
          app will need a backend to store information. We recommend
          <strong> Supabase</strong> — its free tier covers a database, logins,
          and file storage.
        </Note>
      )}
      {section.questions.map((question) => (
        <QuestionField
          key={question.id}
          question={question}
          value={answers[question.id]}
          onChange={(val) => setAnswer(question.id, val)}
        />
      ))}
    </ScreenShell>
  );
}
