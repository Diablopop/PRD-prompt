/*
  Assembles the user's answers into the final, copy-ready prompt. This is a
  pure, deterministic function — the same answers always produce the exact same
  string (PRD 6.2). It implements PROMPT_TEMPLATE.md; if that file changes, this
  must change with it.

  Skipped/blank answers are omitted from their line. "I'm not sure" answers are
  passed through as an explicit marker so the prompt's HANDLING UNKNOWNS section
  makes Claude Code recommend a sensible free-tier default.
*/

import { sections } from "../data/sections.js";

// "I'm not sure" marker reused across single-choice questions.
const UNSURE = "I'm not sure — please recommend a sensible, beginner-friendly default.";

// Look up a choice's label from the section data so copy lives in one place.
function choiceLabel(questionId, value) {
  for (const section of sections) {
    for (const q of section.questions) {
      if (q.id === questionId && q.choices) {
        return q.choices.find((c) => c.value === value)?.label ?? null;
      }
    }
  }
  return null;
}

function skillInstruction(comfort) {
  switch (comfort) {
    case "edit":
      return "I can read and make small edits to code but am not a professional developer. Keep explanations accessible and avoid unexplained jargon.";
    case "experienced":
      return "I am an experienced developer. You can use technical language and skip basic explanations.";
    // none, beginner, unsure, or unanswered all get the most supportive framing.
    default:
      return "I am not a developer and have little or no coding experience. Explain every technical choice in plain language, define any jargon, and clearly flag anything that costs money or could expose personal data.";
  }
}

function detailInstruction(detail) {
  switch (detail) {
    case "light":
      return "Keep it concise — cover the core only: summary, audience, key features, and the main technical choices.";
    case "comprehensive":
      return "Be thorough — include user stories, edge cases, risks, non-goals, and detailed requirements.";
    default: // standard or unsure
      return "Use a standard level of detail — summary, audience, features, technical approach, and success criteria.";
  }
}

function milestonesLine(milestones, comfort) {
  if (milestones === "no") return null; // omit
  const beginner = !["edit", "experienced"].includes(comfort);
  return beginner
    ? "- Break the work into small, independently testable milestones — keep each one small enough that I can build and confirm it works before moving on."
    : "- Break the work into clear, testable milestones I can build and check one at a time.";
}

function testingLine(testing) {
  if (testing === "no") return null; // omit
  return "- Include a testing plan that describes, in plain language, how I can check each part works.";
}

function featuresList(features) {
  const selected = Array.isArray(features) ? features : [];
  if (selected.length === 0) return "No specific features selected yet.";
  if (selected.includes("unsure")) {
    return "I'm not sure which features I need — please suggest a sensible, minimal set for this idea and explain each one in plain language.";
  }
  // Iterate the canonical choice order so output is deterministic.
  const q = sections
    .flatMap((s) => s.questions)
    .find((q) => q.id === "features");
  return q.choices
    .filter((c) => selected.includes(c.value))
    .map((c) => c.label)
    .join(", ");
}

// Backend needs data if the user said so, OR if they picked features that
// inherently require it (accounts/login or saving data) — the conditional flag.
function backendLine(answers) {
  const features = Array.isArray(answers.features) ? answers.features : [];
  const impliedByFeatures = features.includes("auth") || features.includes("persist");
  const needed = answers.backendNeeded;

  const provider = () => {
    switch (answers.backendProvider) {
      case "supabase":
        return "Supabase";
      case "firebase":
        return "Firebase";
      default: // recommend, unsure, or unanswered
        return "please recommend a provider (a free-tier option such as Supabase is preferred)";
    }
  };

  if (needed === "yes") return `Yes — ${provider()}.`;
  if (needed === "no") {
    return impliedByFeatures
      ? `I answered "no," but I also selected features (accounts/login or saving data) that require stored data — please include a backend; ${provider()}.`
      : "No — this is a front-end-only app with no stored data.";
  }
  // unsure or unanswered
  return impliedByFeatures
    ? `Likely yes — I selected features that need stored data, but I'm not sure; ${provider()}.`
    : "I'm not sure whether I need one — please advise based on the features above.";
}

function designLine(answers) {
  const parts = [];
  const style = choiceLabel("style", answers.style);
  if (answers.style === "unsure") parts.push("no strong preference — please recommend");
  else if (style) parts.push(style);
  if (answers.colors) parts.push(`colors: ${answers.colors}`);
  if (answers.reference) parts.push(`should feel like ${answers.reference}`);
  return parts.length ? parts.join("; ") : null;
}

