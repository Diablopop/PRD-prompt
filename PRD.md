# PRD — PRD Prompt Builder

**Purpose:** Product requirements for a web app that helps non-technical people generate a high-quality prompt to feed Claude Code, which then writes their web-app PRD
**Owner:** Andrew Schauer
**Version:** 1.2
**Last updated:** 2026-06-16
**Status:** Draft
**Intended use:** Human reference and AI guidance during build

---

## 1. Summary

PRD Prompt Builder is a mobile-friendly, single-page web app that walks a user through a short guided questionnaire and assembles their answers into one copy-paste block of text — a *prompt*. The user pastes that prompt into Claude Code, and Claude Code produces a well-structured PRD for the web app they want to build.

The app is **deterministic**: it has no AI connection and no backend. The same answers always produce the same prompt. All logic runs in the browser.

The target user is a **non-technical beginner** who has an app idea but does not know how to brief an AI coding tool. The app removes that barrier by asking plain-language questions, offering an "I'm not sure" option everywhere, and recommending free-tier services where a technical choice is required.

## 2. Goals and non-goals

### 2.1 Goals
- Let a non-technical person produce a complete, well-formed PRD-generation prompt in under five minutes.
- Make every technical question answerable without prior knowledge (plain-language explainers, "I'm not sure" defaults, free-tier recommendations).
- Output a single prompt block that reliably gets Claude Code to write a good PRD.
- Work well on a phone (the wizard format and touch targets assume mobile use).
- Run entirely client-side: no backend, no API calls, no data leaving the device.

### 2.2 Non-goals (v1)
- Generating the PRD itself. The app produces a *prompt*; Claude Code writes the PRD.
- Instructing Claude Code to build or scaffold the app. v1 is a "make a PRD" tool only. (See Section 9, Future enhancements.)
- User accounts, saved cloud history, or any server-side storage.
- Shareable-via-URL sessions (parked — see Section 9).

## 3. Users

- **Primary:** Non-technical beginners with an app idea and little or no coding experience. They may not know what a backend, repo, or host is.
- **Secondary:** Hobbyists and intermediate users who want a faster, structured way to brief Claude Code.

Design implication: the app must never assume technical vocabulary. Every term that could confuse a beginner (backend, repository, hosting, responsive) gets a one-tap "What's this?" explainer.

## 4. Core experience

A **step-by-step wizard**: one section per screen, with a progress indicator. This was chosen over a single long form because it is less intimidating on mobile and lets us show contextual help per section.

### 4.1 Flow
1. Welcome screen — one sentence on what the tool does and what the user will walk away with, plus a short plain-language explainer of what a PRD is: *a Product Requirements Document — a clear written plan that describes what your app should do, who it's for, and how it should work, so a developer (or Claude Code) knows exactly what to build.*
2. Ten question sections (Section 5), one screen each, with Back / Next navigation.
3. Review screen — a plain-language summary of all answers, each editable in place.
4. Output screen — the assembled prompt with a **Copy** button and a **Download (.md / .txt)** option, plus short instructions on how to use it in Claude Code.

### 4.2 Wizard behavior
- Progress bar or "Step X of Y" indicator at all times.
- Back and Next always available; Next never blocks on an unanswered question (every question is skippable, and "I'm not sure" is a valid answer).
- Conditional logic: if the user indicates they need login or saved data (Section 5, Q4), the backend section pre-flags that a backend is required.
- Answers persist in `localStorage` so a refresh or accidental close does not lose progress. A "Start over" action clears it.

## 5. Question set

Every question offers an **"I'm not sure / I don't know"** option. Technical questions include a brief plain-language explainer and a recommended free-tier default that is applied when the user is unsure.

### Section 1 — The idea (free text)
1. Working name of the app.
2. One sentence: what does it do?
3. **Who is it for?** (audience — a dedicated field, separate from the one-sentence description).
4. What problem does it solve? (optional)

### Section 2 — Your technical comfort
Single choice. Drives how much the generated PRD instructs Claude Code to explain its decisions in plain language.
- Never coded
- Beginner (can follow step-by-step instructions)
- Can read and edit code
- Experienced developer
- I'm not sure → treated as Beginner (maximum plain-language explanation)

