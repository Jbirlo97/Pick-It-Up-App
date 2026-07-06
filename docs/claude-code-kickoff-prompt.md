# Pick It Up — Claude Code Kickoff Prompt & Project Brief (v2 — Deterministic-First)

Two parts: (1) a copy/paste kickoff prompt to open the Claude Code session,
(2) a project brief to keep in the repo root as `CLAUDE.md` for standing
context. This v2 supersedes the earlier version: the app has since pivoted
to a **fully deterministic, zero-API-cost architecture** with the AI layer
dormant but preserved for later reactivation.

---

## PART 1 — Kickoff Prompt (copy/paste this first)

```
I'm building Pick It Up, a counselling-led wellness and fitness app for the
Australian market. I have a working single-file React prototype
(pick-it-up-app.jsx, ~264k chars, fully validated and functionally tested)
plus standalone engine modules and complete specs. I need you to build this
as a real multi-file app with a proper backend — not refactor the prototype
as-is.

CRITICAL CONTEXT — DETERMINISTIC MODE: This app currently makes ZERO AI API
calls, deliberately, to eliminate cost during business launch. getInsight,
getSession, and getDigest are deterministic functions driven by check-in
scores and curated content pools. callClaude exists in the file but is
COMMENTED OUT. Do not reactivate it, do not require an Anthropic API key,
and do not treat the deterministic functions as placeholders to "upgrade" —
they are the shipping v1 behavior. backend-brief.md describes the future
reactivation path (Supabase Edge Function proxy); architect so that swap
stays a one-pass change later.

Read these files in order before writing any code:
1. integration-spec.md — authoritative build plan. Follow the data
   contracts (Section 4) and explicit non-goals (Section 6) precisely.
2. backend-brief.md — Supabase architecture: tables, RLS, invite-only auth.
   The Edge Function section applies ONLY to future AI reactivation.
3. launch-readiness-checklist.md — pre-user gates. Not your Day-1 tasks
   (most need Josh's time: solicitor, trainer review, insurance), but
   architect so completing them later isn't a rewrite.
4. pick-it-up-app.jsx — the prototype. Source of truth for UX, visual
   design, brand voice, and all current logic. Its design decisions are
   deliberate and iterated, not draft.
5. recipe-engine-data.js + recipe-engine-ui.jsx — 90-recipe recommender.
6. program-engine-data.js + program-engine-ui.jsx — deterministic exercise
   engine (richer schema; fields flagged as awaiting trainer review).

Non-negotiables to hold through the entire build:
- SAFETY: generateDeterministicSession EXCLUDES contraindicated movements
  from the selection pool AND surfaces a "worked around your flags" notice
  in the session intro. Both halves are load-bearing. Never let a flagged
  movement be served; never make the exclusion silent. The detailed-session
  path's blocking contraindication interstitial must stay mandatory and
  blocking.
- Honest-disclosure copy must survive refactors: "not medical advice",
  nutrition "estimated" flags, BMI muscle-mass caveat + WHtR framing,
  "illustrated, not filmed" / "coming soon" demo labels, Regulate's "not
  trauma therapy" scope line.
- Feature gating is behavioral: Regulate and Community unlock on first
  completed session (sessionHistory.length > 0), not day counts.
- Onboarding: 6 steps with progress bar; name, tone, and at least one
  "why" are required; body stats stay deliberately optional. Completion
  routes through the first-win screen to check-in.
- Christian lens is opt-in, off by default, surfaces scripture from
  PILLARS data in Today's Focus and PillarDetail. Never suggest it.
- Brand: four pillars, tone slider (Stoic/Balanced/Empathic), C token
  palette, Georgia serif for literary moments. Preserve the voice.
- Exercise demos are an honest "Video demo coming soon" card (SVG play
  icon — NEVER a unicode ▶, it triggers iOS's native media overlay). Josh
  films real demos in Canada; the card is the slot they drop into.

Ask before deciding anything the specs don't cover — especially hosting,
and anything touching the safety or disclosure items above.
```

---

## PART 2 — Project Brief (keep as CLAUDE.md)

### What this is
Counselling-led wellness app. Tagline: *"Built on the philosophy of
change."* Thesis: *"Muscle is built in the gym. Strength begins in the
mind."* Wellness tool, NOT a clinical service — scope language is a legal
requirement (TGA wellness exclusion), not styling. Sister brand: Action
Potential Counselling (Josh's practice; warm referral pathway only).

Josh holds CHC51015 (Diploma of Counselling) and SIS40221 (Cert IV Fitness)
— psychological depth and movement programming each stay in their lane.

### Current architecture (deterministic mode)
| Function | Behavior | AI future |
|---|---|---|
| getInsight | Score-driven pillar selection (stress≥4→Radical Responsibility; readiness/sleep≤2→The Trickle; mood≤2→Thrownness; avg≥4→Projection; else date-cycle), readiness-calibrated movement text, tone-branched reflections, pillar-matched quotes | Swap to callClaude via Edge Function |
| getSession | Wraps generateDeterministicSession into the Player shape {sessionTitle, sessionRationale, coachCue, estimatedMinutes, exercises[], flaggedExercises, trend} | Optional AI narration layer only — selection logic stays deterministic (safety) |
| getDigest | Session-count-banded weekly copy, tone-branched | Swap to callClaude |
| callClaude | Commented out, in place | Reactivate per backend-brief.md |

All three are synchronous — no await, no loading spinners on these paths.

### Safety design (tested, do not weaken)
- Contraindication matching is substring-based against MDB `contra` arrays;
  flagged movements are filtered OUT of the selection pool; exerciseCount
  clamps to the safe pool size; the flagged list is returned and rendered
  as a "Worked around your flags" notice in the Player intro. Verified by
  a 200-run randomized test: zero contraindicated movements served.
- Injuries have two sources feeding one state: standing (Profile) and
  daily (check-in flags). Both merge into state.injuries.
- Regulate: 8 evidence-grounded practices with real mechanisms and honest
  contraindications; every detail view carries the "not trauma therapy"
  boundary.

### File manifest
| File | Status |
|---|---|
| pick-it-up-app.jsx | Prototype; 53-test functional suite + safety suite passing; source of truth |
| recipe-engine-*.js(x) | Tested standalone; wire in additively per integration-spec |
| program-engine-*.js(x) | Tested standalone; schema fields await trainer review (2.1 in checklist) |
| integration-spec.md / backend-brief.md / launch-readiness-checklist.md | Current |
| *-preview-combined.jsx | Artifact-viewer builds only — do not use |

### Decided (don't relitigate)
- Deterministic-first is a cost decision with a preserved upgrade path,
  not a downgrade. Zero API spend until Josh chooses otherwise.
- Additive integration, not rewrite. Case-by-case data authority per spec.
- Supabase (Postgres + RLS + invite-only auth) per backend-brief.md;
  10–50 trusted users; no payments, no public signup, no self-serve
  deletion tooling yet.
- MDB vs EXERCISES duplication is deliberate until trainer review; then
  consolidate to EXERCISES.

### Not decided (ask Josh)
- Hosting/deployment target.
- When AI reactivates, which functions get it first (getInsight is the
  highest-value candidate).
- Exercise demo interim: licensed animation library (MoveKit ~$99 full
  library was researched) vs waiting for Josh's Canada footage.

### Open items on Josh's side (not build blockers)
Supabase project creation; trusted-user list + invite method; his own
definition of "done" for the first test. An Anthropic API key is NOT
needed for v1.
