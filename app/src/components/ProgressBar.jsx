import "./ProgressBar.css";

/*
  Shows "Step X of Y" plus a filled bar. `current` and `total` are 1-based
  section numbers. The fill width is a genuinely dynamic value, so an inline
  style is acceptable here per the CSS guidelines.
*/
export default function ProgressBar({ current, total }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="progress">
      <div className="progress__label">
        Step {current} of {total}
      </div>
      <div
        className="progress__track"
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label={`Step ${current} of ${total}`}
      >
        <div className="progress__fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