### Section 3 — Platform
Single choice.
- Mobile-first (designed for phones first)
- Mobile-friendly / responsive (works on phone and desktop)
- Desktop only
- I'm not sure → defaults to mobile-friendly / responsive

### Section 4 — Features
A short plain-language note appears at the top of this section: **each feature you add increases the app's complexity, cost, and build time — pick only what you actually need for a first version.**

Multi-select checkboxes:
- User accounts / login
- User profiles
- Save data between visits
- File or image uploads
- Search
- Notifications (email / push)
- Payments or subscriptions
- Social features (comments, likes, sharing)
- Admin dashboard
- Maps / location
- Real-time or live updates (chat, live data)
- AI features
- Forms / surveys
- Content / blog / articles
- Dark mode
- Multi-language

Conditional rule: selecting **login** or **save data between visits** flags that a backend is needed in Section 5.

### Section 5 — Backend
1. Does your app need to store data or have user accounts?
   - Yes
   - No (static / front-end only)
   - I'm not sure → if login or save-data was selected in Section 4, the app states a backend is needed
2. If yes, provider:
   - Supabase *(recommended — free tier includes database, login/auth, and file storage)*
   - Firebase *(Google, free tier)*
   - Let Claude recommend
   - I'm not sure → defaults to Supabase

### Section 6 — Hosting
Where the app will live online. Single choice.
- Vercel *(recommended — free tier, beginner-friendly)*
- Netlify
- GitHub Pages *(free, best for simple sites)*
- Let Claude recommend → defaults to Vercel

### Section 7 — Code repository
Includes a short "what is version control / a repo" explainer.
- GitHub *(recommended — free)*
- Other
- I'm not sure → defaults to GitHub

### Section 8 — Look and feel
- Style: minimal / clean · playful / colorful · professional / corporate · bold · not sure *(not sure → minimal / clean, and the prompt asks Claude to recommend)*
- Brand colors (optional, free text or color picker)
- "Should feel like ___" reference app (optional, free text)

### Section 9 — Scope
- Quick prototype vs polished product *(not sure → quick prototype)*
- Budget: free services only · small budget · flexible *(not sure → free services only)*
- Timeline (optional)

### Section 10 — PRD output preferences
- Format: Markdown (.md) *(recommended for Claude Code)* · Word (.docx) · Plain text *(not sure → Markdown)*
- Detail level: lightweight · standard · comprehensive *(not sure → standard)*
- Include suggested milestones / phases? (yes / no) *(not sure → yes)*
- Include a testing plan? (yes / no) *(not sure → yes)*

Detail level maps to how much the prompt asks Claude Code to write:
- **Lightweight** — core only: summary, audience, key features, main technical choices.
- **Standard** — adds technical approach and success criteria.
- **Comprehensive** — adds user stories, edge cases, risks, and non-goals.

## 6. The prompt template (output)

The app concatenates answers into a deterministic prompt. The template is the second core artifact of this product — it must be authored carefully so the resulting PRD is genuinely good.

### 6.1 Structure of the generated prompt
1. **Role and task framing** — e.g. "You are an experienced product manager and engineer. Write a Product Requirements Document (PRD) for the web app described below. Do not write code yet."
2. **Skill-level instruction** — adapts to Section 2. For beginners: "I am not a developer. Explain every technical choice in plain language and call out anything that costs money or exposes personal data."
3. **The idea** — name, description, audience, problem.
4. **Requirements** — platform, selected features, backend (and provider), hosting, repository, design preferences, scope/budget.
5. **"I'm not sure" handling** — for any unsure answer, the prompt instructs Claude Code to recommend a sensible default, explain it briefly, and note it is an assumption.
6. **Code-quality standards** — a fixed block (always included, not driven by answers) that asks Claude Code to follow healthy, scalable habits in the PRD it writes. Condensed from Andrew's global standards:
   - Keep code DRY — consolidate logic or styling that repeats more than twice instead of copy-pasting.
   - Centralize styling — define colors, fonts, and spacing as shared tokens/variables in one place.
   - Keep files small and single-purpose; split files that grow large or mix unrelated concerns.
   - Use clear, consistent, self-explaining names for files, functions, and variables.
   - Avoid hardcoding values — put URLs, sizes, and repeated text in named constants or config.
   - Comment the "why," not the "what," where logic is non-obvious.
