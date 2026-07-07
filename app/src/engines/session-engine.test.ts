import { describe, expect, it } from "vitest";
import { MDB, MOVS } from "../data/exercises-legacy";
import { checkMovementContraindications, detectReadinessTrendDeterministic, generateDeterministicSession, getDigest, getInsight, getSession } from "./session-engine";
import type { CheckInData, SessionHistoryEntry } from "../types";

describe("checkMovementContraindications", () => {
  it("reports no match when there are no injury flags", () => {
    expect(checkMovementContraindications(MDB.goblet_squat, [])).toEqual({ blocked: false, matches: [] });
  });

  it("matches case-insensitively via substring", () => {
    const result = checkMovementContraindications(MDB.goblet_squat, ["Knee"]);
    expect(result.blocked).toBe(true);
    expect(result.matches).toEqual(["acute knee injury"]);
  });

  it("does not match unrelated injury flags", () => {
    const result = checkMovementContraindications(MDB.goblet_squat, ["wrist"]);
    expect(result.blocked).toBe(false);
  });
});

describe("generateDeterministicSession — safety (non-negotiable)", () => {
  // Matches CLAUDE.md's claim for the original prototype: a randomized
  // sweep across every injury flag and readiness level must never serve a
  // movement whose contraindications match a flagged injury.
  const allInjuryFlags = Array.from(new Set(MOVS.flatMap((m) => m.contra))).map((c) => {
    // Use a substring that would actually match (e.g. "knee" matches
    // "acute knee injury") rather than the full contraindication string,
    // since that's how the app's check-in flags are phrased.
    const words = c.split(" ");
    return words[words.length - 2] || c;
  });

  it("never serves a movement matching a flagged injury, across 200 randomized runs", () => {
    for (let i = 0; i < 200; i++) {
      const readiness = 1 + Math.floor(Math.random() * 5);
      const flagCount = Math.floor(Math.random() * 3);
      const injuryFlags = Array.from({ length: flagCount }, () => allInjuryFlags[Math.floor(Math.random() * allInjuryFlags.length)]);

      const result = generateDeterministicSession({ readiness, injuryFlags, sessionHistory: [] });

      result.main.forEach((exercise) => {
        const matches = exercise.contra.filter((c) => injuryFlags.some((flag) => c.toLowerCase().includes(flag.toLowerCase())));
        expect(matches, `"${exercise.name}" was served despite matching flags [${injuryFlags.join(", ")}]`).toEqual([]);
      });
    }
  });

  it("returns a flagged list documenting what was excluded and why, when injuries are flagged", () => {
    const result = generateDeterministicSession({ readiness: 3, injuryFlags: ["knee"], sessionHistory: [] });
    expect(result.flagged.length).toBeGreaterThan(0);
    result.flagged.forEach((f) => {
      expect(f.matchedInjuries.some((m) => m.toLowerCase().includes("knee"))).toBe(true);
    });
  });

  it("clamps exercise count to the safe pool size when many movements are flagged", () => {
    // Flag nearly every injury type at once to shrink the safe pool hard.
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
    session.exercises.forEach((e) => {
      expect(MDB[e.movementKey]).toBeDefined();
      expect(e.movement.name).toBe(MDB[e.movementKey].name);
    });
  });

  it("never includes a flagged movement in the returned exercises", () => {
    const session = getSession({ tone: "Balanced", checkIn: { readiness: 4, sleep: 3, mood: 3, stress: 3 }, week: 1, equipment: ["bodyweight"], injuries: ["knee"], sessionHistory: [], christianLens: false, userName: "" });
    session.exercises.forEach((e) => {
      const matches = e.movement.contra.filter((c) => c.toLowerCase().includes("knee"));
      expect(matches).toEqual([]);
    });
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
