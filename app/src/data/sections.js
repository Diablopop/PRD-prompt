/*
  The wizard's question set, defined as data so every screen renders from one
  source instead of duplicated markup. Adding or reordering a question happens
  here — no screen code changes.

  Field types:
    - "text"     single-line free text
    - "textarea" multi-line free text
    - "single"   choose one (radio)
    - "multi"    choose any number (checkboxes)

  Conventions:
    - `id` is the key answers are stored under (stable; don't rename casually).
    - For single/multi, every choice has { value, label }. An "unsure" choice
      uses value "unsure" so the prompt builder (M4) can map it to a default.
    - `help` is short plain-language explainer copy shown behind "What's this?".
      (Copy polish + per-service free-tier notes are finalized in M3.)
    - `recommend` marks a choice the app suggests for beginners.
*/

export const sections = [
  {
    id: "idea",
    title: "Your idea",
    blurb: "Tell us about the app you want to build.",
    questions: [
      {
        id: "name",
        type: "text",
        label: "Working name of your app",
        placeholder: "e.g. ForkFile",
      },
      {
        id: "description",
        type: "textarea",
        label: "In one sentence, what does it do?",
        placeholder: "e.g. Lets people save and organize their favorite recipes",
      },
      {
        id: "audience",
        type: "textarea",
        label: "Who is it for?",
        placeholder: "e.g. Home cooks who collect recipes from many places",
      },
      {
        id: "problem",
        type: "textarea",
        label: "What problem does it solve? (optional)",
        placeholder: "e.g. Recipes are scattered across screenshots and bookmarks",
        optional: true,
      },
    ],
  },

  {
    id: "comfort",
    title: "Your technical comfort",
    blurb: "This tells Claude Code how much to explain along the way.",
    questions: [
      {
        id: "comfort",
        type: "single",
        label: "How comfortable are you with code?",
        choices: [
          { value: "none", label: "I've never coded" },
          { value: "beginner", label: "Beginner — I can follow step-by-step instructions" },
          { value: "edit", label: "I can read and make small edits to code" },
          { value: "experienced", label: "I'm an experienced developer" },
          { value: "unsure", label: "I'm not sure" },
        ],
      },
    ],
  },

  {
    id: "platform",
    title: "Platform",
    blurb: "Where will people mostly use your app?",
    questions: [
      {
        id: "platform",
        type: "single",
        label: "Where will it mostly be used?",
        help: "This is about where people will mostly use your app, so Claude knows where to focus the design — not which devices can open it. Any web app opens on both phones and computers. If you're unsure, \"phones and computers equally\" is the safe choice.",
        choices: [
          { value: "phone-mostly", label: "Mainly on phones — still works on a computer" },
          { value: "both", label: "Phones and computers equally", recommend: true },
          { value: "desktop-mostly", label: "Mainly on a computer — it's a desktop-style tool" },
          { value: "unsure", label: "I'm not sure" },
        ],
      },
    ],
  },

  {
    id: "scope",
    title: "Scope & budget",
    blurb: "How polished does the first version need to be?",
    questions: [
      {
        id: "maturity",
        type: "single",
        label: "What are you building right now?",
        choices: [
          { value: "prototype", label: "A quick prototype to try the idea" },
          { value: "polished", label: "A polished product" },
          { value: "unsure", label: "I'm not sure" },
        ],
      },
      {
        id: "budget",
        type: "single",
        label: "Budget for paid services",
        choices: [
          { value: "free", label: "Free services only" },
          { value: "small", label: "A small budget" },
          { value: "flexible", label: "Flexible" },
          { value: "unsure", label: "I'm not sure" },
        ],
      },
    ],
  },

  {
    id: "features",
    title: "Features",
    blurb:
      "Pick only what your first version truly needs — each feature you add increases the app's complexity, cost, and build time.",
    questions: [
      {
        id: "features",
        type: "multi",
        label: "What should your app be able to do?",
        help: 'A few of these explained: "Save data between visits" means the app remembers things after you close it. "Admin dashboard" is a private screen for you to manage the app. "Real-time updates" means content changes live without refreshing, like a chat. Pick only what your first version truly needs.',
        choices: [
          { value: "unsure", label: "I'm not sure — suggest features for me", exclusive: true },
          { value: "auth", label: "User accounts / login" },
          { value: "profiles", label: "User profiles" },
          { value: "persist", label: "Save data between visits" },
          { value: "uploads", label: "File or image uploads" },
          { value: "search", label: "Search" },
          { value: "notifications", label: "Notifications (email / push)" },
          { value: "payments", label: "Payments or subscriptions" },
          { value: "social", label: "Social features (comments, likes, sharing)" },
          { value: "admin", label: "Admin dashboard" },
          { value: "maps", label: "Maps / location" },
          { value: "realtime", label: "Real-time or live updates (chat, live data)" },
          { value: "ai", label: "AI features" },
          { value: "forms", label: "Forms / surveys" },
          { value: "content", label: "Content / blog / articles" },
          { value: "darkmode", label: "Dark mode" },
          { value: "i18n", label: "Multiple languages" },
        ],
      },
    ],
  },

  {
    id: "backend",
    title: "Data & accounts",
    blurb: "Does your app need to remember things or have logins?",
    questions: [
      {
        id: "backendNeeded",
        type: "single",
        label: "Does your app need to store data or have user accounts?",
        help: 'A "backend" is the behind-the-scenes part of an app that stores information and handles logins. If your app needs to remember anything after the page closes — accounts, saved items, uploads — it needs one. Simple apps that only display information do not.',
        choices: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No — it's a simple front-end-only app" },
          { value: "unsure", label: "I'm not sure" },
        ],
      },
      {
        id: "backendProvider",
        type: "single",
        label: "If yes, which service should store it?",
        help: "These are services that provide a ready-made backend so you don't have to build one yourself. Supabase and Firebase both have free tiers that cover storage, logins, and files for small apps. If you're unsure, let Claude pick one.",
        choices: [
          { value: "supabase", label: "Supabase — free tier: database, login, file storage", recommend: true },
          { value: "firebase", label: "Firebase (Google) — free tier" },
          { value: "recommend", label: "Let Claude recommend" },
          { value: "unsure", label: "I'm not sure" },
        ],
      },
    ],
  },

  {
    id: "hosting",
    title: "Hosting",
    blurb: "Where your finished app will live online.",
    questions: [
      {
        id: "hosting",
        type: "single",
        label: "Where should the app be hosted?",
        help: '"Hosting" is where your finished app lives on the internet so others can visit it. Vercel and Netlify offer free hosting that\'s easy to set up; GitHub Pages is free and good for simple sites. If you\'re unsure, Vercel is a safe, beginner-friendly default.',
        choices: [
          { value: "vercel", label: "Vercel — free tier, beginner-friendly", recommend: true },
          { value: "netlify", label: "Netlify" },
          { value: "github-pages", label: "GitHub Pages — free, best for simple sites" },
          { value: "recommend", label: "Let Claude recommend" },
          { value: "unsure", label: "I'm not sure" },
        ],
      },
    ],
  },

  {
    id: "repo",
    title: "Code storage",
    blurb: "A repository keeps a safe, versioned copy of your code.",
    questions: [
      {
        id: "repo",
        type: "single",
        label: "Where should your code be stored?",
        help: 'A "repository" (or "repo") is an online home for your code that saves a full history of every change, so you can undo mistakes and keep a backup. GitHub is the most common and is free. This is recommended even for small projects.',
        choices: [
          { value: "github", label: "GitHub — free", recommend: true },
          { value: "other", label: "Somewhere else" },
          { value: "unsure", label: "I'm not sure" },
        ],
      },
    ],
  },

  {
    id: "design",
    title: "Look & feel",
    blurb: "How should your app feel? (All optional.)",
    questions: [
      {
        id: "style",
        type: "single",
        label: "Overall style",
        choices: [
          { value: "minimal", label: "Minimal / clean" },
          { value: "playful", label: "Playful / colorful" },
          { value: "professional", label: "Professional / corporate" },
          { value: "bold", label: "Bold" },
          { value: "unsure", label: "I'm not sure" },
        ],
      },
      {
        id: "colors",
        type: "text",
        label: "Brand colors, if any (optional)",
        placeholder: "e.g. forest green and cream",
        optional: true,
      },
      {
        id: "reference",
        type: "text",
        label: "Should feel like… (optional)",
        placeholder: "e.g. Notion, Airbnb",
        optional: true,
      },
    ],
  },

  {
    id: "output",
    title: "Your PRD",
    blurb: "How should the finished PRD be written?",
    questions: [
      {
        id: "format",
        type: "single",
        label: "File format",
        help: '"Markdown" (.md) is a simple text format that Claude Code reads and writes most easily — recommended. "Word" (.docx) opens in Microsoft Word. "Plain text" is the most basic option.',
        choices: [
          { value: "md", label: "Markdown (.md) — best for Claude Code", recommend: true },
          { value: "docx", label: "Word (.docx)" },
          { value: "txt", label: "Plain text" },
          { value: "unsure", label: "I'm not sure" },
        ],
      },
      {
        id: "detail",
        type: "single",
        label: "How detailed should it be?",
        choices: [
          { value: "light", label: "Lightweight — just the essentials" },
          { value: "standard", label: "Standard", recommend: true },
          { value: "comprehensive", label: "Comprehensive — thorough and detailed" },
          { value: "unsure", label: "I'm not sure" },
        ],
      },
      {
        id: "milestones",
        type: "single",
        label: "Include suggested milestones / phases?",
        choices: [
          { value: "yes", label: "Yes", recommend: true },
          { value: "no", label: "No" },
          { value: "unsure", label: "I'm not sure" },
        ],
      },
      {
        id: "testing",
        type: "single",
        label: "Include a testing plan?",
        choices: [
          { value: "yes", label: "Yes", recommend: true },
          { value: "no", label: "No" },
          { value: "unsure", label: "I'm not sure" },
        ],
      },
    ],
  },
];

export const sectionCount = sections.length;
