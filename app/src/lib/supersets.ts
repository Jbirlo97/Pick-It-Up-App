import type { SessionExercise } from "../types";

// Per docs/session-structure-spec.md §4: partitions a phase's exercise list
// into groups — exercises sharing the same `group` id become one superset
// group, everything else is its own singleton group. A group appears at
// the position of its first member, so rendering order never changes.
// Nothing produces a `group` value yet (no engine wiring, no UI) — this is
// the data-model-only building block the spec asks for now, ready for a
// later Player pass to consume ("render paired items visually linked with
// a SUPERSET label").
export function groupSessionExercises(exercises: SessionExercise[]): SessionExercise[][] {
  const groups: SessionExercise[][] = [];
  const seenGroupIds = new Set<string>();

  exercises.forEach((ex) => {
    if (ex.group) {
      if (seenGroupIds.has(ex.group)) return;
      seenGroupIds.add(ex.group);
      groups.push(exercises.filter((e) => e.group === ex.group));
    } else {
      groups.push([ex]);
    }
  });

  return groups;
}

export function isSuperset(group: SessionExercise[]): boolean {
  return group.length > 1;
}
