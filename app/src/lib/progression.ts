import type { Movement, SessionHistoryEntry, Unit } from "../types";

export interface ProgressionSuggestion {
  text: string;
}

const UNIT_LABEL: Record<Unit, string> = { metric: "kg", imperial: "lb" };

// Rounds a weight increment to a practical plate/dumbbell jump: 0.5kg / 1lb
// steps, at least one step, roughly a 2.5% bump off the prior load.
function nextWeight(lastWeight: number, unit: Unit): number {
  const step = unit === "imperial" ? 1 : 0.5;
  const raw = lastWeight + Math.max(step, lastWeight * 0.025);
  return Math.round(raw / step) * step;
}

// Per docs/session-structure-spec.md §3 v1.5: deterministic progression from
// the user's own logged history only — never an algorithm-guessed absolute
// weight for someone with no history (see §6's explicit "not copying" list).
// Looks backward through sessionHistory for the most recent log of this
// exact movement; only suggests progressing if every logged set met its
// prescribed target last time. Returns null (no suggestion) otherwise —
// this never suggests regressing or repeating, only "you were ready, try a
// touch more," clearly labeled as a suggestion, not applied automatically.
export function suggestProgression(movement: Movement, sessionHistory: SessionHistoryEntry[], unit: Unit): ProgressionSuggestion | null {
  for (let i = sessionHistory.length - 1; i >= 0; i--) {
    const log = sessionHistory[i].exercises?.find((e) => e.name === movement.name);
    if (!log || log.setsLogged.length === 0) continue;

    const allMet = log.setsLogged.every((s) => s.prescribedReps !== null && s.reps >= s.prescribedReps);
    if (!allMet) return null;

    const sets = log.setsLogged.length;
    const lastSet = log.setsLogged[log.setsLogged.length - 1];
    const unitLabel = UNIT_LABEL[unit];

    if (movement.equipment !== "Bodyweight" && lastSet.weight !== undefined) {
      const suggested = nextWeight(lastSet.weight, unit);
      return { text: `Last time: ${sets}×${lastSet.reps} at ${lastSet.weight}${unitLabel} — try ${suggested}${unitLabel}` };
    }
    return { text: `Last time: ${sets}×${lastSet.reps} — try ${sets}×${lastSet.reps + 1}` };
  }
  return null;
}
