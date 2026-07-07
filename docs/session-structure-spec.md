# Pick It Up — Session Structure Spec (from competitor analysis)

**For:** Claude Code, alongside the existing docs. **Source:** market research
on a trainer-programmed workout app (screenshots reviewed with Josh, July
2026). This spec extracts the patterns worth adopting and explicitly lists
what NOT to copy. It extends — does not replace — the deterministic session
engine and its safety rules (contraindication exclusion + "worked around
your flags" notice both stay exactly as built).

---

## 1. Three-phase session structure (HIGH priority)

Sessions become: **Warm-up → Workout → Cool-down.** The current
deterministic output becomes the Workout phase, unchanged.

**Warm-up (deterministic):** 2–3 items, selected by the movement patterns
in the generated workout — e.g. lower-body session → hip/glute activation
(glute bridge, hip circles) + 1–2 min easy cardio-style raise (jumping
jacks / jump rope / march in place; bodyweight-first, no machine
assumptions). Readiness ≤2 sessions skip the raise and go straight to
gentle mobility.

**Cool-down (deterministic):** 2–3 stretch/mobility items matched to what
was trained (from existing mobility movements in MDB), then **always end
with one Regulate breath practice** (default: extended_exhale, 2 min).
This is the brand-distinctive close — competitor cool-downs are stretches
only; ours downshifts the nervous system. Label it honestly: "Downshift —
from your Regulate library."

**Player:** phase headers with per-phase exercise count and estimated
minutes; a "Start section" affordance per phase is nice-to-have, phase
labels in the existing player flow are the v1 requirement.

**Data shape:** extend the session object with
`phases: { warmup: [...], main: [...], cooldown: [...] }` while keeping
`exercises` as the flat main list for backward compatibility during the
transition.

## 2. Alternate-exercise swaps (HIGH priority, low cost)

Each MDB movement already has `regression` and `progression`. Surface
these as swaps: a small "swap" control on an exercise row offering
"Easier: {regression}" / "Harder: {progression}".

**Safety rule (non-negotiable):** any swap target is run through
`checkMovementContraindications` against current injury flags before
being offered; contraindicated swaps are not shown. A swap never
bypasses the exclusion system.

## 3. Per-set logging + deterministic progression (MEDIUM, phased)

- **v1:** during a session, each set is loggable: reps done (+ optional
  weight for equipment movements). Store per-session in sessionHistory
  (`exercises[].setsLogged: [{reps, weight?}]`). Bodyweight movements log
  reps only.
- **v1.5:** simple deterministic progression using history: if the user
  completed all prescribed reps on a movement last time → suggest +1–2
  reps (bodyweight) or a small load increase (equipment) next time, with
  the suggestion labeled as such ("Last time: 3×10 — try 3×11"). Never
  auto-prescribe absolute weights with no history (see §6).

## 4. Supersets (LOW priority, phase 2)

Add an optional `group` field on exercise entries so two movements can be
paired; render paired items visually linked with a SUPERSET label. Ship
the data-model support now; the player UI can come later.

## 5. Small wins (do with any adjacent work)

- Set-count badge (×3 / ×4) on exercise rows.
- Per-phase and total estimated minutes.
- Thumbnail slot on each exercise row — renders the "coming soon" state
  now, Josh's filmed clips drop in later (same slot the demo tab uses).

## 6. Explicitly NOT copying

- **Algorithm-prescribed absolute weights for new users.** The
  competitor's "45 kg × 12" comes from a human PT who knows the client.
  An algorithm guessing loads for a stranger is a safety and credibility
  problem. Loads only ever come from the user's own logged history (§3).
- **Machine-heavy defaults** (Smith machine, cables). Bodyweight-first
  stands; equipment movements arrive via the Tier 2/3 expansion after
  Josh's shortlist review. Note: the competitor's equipment mix
  (dumbbell/barbell/kettlebell/bands/pull-up bar/cable) is a useful
  reality-check against that shortlist.
- **Their aesthetic.** Structure only; Pick It Up's C-token design
  system and voice are untouched.
- **Burying session rationale.** Ours stays on the session intro, with
  the contraindication notice.

## 7. Sequencing recommendation

1. §1 three-phase structure + §5 small wins (one pass — same surfaces)
2. §2 swaps (small, high value)
3. §3 v1 set logging → v1.5 progression (needs backend persistence)
4. §4 supersets last

Every phase keeps the existing functional test suite passing; add tests:
warm-up/cool-down selection respects injury exclusions, swap options are
contraindication-filtered, cool-down always ends with a breath practice.
