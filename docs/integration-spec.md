# Pick It Up — Integration Spec for Claude Code Handoff

**Scope:** Integrate the Recipe Engine and Program Engine as ADDITIVE features
into the existing Pick It Up app. Do NOT replace Movement or Nourish's
existing logic in this pass — see "Why additive, not full merge" below.

**Source artifacts (all in this output set):**
- `pick-it-up-app.jsx` — the live, tested app. Source of truth for UI/UX
  patterns, brand palette, onboarding flow, state shape.
- `recipe-engine-data.js` + `recipe-engine-ui.jsx` — new "Discover Recipes"
  feature, goal-based recommendation engine, 90 recipes.
- `program-engine-data.js` + `program-engine-ui.jsx` — upgraded session
  generator with deterministic scoring, contraindication warnings, trend
  detection. NOT yet wired to replace the main app's existing `getSession`.

---

## 1. Why additive, not full merge (read this first)

A full merge would mean rewriting Movement and Nourish — screens that are
live, tested, and already validated with real users — to run on data that
is **partially unverified**:
- The program engine's exercise schema fields (`pattern`, `difficulty`,
  `coordination_demand`, `confidence_demand`, `energy_demand`,
  `nervous_system_effect`) were derived by heuristic from the existing
  `MDB` tags, NOT reviewed by a trainer. See `program-engine-data.js`
  header comment.
