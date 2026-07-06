# Pick It Up — Backend Brief (Supabase)

**Audience:** Claude Code (build instructions) and Josh (so you can follow
along without needing to read the code). Pair this with
`claude-code-kickoff-prompt.md` and `integration-spec.md`.

**Scale target:** 10-50 trusted users. Nothing here is over-engineered for
that — if you outgrow it, the database underneath (Postgres) scales far
beyond this without a rewrite, so there's no premature-optimization risk
in starting simple.

---

## 1. Why Supabase (the reasoning, not just the pick)

Three things you said shaped this: you want to actually understand the
backend, not just trust it; you have no existing preference; and this is
for a small trusted group, not a public launch yet.

- **Real Postgres underneath.** Not a proprietary toy database — the same
  technology used at serious scale elsewhere. What you learn here
  transfers if you ever need to move.
- **A dashboard you can actually read.** You can open a table view and see
  real rows of real data — Josh's check-in from yesterday, Sarah's saved
  recipes — without needing to read SQL or code. This directly serves
  "deep dive with minimal" hands-on coding.
- **Auth, database, and file storage in one place.** For a solo/small-team
  build, not having to wire together three separate vendors (a database
  host + a separate auth provider + a separate file storage service)
  removes a lot of integration work Claude Code would otherwise have to
  get right.
- **Free tier comfortably covers 10-50 users.** No cost decision needed
  yet.
- **Common in 2026 AI-assisted builds.** Claude Code will have well-worn
  patterns for this combination, rather than improvising.

**Honest tradeoff:** if Pick It Up ever needs to leave Supabase, the
database itself (Postgres) is portable — but the auth and storage layers
are more Supabase-specific to migrate off. At this scale, that's a
reasonable and common tradeoff, not a real risk yet.

---

## 2. The data model (derived directly from the prototype's actual state)

The prototype's `DEFAULT` state object in `pick-it-up-app.jsx` is the
real source of truth for what needs to persist. Below is that data
reorganised into database tables. This is a starting schema for Claude
Code to refine, not a rigid final spec.

### `users` (handled mostly by Supabase Auth automatically)
Supabase's built-in auth table covers login/email/password. Add a
companion `profiles` table for app-specific fields:

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | matches the Supabase auth user id |
| `user_name` | text | from onboarding |
| `weekly_target` | int | sessions/week goal |
| `weight`, `height`, `age`, `waist` | numeric | from `bodyStats` |
| `unit` | text | "metric" or "imperial" |
| `sex` | text | used only for physiological calculations (TDEE, etc.), never for content filtering — preserve this principle from the existing app |
| `tone` | text | "Stoic" / "Balanced" / "Empathic" |
| `christian_lens` | boolean | default false |
| `training_location` | text | "bodyweight" / "home" / "commercial" |
| `equipment` | text[] | array of equipment strings |
| `injuries` | text[] | standing injury flags (set in Profile) |
| `is_premium` | boolean | |
| `onboarded` | boolean | |

### `check_ins`
One row per day per user — this is what `checkIn` + `checkInDate` +
`aiInsight` currently are, combined into a real history instead of a
single overwritten object.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | |
| `user_id` | uuid | foreign key |
| `date` | date | the day this check-in is for — this is the fix for the "today's focus never changes" bug; with a real date column, staleness is a query, not a guess |
| `readiness`, `sleep`, `mood`, `stress` | int (1-5) | |
| `ai_insight` | jsonb | stores the `{message, movement, reflection, pillar, quote}` object as-is |
| `injuries_today` | text[] | the daily check-in injury flags added per the recent critique fixes — kept separate from the standing `profiles.injuries` list |
| `created_at` | timestamptz | |

### `sessions`
What `sessionHistory` and `currentSession` currently are.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | |
| `user_id` | uuid | |
| `date` | date | |
| `source` | text | "ai" (getSession) or "deterministic" (generateProgram) — keep both possible per the integration spec's decision to let them coexist |
| `exercises` | jsonb | the generated session content |
| `readiness_at_time` | int | snapshot, for trend detection later |
| `completed` | boolean | |
| `flagged_contraindications` | jsonb | nullable — records if a contraindication warning fired and was acknowledged, for audit/safety record-keeping |