function scopeLine(answers) {
  const parts = [];
  if (answers.maturity === "prototype") parts.push("a quick prototype to try the idea");
  else if (answers.maturity === "polished") parts.push("a polished product");
  else if (answers.maturity === "unsure") parts.push("not sure how polished — please recommend");
  if (answers.budget === "free") parts.push("free services only");
  else if (answers.budget === "small") parts.push("a small budget");
  else if (answers.budget === "flexible") parts.push("flexible budget");
  return parts.length ? parts.join("; ") : null;
}

function singleLine(answers, id, { unsureDefault } = {}) {
  const v = answers[id];
  if (!v) return null;
  if (v === "unsure") return unsureDefault ?? UNSURE;
  if (v === "recommend") return UNSURE;
  return choiceLabel(id, v);
}

function platformLine(platform) {
  switch (platform) {
    case "phone-mostly":
      return "Prioritize the mobile/phone experience; it should still work well on a computer.";
    case "both":
      return "Should work equally well on phones and computers (responsive design).";
    case "desktop-mostly":
      return "Primarily a desktop/computer experience; phone support is a lower priority.";
    case "unsure":
      return UNSURE;
    default:
      return null; // unanswered — omit the line
  }
}

function formatLine(format) {
  switch (format) {
    case "docx":
      return "Word (.docx)";
    case "txt":
      return "Plain text";
    default: // md or unsure — Markdown is the sensible default
      return "Markdown (.md)";
  }
}

export function buildPrompt(answers = {}) {
  const lines = [];
  const push = (s) => lines.push(s);

  push(
    "You are an experienced product manager and software engineer. Your task is to"
  );
  push(
    "write a clear Product Requirements Document (PRD) for the web app described"
  );
  push("below. Do not write any code yet — produce only the PRD.");
  push("");

  push("ABOUT ME");
  push(skillInstruction(answers.comfort));
  push("");

  push("THE IDEA");
  if (answers.name) push(`- Working name: ${answers.name}`);
  if (answers.description) push(`- What it does: ${answers.description}`);
  if (answers.audience) push(`- Who it is for: ${answers.audience}`);
  if (answers.problem) push(`- Problem it solves: ${answers.problem}`);
  push("");

  push("REQUIREMENTS");
  const platform = platformLine(answers.platform);
  if (platform) push(`- Platform: ${platform}`);
  push(`- Features I want: ${featuresList(answers.features)}`);
  push(`- Data storage / backend: ${backendLine(answers)}`);
  const hosting = singleLine(answers, "hosting");
  if (hosting) push(`- Hosting: ${hosting}`);
  const repo = singleLine(answers, "repo");
  if (repo) push(`- Code repository: ${repo}`);
  const design = designLine(answers);
  if (design) push(`- Look and feel: ${design}`);
  const scope = scopeLine(answers);
  if (scope) push(`- Scope and budget: ${scope}`);
  push("");

  push("HANDLING UNKNOWNS");
  push(
    'For anything marked "I\'m not sure," recommend a sensible, beginner-friendly'
  );
  push(
    "default — prefer services with a free tier — explain the choice in one or two"
  );
  push("plain sentences, and note that it is an assumption I can change.");
  push("");

  push("HEALTHY CODE STANDARDS");
  push("In the PRD, instruct the build to follow these habits:");
  push("- Keep code DRY — consolidate logic or styling that repeats more than twice.");
  push("- Centralize styling — define colors, fonts, and spacing as shared tokens in one place.");
  push("- Keep files small and single-purpose.");
  push("- Use clear, self-explaining names for files, functions, and variables.");
  push("- Avoid hardcoding values — use named constants or config.");
  push('- Comment the "why," not the "what," where logic is non-obvious.');
  push("");

  push("THE PRD I WANT");
  push(`- Format: ${formatLine(answers.format)}`);
  push(`- Detail level: ${detailInstruction(answers.detail)}`);
  const ms = milestonesLine(answers.milestones, answers.comfort);
  if (ms) push(ms);
  const ts = testingLine(answers.testing);
  if (ts) push(ts);
  push("");

  push(
    "Before writing, if anything important is missing or unclear, ask me 1–3"
  );
  push("clarifying questions first. Otherwise, write the PRD.");

  return lines.join("\n");
}