- The recipe engine's nutrition data is flagged `nutritionSource:
  "estimated"` on every recipe — not yet verified against AUSNUT/FSANZ
  (see market research findings).

Swapping working, tested logic for less-validated logic in one pass is the
highest-risk version of a pattern that has already caused real crashes in
this project's history (documented: three "Error running artifact"
failures from large single-pass rewrites). Build additively, validate the
new pieces with real usage, THEN retire the older/simpler logic once
confidence is earned — not before.

---

## 2. Confirmed duplicate/overlapping concepts (full audit)

### 2a. Color palette — TRIVIAL, consolidate immediately
`const C = {...}` is byte-identical across all three files (`gd`, `go`,
`cr`, `sg`, `sl`, `ch`, `ow`, `mu`, `wh`, `rd`, `am`). Zero risk to merge
into one shared `theme.js` / `theme.ts` module. Do this first — it's free.

### 2b. Exercise data — REAL duplication, KEEP BOTH for now, plan convergence
- `pick-it-up-app.jsx` → `MDB` (object keyed by snake_case id, e.g.
  `goblet_squat`), 36 entries, simple schema (name/tier/tags/muscles/
  primary/cues/errors/regression/progression/contra). This is what
  Movement and the existing `getSession` LLM call actually use today.
- `program-engine-data.js` → `EXERCISES` (array, `exercise_id` field like
  `"EX_GOBLET_SQUAT"`), same 36 entries (it was literally derived FROM
  `MDB`), richer schema (+pattern, difficulty, 3 demand ratings, nervous
  system effect, sub_1/2/3, breath_cue, video_url).
- **Key-naming mismatch:** `goblet_squat` (object key) vs
  `"EX_GOBLET_SQUAT"` (string field) — these are NOT directly joinable
  without a translation step. If Claude Code needs to cross-reference them
  before full consolidation, write a small mapping function, don't assume
  string equality.
- **Decision:** Keep `MDB` powering existing Movement/Player as-is. Keep
  `EXERCISES` powering the new Program Generator feature (see Section 3)
  as a separate, additive flow. Flag for a later consolidation pass ONLY
  after a trainer (Josh) has reviewed and corrected the heuristic-derived
  fields in `EXERCISES` — at that point `EXERCISES` becomes the single
  source of truth and `MDB` retires.

### 2c. Session/program generation — REAL architectural collision, this is the headline finding
- `pick-it-up-app.jsx` → `getSession()` is an **LLM call**. It sends a
  prompt with rules ("readiness 1-2 → EXACTLY 2 exercises...") and trusts
  Claude to follow them. Injury handling is a soft text instruction:
  `"Avoid for injuries: " + injuries.join(",")` — advisory only, the model
  could ignore it, there is no hard check and no warning UI.
- `program-engine-data.js` → `generateProgram()` is **fully deterministic**
  — fixed point-based scoring (`SCORING_RULES`), explicit
  `checkContraindications()`, and the engine UI enforces a mandatory
  one-tap warning before a flagged session can be played.
- **This is the exact pattern the market research flagged**: deterministic
  scoring is 2026 best practice for safety-critical recommendations
  (Fitbod's "Injuries and Limitations" feature does transparent exclusion,
  not silent LLM-trusted filtering). The live app currently has the
  WEAKER pattern of the two. This is the single most important reason to
  treat the program engine as a real upgrade path, not just an add-on —
  but per the additive decision above, ship it as a new entry point first
  (Section 3), prove it out, then consider replacing `getSession`.
- `getSession` ALSO has its own trend detection (first-vs-last of last 3
  readiness scores) which is a strictly worse version of
  `detectReadinessTrend()` in the program engine (which checks the full
  window and distinguishes "volatile" from "stable" — see code comments
  in `program-engine-data.js` for the exact difference). When the program
  engine is wired in, its trend function should be treated as the
  upgrade — don't keep both.

### 2d. Food/recipe data — NOT a duplicate, just adjacent (no action needed)
- `FOODS` (main app) = 38 single-item quick-log entries
  (`{name, kcal, protein, carbs, fat}`) for the existing Nourish
  autocomplete-on-log flow. Answers "what did I just eat."
- `RECIPES`/`INGREDIENTS` (recipe engine) = 90 full recipes with cost,
  prep time, goal-scoring, ingredient patterns. Answers "what should I
  cook." Different job, different moment in the user's day. Keep both,
  no consolidation needed — they're genuinely different features.

### 2e. Goal vocabularies — NOT a collision, just confusingly similar names
- Recipe engine `GOALS`: Fat Loss, Muscle Gain, General Health, Budget
  Friendly, Time Efficient, Family Friendly, Vegetarian/Plant-Based,
  Endurance/Active — these are FOOD goals.
- Program engine `USER_INPUT_SCHEMA.primaryGoal`: Strength, Consistency,
  Mood support, Confidence, Stress management — these are TRAINING goals.
- Do not attempt to unify these into one "goal" concept — they answer
  different questions and a user may reasonably want "Fat Loss" recipes
  while training for "Mood support." Keep as two separate selectors in
  their respective flows.

### 2f. Onboarding field mismatches — REAL gaps, need new questions
The program engine's `USER_INPUT_SCHEMA` expects fields the live app does
not currently collect:
- `primaryGoal` (Strength/Consistency/Mood support/Confidence/Stress
  management) — **does not exist anywhere in the live app.** Needs a new
  onboarding question if/when the program engine becomes the default
  session generator. NOT required for the additive Section 3 build (can
  default to "Consistency" or ask inline on first use of the new feature).
- `experienceLevel` (Beginner/Intermediate/Advanced) — **does not exist.**
  Same treatment as above.
- `equipmentAccess` options ("None"/"Bands"/"Dumbbells"/"Home gym"/
  "Commercial gym") **do not match** the live app's actual equipment
  values (`trainingLocation`: commercial/home/bodyweight, plus a granular
  `equipment` array: dumbbells/barbell/bench/pull-up bar/resistance
  bands/kettlebell/cable machine/squat rack). A direct field mapping is
  needed, not a rename — see Section 4 data contract.
- `sessionLength` (15/30/45/60 min) — flagged in the engine's own code
  comments as "NOT YET in live app." True. Not required for Section 3 (the
  engine already auto-sizes by readiness); add later if Josh wants
  explicit time-boxing.
- `trainingDays` (2-6/week) — this one DOES map directly to the live app's
  existing `weeklyTarget` field. No new question needed, just pass
  `weeklyTarget` in as `trainingDays`.

### 2g. Component/function name collisions — none found requiring renames
No two artifacts define a function or component with the same name doing
different things. `C` (the palette) is the only literal naming collision,
and it's identical in content, so it's a consolidation opportunity, not a
conflict to resolve.

---

## 3. Recommended integration (additive, into the correct places)

### 3a. Recipe Engine → new "Discover" entry point inside Nourish
- Add a new tab to Nourish's existing tab row: `[["log", "Log"],
  ["macros", "Macros"], ["bmi", "BMI"]]` → add `["discover", "Discover"]`.
- The `discover` tab renders the recipe engine's goal → situation →
  results flow (from `recipe-engine-ui.jsx`), restyled to fit inside
  Nourish's existing screen chrome rather than as a full-screen takeover
  (the current preview build is full-screen for standalone testing —
  Claude Code should adapt it to sit within Nourish's existing header/nav
  pattern).
- Wire `bodyStats.sex` (already collected) into recipe scoring ONLY where
  it affects portioning/macro targets — do not use it for recipe content
  filtering, consistent with the existing TDEE implementation's stated
  principle ("biology not identity, never stereotyping").
- Shopping list (`buildShoppingList`) can either live inside this new tab
  or become a new item on the Track screen — Josh's call, not assumed
  here, since Track is closer to "things to revisit" than Nourish.

### 3b. Program Engine → new "Generate Smart Session" option inside Movement
- Do NOT replace the existing `gen()` flow (which calls `getSession`, the
  LLM-based generator). Add it as a second, explicit choice — e.g. a
  toggle or secondary button: "Quick session" (existing, LLM-based, fast)
  vs. "Detailed session" (new, deterministic, shows contraindication
  warnings, shows trend reasoning).
- This lets Josh and early testers compare both side by side before
  deciding whether to retire `getSession` — directly serving the
  "get feedback" goal stated for this build.
- The mandatory one-tap contraindication warning (`ContraindicationWarning`
  component) must be preserved exactly as built — do not let this get
  "simplified" into a passive banner during integration. This is the
  single feature most validated by the market research as correct and
  ahead of competitors.

### 3c. Regulatory guardrails to bake into both (high priority, low cost)
These are specific, narrow constraints — not broad caveats — chosen to
keep the app inside the TGA wellness exclusion and clear of AHPRA/ACL risk
WITHOUT limiting functionality:
1. Any mood/trigger/craving copy must stay self-reflection-framed
   ("pattern over time, not shame in the moment" — the EXISTING Track/Mind
   copy already does this correctly; use it as the house style for any
   new copy in the recipe/program engines too).
2. Never use the words "diagnose," "treat," "screen for," or name a
   specific clinical condition (e.g. "depression," "an eating disorder")
   in any AI-generated or static copy across either engine.
3. Add a one-line disclaimer to the Program Generator's results screen,
   matching Fitbod's pattern: "These suggestions are not medical advice
   and don't replace professional guidance." This costs nothing in
   usefulness and directly closes the regulatory gap the live app
   currently has (advisory-only injury handling with no disclaimer at
   all).
4. Do not add any feature that screens for, scores, or monitors a named
   mental health condition. Craving/trigger logging stays a personal
   pattern-tracker, never a clinical assessment tool. If a future feature
   idea crosses this line, escalate for a proper compliance review before
   building — don't let it ship via incremental feature creep.
5. When recipe nutrition data is shown to users, the `nutritionSource:
   "estimated"` flag should surface as a small, honest UI note (e.g. "~"
   prefix on macros, or a footnote) rather than being silently dropped
   during integration. Same principle as #3 — disclosure costs nothing
   and prevents an overclaim risk.

---

## 4. Data contracts (exact shapes Claude Code needs to bridge)

### Equipment mapping (program engine ⟷ live app)
```
Live app trainingLocation + equipment array  →  Engine equipmentAccess array
"bodyweight"                                  →  ["None"]
"commercial"                                  →  ["Commercial gym"]  (implies all equipment available)
"home" + equipment:["dumbbells"]              →  ["Dumbbells", "Home gym"]
"home" + equipment:["resistance bands"]       →  ["Bands", "Home gym"]
"home" + equipment:[multiple]                 →  map each known item; barbell/bench/pull-up bar/
                                                   kettlebell/cable machine/squat rack have NO
                                                   direct equivalent in the engine's current
                                                   equipmentAccess options — extend
                                                   USER_INPUT_SCHEMA.equipmentAccess.options to
                                                   include these rather than losing the data.
