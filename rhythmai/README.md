# RhythmAI

An intelligent life partner: it learns your routine, plans *with* you (never *for* you), follows up gently, and researches things deeply — all locally, with full respect for your privacy.

This is a fully standalone application, independent of the existing `New folder/apps/web` site in this repository — it shares no code or dependencies with it.

## Principles

- **Plans with you, not for you**: every suggested weekly plan requires your explicit approval before it is saved.
- **Full privacy**: your profile, plan, and research history are stored only in your browser's `localStorage`. There is no backend server.
- **No medical advice**: RhythmAI never diagnoses or prescribes. Any serious health question is met with a clear notice to consult a doctor.

## Running locally

```bash
cd rhythmai
npm install
npm run dev
```

Opens at `http://localhost:3001`.

## Languages

RhythmAI ships in the six official languages of the United Nations: English (default), Arabic, French, Spanish, Chinese (Simplified), and Russian. The language can be changed from the switcher in the top bar, on the welcome screen, or in Settings — it also drives the language the AI responds in, and switches the layout direction (RTL for Arabic).

## Appearance

Three built-in premium themes, switchable from Settings, each rendered through CSS custom-property tokens (`src/index.css`) so no component needs theme-specific styling:

- **Platinum Pearl** (default) — cool pearl white with refined platinum accents
- **Emerald Marble** — cream marble with deep emerald and antique gold
- **Midnight Gold** — deep charcoal with warm gold accents

## Artificial intelligence

The app calls the Anthropic API directly from the browser (no intermediary server). To enable it:

1. Open **Settings** inside the app.
2. Paste your Anthropic API key.

The key is sent only to `api.anthropic.com`, directly from your browser, and is stored only in local `localStorage`. Without a key, the app falls back to simplified, localized general suggestions so it never breaks.

> Note: calling the Anthropic API directly from the browser is intended for prototyping. A production deployment should add a thin server-side proxy to keep the key off the client.

## Structure

```
src/
  i18n/
    translations.js        # UI strings in all 6 languages
    languages.js            # language metadata + AI language-name mapping
    LanguageContext.jsx     # useLanguage() hook: t(), lang, setLang, dir
  theme/
    themes.js                # the 3 theme definitions
    ThemeContext.jsx         # useTheme() hook: theme, setTheme
  lib/
    storage.js   # local persistence layer (localStorage)
    ai.js        # Claude calls + localized fallback content when no key is set
    safety.js    # multilingual medical-question detection + safety system prompt
    dates.js     # localized weekday names via Intl
  pages/
    OnboardingPage.jsx   # first-time profile setup
    DashboardPage.jsx    # today's tasks, energy check-in, crisis mode, evening check-in
    GoalsPage.jsx         # goals broken into AI-generated steps, with progress tracking
    PlanPage.jsx          # suggest/edit/approve the weekly plan
    ResearchPage.jsx      # ask-anything with safety disclaimers
    ReportPage.jsx        # weekly completion chart, energy/evening stats, detected patterns, AI summary
    SettingsPage.jsx      # API key, language, theme, profile, export/delete data
```

## Weekly report & pattern detection

`lib/insights.js` computes the weekly report entirely from locally stored history — no fabricated claims:

- **This week's chart** compares completed vs. planned tasks per day, using the *current* plan (task completion is stored per calendar day in `rhythmai.completion_log`).
- **Patterns** ("what I've noticed") are only surfaced when there is real repeated signal — e.g. an energy-by-weekday trend needs samples from at least two different weeks on the same weekday before it's shown, and a "high-energy days get more done" pattern needs at least two low- and two high-energy samples. With only a few days of history, the page will honestly say there isn't enough data yet rather than guessing.
- The narrative summary is AI-generated when a key is set (with an explicit instruction not to invent facts beyond the computed stats) and falls back to a simple templated summary otherwise.

## Current limitations (MVP)

- No real push notifications outside the browser — only in-app reminders.
- No cross-device sync (data is local by design).
- Research does not yet query external web sources; it relies on the model's own knowledge.
- A weekly plan generated in one language keeps its day labels in that language; switching languages afterward does not retroactively relabel an already-approved plan.
- The weekly report's completion chart reflects the *current* plan only — if the plan is replaced mid-week, earlier days in the chart are shown against the new plan's task list for that weekday.
