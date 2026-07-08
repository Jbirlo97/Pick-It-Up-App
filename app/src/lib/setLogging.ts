import type { ExerciseLogEntry, SessionExercise, SetLogEntry } from "../types";

// Extracts a sensible target rep count from prescription text for
// pre-filling the log input and for v1.5 progression comparisons. Handles
// the shapes the engines actually produce: "10", "easy, 10-12",
// "8-10 each side", "1-2 min" (non-rep phases return null — logging is
// scoped to the main phase only, see Player.tsx).
export function parsePrescribedReps(repsText: string): number | null {
  const match = repsText.match(/\d+/);
  return match ? Number(match[0]) : null;
}

// Per docs/session-structure-spec.md §3 v1: bodyweight movements log reps
// only — the caller (Player.tsx) never even shows a weight field for them,
// but this is enforced here too so a weight can't be attached by mistake.
export function logSet(exercise: SessionExercise, reps: number, weight?: number): SessionExercise {
  const entry: SetLogEntry = {
    reps,
    prescribedReps: parsePrescribedReps(exercise.reps),
    ...(exercise.movement.equipment !== "Bodyweight" && weight !== undefined ? { weight } : {}),
  };
  return { ...exercise, setsLogged: [...(exercise.setsLogged || []), entry] };
}

export function toExerciseLogEntry(exercise: SessionExercise): ExerciseLogEntry | null {
  if (!exercise.setsLogged || exercise.setsLogged.length === 0) return null;
  return {
    movementKey: exercise.movementKey,
    name: exercise.movement.name,
    equipment: exercise.movement.equipment,
    setsLogged: exercise.setsLogged,
  };
}