```
**Action for Claude Code:** extend `equipmentAccess` options in
`USER_INPUT_SCHEMA` to match the live app's actual granular list, rather
than forcing the live app's data into the engine's narrower categories.
The live app's list is more specific and shouldn't be downgraded.

### Exercise key mapping (when cross-referencing MDB and EXERCISES)
```
MDB object key (e.g. "goblet_squat")  →  strip underscores, uppercase,
                                           prefix "EX_" → "EX_GOBLET_SQUAT"
                                           (= EXERCISES[].exercise_id)
```
Write this as an explicit helper function if any code needs to look up
the same movement in both datasets during the transition period. Do not
assume string equality.

### Trend data (sessionHistory shape)
Both `getSession`'s inline trend logic and `detectReadinessTrend()` expect
`sessionHistory` as an array of objects with at least `{ readiness:
number }`, most recent last. This shape is already consistent between the
live app's `state.sessionHistory` and the engine's expected input — no
transformation needed here, just pass it through directly.

---

## 5. Suggested file structure for Claude Code

```
/src
  /theme.js                    — consolidated C palette (Section 2a)
  /data
    /exercises-legacy.js       — current MDB, powers existing Movement/Player
    /exercises-v2.js           — EXERCISES from program-engine-data.js
    /recipes.js                — RECIPES + INGREDIENTS + GOALS + ARCHETYPES
    /foods-quicklog.js         — existing FOODS array (unchanged)
  /engines
    /recipe-engine.js          — scoring/recommendation functions
    /program-engine.js         — scoring/generateProgram/contraindication functions
  /screens
    /Movement.jsx               — existing screen + new "Detailed session" entry point
    /Nourish.jsx                 — existing screen + new "Discover" tab
    /...                         — all other existing screens, unchanged
  /components
    /ContraindicationWarning.jsx — ported as-is from program-engine-ui.jsx
    /RecipeCard.jsx, RecipeDetail.jsx — ported from recipe-engine-ui.jsx
    /...                         — existing shared components, unchanged
```

This keeps the legacy and v2 exercise data explicitly separate and
named for what they are, rather than ambiguously named in a way that
invites someone to assume they're interchangeable before the trainer
review (Section 2b) has happened.

---

## 6. Explicit non-goals for this integration pass

- Do NOT retire `getSession` or `MDB` yet.
- Do NOT attempt to merge the recipe and program "goal" vocabularies.
- Do NOT add `sessionLength` or other not-yet-needed onboarding fields
  speculatively — add them when a feature actually requires them.
- Do NOT silently drop the `nutritionSource: "estimated"` or
  contraindication-warning disclosures during UI integration for the
  sake of visual cleanliness — these are deliberate, evidence-based
  inclusions, not placeholder text.
