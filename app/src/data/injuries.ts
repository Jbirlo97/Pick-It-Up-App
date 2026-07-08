// Canonical injury vocabulary — docs/trainer-review-findings.md §1.
//
// Previously, injury flags were free-text strings ("lower back") matched
// against free-text contraindication phrases ("acute low back pain") via
// substring search. "lower back" is not a substring of "acute low back
// pain", so back-injury exclusion silently never fired — 14 movements
// including Barbell Deadlift and KB Swing were served to users flagging
// back pain. The randomized safety sweeps passed anyway because they
// derived their own test flags from the contra text itself, which
// coincidentally matched — a vacuous pass that never exercised the real
// flag vocabulary a user actually picks from.
//
// Fix: contraindications and injury flags both live in this fixed enum,
// matched by exact key equality. There is no vocabulary to drift out of
// sync — a phrasing mismatch becomes a type error, not a silent no-op.
export const INJURY_KEYS = ["low_back", "knee", "shoulder", "wrist", "ankle", "hip", "elbow", "groin", "hamstring", "achilles"] as const;

export type InjuryKey = (typeof INJURY_KEYS)[number];

export function isInjuryKey(value: string): value is InjuryKey {
  return (INJURY_KEYS as readonly string[]).includes(value);
}

// Short labels for the check-in / Profile injury-flag pickers.
export const INJURY_LABELS: Record<InjuryKey, string> = {
  low_back: "Lower back",
  knee: "Knee",
  shoulder: "Shoulder",
  wrist: "Wrist",
  ankle: "Ankle",
  hip: "Hip",
  elbow: "Elbow",
  groin: "Groin",
  hamstring: "Hamstring",
  achilles: "Achilles/calf",
};

// Descriptive phrasing for contraindication displays (Movement library,
// Player's Detail tab, session "worked around your flags" copy).
export const CONTRA_DISPLAY: Record<InjuryKey, string> = {
  low_back: "acute low back pain",
  knee: "acute knee injury",
  shoulder: "shoulder injury or impingement",
  wrist: "wrist injury",
  ankle: "acute ankle injury or instability",
  hip: "acute hip labral tear",
  elbow: "acute elbow injury",
  groin: "acute groin strain",
  hamstring: "acute hamstring strain or tear",
  achilles: "acute achilles or calf injury",
};
