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

## Two modes: local-only vs. cloud accounts

RhythmAI runs in one of two modes, decided automatically by whether a Supabase
project is configured:

- **Local-only (default, zero setup)**: no `.env.local` → no login, no
  network calls for data. Everything lives in this browser's `localStorage`,
  exactly as the original MVP worked.
- **Cloud accounts**: set up Supabase (see `supabase/README.md`), copy
  `.env.local.example` to `.env.local` and fill in the two values, restart
  the dev server. The app now requires sign-up/sign-in, and every page reads
  and writes through `src/lib/db.js` to Postgres instead of `localStorage`,
  scoped per-user by row-level security. Anyone who used the local-only
  version before creating an account is offered a one-time import of their
  local data during onboarding.

Every page calls the same `db.*` API either way — `src/lib/db.js` is the only
place that knows which mode is active.

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
    storage.js        # local persistence layer (localStorage) — the local-mode backend
    supabaseClient.js  # Supabase client, or null when not configured
    db.js              # the API every page calls; dispatches to storage.js or Supabase
    ai.js        # Claude calls + localized fallback content when no key is set
    safety.js    # multilingual medical-question detection + safety system prompt
    dates.js     # localized weekday names via Intl
  auth/
    AuthContext.jsx  # useAuth(): session, user, signUp/signIn/signOut
  pages/
    OnboardingPage.jsx   # first-time profile setup
    DashboardPage.jsx    # today's tasks, energy check-in, crisis mode, evening check-in
    GoalsPage.jsx         # goals broken into AI-generated steps, with progress tracking
    PlanPage.jsx          # suggest/edit/approve the weekly plan
    ResearchPage.jsx      # ask-anything with safety disclaimers
    ReportPage.jsx        # weekly completion chart, energy/evening stats, detected patterns, AI summary
    WorkPage.jsx           # projects with deadlines/priorities, sorted by urgency
    SettingsPage.jsx      # API key, language, theme, travel mode, profile, export/delete data
```

## Work & travel mode

- **Work & Projects** (`/work`): add a project with an optional deadline and a priority; projects are sorted by urgency (overdue first, then nearest deadline, then priority). The single most urgent unfinished task across all projects also surfaces on the Dashboard.
- **Travel mode** (toggle in Settings): while on, the Dashboard shows a small set of travel-friendly suggestions (equipment-free exercise, hydration, a gentle note on sleep schedule) that can be checked off like any other task.

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
- The Anthropic API key is still entered per-browser in Settings (bring-your-own-key) even in cloud mode — it is not yet proxied through a server-side function, so real per-plan usage metering and billing aren't possible yet. This is the next required piece before a paid tier can exist (see `supabase/README.md`).
- Account deletion in Settings clears the account's data but not the Supabase Auth login itself (that needs a server-side admin action).
