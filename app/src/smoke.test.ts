import { describe, expect, it } from "vitest";
import { getInsight, getSession } from "./engines/session-engine";
import { recommendRecipes, buildShoppingList } from "./engines/recipe-engine";

// Basic smoke tests for the two main flows named explicitly in
// docs/launch-readiness-checklist.md Section 3.2: "check-in → session,
// goal → recipe recommendation." These chain real functions end-to-end
// with realistic input, rather than testing each in isolation.

describe("smoke: check-in -> session", () => {
  it("a full check-in produces an insight and a playable session consistent with it", () => {
    const checkIn = { readiness: 2, sleep: 2, mood: 3, stress: 3 };
    const insight = getInsight({ tone: "Balanced", checkIn, userName: "Josh" });
    expect(insight.pillar).toBeTruthy();
    expect(insight.movement).toBeTruthy();

    const session = getSession({
      tone: "Balanced",
      checkIn,
      week: 1,
      equipment: ["bodyweight"],
      injuries: [],
      sessionHistory: [],
      christianLens: false,
      userName: "Josh",
    });

    expect(session.exercises.length).toBeGreaterThan(0);
    expect(session.estimatedMinutes).toBeGreaterThan(0);
    // Low readiness (2) should produce a gentler, shorter session.
    expect(session.sessionTitle).toBe("Rest & Restore");
  });
});

describe("smoke: goal -> recipe recommendation -> shopping list", () => {
  it("a goal produces ranked recipes that can be turned into a shopping list", () => {
    const results = recommendRecipes({ goal: "Muscle Gain", diet: "Vegetarian", count: 6 });
    expect(results.length).toBeGreaterThan(0);

    const shoppingList = buildShoppingList(results.slice(0, 3));
    expect(shoppingList.length).toBeGreaterThan(0);
    shoppingList.forEach((group) => expect(group.items.length).toBeGreaterThan(0));
  });
});
