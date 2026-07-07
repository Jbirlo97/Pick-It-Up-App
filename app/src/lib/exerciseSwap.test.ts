import { describe, expect, it } from "vitest";
import { MDB } from "../data/exercises-legacy";
import { getSwapOptions } from "./exerciseSwap";
import type { SessionExercise } from "../types";

function toSessionExercise(key: string): SessionExercise {
  return {
    movementKey: key,
    movement: MDB[key],
    sets: 3,
    reps: "10",
    rest: 60,
    coachNote: MDB[key].cues[0],
    phase: "main",
    estMinutes: 8,
  };
}

describe("getSwapOptions", () => {
  it("offers a full movement swap when regression/progression names a real library movement", () => {
    // hip_hinge's progression, "Single-leg RDL", is a real MDB entry.
    const options = getSwapOptions(toSessionExercise("hip_hinge"), []);
    const harder = options.find((o) => o.direction === "harder")!;
    expect(harder.label).toBe("Harder: Single-leg RDL");
    const applied = harder.apply(toSessionExercise("hip_hinge"));
    expect(applied.movement.name).toBe("Single-leg RDL");
    expect(applied.movementKey).toBe("sl_rdl");
  });

  it("never offers a swap target that matches a current injury flag", () => {
    // Single-leg RDL's contraindication is "acute ankle instability".
    const withoutFlag = getSwapOptions(toSessionExercise("hip_hinge"), []);
    expect(withoutFlag.some((o) => o.direction === "harder")).toBe(true);

    const withAnkleFlag = getSwapOptions(toSessionExercise("hip_hinge"), ["ankle"]);
    expect(withAnkleFlag.some((o) => o.direction === "harder")).toBe(false);
  });

  it("falls back to a rep/tempo note (not a fabricated movement swap) when the text isn't a real library entry", () => {
    // goblet_squat's regression, "Box squat", is descriptive text only.
    const options = getSwapOptions(toSessionExercise("goblet_squat"), []);
    const easier = options.find((o) => o.direction === "easier")!;
    expect(easier.label).toBe("Easier: Box squat");
    const original = toSessionExercise("goblet_squat");
    const applied = easier.apply(original);
    expect(applied.movement).toBe(original.movement); // unchanged — no fabricated cues/contraindications
    expect(applied.coachNote).toContain("Box squat");
  });
});
