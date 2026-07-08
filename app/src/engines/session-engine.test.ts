import { describe, expect, it } from "vitest";
import { MDB, MOVS } from "../data/exercises-legacy";
import { INJURY_KEYS } from "../data/injuries";
import { checkMovementContraindications, detectReadinessTrendDeterministic, generateDeterministicSession, getDigest, getInsight, getSession } from "./session-engine";
import type { CheckInData, SessionHistoryEntry } from "../types";

describe("checkMovementContraindications", () => {
  it("reports no match when there are no injury flags", () => {
    expect(checkMovementContraindications(MDB.goblet_squat, [])).toEqual({ blocked: false, matches: [] });
  });

  it("matches on exact canonical key equality", () => {
    const result = checkMovementContraindications(MDB.goblet_squat, ["knee"]);
    expect(result.blocked).toBe(true);
    expect(result.matches).toEqual(["knee"]);
  });

  it("does not match unrelated injury flags", () => {
    const result = checkMovementContraindications(MDB.goblet_squat, ["wrist"]);
    expect(result.blocked).toBe(false);
  });

  // docs/trainer-review-findings.md §1: the exact bug this fixes. "lower
  // back" was never a substring of "acute low back pain", so this
  // real-world flag/contra pair silently never matched under the old
  // substring-matching implementation.
  it("regression: a 'low_back' flag matches a movement contraindicated for low_back (previously a silent no-op)", () => {
    const result = checkMovementContraindications(MDB.hip_hinge, ["low_back"]);
    expect(result.blocked).toBe(true);
  });
});

