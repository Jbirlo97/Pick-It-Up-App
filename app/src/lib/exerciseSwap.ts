import { MDB, MOVS } from "../data/exercises-legacy";
import type { Movement, SessionExercise } from "../types";

export type SwapDirection = "easier" | "harder";

export interface SwapOption {
  direction: SwapDirection;
  label: string;
  apply: (current: SessionExercise) => SessionExercise;
}

// Per docs/trainer-review-findings.md §1: exact key equality, not substring
// matching — this was a second, independent copy of the same bug that
// silently broke "lower back" vs "acute low back pain" in the engines.
function isContraindicated(movement: Movement, injuryFlags: string[]): boolean {
  if (!injuryFlags || injuryFlags.length === 0) return false;
  return movement.contra.some((c) => injuryFlags.includes(c));
}

function findMovementByName(name: string): Movement | undefined {
  return MOVS.find((m) => m.name === name);
}

// Per docs/session-structure-spec.md §2: most `regression`/`progression`
// fields are descriptive text ("Box squat", "Add a pause at end range"),
// not another entry in the library — only a minority name a real movement
// with its own cues/contraindications. Those become a full swap (re-checked
// against current injury flags, per the spec's non-negotiable safety rule).
// The rest become a rep/tempo note on the *same* movement rather than a
// fabricated swap with cues we don't actually have for that variant.
export function getSwapOptions(exercise: SessionExercise, injuryFlags: string[]): SwapOption[] {
  const candidates: [SwapDirection, string][] = [
    ["easier", exercise.movement.regression],
    ["harder", exercise.movement.progression],
  ];
  const options: SwapOption[] = [];

  candidates.forEach(([direction, targetName]) => {
    if (!targetName) return;
    const targetMovement = findMovementByName(targetName);

    if (targetMovement) {
      if (isContraindicated(targetMovement, injuryFlags)) return; // never offer a blocked swap target
      const key = Object.keys(MDB).find((k) => MDB[k].name === targetMovement.name) || exercise.movementKey;
      options.push({
        direction,
        label: (direction === "easier" ? "Easier: " : "Harder: ") + targetMovement.name,
        apply: (current) => ({ ...current, movementKey: key, movement: targetMovement, coachNote: targetMovement.cues[0] || current.coachNote }),
      });
    } else {
      options.push({
        direction,
        label: (direction === "easier" ? "Easier: " : "Harder: ") + targetName,
        apply: (current) => ({ ...current, coachNote: `Try ${direction === "easier" ? "easier" : "harder"}: ${targetName}` }),
      });
    }
  });

  return options;
}
