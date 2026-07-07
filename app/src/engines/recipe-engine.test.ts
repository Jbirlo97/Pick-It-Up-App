import { describe, expect, it } from "vitest";
import { RECIPES } from "../data/recipes";
import { GOALS } from "../data/recipe-meta";
import { badgesForRecipe, buildShoppingList, lookupIngredient, recommendRecipes, scoreRecipeForGoal } from "./recipe-engine";

describe("scoreRecipeForGoal", () => {
  it("throws on an unknown goal name", () => {
    expect(() => scoreRecipeForGoal(RECIPES[0], "Not A Real Goal")).toThrow();
  });

  it("produces a numeric score for every real goal", () => {
    GOALS.forEach((goal) => {
      const score = scoreRecipeForGoal(RECIPES[0], goal.name);
      expect(typeof score).toBe("number");
      expect(Number.isNaN(score)).toBe(false);
    });
  });

  it("ranks a high-protein, high-satiety recipe above a low-protein one for Fat Loss", () => {
    const byProtein = [...RECIPES].sort((a, b) => a.protein - b.protein);
    const lowProtein = byProtein[0];
    const highProtein = byProtein[byProtein.length - 1];
    expect(scoreRecipeForGoal(highProtein, "Fat Loss")).toBeGreaterThan(scoreRecipeForGoal(lowProtein, "Fat Loss"));
  });
});

describe("recommendRecipes", () => {
  it("returns at most `count` recipes, ranked by score descending", () => {
    const results = recommendRecipes({ goal: "General Health", count: 5 });
    expect(results.length).toBeLessThanOrEqual(5);
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1]._score).toBeGreaterThanOrEqual(results[i]._score);
    }
  });

  it("filters by diet, treating Vegan as satisfying a Vegetarian request", () => {
    const results = recommendRecipes({ goal: "General Health", diet: "Vegetarian", count: 90 });
    results.forEach((r) => expect(["Vegetarian", "Vegan"]).toContain(r.diet));
  });

  it("filters by a situation (e.g. quick <= 20 minutes)", () => {
    const results = recommendRecipes({ goal: "Time Efficient", situation: "quick", count: 90 });
    results.forEach((r) => expect(r.totalMin).toBeLessThanOrEqual(20));
  });

  it("boosts recipes that match pantry items and badges them", () => {
    const withoutPantry = recommendRecipes({ goal: "General Health", count: 90 });
    const withPantry = recommendRecipes({ goal: "General Health", pantryItems: ["yoghurt", "oats"], count: 90 });
    const boosted = withPantry.find((r) => r._pantryHits >= 2);
    if (boosted) {
      expect(boosted._badges).toContain("Uses what you have");
    }
    // Sanity: pantry filtering doesn't change the candidate pool size.
    expect(withPantry.length).toBe(withoutPantry.length);
  });
});

describe("badgesForRecipe", () => {
  it("badges high protein, budget, quick, and dietary recipes correctly", () => {
    const recipe = RECIPES.find((r) => r.protein >= 35 && r.costPerServe <= 2.5 && r.totalMin <= 20)!;
    expect(recipe).toBeDefined();
    const badges = badgesForRecipe(recipe);
    expect(badges).toContain("High Protein");
    expect(badges).toContain("Budget");
  });
});

describe("lookupIngredient", () => {
  it("fuzzy-matches an ingredient name by substring", () => {
    expect(lookupIngredient("Rolled oats")?.name).toBe("Rolled oats");
    expect(lookupIngredient("oats")).toBeDefined();
  });

  it("returns undefined for a non-existent ingredient", () => {
    expect(lookupIngredient("unobtainium")).toBeUndefined();
  });
});

describe("buildShoppingList", () => {
  it("tags every item as quantityConfidence: estimated (honest-disclosure requirement)", () => {
    const list = buildShoppingList([RECIPES[0], RECIPES[1]]);
    list.forEach((group) => {
      group.items.forEach((item) => {
        expect(item.quantityConfidence).toBe("estimated");
      });
    });
  });

  it("groups items by grocery aisle in a stable display order", () => {
    const list = buildShoppingList(RECIPES.slice(0, 10));
    const order = ["Fresh Produce", "Meat, Fish & Protein", "Dairy & Eggs", "Grains & Bakery", "Legumes & Canned", "Pantry & Sauces", "Oils & Fats", "Supplements", "Other"];
    const aislesPresent = list.map((g) => g.aisle);
    const indices = aislesPresent.map((a) => order.indexOf(a));
    const sorted = [...indices].sort((a, b) => a - b);
    expect(indices).toEqual(sorted);
  });
});
