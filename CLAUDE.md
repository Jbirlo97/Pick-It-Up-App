# Pick It Up — Project Brief

## What this is
Counselling-led wellness app. Tagline: *"Built on the philosophy of
change."* Thesis: *"Muscle is built in the gym. Strength begins in the
mind."* Wellness tool, NOT a clinical service — scope language is a legal
requirement (TGA wellness exclusion), not styling. Sister brand: Action
Potential Counselling (Josh's practice; warm referral pathway only).

Josh holds CHC51015 (Diploma of Counselling) and SIS40221 (Cert IV Fitness)
— psychological depth and movement programming each stay in their lane.

## Current architecture (deterministic mode)
| Function | Behavior | AI future |
|---|---|---|
| getInsight | Score-driven pillar selection (stress≥4→Radical Responsibility; readiness/sleep≤2→The Trickle; mood≤2→Thrownness; avg≥4→Projection; else date-cycle), readiness-calibrated movement text, tone-branched reflections, pillar-matched quotes | Swap to callClaude via Edge Function |
| getSession | Wraps generateDeterministicSession into the Player shape {sessionTitle, sessionRationale, coachCue, estimatedMinutes, exercises[], flaggedExercises, trend} | Optional AI narration layer only — selection logic stays deterministic (safety) |
| getDigest | Session-count-banded weekly copy, tone-branched | Swap to callClaude |
| callClaude | Commented out, in place | Reactivate per backend-brief.md |

All three are synchronous — no await, no loading spinners on these paths.

## Safety design (tested, do not weaken)
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

## File manifest
| File | Status |
|---|---|
| reference/pick-it-up-app.jsx | Prototype; 53-test functional suite + safety suite passing; source of truth |
| reference/recipe-engine-*.js(x) | Tested standalone; wire in additively per integration-spec |
| reference/program-engine-*.js(x) | Tested standalone; schema fields await trainer review (2.1 in checklist) |
| docs/integration-spec.md / docs/backend-brief.md / docs/launch-readiness-checklist.md | Current |
| *-preview-combined.jsx | Artifact-viewer builds only — do not use (not included in this repo) |

## Decided (don't relitigate)
- Deterministic-first is a cost decision with a preserved upgrade path,
  not a downgrade. Zero API spend until Josh chooses otherwise.
- Additive integration, not rewrite. Case-by-case data authority per spec.
- Supabase (Postgres + RLS + invite-only auth) per docs/backend-brief.md;
  10–50 trusted users; no payments, no public signup, no self-serve
  deletion tooling yet.
- MDB vs EXERCISES duplication is deliberate until trainer review; then
  consolidate to EXERCISES.

## Not decided (ask Josh)
- Hosting/deployment target.
- When AI reactivates, which functions get it first (getInsight is the
  highest-value candidate).
- Exercise demo interim: licensed animation library (MoveKit ~$99 full
  library was researched) vs waiting for Josh's Canada footage.

## Open items on Josh's side (not build blockers)
Supabase project creation; trusted-user list + invite method; his own
definition of "done" for the first test. An Anthropic API key is NOT
needed for v1.

## Non-negotiables to hold through every build/refactor
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

See docs/claude-code-kickoff-prompt.md for the original kickoff prompt,
docs/integration-spec.md for the authoritative build plan, docs/backend-brief.md
for the Supabase architecture, and docs/launch-readiness-checklist.md for
pre-launch gates.
