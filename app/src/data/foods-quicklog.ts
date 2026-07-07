export interface QuickLogFood {
  name: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

// FOODS — quick-log autocomplete entries for Nourish's Log tab. Distinct
// from the recipe engine's RECIPES (integration-spec.md Section 2d):
// answers "what did I just eat," not "what should I cook."
export const FOODS: QuickLogFood[] = [
  { name: "Chicken breast, grilled (150g)", kcal: 248, protein: 46, carbs: 0, fat: 5 },
  { name: "Eggs, 2 large", kcal: 156, protein: 13, carbs: 1, fat: 11 },
  { name: "Greek yogurt, plain (200g)", kcal: 146, protein: 20, carbs: 8, fat: 4 },
  { name: "Oats, dry (60g)", kcal: 230, protein: 8, carbs: 39, fat: 4 },
  { name: "White rice, cooked (200g)", kcal: 260, protein: 5, carbs: 56, fat: 1 },
  { name: "Brown rice, cooked (200g)", kcal: 248, protein: 5, carbs: 52, fat: 2 },
  { name: "Sweet potato, baked (200g)", kcal: 180, protein: 4, carbs: 41, fat: 0 },
  { name: "Salmon fillet (150g)", kcal: 312, protein: 34, carbs: 0, fat: 19 },
  { name: "Banana, 1 medium", kcal: 105, protein: 1, carbs: 27, fat: 0 },
  { name: "Apple, 1 medium", kcal: 95, protein: 0, carbs: 25, fat: 0 },
  { name: "Almonds (30g)", kcal: 174, protein: 6, carbs: 6, fat: 15 },
  { name: "Peanut butter (2 tbsp)", kcal: 188, protein: 8, carbs: 6, fat: 16 },
  { name: "Avocado, half", kcal: 120, protein: 1, carbs: 6, fat: 11 },
  { name: "Whole wheat bread, 2 slices", kcal: 160, protein: 8, carbs: 28, fat: 2 },
  { name: "Steak, lean (150g)", kcal: 330, protein: 42, carbs: 0, fat: 17 },
  { name: "Tofu, firm (150g)", kcal: 144, protein: 16, carbs: 3, fat: 9 },
  { name: "Lentils, cooked (200g)", kcal: 230, protein: 18, carbs: 40, fat: 1 },
  { name: "Broccoli, steamed (150g)", kcal: 51, protein: 4, carbs: 10, fat: 1 },
  { name: "Mixed salad with olive oil", kcal: 180, protein: 3, carbs: 10, fat: 15 },
  { name: "Protein shake, whey (1 scoop)", kcal: 120, protein: 24, carbs: 3, fat: 1 },
  { name: "Pasta, cooked (200g)", kcal: 280, protein: 10, carbs: 56, fat: 2 },
  { name: "Cottage cheese (150g)", kcal: 130, protein: 18, carbs: 5, fat: 4 },
  { name: "Tuna, canned in water (1 can)", kcal: 130, protein: 29, carbs: 0, fat: 1 },
  { name: "Quinoa, cooked (200g)", kcal: 240, protein: 9, carbs: 43, fat: 4 },
  { name: "Milk, full cream (250ml)", kcal: 150, protein: 8, carbs: 12, fat: 8 },
  { name: "Cheese, cheddar (30g)", kcal: 120, protein: 7, carbs: 0, fat: 10 },
  { name: "Protein bar, 1", kcal: 220, protein: 20, carbs: 22, fat: 8 },
  { name: "Hamburger, fast food", kcal: 540, protein: 25, carbs: 45, fat: 29 },
  { name: "Pizza, 2 slices", kcal: 570, protein: 24, carbs: 66, fat: 22 },
  { name: "Coffee with milk", kcal: 40, protein: 2, carbs: 4, fat: 2 },
  { name: "Beer, 1 can", kcal: 154, protein: 1, carbs: 13, fat: 0 },
  { name: "Wine, 1 glass", kcal: 125, protein: 0, carbs: 4, fat: 0 },
  { name: "Chocolate bar, 1 standard", kcal: 230, protein: 3, carbs: 26, fat: 13 },
  { name: "Mixed nuts (30g)", kcal: 180, protein: 5, carbs: 6, fat: 16 },
  { name: "Smoothie, fruit (300ml)", kcal: 200, protein: 3, carbs: 45, fat: 1 },
  { name: "Stir fry, chicken and veg", kcal: 380, protein: 32, carbs: 30, fat: 14 },
  { name: "Burrito, chicken", kcal: 520, protein: 28, carbs: 58, fat: 19 },
  { name: "Porridge with berries", kcal: 290, protein: 9, carbs: 50, fat: 6 },
];
