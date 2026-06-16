import ScreenShell from "../components/ScreenShell.jsx";
import Button from "../components/Button.jsx";
import "./ReviewScreen.css";
import { useWizard, STEP } from "../context/WizardContext.jsx";
import { sections } from "../data/sections.js";

/*
  Read-back of every answer, grouped by section, with a quick jump to edit.
  (In-place editing polish and the assembled prompt come in later milestones.)
*/
function readableAnswer(question, value) {
  if (value == null || value === "" || (Array.isArray(value) && value.length === 0)) {
    return null; // skipped
  }
  if (question.type === "multi") {
    const labels = question.choices
      .filter((c) => value.includes(c.value))
      .map((c) => c.label);
    return labels.join(", ");
  }
  if (question.type === "single") {
    return question.choices.find((c) => c.value === value)?.label ?? value;
  }
  return value;
}

export default function ReviewScreen() {
  const { answers, back, next, goTo } = useWizard();

  return (
    <ScreenShell
      title="Review your answers"
      blurb="Check everything over. Tap any section to make changes."
      footer={
        <>
          <Button variant="secondary" onClick={back}>
            Back
          </Button>
          <Button onClick={next}>Build my prompt</Button>
        </>
      }
    >
      <div className="review">
        {sections.map((section, index) => (
          <section key={section.id} className="review__group">
            <div className="review__group-head">
              <h2 className="review__group-title">{section.title}</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => goTo(STEP.firstSection + index)}
              >
                Edit
              </Button>
            </div>
            <dl className="review__list">
              {section.questions.map((q) => {
                const display = readableAnswer(q, answers[q.id]);
                return (
                  <div key={q.id} className="review__row">
                    <dt className="review__term">{q.label}</dt>
                    <dd className="review__value">
                      {display ?? <span className="review__empty">Not answered</span>}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </section>
        ))}
      </div>
    </ScreenShell>
  );
}
