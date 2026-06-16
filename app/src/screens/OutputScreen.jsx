import { useMemo, useState } from "react";
import ScreenShell from "../components/ScreenShell.jsx";
import Button from "../components/Button.jsx";
import "./OutputScreen.css";
import { useWizard } from "../context/WizardContext.jsx";
import { buildPrompt } from "../lib/buildPrompt.js";

export default function OutputScreen() {
  const { answers, back, reset } = useWizard();
  const [copied, setCopied] = useState(false);

  // Recompute only when answers change. Deterministic output.
  const prompt = useMemo(() => buildPrompt(answers), [answers]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([prompt], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "prd-prompt.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ScreenShell
      title="Your prompt is ready"
      blurb="Copy this and paste it into Claude Code. It will ask any follow-up questions, then write your PRD."
      footer={
        <>
          <Button variant="secondary" onClick={back}>
            Back
          </Button>
          <Button variant="ghost" onClick={reset}>
            Start over
          </Button>
        </>
      }
    >
      <div className="output">
        <div className="output__actions">
          <Button onClick={handleCopy}>
            {copied ? "Copied!" : "Copy prompt"}
          </Button>
          <Button variant="secondary" onClick={handleDownload}>
            Download .md
          </Button>
        </div>

        <pre className="output__prompt" aria-label="Assembled prompt">
          {prompt}
        </pre>

        <ol className="output__steps">
          <li>Open Claude Code (in your terminal, the desktop app, or the web app).</li>
          <li>Paste the prompt above and send it.</li>
          <li>Answer any clarifying questions, then let it write your PRD.</li>
        </ol>
      </div>
    </ScreenShell>
  );
}
