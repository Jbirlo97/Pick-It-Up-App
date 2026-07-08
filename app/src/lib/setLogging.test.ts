import { describe, expect, it } from "vitest";
import { MDB } from "../data/exercises-legacy";
import { logSet, parsePrescribedReps, toExerciseLogEntry } from "./setLogging";
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

describe("parsePrescribedReps", () => {
  it("extracts a plain number", () => {
    expect(parsePrescribedReps("10")).toBe(10);
  });

  it("extracts the first number from a range or qualified prescription", () => {
    expect(parsePrescribedReps("easy, 10-12")).toBe(10);
    expect(parsePrescribedReps("8-10 each side")).toBe(8);
  });

  it("returns null when there's no number to find", () => {
    expect(parsePrescribedReps("to failure")).toBeNull();
  });
});

describe("logSet", () => {
  it("logs reps and captures the prescribed target for later comparison", () => {
    const ex = toSessionExercise("goblet_squat", { reps: "10" });
    const logged = logSet(ex, 12);
    expect(logged.setsLogged).toEqual([{ reps: 12, prescribedReps: 10 }]);
  });

  it("appends to existing logged sets rather than replacing them", () => {
    let ex = toSessionExercise("goblet_squat");
    ex = logSet(ex, 10);
    ex = logSet(ex, 9);
    expect(ex.setsLogged?.map((s) => s.reps)).toEqual([10, 9]);
  });

  it("attaches weight only for equipment movements, never for bodyweight", () => {
    const bodyweight = logSet(toSessionExercise("goblet_squat"), 10, 20);
    expect(bodyweight.setsLogged?.[0].weight).toBeUndefined();

    const equipped = logSet(toSessionExercise("db_goblet_squat"), 10, 20);
    expect(equipped.setsLogged?.[0].weight).toBe(20);
  });

  it("leaves weight undefined for an equipment movement when none was entered", () => {
    const equipped = logSet(toSessionExercise("db_goblet_squat"), 10);
    expect(equipped.setsLogged?.[0].weight).toBeUndefined();
  });
});

describe("toExerciseLogEntry", () => {
  it("returns null when nothing has been logged yet", () => {
    expect(toExerciseLogEntry(toSessionExercise("goblet_squat"))).toBeNull();
  });

  it("produces a compact record once sets are logged", () => {
    const ex = logSet(toSessionExercise("db_goblet_squat"), 10, 22.5);
    const entry = toExerciseLogEntry(ex);
    expect(entry).toEqual({
      movementKey: "db_goblet_squat",
      name: "Goblet Squat (Dumbbell)",
      equipment: "Dumbbells",
      setsLogged: [{ reps: 10, prescribedReps: 10, weight: 22.5 }],
    });
  });
});
