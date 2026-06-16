import Explainer from "../Explainer.jsx";

/* Choose exactly one option. Grouped in a fieldset for accessibility. */
export default function RadioGroup({ question, value, onChange }) {
  const { id, label, choices, help } = question;

  return (
    <fieldset className="field">
      <legend className="field__label">{label}</legend>
      <div className="field__choices">
        {choices.map((choice) => (
          <label
            key={choice.value}
            className="choice"
            data-selected={value === choice.value}
          >
            <input
              className="choice__control"
              type="radio"
              name={id}
              value={choice.value}
              checked={value === choice.value}
              onChange={() => onChange(choice.value)}
            />
            <span className="choice__text">
              {choice.label}
              {choice.recommend && <span className="choice__badge">Recommended</span>}
            </span>
          </label>
        ))}
      </div>
      <Explainer text={help} />
    </fieldset>
  );
}