describe("generateDeterministicSession — safety (non-negotiable)", () => {
  // Real canonical flags — the exact vocabulary a user actually picks from
  // (data/injuries.ts / content.ts's INJURY_OPTIONS), not a substring
  // self-derived from contra text. Deriving test flags from the contra
  // strings themselves is precisely how the old suite's sweeps passed
  // vacuously: nothing matched a real flag -> nothing was ever excluded ->
  // "no violations found" looked like a pass.
  const allInjuryFlags = [...INJURY_KEYS];

  it("never serves a movement matching a flagged injury, across 200 randomized runs", () => {
    for (let i = 0; i < 200; i++) {
      const readiness = 1 + Math.floor(Math.random() * 5);
      const flagCount = Math.floor(Math.random() * 3);
      const injuryFlags = Array.from({ length: flagCount }, () => allInjuryFlags[Math.floor(Math.random() * allInjuryFlags.length)]);

      const result = generateDeterministicSession({ readiness, injuryFlags, sessionHistory: [] });

      result.main.forEach((exercise) => {
        const matches = exercise.contra.filter((c) => injuryFlags.includes(c));
        expect(matches, `"${exercise.name}" was served despite matching flags [${injuryFlags.join(", ")}]`).toEqual([]);
      });
    }
  });

  it("returns a flagged list documenting what was excluded and why, when injuries are flagged", () => {
    const result = generateDeterministicSession({ readiness: 3, injuryFlags: ["knee"], sessionHistory: [] });
    expect(result.flagged.length).toBeGreaterThan(0);
    result.flagged.forEach((f) => {
      expect(f.matchedInjuries).toContain("knee");
    });
  });

  // §7.2 — the exact regression case the findings call out: every movement
  // contraindicated for low_back (14+ of them, including Barbell Deadlift,
  // KB Swing, Barbell Back Squat, and Barbell Bent-Over Row) must never be
  // served to a user flagging low_back. Computed from live data, not a
  // hardcoded count, so it stays honest as the library grows.
  it("regression: a low_back flag excludes every low_back-contraindicated movement, across 100 randomized runs", () => {
    const backContraNames = MOVS.filter((m) => m.contra.includes("low_back")).map((m) => m.name);
    expect(backContraNames.length).toBeGreaterThanOrEqual(14);

    for (let i = 0; i < 100; i++) {
      const readiness = 1 + Math.floor(Math.random() * 5);
      const result = generateDeterministicSession({ readiness, injuryFlags: ["low_back"], sessionHistory: [] });
      [...result.warmup, ...result.main, ...result.cooldown].forEach((exercise) => {
        expect(backContraNames, `"${exercise.name}" was served while flagging low_back`).not.toContain(exercise.name);
      });
    }
  });

  // §7.3 — guards against a future vacuous pass: every one of the 10
  // canonical flags must actually exclude at least one movement, not just
  // "never serves anything wrong" (which trivially passes if nothing ever
  // matches, exactly how the old bug went undetected).
  it("excludes at least one movement for every one of the 10 canonical injury flags", () => {
    // Full equipment access — some contraindicated movements (e.g. the
    // elbow-flagged Pull-up/Chin-up/Cable Tricep Pushdown) require
    // equipment, so a bodyweight-only context could never reach them and
    // the flag would look vacuously "safe" for the wrong reason.
    INJURY_KEYS.forEach((key) => {
      const result = generateDeterministicSession({ readiness: 5, injuryFlags: [key], sessionHistory: [], trainingLocation: "commercial", equipment: [] });
      expect(result.flagged.length, `flag "${key}" excluded nothing — check MOVS has at least one movement contraindicated for it`).toBeGreaterThan(0);
    });
  });

  it("clamps exercise count to the safe pool size when many movements are flagged", () => {
    // Flag every injury type at once to shrink the safe pool hard.
    const result = generateDeterministicSession({ readiness: 5, injuryFlags: allInjuryFlags, sessionHistory: [] });
    expect(result.main.length).toBeLessThanOrEqual(5);
  });

  it("sizes sessions by readiness (low readiness -> fewer, easier exercises)", () => {
    const low = generateDeterministicSession({ readiness: 1, injuryFlags: [], sessionHistory: [] });
    const high = generateDeterministicSession({ readiness: 5, injuryFlags: [], sessionHistory: [] });
    expect(low.main.length).toBeLessThan(high.main.length);
    low.main.forEach((m) => expect(m.reps).toBe("easy, 10-12"));
  });

  it("trims volume on a declining trend", () => {
    const decliningHistory: SessionHistoryEntry[] = [
      { date: "d1", readiness: 5, completed: true },
      { date: "d2", readiness: 4, completed: true },
      { date: "d3", readiness: 3, completed: true },
    ];
    const result = generateDeterministicSession({ readiness: 4, injuryFlags: [], sessionHistory: decliningHistory });
    expect(result.trend).toBe("declining");
    expect(result.main.length).toBe(3); // 4 - 1 for declining trend
  });
});

// Per docs/session-structure-spec.md §1: sessions gained a warm-up and
// cool-down phase. The existing safety rule (never serve a contraindicated
// movement) has to hold for these new pools too, not just `main`.
describe("generateDeterministicSession — warm-up/cool-down (session-structure-spec.md §1)", () => {
  const allInjuryFlags = [...INJURY_KEYS];

  it("never serves a warm-up or cool-down movement matching a flagged injury, across 100 randomized runs", () => {
    for (let i = 0; i < 100; i++) {
      const readiness = 1 + Math.floor(Math.random() * 5);
      const flagCount = Math.floor(Math.random() * 3);
      const injuryFlags = Array.from({ length: flagCount }, () => allInjuryFlags[Math.floor(Math.random() * allInjuryFlags.length)]);

      const result = generateDeterministicSession({ readiness, injuryFlags, sessionHistory: [] });

      [...result.warmup, ...result.cooldown].forEach((exercise) => {
        const matches = exercise.contra.filter((c) => injuryFlags.includes(c));
        expect(matches, `"${exercise.name}" was served despite matching flags [${injuryFlags.join(", ")}]`).toEqual([]);
      });
    }
  });

  it("skips the cardio raise at low readiness, going straight to gentle mobility", () => {
    const results = Array.from({ length: 20 }, () => generateDeterministicSession({ readiness: 1, injuryFlags: [], sessionHistory: [] }));
    results.forEach((r) => {
      r.warmup.forEach((w) => expect(["Jump Rope", "Mountain Climber"]).not.toContain(w.name));
    });
  });
});

