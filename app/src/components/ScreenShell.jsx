import "./ScreenShell.css";
import Card from "./Card.jsx";
import ProgressBar from "./ProgressBar.jsx";

/*
  Shared layout for every wizard screen: an optional progress bar, a titled
  card with intro copy and body content, and a footer for navigation buttons.
  Centralizing this keeps all screens visually consistent.
*/
export default function ScreenShell({
  progress, // { current, total } or null
  title,
  blurb,
  children,
  footer,
}) {
  return (
    <div className="screen">
      {progress && (
        <div className="screen__progress">
          <ProgressBar current={progress.current} total={progress.total} />
        </div>
      )}
      <Card>
        <header className="screen__header">
          <h1 className="screen__title">{title}</h1>
          {blurb && <p className="screen__blurb">{blurb}</p>}
        </header>
        <div className="screen__body">{children}</div>
      </Card>
      {footer && <div className="screen__footer">{footer}</div>}
    </div>
  );
}
