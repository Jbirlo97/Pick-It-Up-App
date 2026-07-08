# Pick It Up — Exercise Library Trainer Review: Findings & Change List

**Status:** Reviewed and signed off by Josh (CHC51015 / SIS40221) with
Claude-assisted pre-screening and targeted evidence checks, July 2026.
**For:** Claude Code — apply as one focused pass, then re-run and extend
the safety test suite as specified in §5 (implemented below as §7's tests).

This closes launch-readiness item "trainer review of the exercise library"
for the contraindication layer, subject to Josh eyeballing the applied
result. Cues/errors/tiers were spot-checked and stand as-is.

---

## 1. CRITICAL BUG — injury matching vocabulary (fix first)

The injury flag "lower back" never matches the contra phrasing "acute low
back pain" under substring matching ("lower back" ⊄ "low back").
Back-injury exclusion has never functioned — 14 movements including
Barbell Deadlift, KB Swing, Back Squat, and Bent-Over Row are served to
users flagging back pain. This phrasing originates in the original
37-movement prototype data, and the randomized safety sweeps passed
vacuously (nothing matched → nothing blocked → nothing "wrongly served").

**Fix (durable, not a phrasing patch):** replace English-substring
matching with canonical injury keys. Each movement's contra becomes an
array of keys from a fixed enum; flags map to the same enum; matching is
exact key equality. Human-readable phrasing moves to display copy.

**Canonical keys:** `low_back`, `knee`, `shoulder`, `wrist`, `ankle`,
`hip`, `elbow`, `groin`, `hamstring`, `achilles`.

## 2. Injury flag picker — extend from 6 to 10

Add `elbow`, `groin`, `hamstring`, `achilles`/calf to `INJURY_OPTIONS`
(both check-in daily flags and Profile standing list). Rationale:
existing contra data references all four but no flag could ever fire
them, and they guard high-consequence movements (Nordic Curl / hamstring;
pull-ups / elbow).

## 3. Per-movement contra changes (trainer-decided)

| Movement | Change | Rationale |
|---|---|---|
| DB Single-Arm Row, KB Single-Arm Row | + `low_back` | Hip-hinged like other rows; supported hand mitigates but doesn't remove |
| Turkish Get-Up | + `knee` | Lunge-up portion loads the knee |
| KB Swing | + `shoulder` | Ballistic traction on the joint; ISSA: can aggravate pre-existing shoulder injury |
| Pull-up, Chin-up, Band-Assisted Pull-up, Hanging Knee Raise, Dead Hang | + `wrist` | Full bodyweight through grip; consistent with farmer's-carry precedent |
| Cat-Cow | + `wrist` ONLY | Weight-bearing on hands (documented contraindication). Back stays CLEAR — cat-cow is broadly recommended for back pain; excluding it would strip the most therapeutic option from back-flagged users |
| Thread the Needle | + `shoulder` | Bodyweight rests on the shoulder under rotation; documented contraindication |
| Dead Hang | `shoulder` exclusion CONFIRMED (any shoulder key) | Therapeutic-hanging evidence is one unpublished case series (Kirsch, n=92); even advocates exclude instability/dislocation; a generic flag can't distinguish impingement from instability, so conservative exclusion stands |

## 4. Confirmed deliberately clean (leave contra empty)

Band Row, Scapular Push-up (rehab-adjacent by design), Standing Hip
Circle, Box Breathing, Band Pull-Apart (prescribed in shoulder rehab). Do
not "fix" these in future passes — emptiness is a trainer decision,
recorded here.

## 5. Detail-copy additions (education, not exclusion)

- **Dead Hang:** "Some shoulder issues respond well to graded hanging —
  that's a conversation for a physio, not a flag in an app."
- **Cat-Cow:** "During an active back spasm, rest first — return to
  gentle movement as the acute phase settles."
- **Box Breathing** (movement library entry): mirror the Regulate
  library's caution (avoid long holds with uncontrolled high blood
  pressure / fainting history).

## 6. Data fix

`breath_work` is missing its `primary` field — restore it.

## 7. Required tests (extend the safety suite)

1. **Vocabulary lint:** every contra key in the library ∈ canonical enum;
   every enum key is reachable from at least one picker flag. Phrasing
   drift becomes a failing test forever.
2. **Regression:** a user flagging `low_back` is never served any of the
   14 back-contra movements (the exact case that silently failed).
3. **Re-run the randomized sweeps** across all 10 flags; assert at least
   one movement is excluded per flag (guards against future vacuous
   passes).

---

## Applied (this pass)

All of the above has been implemented:

- `app/src/data/injuries.ts` — the canonical `InjuryKey` enum, display
  labels, and contraindication display phrases.
- `Movement.contra` / `ExerciseV2.contraindications` — retyped to
  `InjuryKey[]`; `checkMovementContraindications` /
  `checkContraindications` / `exerciseSwap.ts`'s `isContraindicated` all
  moved from substring matching to exact key equality (three independent
  copies of the same bug, all fixed together).
- All 60 movements' contra arrays migrated from free-text phrases to
  canonical keys, with §3's trainer-decided additions applied on top —
  verified field-by-field against the original data (zero unexpected
  diffs outside contra/primary/note) before being written.
- `INJURY_OPTIONS` (content.ts) extended to the full 10-key set;
  check-in and Profile injury pickers render `INJURY_LABELS[key]`, never
  the raw key.
- `Movement.note` / `ExerciseV2.note` — new optional field for §5's
  educational asides, rendered in the Movement library list and Player's
  Detail tab, never affecting matching.
- `breath_work`'s `primary` field restored (`["diaphragm"]`) in both
  datasets.
- §7's three tests: `data/injuries.test.ts` (vocabulary lint, both
  datasets in sync), plus a `low_back` regression test and a full
  10-flag exclusion sweep added to both `session-engine.test.ts` and
  `program-engine.test.ts` (Quick Session and Detailed Session engines
  each have their own copy of the matching logic).
