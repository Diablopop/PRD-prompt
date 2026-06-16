import ScreenShell from "../components/ScreenShell.jsx";
import Button from "../components/Button.jsx";
import { useWizard } from "../context/WizardContext.jsx";

export default function WelcomeScreen() {
  const { next } = useWizard();

  return (
    <ScreenShell
      title="Build your PRD prompt"
      blurb="Answer a few plain-language questions and we'll write a ready-to-paste prompt for Claude Code — which then turns it into a full plan for your app."
      footer={
        <>
          <span />
          <Button size="lg" onClick={next}>
            Get started
          </Button>
        </>
      }
    >
      <div className="prose">
        <p>
          <strong>What&rsquo;s a PRD?</strong> A Product Requirements Document is
          a clear written plan that describes what your app should do, who it&rsquo;s
          for, and how it should work — so a developer (or Claude Code) knows
          exactly what to build.
        </p>
        <p>
          You don&rsquo;t need any technical knowledge. Every question has an
          &ldquo;I&rsquo;m not sure&rdquo; option, and we&rsquo;ll suggest free
          tools where a choice is needed. Nothing you enter leaves your device.
        </p>
      </div>
    </ScreenShell>
  );
}