### `meals`
What `meals` currently is — the quick-log Nourish entries.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | |
| `user_id` | uuid | |
| `date` | date | |
| `name`, `kcal`, `protein`, `carbs`, `fat` | text/numeric | |

### `saved_recipes`
New table — not in the prototype's state yet, but needed once the
Discover tab's recipes are real and users want to keep favourites across
sessions rather than losing them on refresh.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | |
| `user_id` | uuid | |
| `recipe_id` | text | matches `RECIPES[].id` from the recipe engine |
| `saved_at` | timestamptz | |

### `sleep_log`, `goals`, `craving_log`
Same pattern as above — one row per entry per user, mirroring the
prototype's `sleepLog`, `goals`, `cravingLog` arrays exactly in shape,
just with a `user_id` and proper row-per-entry instead of an array on a
single object.

### `sobriety`
One row per user (not per entry) — mirrors `sobriety: { substance,
startDate }`.

### `community_posts`
Mirrors the existing `communityPosts` shape (`user`, `day`, `pillar`,
`text`, `seen`, `flagged`). At 10-50 users this can stay simple — a
shared table everyone reads from, no need for follower graphs or feeds
yet.

---

## 3. Authentication

Supabase Auth handles this — email/password or magic-link sign-in are
both built in and don't need custom code. For 10-50 trusted users, a
simple invite-only flow is worth considering over public sign-up:

- Create user accounts manually (or via a simple invite link) rather than
  building a public registration flow you don't need yet.
- This also sidesteps needing to build spam/abuse protections that don't
  matter at this scale but would for a public launch.

**Row Level Security (RLS):** Supabase's RLS policies are how you ensure
Josh's check-ins are only ever visible to Josh, not to other users
querying the same table. This is not optional — ask Claude Code to set
RLS policies on every table above before any real data goes in. This is
also directly relevant to the Privacy Act / APP 11 obligation already
flagged in the readiness checklist (reasonable steps to protect sensitive
health data) — RLS is a concrete, verifiable way to satisfy that, not
just a technical nicety.

---

## 4. Where the AI calls move

Right now, `callClaude()` in the prototype calls Anthropic's API directly
from the browser. **This cannot stay client-side in a real build** — it
either needs a visible API key (a real security problem) or it simply
won't work outside the artifact environment, which handles this
invisibly today.

**Fix:** move `callClaude()` server-side, via a Supabase Edge Function (a
small serverless function that runs near the database). The flow becomes:

```
App (browser) → Supabase Edge Function → Anthropic API → back to app
```

The Edge Function holds the real API key as a secret (never shipped to
the browser), and the app calls the Edge Function instead of Anthropic
directly. The function signature can stay almost identical to today's
`callClaude(system, userMsg, tokens)` — this is a relocation, not a
redesign.

---

## 5. What Claude Code should NOT build yet (matches the readiness checklist)

- No public sign-up flow — invite/manual accounts are enough for 10-50
  trusted users.
- No payment/subscription processing — `is_premium` can stay a manually
  toggled flag for now; build real billing only once you're past trusted
  testing.
- No data export/deletion self-service tooling yet — at this scale, Josh
  can handle a deletion request manually if one ever comes in. Worth
  building before any public launch, not before this first real test.
- No admin dashboard beyond Supabase's own table view — it's enough to
  see and edit data directly at this scale.

---

## 6. Suggested first steps for Claude Code

1. Set up a Supabase project, define the tables above as real Postgres
   tables with RLS policies.
2. Build the Edge Function that wraps `callClaude()`.
3. Wire the existing prototype's state shape to read/write from Supabase
   instead of local React state — this should largely be a mechanical
   swap, since the data shapes above were deliberately kept close to the
   prototype's existing `DEFAULT` object.
4. Confirm check-in staleness now works via a real `date` column query
   rather than the `checkInDate` string-comparison workaround in the
   prototype.
5. Everything else in `integration-spec.md` proceeds as already planned,
   now against real persisted data instead of in-memory state.