describe("generateDeterministicSession — equipment filtering", () => {
  // A bodyweight-only user must never be served a movement requiring
  // equipment they don't have — a functional safety concern (attempting an
  // exercise without the right equipment), not just a UX nicety.
  it("never serves an equipment-requiring movement to a bodyweight-only user, across 100 randomized runs", () => {
    for (let i = 0; i < 100; i++) {
      const readiness = 1 + Math.floor(Math.random() * 5);
      const result = generateDeterministicSession({ readiness, injuryFlags: [], sessionHistory: [], trainingLocation: "bodyweight", equipment: ["bodyweight"] });
      result.main.forEach((exercise) => {
        const mov = MOVS.find((m) => m.name === exercise.name)!;
        expect(mov.equipment, `"${exercise.name}" (equipment: ${mov.equipment}) was served to a bodyweight-only user`).toBe("Bodyweight");
      });
    }
  });

  it("serves dumbbell movements once the user has dumbbells at home", () => {
    const results = Array.from({ length: 30 }, () => generateDeterministicSession({ readiness: 5, injuryFlags: [], sessionHistory: [], trainingLocation: "home", equipment: ["dumbbells"] }));
    const sawDumbbellMovement = results.some((r) => r.main.some((e) => MOVS.find((m) => m.name === e.name)?.equipment === "Dumbbells"));
    expect(sawDumbbellMovement).toBe(true);
  });

  it("gives a commercial-gym user access to every equipment tag, not just movements literally tagged 'Commercial gym'", () => {
    // Regression test: an earlier version of this mapping short-circuited
    // commercial-gym users to equipmentAccess: ["Commercial gym"], which
    // matched nothing (no movement is tagged that) and meant they'd never
    // see any of the new equipment-based movements at all.
    const results = Array.from({ length: 40 }, () => generateDeterministicSession({ readiness: 5, injuryFlags: [], sessionHistory: [], trainingLocation: "commercial", equipment: [] }));
    const equipmentSeen = new Set(results.flatMap((r) => r.main.map((e) => MOVS.find((m) => m.name === e.name)?.equipment)));
    expect(equipmentSeen.size).toBeGreaterThan(1); // sees more than just Bodyweight
  });
});

describe("detectReadinessTrendDeterministic", () => {
  it("returns 'unknown' with fewer than 2 data points", () => {
    expect(detectReadinessTrendDeterministic([])).toBe("unknown");
    expect(detectReadinessTrendDeterministic([{ date: "d1", readiness: 3, completed: true }])).toBe("unknown");
  });

  it("detects a volatile (non-monotonic) trend, unlike a naive first-vs-last comparison", () => {
    const history: SessionHistoryEntry[] = [
      { date: "d1", readiness: 3, completed: true },
      { date: "d2", readiness: 5, completed: true },
      { date: "d3", readiness: 3, completed: true },
    ];
    // A naive first-vs-last check would call this "stable" (3 == 3).
    expect(detectReadinessTrendDeterministic(history)).toBe("volatile");
  });

  it("detects improving and declining trends", () => {
    expect(
      detectReadinessTrendDeterministic([
        { date: "d1", readiness: 2, completed: true },
        { date: "d2", readiness: 3, completed: true },
        { date: "d3", readiness: 4, completed: true },
      ])
    ).toBe("improving");
    expect(
      detectReadinessTrendDeterministic([
        { date: "d1", readiness: 4, completed: true },
        { date: "d2", readiness: 3, completed: true },
        { date: "d3", readiness: 2, completed: true },
      ])
    ).toBe("declining");
  });
});

