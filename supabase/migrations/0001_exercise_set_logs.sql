-- Exercise Set Logs — per-set reps/weight logging
-- ============================================================================
-- docs/session-structure-spec.md §3 v1: each set of a main-phase exercise
-- can be logged with reps done (+ optional weight for equipment movements).
--
-- This is additive to schema.sql, not a replacement — `sessions.exercises`
-- already stores the full per-session exercise blob (including inline
-- `setsLogged`, see app/src/types.ts SessionExercise), and that blob is
-- still what the app reads back for §3 v1.5 progression suggestions (see
-- app/src/lib/progression.ts). This table exists alongside it as a
-- normalized, queryable record of the same data, for anything that needs
-- per-set rows directly (e.g. future analytics) rather than parsing JSONB.
--
-- This has NOT been applied to any live project — the Supabase project
-- doesn't exist yet (see docs/backend-brief.md). Run this after
-- schema.sql, once, against a fresh project: `supabase db push`, or paste
-- into the SQL Editor.
-- ============================================================================

create table if not exists exercise_set_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  session_id uuid references sessions(id) on delete cascade,
  movement_key text not null,
  movement_name text not null,
  equipment text not null,
  set_number int not null check (set_number > 0),
  reps int not null check (reps >= 0),
  prescribed_reps int,
  weight numeric check (weight is null or weight >= 0),
  created_at timestamptz not null default now()
);

alter table exercise_set_logs enable row level security;

-- Matches schema.sql's existing "own rows only" convention (see meals,
-- goals, sleep_log, etc.).
create policy "exercise_set_logs_all_own" on exercise_set_logs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Supports "most recent log for this movement" lookups — exactly what
-- suggestProgression needs, if it's ever moved server-side.
create index if not exists exercise_set_logs_user_movement_idx on exercise_set_logs (user_id, movement_key, created_at desc);
