import "./Field.css";
import TextField from "./TextField.jsx";
import RadioGroup from "./RadioGroup.jsx";
import CheckboxGroup from "./CheckboxGroup.jsx";

/* Picks the right field component for a question's type. */
export default function QuestionField({ question, value, onChange }) {
  switch (question.type) {
    case "text":
    case "textarea":
      return <TextField question={question} value={value} onChange={onChange} />;
    case "single":
      return <RadioGroup question={question} value={value} onChange={onChange} />;
    case "multi":
      return <CheckboxGroup question={question} value={value} onChange={onChange} />;
    default:
      return null;
  }
}
