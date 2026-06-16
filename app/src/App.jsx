import "./App.css";
import { useWizard, STEP } from "./context/WizardContext.jsx";
import WelcomeScreen from "./screens/WelcomeScreen.jsx";
import SectionScreen from "./screens/SectionScreen.jsx";
import ReviewScreen from "./screens/ReviewScreen.jsx";
import OutputScreen from "./screens/OutputScreen.jsx";

/* Chooses which screen to show based on the current step. */
function CurrentScreen() {
  const { step } = useWizard();
  if (step === STEP.welcome) return <WelcomeScreen />;
  if (step === STEP.review) return <ReviewScreen />;
  if (step === STEP.output) return <OutputScreen />;
  return <SectionScreen />; // any step in 1..sectionCount
}

export default function App() {
  return (
    <div className="app">
      <main className="app__main">
        <CurrentScreen />
      </main>
    </div>
  );
}
