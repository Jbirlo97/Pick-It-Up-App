-- Pick It Up — Supabase schema
-- ============================================================================
-- Derived from docs/backend-brief.md Section 2, extended to cover every
-- singleton "settings" field in the app's state shape (see app/src/types.ts
-- AppState) so `profiles` can be the single source of truth for everything
-- that isn't naturally row-per-entry.
--
-- Run this once against a fresh Supabase project (SQL Editor, or via the
-- Supabase CLI: `supabase db push`). Idempotent-ish via IF NOT EXISTS /
-- CREATE OR REPLACE where practical, but this is a first migration, not a
-- repeatable one — a real migrations folder can come once the schema needs
-- to evolve.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- profiles — companion to Supabase Auth's built-in users table. One row per
-- user, created automatically on signup (see trigger below).
-- ---------------------------------------------------------------------------
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  user_name text not null default '',
  weekly_target int not null default 3,
  weight numeric,
  height numeric,
  age numeric,
  waist numeric,
  unit text not null default 'metric' check (unit in ('metric', 'imperial')),
  sex text not null default '' check (sex in ('male', 'female', 'unspecified', '')),
  tone text not null default 'Balanced' check (tone in ('Stoic', 'Balanced', 'Empathic')),
  christian_lens boolean not null default false,
  training_location text not null default 'bodyweight' check (training_location in ('bodyweight', 'home', 'commercial')),
  equipment text[] not null default '{bodyweight}',
  injuries text[] not null default '{}',
  whys text[] not null default '{}',
  is_premium boolean not null default false,
  onboarded boolean not null default false,
  onboard_step int not null default 0,
  first_win_pending boolean not null default false,
  day int not null default 1,
  week int not null default 1,
  spotify_connected boolean not null default false,
  buddy text,
  tutorial_seen boolean not null default false,
  email text,
  email_captured boolean not null default false,
  email_prompt_dismissed boolean not null default false,
  steps int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create a profile row when a new auth user is created (invite-only
-- signup per docs/backend-brief.md Section 3 — Josh creates the account,
-- this trigger just ensures the companion row exists from day one).
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Keep updated_at current on every profile write.
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on profiles;
create trigger profiles_set_updated_at
  before update on profiles
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- check_ins — one row per day per user. Real `date` column fixes the
-- "today's focus never changes" staleness bug (backend-brief.md Section 2).
-- ---------------------------------------------------------------------------
create table if not exists check_ins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  readiness int not null check (readiness between 1 and 5),
  sleep int not null check (sleep between 1 and 5),
  mood int not null check (mood between 1 and 5),
  stress int not null check (stress between 1 and 5),
  ai_insight jsonb,
  injuries_today text[] not null default '{}',
  created_at timestamptz not null default now(),
  unique (user_id, date)
);

-- ---------------------------------------------------------------------------
-- sessions — sessionHistory + currentSession. `source` records which
-- generator produced it (integration-spec.md Section 3b: quick vs detailed
-- coexist by design).
-- ---------------------------------------------------------------------------
create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null default current_date,
  source text not null default 'quick' check (source in ('quick', 'detailed')),
  session_title text,
  exercises jsonb not null,
  readiness_at_time int,
  completed boolean not null default true,
  flagged_contraindications jsonb,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- meals — Nourish's quick-log entries.
-- ---------------------------------------------------------------------------
create table if not exists meals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null default current_date,
  name text not null,
  kcal numeric,
  protein numeric,
  carbs numeric,
  fat numeric,
  notes text,
  logged_at text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- saved_recipes — favourites from the Discover tab (recipe engine).
-- ---------------------------------------------------------------------------
create table if not exists saved_recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  recipe_id text not null,
  saved_at timestamptz not null default now(),
  unique (user_id, recipe_id)
);

-- ---------------------------------------------------------------------------
-- sleep_log, goals, craving_log — one row per entry per user.
-- ---------------------------------------------------------------------------
create table if not exists sleep_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null default current_date,
  hours numeric not null,
  quality int not null check (quality between 1 and 5),
  created_at timestamptz not null default now()
);

create table if not exists goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  target numeric,
  unit text,
  progress numeric not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists craving_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null default current_date,
  logged_at text,
  intensity int not null check (intensity between 1 and 5),
  trigger text not null,
  note text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- sobriety — one row per user (not per entry).
-- ---------------------------------------------------------------------------
create table if not exists sobriety (
  user_id uuid primary key references auth.users(id) on delete cascade,
  substance text not null,
  start_date date not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- community_posts — shared table, everyone reads. At 10-50 users this stays
-- simple (backend-brief.md Section 2) — no follower graph, no feed ranking.
-- `user_label` is the "M." style initial, never the real name.
-- ---------------------------------------------------------------------------
create table if not exists community_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  user_label text not null,
  day int not null,
  pillar text not null,
  text text not null,
  seen uuid[] not null default '{}',
  flagged boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- Row Level Security — mandatory on every table before real data goes in
-- (docs/backend-brief.md Section 3; also the concrete Privacy Act / APP 11
-- control referenced in docs/launch-readiness-checklist.md Section 1.4).
-- ============================================================================

alter table profiles enable row level security;
alter table check_ins enable row level security;
alter table sessions enable row level security;
alter table meals enable row level security;
alter table saved_recipes enable row level security;
alter table sleep_log enable row level security;
alter table goals enable row level security;
alter table craving_log enable row level security;
alter table sobriety enable row level security;
alter table community_posts enable row level security;

-- profiles: a user can only see/edit their own row.
create policy "profiles_select_own" on profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on profiles for update using (auth.uid() = id);
-- No insert policy: rows are created only by the handle_new_user trigger
-- (security definer), not directly by clients.

-- Generic "own rows only" policy set, applied per table below.
create policy "check_ins_all_own" on check_ins for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "sessions_all_own" on sessions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "meals_all_own" on meals for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "saved_recipes_all_own" on saved_recipes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "sleep_log_all_own" on sleep_log for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "goals_all_own" on goals for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "craving_log_all_own" on craving_log for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "sobriety_all_own" on sobriety for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- community_posts: everyone (any authenticated trusted user) can read, but
-- only the author can create or edit their own post via a raw table UPDATE.
create policy "community_posts_select_all" on community_posts for select using (auth.role() = 'authenticated');
create policy "community_posts_insert_own" on community_posts for insert with check (auth.uid() = user_id);
create policy "community_posts_update_own" on community_posts for update using (auth.uid() = user_id);

-- "I see you" and "Flag" are the two things another (non-owner) user needs
-- to do to someone else's post. RLS can't restrict *which columns* an
-- UPDATE touches — only which rows — so a second, broader UPDATE policy
-- here would let any authenticated user rewrite a post's text, not just
-- mark it seen/flagged. Instead, expose those two actions as narrow
-- SECURITY DEFINER functions that touch only the seen/flagged columns,
-- callable by any authenticated user, while the table's own UPDATE policy
-- above stays owner-only.
create or replace function mark_post_seen(post_id uuid)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  update community_posts
  set seen = case when auth.uid() = any(seen) then seen else array_append(seen, auth.uid()) end
  where id = post_id;
end;
$$;

create or replace function flag_post(post_id uuid)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  update community_posts set flagged = true where id = post_id;
end;
$$;

revoke all on function mark_post_seen(uuid) from public;
revoke all on function flag_post(uuid) from public;
grant execute on function mark_post_seen(uuid) to authenticated;
grant execute on function flag_post(uuid) to authenticated;
