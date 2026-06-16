import "./Explainer.css";

/*
  Progressive-disclosure helper: a "What's this?" toggle that reveals plain-
  language help. Uses native <details>/<summary> so it's keyboard- and screen-
  reader-accessible with no extra JS. Renders nothing if there's no text.
*/
export default function Explainer({ text }) {
  if (!text) return null;
  return (
    <details className="explainer">
      <summary className="explainer__summary">What&rsquo;s this?</summary>
      <p className="explainer__body">{text}</p>
    </details>
  );
}