describe("getInsight", () => {
  const baseCheckIn: CheckInData = { readiness: 3, sleep: 3, mood: 3, stress: 3 };

  it("selects Radical Responsibility when stress is high, regardless of other scores", () => {
    const insight = getInsight({ tone: "Balanced", checkIn: { ...baseCheckIn, stress: 5 } });
    expect(insight.pillar).toBe("Radical Responsibility");
  });

  it("selects The Trickle when readiness or sleep is low (and stress isn't high)", () => {
    const insight = getInsight({ tone: "Balanced", checkIn: { ...baseCheckIn, readiness: 1, stress: 2 } });
    expect(insight.pillar).toBe("The Trickle");
  });

  it("selects Thrownness when mood is low and readiness/sleep/stress are fine", () => {
    const insight = getInsight({ tone: "Balanced", checkIn: { ...baseCheckIn, mood: 1, stress: 2 } });
    expect(insight.pillar).toBe("Thrownness");
  });

  it("gives a gentle, rest-forward movement suggestion at readiness 1", () => {
    const insight = getInsight({ tone: "Balanced", checkIn: { ...baseCheckIn, readiness: 1 } });
    expect(insight.movement).toMatch(/rest/i);
  });

  it("branches message tone (Stoic vs Empathic differ on the same check-in)", () => {
    const stoic = getInsight({ tone: "Stoic", checkIn: { ...baseCheckIn, readiness: 1 } });
    const empathic = getInsight({ tone: "Empathic", checkIn: { ...baseCheckIn, readiness: 1 } });
    expect(stoic.message).not.toBe(empathic.message);
  });
});

describe("getSession", () => {
  it("wraps generateDeterministicSession into the Player shape with real movement lookups", () => {
    const session = getSession({ tone: "Balanced", checkIn: { readiness: 3, sleep: 3, mood: 3, stress: 3 }, week: 1, equipment: ["bodyweight"], injuries: [], sessionHistory: [], christianLens: false, userName: "Josh" });
    expect(session.exercises.length).toBeGreaterThan(0);
    // The closing cool-down item is a Regulate breath practice, not an MDB
    // movement (see docs/session-structure-spec.md §1) — every other
    // exercise resolves to a real MDB entry.
    session.exercises
      .filter((e) => !e.movementKey.startsWith("regulate_"))
      .forEach((e) => {
        expect(MDB[e.movementKey]).toBeDefined();
        expect(e.movement.name).toBe(MDB[e.movementKey].name);
      });
  });

  it("never includes a flagged movement in the returned exercises", () => {
    const session = getSession({ tone: "Balanced", checkIn: { readiness: 4, sleep: 3, mood: 3, stress: 3 }, week: 1, equipment: ["bodyweight"], injuries: ["knee"], sessionHistory: [], christianLens: false, userName: "" });
    session.exercises.forEach((e) => {
      expect(e.movement.contra).not.toContain("knee");
    });
  });

  it("always closes the cool-down with a Regulate breath practice", () => {
    const session = getSession({ tone: "Balanced", checkIn: { readiness: 3, sleep: 3, mood: 3, stress: 3 }, week: 1, equipment: ["bodyweight"], injuries: [], sessionHistory: [], christianLens: false, userName: "" });
    const cooldown = session.phases.cooldown;
    expect(cooldown.length).toBeGreaterThan(0);
    expect(cooldown[cooldown.length - 1].movement.name).toBe("Extended Exhale");
    expect(cooldown[cooldown.length - 1].phase).toBe("cooldown");
    // exercises is the flat backward-compatible list — phases partition it exactly.
    expect(session.exercises.length).toBe(session.phases.warmup.length + session.phases.main.length + session.phases.cooldown.length);
  });
});

describe("getDigest", () => {
  it("returns an encouraging headline even with zero completed sessions", () => {
    const digest = getDigest({ sessionHistory: [], week: 1, tone: "Balanced" });
    expect(digest.headline).toBeTruthy();
    expect(digest.body).toBeTruthy();
  });

  it("reflects a full week of completed sessions in the headline", () => {
    const history: SessionHistoryEntry[] = [
      { date: "d1", readiness: 4, completed: true },
      { date: "d2", readiness: 4, completed: true },
      { date: "d3", readiness: 4, completed: true },
    ];
    const digest = getDigest({ sessionHistory: history, week: 2, tone: "Balanced" });
    expect(digest.headline).toBe("You showed up this week.");
  });
});
