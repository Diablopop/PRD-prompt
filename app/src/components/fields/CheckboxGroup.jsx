import Explainer from "../Explainer.jsx";

/* Choose any number of options. Value is an array of selected choice values. */
export default function CheckboxGroup({ question, value, onChange }) {
  const { id, label, choices, help } = question;
  const selected = Array.isArray(value) ? value : [];

  const exclusiveValues = choices.filter((c) => c.exclusive).map((c) => c.value);

  const toggle = (choice) => {
    const v = choice.value;
    if (selected.includes(v)) {
      onChange(selected.filter((x) => x !== v));
    } else if (choice.exclusive) {
      // An exclusive option (e.g. "I'm not sure") clears everything else.
      onChange([v]);
    } else {
      // Picking a normal option clears any exclusive option that was selected.
      onChange([...selected.filter((x) => !exclusiveValues.includes(x)), v]);
    }
  };

  return (
    <fieldset className="field">
      <legend className="field__label">{label}</legend>
      <div className="field__choices">
        {choices.map((choice) => (
          <label
            key={choice.value}
            className="choice"
            data-selected={selected.includes(choice.value)}
          >
            <input
              className="choice__control"
              type="checkbox"
              name={id}
              value={choice.value}
              checked={selected.includes(choice.value)}
              onChange={() => toggle(choice)}
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