7. **PRD output spec** — requested format, detail level, and whether to include milestones and a testing plan.
8. **Closing instruction** — ask 1–3 clarifying questions first if anything material is missing, then write the PRD.

### 6.2 Determinism requirement
Given the same answers, the output prompt must be byte-for-byte identical. No randomness, no timestamps, no AI generation in the assembly step.

### 6.3 Empty and partial input
Every question is skippable. The app always produces a prompt, even with most fields blank: skipped questions are simply omitted from their section, and the prompt's closing instruction tells Claude Code to ask 1–3 clarifying questions before writing if material information is missing.

## 7. Technical approach

- **Stack:** static front-end only (a single-page app). Framework choice (e.g. plain HTML/CSS/JS, or a lightweight framework like React/Vite) to be decided at build time; keep it simple given there is no backend.
- **No backend, no API calls, no analytics that transmit answers.** All data stays in the browser.
- **Persistence:** `localStorage` for in-progress answers only.
- **Output:** clipboard copy (Clipboard API) and file download (`.md` / `.txt`) generated in-browser.
- **Hosting:** Vercel free tier (per Andrew's tooling preferences).
- **Code:** stored in a GitHub repo, in a subdirectory of this project folder (per global file-structure rules), not in the project root.

## 8. Design

- Follow `context/design-guidelines/DESIGN_GUIDELINES.md` as the source of truth for tokens, components, accessibility, and responsive rules. Do not hardcode colors, fonts, or spacing.
- Mobile-friendly first: large touch targets, single-column layout, readable default font sizes.
- Accessibility: keyboard navigable, labeled inputs, sufficient contrast, screen-reader-friendly progress and step announcements.
- Plain-language microcopy throughout; explainers are progressive disclosure ("What's this?" reveals, not walls of text).

## 9. Future enhancements (parked)

- **Shareable URL:** encode answers in the URL so a session can be bookmarked or shared — still deterministic and backend-free.
- **Scaffold mode:** an optional toggle so the output prompt also asks Claude Code to set up the project after writing the PRD.
- Saved templates / multiple drafts.
- Example gallery of finished prompts.

## 10. Milestones

| Milestone | Scope | How Andrew tests it |
|-----------|-------|---------------------|
| M1 — Prompt template ✅ | Author and validate the prompt template (Section 6) by hand; paste sample outputs into Claude Code and confirm the PRDs are good | Read 2–3 generated PRDs and judge quality |
| M2 — Wizard shell ✅ | Static wizard: screens, navigation, progress bar, localStorage persistence (no real prompt assembly yet). Built in `app/` (React + Vite). | Click through all steps on a phone; refresh mid-flow and confirm answers survive |
| M3 — Question content ✅ | All ten sections wired with real questions and "I'm not sure" options, conditional backend logic, and plain-language "What's this?" explainer copy on the technical questions | Answer every question type; verify backend flag triggers from Section 4 |
| M4 — Output ✅ | Prompt assembly, review/edit screen, copy and download | Complete a full run, copy the prompt, paste into Claude Code, get a PRD |
| M5 — Polish | Design tokens, accessibility pass, copy review, deploy to Vercel | Full run on mobile and desktop; accessibility check |

## 11. Open questions

- Framework choice for M2 (plain JS vs lightweight framework) — decide at build start.
- ~~Exact wording of the prompt template~~ — **Resolved (M1 complete).** Drafted and tested in `PROMPT_TEMPLATE.md`; a sample beginner run produced a good PRD, including correct "I'm not sure" → free-tier recommendation behavior.

## 12. Success criteria

- A non-technical user completes the wizard and gets a prompt without needing help.
- Pasting that prompt into Claude Code reliably yields a usable PRD.
- The app sends no data anywhere and works offline after first load.
