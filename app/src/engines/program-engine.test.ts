import { describe, expect, it } from "vitest";
import { EXERCISES } from "../data/exercises-v2";
import { checkContraindications, detectReadinessTrend, generateProgram, getDetailedSession, scoreExercise } from "./program-engine";
import type { SessionHistoryEntry } from "../types";

describe("checkContraindications", () => {
  it("reports no match with no injury flags", () => {
    const goblet = EXERCISES.find((e) => e.exercise_id === "EX_GOBLET_SQUAT")!;
    expect(checkContraindications(goblet, [])).toEqual({ blocked: false, matches: [] });
  });

  it("matches case-insensitively via substring", () => {
    const goblet = EXERCISES.find((e) => e.exercise_id === "EX_GOBLET_SQUAT")!;
    const result = checkContraindications(goblet, ["Knee"]);
    expect(result.blocked).toBe(true);
  });
});

describe("generateProgram — safety (deliberate deviation from the reference engine)", () => {
  // The original program-engine-data.js reference scored contraindicated
  // exercises normally and only asked for a one-tap acknowledgment before
  // serving them. This port follows CLAUDE.md's stricter existing rule
  // instead: excluded outright, never served, regardless of score.
  const allInjuryFlags = Array.from(new Set(EXERCISES.flatMap((e) => e.contraindications))).map((c) => {
    const words = c.split(" ");
    return words[words.length - 2] || c;
  });

  it("never serves a flagged exercise in warmup/main/regulation, across 200 randomized runs", () => {
    for (let i = 0; i < 200; i++) {
      const readiness = 1 + Math.floor(Math.random() * 5);
      const stress = 1 + Math.floor(Math.random() * 5);
      const flagCount = Math.floor(Math.random() * 3);
      const injuryFlags = Array.from({ length: flagCount }, () => allInjuryFlags[Math.floor(Math.random() * allInjuryFlags.length)]);

      const program = generateProgram({
        readiness,
        stress,
        injuryFlags,
        equipmentAccess: ["None"],
        primaryGoal: "Consistency",
        experienceLevel: "Beginner",
      });

      const served = [...program.warmup, ...program.main, ...program.regulation];
      served.forEach((prescription) => {
        const full = EXERCISES.find((e) => e.exercise_id === prescription.exercise_id)!;
        const matches = full.contraindications.filter((c) => injuryFlags.some((flag) => c.toLowerCase().includes(flag.toLowerCase())));
        expect(matches, `"${full.name}" was served despite matching flags [${injuryFlags.join(", ")}]`).toEqual([]);
      });
    }
  });

  it("reports flagged exercises for informational display, but excludes them from the session", () => {
    const program = generateProgram({ readiness: 3, stress: 3, injuryFlags: ["knee"], equipmentAccess: ["None"], primaryGoal: "Consistency", experienceLevel: "Beginner" });
    expect(program.flaggedExercises.length).toBeGreaterThan(0);
    const servedIds = [...program.warmup, ...program.main, ...program.regulation].map((p) => p.exercise_id);
    program.flaggedExercises.forEach((f) => {
      expect(servedIds).not.toContain(f.exercise.exercise_id);
    });
  });

  it("adds a regulation finisher only when stress is logged high", () => {
    const lowStress = generateProgram({ readiness: 3, stress: 2, equipmentAccess: ["None"] });
    const highStress = generateProgram({ readiness: 3, stress: 5, equipmentAccess: ["None"] });
    expect(lowStress.regulation.length).toBe(0);
    expect(highStress.regulation.length).toBeGreaterThan(0);
  });
});

describe("getDetailedSession", () => {
  it("adapts generateProgram's output into a playable PlayerSession", () => {
    const session = getDetailedSession({ readiness: 3, stress: 3, equipmentAccess: ["None"], primaryGoal: "Consistency", experienceLevel: "Beginner" });
    expect(session.exercises.length).toBeGreaterThan(0);
    session.exercises.forEach((e) => {
      expect(e.movement.name).toBeTruthy();
      expect(Array.isArray(e.movement.cues)).toBe(true);
    });
  });

  it("never includes a flagged exercise in the adapted session", () => {
    const session = getDetailedSession({ readiness: 4, stress: 3, injuryFlags: ["knee"], equipmentAccess: ["None"], primaryGoal: "Consistency", experienceLevel: "Beginner" });
    session.exercises.forEach((e) => {
      expect(e.movement.contra.some((c) => c.toLowerCase().includes("knee"))).toBe(false);
    });
  });
});

describe("scoreExercise", () => {
  it("awards equipment, goal, and difficulty match points", () => {
    const goblet = EXERCISES.find((e) => e.exercise_id === "EX_GOBLET_SQUAT")!; // Bodyweight, Squat/Hinge, Beginner
    const { score, breakdown } = scoreExercise(goblet, { equipmentAccess: ["None"], primaryGoal: "Strength", experienceLevel: "Beginner", readiness: 3, stress: 3 });
    expect(breakdown.equipmentMatch).toBe(30);
    expect(breakdown.goalMatch).toBe(25); // Strength -> Squat/Hinge
    expect(breakdown.difficultyMatch).toBe(20);
    expect(score).toBeGreaterThanOrEqual(75);
  });

  it("penalizes high energy demand on a low-readiness day", () => {
    const squatJump = EXERCISES.find((e) => e.exercise_id === "EX_SQUAT_JUMP")!; // energy_demand: High
    const { breakdown } = scoreExercise(squatJump, { equipmentAccess: ["None"], readiness: 1, stress: 3 });
    expect(breakdown.energyPenalty).toBe(-15);
  });
});

describe("detectReadinessTrend", () => {
  it("distinguishes volatile from stable (unlike a naive first-vs-last check)", () => {
    const history: SessionHistoryEntry[] = [
      { date: "d1", readiness: 3, completed: true },
      { date: "d2", readiness: 5, completed: true },
      { date: "d3", readiness: 3, completed: true },
    ];
    expect(detectReadinessTrend(history)).toBe("volatile");
  });
});
