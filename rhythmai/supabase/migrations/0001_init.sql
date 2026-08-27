-- RhythmAI core schema.
-- Every table is scoped to auth.uid() via row-level security, so a user can
-- only ever read or write their own rows — Postgres enforces this, not the
-- client code.

create extension if not exists "pgcrypto";

-- ---- Profiles (1:1 with auth.users) ----
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  goals text,
  routine text,
  work text,
  health_notes text,
  tone text default 'gentle',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---- Settings (1:1 with auth.users) ----
-- No api_key column here: in the hosted product RhythmAI supplies the
-- Anthropic key server-side (via an edge function), metered by `plan`.
create table if not exists public.settings (
  id uuid primary key references auth.users(id) on delete cascade,
  language text not null default 'en',
  theme text not null default 'platinum-pearl',
  travel_mode boolean not null default false,
  plan text not null default 'free', -- 'free' | 'pro_monthly' | 'pro_annual'
  updated_at timestamptz not null default now()
);

-- ---- Weekly plan: one current plan per user ----
create table if not exists public.weekly_plans (
  user_id uuid primary key references auth.users(id) on delete cascade,
  days jsonb not null default '[]'::jsonb, -- [{ tasks: string[] }, ...] length 7, Sun..Sat
  updated_at timestamptz not null default now()
);

-- ---- Goals ----
create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  why text,
  steps jsonb not null default '[]'::jsonb, -- [{ id, text, done }, ...]
  created_at timestamptz not null default now()
);

-- ---- Projects (work/project management) ----
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  deadline date,
  priority text not null default 'medium', -- 'low' | 'medium' | 'high'
  tasks jsonb not null default '[]'::jsonb, -- [{ id, text, done }, ...]
  created_at timestamptz not null default now()
);

-- ---- Morning energy check-in, one row per user per day ----
create table if not exists public.energy_log (
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  level text not null, -- 'low' | 'medium' | 'high'
  primary key (user_id, date)
);

-- ---- Crisis ("hard day") mode, one row per user per active day ----
create table if not exists public.crisis_log (
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  primary key (user_id, date)
);

-- ---- Evening check-in, one row per user per day ----
create table if not exists public.evening_log (
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  answer text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, date)
);

-- ---- Task completion, one row per user per day ----
create table if not exists public.completion_log (
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  completed jsonb not null default '[]'::jsonb, -- string[]
  primary key (user_id, date)
);

-- ---- Research history ----
create table if not exists public.research_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question text not null,
  answer text not null,
  flagged_medical boolean not null default false,
  created_at timestamptz not null default now()
);

-- ==== Row-level security ====

alter table public.profiles enable row level security;
alter table public.settings enable row level security;
alter table public.weekly_plans enable row level security;
alter table public.goals enable row level security;
alter table public.projects enable row level security;
alter table public.energy_log enable row level security;
alter table public.crisis_log enable row level security;
alter table public.evening_log enable row level security;
alter table public.completion_log enable row level security;
alter table public.research_history enable row level security;

-- 1:1 tables keyed directly by the user's own id
create policy "own profile" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "own settings" on public.settings
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "own weekly plan" on public.weekly_plans
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- user_id-scoped tables
create policy "own goals" on public.goals
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own projects" on public.projects
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own energy log" on public.energy_log
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own crisis log" on public.crisis_log
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own evening log" on public.evening_log
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own completion log" on public.completion_log
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own research history" on public.research_history
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Auto-create a profile + settings row the moment someone signs up.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id) values (new.id);
  insert into public.settings (id) values (new.id);
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
