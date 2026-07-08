import { describe, expect, it } from "vitest";
import { MDB } from "../data/exercises-legacy";
import { suggestProgression } from "./progression";
import type { SessionHistoryEntry } from "../types";

describe("suggestProgression", () => {
  it("suggests nothing when there's no history for this movement", () => {
    expect(suggestProgression(MDB.goblet_squat, [], "metric")).toBeNull();
  });

  it("suggests nothing when the prior session didn't hit the prescribed reps", () => {
    const history: SessionHistoryEntry[] = [
      {
        date: "d1",
        readiness: 3,
        completed: true,
        exercises: [{ movementKey: "goblet_squat", name: "Goblet Squat", equipment: "Bodyweight", setsLogged: [{ reps: 8, prescribedReps: 10 }] }],
      },
    ];
    expect(suggestProgression(MDB.goblet_squat, history, "metric")).toBeNull();
  });

  it("suggests +1 rep for a bodyweight movement after hitting every prescribed set", () => {
    const history: SessionHistoryEntry[] = [
      {
        date: "d1",
        readiness: 3,
        completed: true,
        exercises: [
          {
            movementKey: "goblet_squat",
            name: "Goblet Squat",
            equipment: "Bodyweight",
            setsLogged: [
              { reps: 10, prescribedReps: 10 },
              { reps: 11, prescribedReps: 10 },
            ],
          },
        ],
      },
    ];
    const suggestion = suggestProgression(MDB.goblet_squat, history, "metric");
    expect(suggestion?.text).toBe("Last time: 2×11 — try 2×12");
  });

  it("suggests a small weight increment for an equipment movement when a weight was logged", () => {
    const history: SessionHistoryEntry[] = [
      {
        date: "d1",
        readiness: 3,
        completed: true,
        exercises: [{ movementKey: "db_goblet_squat", name: "Goblet Squat (Dumbbell)", equipment: "Dumbbells", setsLogged: [{ reps: 10, prescribedReps: 10, weight: 20 }] }],
      },
    ];
    const suggestion = suggestProgression(MDB.db_goblet_squat, history, "metric");
    expect(suggestion?.text).toBe("Last time: 1×10 at 20kg — try 20.5kg");
  });

  it("never fabricates an absolute weight when no weight was ever logged — falls back to a rep suggestion", () => {
    const history: SessionHistoryEntry[] = [
      {
        date: "d1",
        readiness: 3,
        completed: true,
        exercises: [{ movementKey: "db_goblet_squat", name: "Goblet Squat (Dumbbell)", equipment: "Dumbbells", setsLogged: [{ reps: 10, prescribedReps: 10 }] }],
      },
    ];
    const suggestion = suggestProgression(MDB.db_goblet_squat, history, "metric");
    expect(suggestion?.text).toBe("Last time: 1×10 — try 1×11");
    expect(suggestion?.text).not.toMatch(/kg|lb/);
  });

  it("respects the user's unit preference in the weight suggestion", () => {
    const history: SessionHistoryEntry[] = [
      {
        date: "d1",
        readiness: 3,
        completed: true,
        exercises: [{ movementKey: "db_goblet_squat", name: "Goblet Squat (Dumbbell)", equipment: "Dumbbells", setsLogged: [{ reps: 10, prescribedReps: 10, weight: 40 }] }],
      },
    ];
    const suggestion = suggestProgression(MDB.db_goblet_squat, history, "imperial");
    expect(suggestion?.text).toBe("Last time: 1×10 at 40lb — try 41lb");
  });

  it("reads the most recent matching entry when history has multiple sessions", () => {
    const history: SessionHistoryEntry[] = [
      { date: "d1", readiness: 3, completed: true, exercises: [{ movementKey: "goblet_squat", name: "Goblet Squat", equipment: "Bodyweight", setsLogged: [{ reps: 5, prescribedReps: 10 }] }] },
      { date: "d2", readiness: 3, completed: true, exercises: [{ movementKey: "goblet_squat", name: "Goblet Squat", equipment: "Bodyweight", setsLogged: [{ reps: 10, prescribedReps: 10 }] }] },
    ];
    const suggestion = suggestProgression(MDB.goblet_squat, history, "metric");
    expect(suggestion?.text).toBe("Last time: 1×10 — try 1×11");
  });
});
