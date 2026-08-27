# RhythmAI — Supabase setup

1. Create a free project at [supabase.com](https://supabase.com).
2. In the Supabase dashboard, open **SQL Editor** → paste the contents of
   `migrations/0001_init.sql` → **Run**. This creates every table, enables
   row-level security, and auto-creates a `profiles`/`settings` row for each
   new signup.
3. Go to **Project Settings → API** and copy:
   - **Project URL**
   - **anon public** key (safe to use in the browser — RLS is what actually
     protects the data, not this key)
4. Create `rhythmai/.env.local`:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
5. Restart `npm run dev`.

## What's intentionally not here yet

- **AI proxying**: in the hosted product, Anthropic calls should go through a
  Supabase Edge Function that holds the real API key server-side and checks
  the caller's `settings.plan` before calling — never the client-side
  `anthropic-dangerous-direct-browser-access` approach the local-only version
  used. That function isn't built yet (tracked separately).
- **Billing**: `settings.plan` exists as a column so the schema doesn't need
  to change later, but there's no Stripe integration wired to it yet.
