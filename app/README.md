# PRD Prompt Builder — app

A mobile-friendly, deterministic web app that walks a non-technical user through
a short questionnaire and assembles their answers into a copy-paste prompt for
Claude Code, which then writes a PRD for their web app. No backend, no AI calls,
no data leaves the browser.

See the parent folder for product docs: `../PRD.md` and `../PROMPT_TEMPLATE.md`.

## Tech

- React + Vite (static front-end only)
- Plain CSS with a design-token foundation in `src/styles/tokens.css`
- State + localStorage persistence in `src/context/WizardContext.jsx`

## Run it locally

```bash
npm install      # first time only
npm run dev      # start dev server at http://localhost:5173
npm run build    # production build into dist/
npm run preview  # preview the production build
```

## How it's organized

```
src/
  styles/tokens.css      Design tokens (colors, type, spacing) — single source of truth
  styles/base.css        Resets and global element defaults
  data/sections.js       The question set, as data (edit questions here)
  context/WizardContext   Answers + step state, saved to localStorage
  components/             Reusable UI: Button, Card, ProgressBar, Explainer, ScreenShell
  components/fields/      Field types: text, radio, checkbox + a dispatcher
  screens/               Welcome, Section, Review, Output
```

To add or change a question, edit `src/data/sections.js` — screens render from it.

## Build status

- M1 — Prompt template: done (`../PROMPT_TEMPLATE.md`)
- M2 — Wizard shell: done (screens, navigation, progress, persistence)
- M3 — Question content: done (questions, conditional backend logic, "What's this?" explainers)
- M4 — Output: done (prompt assembly in `src/lib/buildPrompt.js`, copy, download)
- M5 — Polish + deploy — not started
