import type { Recipe } from "./recipes";

export interface GoalWeights {
  proteinDensity: number;
  satiety: number;
  nutrientDensity: number;
  affordability: number;
  simplicity: number;
  mealPrep: number;
  calories: number;
  fibre: number;
}

export interface RecipeGoal {
  name: string;
  weights: GoalWeights;
  logic: string;
}

export const GOALS: RecipeGoal[] = [
  { name: "Fat Loss", weights: { proteinDensity: 0.3, satiety: 0.35, nutrientDensity: 0.2, affordability: 0.05, simplicity: 0.05, mealPrep: 0.05, calories: 0.0, fibre: 0.0 }, logic: "High satiety, high protein per calorie, lower calorie density." },
  { name: "Muscle Gain", weights: { proteinDensity: 0.3, satiety: 0.1, nutrientDensity: 0.1, affordability: 0.1, simplicity: 0.05, mealPrep: 0.15, calories: 0.15, fibre: 0.05 }, logic: "Protein, sufficient calories, meal-prep practicality and value." },
  { name: "General Health", weights: { proteinDensity: 0.18, satiety: 0.15, nutrientDensity: 0.32, affordability: 0.1, simplicity: 0.05, mealPrep: 0.05, calories: 0.0, fibre: 0.15 }, logic: "Nutrient density, fibre, variety, and adequate protein." },
  { name: "Budget Friendly", weights: { proteinDensity: 0.18, satiety: 0.1, nutrientDensity: 0.17, affordability: 0.35, simplicity: 0.12, mealPrep: 0.08, calories: 0.0, fibre: 0.0 }, logic: "Lowest cost per serve and protein/nutrients per dollar." },
  { name: "Time Efficient", weights: { proteinDensity: 0.16, satiety: 0.12, nutrientDensity: 0.14, affordability: 0.08, simplicity: 0.32, mealPrep: 0.18, calories: 0.0, fibre: 0.0 }, logic: "Fast prep, simple method, batch-friendly when possible." },
  { name: "Family Friendly", weights: { proteinDensity: 0.18, satiety: 0.14, nutrientDensity: 0.16, affordability: 0.12, simplicity: 0.18, mealPrep: 0.12, calories: 0.05, fibre: 0.05 }, logic: "Familiar flavours, simple prep, balanced nutrition, affordable." },
  { name: "Vegetarian / Plant-Based", weights: { proteinDensity: 0.22, satiety: 0.18, nutrientDensity: 0.25, affordability: 0.15, simplicity: 0.08, mealPrep: 0.07, calories: 0.0, fibre: 0.05 }, logic: "Plant-based protein adequacy, fibre, nutrients, and affordability." },
  { name: "Endurance / Active", weights: { proteinDensity: 0.18, satiety: 0.12, nutrientDensity: 0.18, affordability: 0.08, simplicity: 0.08, mealPrep: 0.12, calories: 0.16, fibre: 0.08 }, logic: "Carbohydrate/fuel support, recovery protein, nutrients, and prep." },
];

export interface Archetype {
  name: string;
  formula: string;
  bestGoals: string[];
  uxLabel: string;
}

export const ARCHETYPES: Archetype[] = [
  { name: "Burrito Bowl", formula: "Protein + rice/beans + salsa + veg + yoghurt/cheese", bestGoals: ["Fat Loss", "Muscle Gain", "Family Friendly", "Meal Prep"], uxLabel: "Reliable high-protein bowl" },
  { name: "Curry Bowl", formula: "Protein/legume + curry sauce + rice + veg", bestGoals: ["Budget Friendly", "Family Friendly", "Meal Prep", "Muscle Gain"], uxLabel: "Comforting curry night" },
  { name: "Stir Fry", formula: "Protein + mixed vegetables + rice/noodles + sauce", bestGoals: ["Time Efficient", "General Health", "Muscle Gain"], uxLabel: "Fast balanced dinner" },
  { name: "Protein Pasta", formula: "Protein + pasta + veg + tomato/cream sauce", bestGoals: ["Family Friendly", "Muscle Gain"], uxLabel: "Macro-friendly comfort pasta" },
  { name: "Tray Bake", formula: "Protein + starchy veg + non-starchy veg + seasoning", bestGoals: ["Family Friendly", "Time Efficient", "General Health"], uxLabel: "One-pan dinner" },
  { name: "Chilli", formula: "Lean mince/beans + tomato + spices + rice/potato", bestGoals: ["Budget Friendly", "Meal Prep", "Fat Loss"], uxLabel: "Batch-cook staple" },
  { name: "Loaded Potato", formula: "Potato + protein topping + yoghurt/cheese + salad", bestGoals: ["Budget Friendly", "Family Friendly"], uxLabel: "Filling budget meal" },
  { name: "Greek Yoghurt Bowl", formula: "Greek yoghurt + fruit + oats/seeds + protein optional", bestGoals: ["Fat Loss", "Time Efficient", "General Health"], uxLabel: "3-minute high-protein breakfast" },
  { name: "Overnight Oats", formula: "Oats + milk/yoghurt + fruit + optional protein", bestGoals: ["Budget Friendly", "Meal Prep", "Time Efficient"], uxLabel: "Breakfast made ahead" },
  { name: "Wrap / Taco", formula: "Protein + wrap/taco + salad + sauce", bestGoals: ["Family Friendly", "Time Efficient"], uxLabel: "Quick handheld meal" },
  { name: "Soup / Stew", formula: "Protein/legume + broth/tomato + vegetables", bestGoals: ["Fat Loss", "Budget Friendly", "Meal Prep"], uxLabel: "Warm filling meal" },
  { name: "Fried Rice", formula: "Protein + rice + egg/veg + soy-style sauce", bestGoals: ["Budget Friendly", "Family Friendly", "Time Efficient"], uxLabel: "Leftover-friendly dinner" },
  { name: "Burger / Fakeaway Bowl", formula: "Lean protein + potato/rice + salad + sauce", bestGoals: ["Family Friendly", "Fat Loss"], uxLabel: "Takeaway feel, better fit" },
  { name: "Omelette / Egg Bowl", formula: "Eggs + veg + potato/toast + dairy optional", bestGoals: ["Budget Friendly", "Fat Loss", "Time Efficient"], uxLabel: "Cheap protein breakfast" },
];

export interface SituationFilter {
  label: string;
  test: (r: Recipe) => boolean;
}

export const SITUATION_FILTERS: Record<string, SituationFilter> = {
  quick: { label: "I only have 10-20 minutes", test: (r) => r.totalMin <= 20 },
  comfort: { label: "I want comfort food", test: (r) => ["Burger / Fakeaway Bowl", "Protein Pasta", "Curry Bowl"].some((a) => r.ingredientPattern.startsWith(a)) },
  workLunches: { label: "I need work lunches", test: (r) => r.scores.mealPrep >= 70 },
  lowEffort: { label: "I want low effort", test: (r) => r.totalMin <= 30 && r.prepMin <= 15 },
};
