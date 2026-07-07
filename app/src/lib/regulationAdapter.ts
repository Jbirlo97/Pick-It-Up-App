import { REGULATION_PRACTICES, type RegulationPractice } from "../data/content";
import type { Movement } from "../types";

// Per docs/session-structure-spec.md §1: every cool-down phase ends with one
// Regulate breath practice, sourced from the real Regulate library (not a
// fabricated stand-in), so it's honestly labelled "from your Regulate
// library." Adapted into Movement shape so it can travel through the
// existing SessionExercise/Player pipeline unchanged.
export const DEFAULT_COOLDOWN_PRACTICE_ID = "extended_exhale";

export function getDefaultCooldownPractice(): RegulationPractice {
  return REGULATION_PRACTICES.find((p) => p.id === DEFAULT_COOLDOWN_PRACTICE_ID) || REGULATION_PRACTICES[0];
}

export function regulationPracticeToMovement(practice: RegulationPractice): Movement {
  return {
    name: practice.name,
    tier: 1,
    tags: ["recovery"],
    muscles: "Nervous system regulation",
    primary: [],
    cues: practice.steps,
    errors: [],
    regression: "Shorten the counts if it feels like a stretch, not a rest.",
    progression: `Build toward the full ${practice.durationMin}-minute practice as it becomes familiar.`,
    contra: [],
    equipment: "Bodyweight",
  };
}
