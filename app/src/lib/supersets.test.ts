import { describe, expect, it } from "vitest";
import { MDB } from "../data/exercises-legacy";
import { groupSessionExercises, isSuperset } from "./supersets";
import type { SessionExercise } from "../types";

function toSessionExercise(key: string, overrides?: Partial<SessionExercise>): SessionExercise {
  return {
    movementKey: key,
    movement: MDB[key],
    sets: 3,
    reps: "10",
    rest: 60,
    coachNote: MDB[key].cues[0],
    phase: "main",
    estMinutes: 8,
    ...overrides,
  };
}

describe("groupSessionExercises", () => {
  it("treats every exercise as its own singleton group when nothing is grouped (today's behavior)", () => {
    const exercises = [toSessionExercise("goblet_squat"), toSessionExercise("pushup"), toSessionExercise("plank")];
    const groups = groupSessionExercises(exercises);
    expect(groups).toEqual([[exercises[0]], [exercises[1]], [exercises[2]]]);
  });

  it("pairs two exercises sharing the same group id into one group", () => {
    const a = toSessionExercise("goblet_squat", { group: "superset-1" });
    const b = toSessionExercise("pushup", { group: "superset-1" });
    const c = toSessionExercise("plank");
    const groups = groupSessionExercises([a, b, c]);
    expect(groups).toEqual([[a, b], [c]]);
  });

  it("places a group at the position of its first member, preserving overall order", () => {
    const a = toSessionExercise("goblet_squat");
    const b = toSessionExercise("pushup", { group: "s1" });
    const c = toSessionExercise("plank");
    const d = toSessionExercise("bird_dog", { group: "s1" });
    const groups = groupSessionExercises([a, b, c, d]);
    expect(groups).toEqual([[a], [b, d], [c]]);
  });

  it("supports more than two exercises sharing a group id", () => {
    const a = toSessionExercise("goblet_squat", { group: "circuit" });
    const b = toSessionExercise("pushup", { group: "circuit" });
    const c = toSessionExercise("plank", { group: "circuit" });
    const groups = groupSessionExercises([a, b, c]);
    expect(groups).toEqual([[a, b, c]]);
  });

  it("keeps independent groups separate", () => {
    const a = toSessionExercise("goblet_squat", { group: "s1" });
    const b = toSessionExercise("pushup", { group: "s1" });
    const c = toSessionExercise("plank", { group: "s2" });
    const d = toSessionExercise("bird_dog", { group: "s2" });
    const groups = groupSessionExercises([a, b, c, d]);
    expect(groups).toEqual([
      [a, b],
      [c, d],
    ]);
  });
});

describe("isSuperset", () => {
  it("is false for a singleton group", () => {
    expect(isSuperset([toSessionExercise("goblet_squat")])).toBe(false);
  });

  it("is true for a group with more than one exercise", () => {
    expect(isSuperset([toSessionExercise("goblet_squat"), toSessionExercise("pushup")])).toBe(true);
  });
});
