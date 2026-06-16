# Prompt template (M1)

**Purpose:** The deterministic text the app assembles from a user's answers. This is the core artifact — the app is only as good as this template.
**Owner:** Andrew Schauer
**Version:** 1.1
**Last updated:** 2026-06-16
**Status:** Tested — passed M1 gate

---

## 1. How to read this file

- `{{double_braces}}` are placeholders the app fills from answers.
- Lines marked *(conditional)* are included only when relevant; skipped questions are omitted entirely (see PRD 6.3).
- Everything else is fixed text that always appears.

## 2. The template

```
You are an experienced product manager and software engineer. Your task is to
write a clear Product Requirements Document (PRD) for the web app described
below. Do not write any code yet — produce only the PRD.

ABOUT ME
{{skill_level_instruction}}

THE IDEA
- Working name: {{name}}
- What it does: {{description}}
- Who it is for: {{audience}}
- Problem it solves: {{problem}}

REQUIREMENTS
- Platform: {{platform}}
- Features I want: {{features_list}}
- Data storage / backend: {{backend}}
- Hosting: {{hosting}}
- Code repository: {{repo}}
- Look and feel: {{design}}
- Scope and budget: {{scope}}

HANDLING UNKNOWNS
For anything marked "I'm not sure," recommend a sensible, beginner-friendly
default — prefer services with a free tier — explain the choice in one or two
plain sentences, and note that it is an assumption I can change.

HEALTHY CODE STANDARDS
In the PRD, instruct the build to follow these habits:
- Keep code DRY — consolidate logic or styling that repeats more than twice.
- Centralize styling — define colors, fonts, and spacing as shared tokens in one place.
- Keep files small and single-purpose.
- Use clear, self-explaining names for files, functions, and variables.
- Avoid hardcoding values — use named constants or config.
- Comment the "why," not the "what," where logic is non-obvious.

THE PRD I WANT
- Format: {{format}}
- Detail level: {{detail_instruction}}
{{milestones_line}}   (conditional)
{{testing_line}}      (conditional)

Before writing, if anything important is missing or unclear, ask me 1–3
clarifying questions first. Otherwise, write the PRD.
```

## 3. Placeholder value tables

### skill_level_instruction
| Answer | Text |
|--------|------|
| Never coded / Beginner / Not sure | I am not a developer and have little or no coding experience. Explain every technical choice in plain language, define any jargon, and clearly flag anything that costs money or could expose personal data. |
| Can read and edit code | I can read and make small edits to code but am not a professional developer. Keep explanations accessible and avoid unexplained jargon. |
| Experienced developer | I am an experienced developer. You can use technical language and skip basic explanations. |

### detail_instruction
| Answer | Text |
|--------|------|
| Lightweight | Keep it concise — cover the core only: summary, audience, key features, and the main technical choices. |
| Standard | Use a standard level of detail — summary, audience, features, technical approach, and success criteria. |
| Comprehensive | Be thorough — include user stories, edge cases, risks, non-goals, and detailed requirements. |

### milestones_line *(conditional)*
- Yes, and skill level is Never coded / Beginner / Not sure → `- Break the work into small, independently testable milestones — keep each one small enough that I can build and confirm it works before moving on.`
- Yes, and skill level is Can read and edit code / Experienced developer → `- Break the work into clear, testable milestones I can build and check one at a time.`
- No → omit the line.

### testing_line *(conditional)*
- Yes → `- Include a testing plan that describes, in plain language, how I can check each part works.`
- No → omit the line.

### Other placeholders
- `{{name}}`, `{{description}}`, `{{audience}}`, `{{problem}}` — verbatim free text; omit the line if blank.
- `{{platform}}` — the chosen label (e.g. "Mobile-friendly / responsive").
- `{{features_list}}` — comma-joined checked features; if none, "No specific features selected yet."
- `{{backend}}` — e.g. "Yes — Supabase" / "No (static / front-end only)" / "Needed; please recommend a provider."
- `{{hosting}}`, `{{repo}}` — chosen label, or "Please recommend" when set to let Claude decide.
- `{{design}}` — style + optional colors + optional reference app, joined into one line.
- `{{scope}}` — prototype/polished + budget, joined (e.g. "Quick prototype; free services only").
- `{{format}}` — "Markdown (.md)" / "Word (.docx)" / "Plain text".
