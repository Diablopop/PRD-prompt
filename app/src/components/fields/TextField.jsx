import Explainer from "../Explainer.jsx";

/* Single-line or multi-line free text, chosen by `multiline`. */
export default function TextField({ question, value, onChange }) {
  const { id, label, placeholder, help, type } = question;
  const multiline = type === "textarea";
  const inputId = `field-${id}`;

  return (
    <div className="field">
      <label className="field__label" htmlFor={inputId}>
        {label}
      </label>
      {multiline ? (
        <textarea
          id={inputId}
          className="field__textarea"
          placeholder={placeholder}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          id={inputId}
          type="text"
          className="field__input"
          placeholder={placeholder}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      <Explainer text={help} />
    </div>
  );
}
