import { RECIPES, INGREDIENTS, type Recipe, type Ingredient } from "../data/recipes";
import { GOALS, SITUATION_FILTERS } from "../data/recipe-meta";

// Scoring is fully deterministic (no AI/LLM call) by design — predictable,
// auditable recommendations matter for a counselling-led health product.
// See docs/integration-spec.md Section 3a for the additive Discover-tab plan.

function normalizeComponent(key: keyof Recipe["scores"], recipe: Recipe): number {
  const raw = recipe.scores[key];
  if (raw === undefined) return 0;
  if (key === "proteinDensity") return Math.min(100, raw * 10);
  if (key === "proteinPerDollar") return Math.min(100, raw * 5);
  if (key === "caloriesPerDollar") return Math.min(100, raw / 3);
  return raw;
}

export function scoreRecipeForGoal(recipe: Recipe, goalName: string): number {
  const goal = GOALS.find((g) => g.name === goalName);
  if (!goal) throw new Error(`Unknown goal: ${goalName}`);
  const w = goal.weights;
  let score = 0;
  score += normalizeComponent("proteinDensity", recipe) * w.proteinDensity;
  score += recipe.scores.satiety * w.satiety;
  score += recipe.scores.nutrientDensity * w.nutrientDensity;
  score += recipe.scores.affordability * w.affordability;
  score += recipe.scores.simplicity * w.simplicity;
  score += recipe.scores.mealPrep * w.mealPrep;
  score += recipe.scores.calories * w.calories;
  score += recipe.scores.fibre * w.fibre;
  return Math.round(score * 10) / 10;
}

function pantryMatchCount(recipe: Recipe, pantryItems?: string[]): number {
  if (!pantryItems || pantryItems.length === 0) return 0;
  const pattern = recipe.ingredientPattern.toLowerCase();
  return pantryItems.filter((item) => pattern.includes(item.toLowerCase())).length;
}

export function badgesForRecipe(recipe: Recipe): string[] {
  const badges: string[] = [];
  if (recipe.protein >= 35) badges.push("High Protein");
  if (recipe.costPerServe <= 2.5) badges.push("Budget");
  if (recipe.totalMin <= 20) badges.push(`${recipe.totalMin} min`);
  if (recipe.scores.mealPrep >= 80) badges.push("Meal Prep");
  if (recipe.fibre >= 10) badges.push("High Fibre");
  if (recipe.diet === "Vegan" || recipe.diet === "Vegetarian") badges.push(recipe.diet);
  return badges;
}

export interface RecommendRecipesParams {
  goal: string;
  situation?: string | null;
  diet?: string | null;
  maxCostPerServe?: number;
  maxTotalMin?: number;
  minProtein?: number;
  pantryItems?: string[];
  count?: number;
}

export interface ScoredRecipe extends Recipe {
  _score: number;
  _badges: string[];
  _pantryHits: number;
}

export function recommendRecipes({
  goal,
  situation,
  diet,
  maxCostPerServe,
  maxTotalMin,
  minProtein,
  pantryItems,
  count = 6,
}: RecommendRecipesParams): ScoredRecipe[] {
  let pool = RECIPES.slice();

  if (diet) pool = pool.filter((r) => r.diet === diet || (diet === "Vegetarian" && r.diet === "Vegan"));
  if (maxCostPerServe) pool = pool.filter((r) => r.costPerServe <= maxCostPerServe);
  if (maxTotalMin) pool = pool.filter((r) => r.totalMin <= maxTotalMin);
  if (minProtein) pool = pool.filter((r) => r.protein >= minProtein);
  if (situation && SITUATION_FILTERS[situation]) pool = pool.filter(SITUATION_FILTERS[situation].test);

  const scored: ScoredRecipe[] = pool.map((r) => {
    const pantryHits = pantryMatchCount(r, pantryItems);
    const baseScore = scoreRecipeForGoal(r, goal);
    const pantryBoost = pantryItems && pantryItems.length ? Math.min(8, pantryHits * 3) : 0;
    const badges = badgesForRecipe(r);
    if (pantryHits >= 2) badges.unshift("Uses what you have");
    return {
      ...r,
      _score: Math.round((baseScore + pantryBoost) * 10) / 10,
      _badges: badges,
      _pantryHits: pantryHits,
    };
  });

  scored.sort((a, b) => b._score - a._score);
  return scored.slice(0, count);
}

const AISLE_LABELS: Record<string, string> = {
  Vegetable: "Fresh Produce",
  Fruit: "Fresh Produce",
  "Starchy veg": "Fresh Produce",
  Protein: "Meat, Fish & Protein",
  Dairy: "Dairy & Eggs",
  Grain: "Grains & Bakery",
  Legume: "Legumes & Canned",
  "Legume/fat": "Legumes & Canned",
  Pantry: "Pantry & Sauces",
  Fat: "Oils & Fats",
  "Fat/protein": "Oils & Fats",
  Supplement: "Supplements",
  Minerals: "Pantry & Sauces",
};

export interface ShoppingListItem {
  label: string;
  recipes: string[];
  matchedIngredient: string | null;
  unit: string | null;
  estCostPerUnit: number | null;
  aisle: string;
  quantityConfidence: "estimated";
}

export interface ShoppingListGroup {
  aisle: string;
  items: ShoppingListItem[];
}

export function lookupIngredient(name: string): Ingredient | undefined {
  const n = name.toLowerCase();
  return INGREDIENTS.find((i) => n.includes(i.name.toLowerCase()) || i.name.toLowerCase().includes(n));
}

// HONEST LIMITATION: there is no per-recipe ingredient-quantity table, only
// a free-text ingredientPattern. Every returned item is tagged
// quantityConfidence: "estimated" so the UI can disclose this (e.g. "~"
// prefix) rather than presenting it as exact (integration-spec.md 3c.5).
export function buildShoppingList(selectedRecipes: Recipe[]): ShoppingListGroup[] {
  const items: Record<string, ShoppingListItem> = {};
  selectedRecipes.forEach((r) => {
    const parts = r.ingredientPattern
      .split(/[+,]/)
      .map((s) => s.trim())
      .filter(Boolean);
    parts.forEach((p) => {
      const key = p.toLowerCase();
      const matched = lookupIngredient(p);
      if (!items[key]) {
        items[key] = {
          label: p,
          recipes: [],
          matchedIngredient: matched ? matched.name : null,
          unit: matched ? matched.unit : null,
          estCostPerUnit: matched ? matched.costPerUnit : null,
          aisle: matched ? AISLE_LABELS[matched.category] || "Pantry & Sauces" : "Other",
          quantityConfidence: "estimated",
        };
      }
      items[key].recipes.push(r.name);
    });
  });

  const grouped: Record<string, ShoppingListItem[]> = {};
  Object.values(items).forEach((item) => {
    if (!grouped[item.aisle]) grouped[item.aisle] = [];
    grouped[item.aisle].push(item);
  });

  const aisleDisplayOrder = [
    "Fresh Produce",
    "Meat, Fish & Protein",
    "Dairy & Eggs",
    "Grains & Bakery",
    "Legumes & Canned",
    "Pantry & Sauces",
    "Oils & Fats",
    "Supplements",
    "Other",
  ];
  return aisleDisplayOrder.filter((aisle) => grouped[aisle]).map((aisle) => ({ aisle, items: grouped[aisle] }));
}
