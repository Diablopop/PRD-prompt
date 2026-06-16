import "./Note.css";

/* A small inline informational note (e.g. contextual guidance on a screen). */
export default function Note({ children }) {
  return (
    <p className="note" role="note">
      {children}
    </p>
  );
}
