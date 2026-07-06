/**
 * Pick It Up — Recipe Recommendation Engine
 * ============================================
 * Source: recipe_intelligence_database_expanded.xlsx (90 recipes, goal-weighted scoring)
 *
 * This module is data + pure logic only — no UI, no framework dependency.
 * Designed to be dropped into a backend service (API route, serverless function,
 * or server-side service layer) and called from the Recipe UI artifact.
 *
 * Architecture notes for implementation:
 * - RECIPES and INGREDIENTS are static reference data. In production these belong
 *   in a real database table (Postgres/Supabase) so they can be edited without a
 *   redeploy — this module ships them as JS constants for portability during the
 *   prototype phase.
 * - Scoring is fully deterministic (no AI/LLM call) by design, per the source
 *   workbook's intent: "Hidden nutrition intelligence... Display 'Great for your
 *   goal' instead of numeric scores." Keep the scoring engine deterministic and
 *   keep any AI usage (if added later) to copy/explanation layers only, not the
 *   ranking itself — predictable, auditable recommendations matter for a
 *   counselling-led health product.
 * - All weights sum to 1.0 per goal (see GOALS). If you add new goals or new
 *   score components, re-balance weights so they still sum to 1.0.
 *
 * NUTRITION DATA PROVENANCE — read before treating macros as authoritative:
 * Calorie/macro values in RECIPES and INGREDIENTS below are estimates from
 * the source workbook, not yet verified against an official Australian food
 * composition database. For a counselling-led health product, this matters —
 * leading AU dietitian-facing nutrition software anchors on AUSNUT/FSANZ
 * (Australian Food Composition Database, Food Standards Australia New
 * Zealand) rather than generic estimates, because it's the dataset
 * Australian dietitians and the Eat for Health guidelines are built on.
 * Before this goes live with real users, recommend a pass that either:
 *   (a) re-derives INGREDIENTS macro values from AUSNUT/FSANZ
 *       (https://www.foodstandards.gov.au/science/monitoringnutrients/afcd),
 *       or
 *   (b) at minimum, adds a `nutritionSource: "estimated"` flag per recipe so
 *       the UI can disclose this honestly rather than implying clinical-grade
 *       precision it doesn't have yet.
 * Each RECIPES entry below has been given `nutritionSource: "estimated"` to
 * make this explicit and queryable rather than silent.
 */

export const RECIPES = [
  {
    "id": "R001",
    "name": "High-Protein Overnight Oats",
    "category": "Breakfast",
    "diet": "Vegetarian",
    "goalTags": [
      "Fat Loss",
      "Muscle Gain",
      "Time Efficient"
    ],
    "servings": 1,
    "prepMin": 5,
    "cookMin": 0,
    "totalMin": 5,
    "costPerServe": 2.2,
    "calories": 430,
    "protein": 38,
    "carbs": 48,
    "fat": 11,
    "fibre": 9,
    "scores": {
      "proteinDensity": 8.8,
      "proteinPerDollar": 17.3,
      "caloriesPerDollar": 195.5,
      "satiety": 88.0,
      "nutrientDensity": 82.0,
      "affordability": 83.0,
      "simplicity": 98.75,
      "mealPrep": 85.0,
      "calories": 86.0,
      "fibre": 60.000299999999996
    },
    "ingredientPattern": "Mix oats, yoghurt, milk/protein, fruit; refrigerate overnight.",
    "method": "Adjust milk for texture.",
    "notes": "",
    "nutritionSource": "estimated"
  },
  {
    "id": "R002",
    "name": "Greek Yoghurt Berry Bowl",
    "category": "Breakfast",
    "diet": "Vegetarian",
    "goalTags": [
      "Fat Loss",
      "General Health",
      "Time Efficient"
    ],
    "servings": 1,
    "prepMin": 3,
    "cookMin": 0,
    "totalMin": 3,
    "costPerServe": 2.4,
    "calories": 300,
    "protein": 32,
    "carbs": 32,
    "fat": 5,
    "fibre": 8,
    "scores": {
      "proteinDensity": 10.7,
      "proteinPerDollar": 13.3,
      "caloriesPerDollar": 125.0,
      "satiety": 85.0,
      "nutrientDensity": 86.0,
      "affordability": 81.0,
      "simplicity": 100.0,
      "mealPrep": 60.0,
      "calories": 60.0,
      "fibre": 53.3336
    },
    "ingredientPattern": "Assemble yoghurt, berries, oats or seeds.",
    "method": "Fast snack/breakfast.",
    "notes": "",
    "nutritionSource": "estimated"
  },
  {
    "id": "R003",
    "name": "Egg & Veg Breakfast Wrap",
    "category": "Breakfast",
    "diet": "Omnivore",
    "goalTags": [
      "Muscle Gain",
      "Family Friendly"
    ],
    "servings": 1,
    "prepMin": 8,
    "cookMin": 8,
    "totalMin": 16,
    "costPerServe": 2.7,
    "calories": 430,
    "protein": 28,
    "carbs": 38,
    "fat": 18,
    "fibre": 6,
    "scores": {
      "proteinDensity": 6.5,
      "proteinPerDollar": 10.4,
      "caloriesPerDollar": 159.3,
      "satiety": 78.0,
      "nutrientDensity": 75.0,
      "affordability": 78.0,
      "simplicity": 85.0,
      "mealPrep": 50.0,
      "calories": 86.0,
      "fibre": 40.0002
    },
    "ingredientPattern": "Scramble eggs with veg; wrap with salsa.",
    "method": "Good portable meal.",
    "notes": "",
    "nutritionSource": "estimated"
  },
  {
    "id": "R004",
    "name": "Cottage Cheese Protein Pancakes",
    "category": "Breakfast",
    "diet": "Vegetarian",
    "goalTags": [
      "Muscle Gain",
      "Family Friendly"
    ],
    "servings": 2,
    "prepMin": 10,
    "cookMin": 10,
    "totalMin": 20,
    "costPerServe": 2.3,
    "calories": 390,
    "protein": 31,
    "carbs": 42,
    "fat": 10,
    "fibre": 5,
    "scores": {
      "proteinDensity": 7.9,
      "proteinPerDollar": 13.5,
      "caloriesPerDollar": 169.6,
      "satiety": 76.0,
      "nutrientDensity": 73.0,
      "affordability": 82.0,
      "simplicity": 80.0,
      "mealPrep": 45.0,
      "calories": 78.0,
      "fibre": 33.3335
    },
    "ingredientPattern": "Blend batter; cook pancakes.",
    "method": "Batch batter or pancakes.",
    "notes": "",
    "nutritionSource": "estimated"
  },
  {
    "id": "R005",
    "name": "Chicken Burrito Bowl",
    "category": "Lunch",
    "diet": "Omnivore",
    "goalTags": [
      "Muscle Gain",
      "Family Friendly"
    ],
    "servings": 4,
    "prepMin": 15,
    "cookMin": 20,
    "totalMin": 35,
    "costPerServe": 4.1,
    "calories": 590,
    "protein": 47,
    "carbs": 68,
    "fat": 14,
    "fibre": 9,
    "scores": {
      "proteinDensity": 8.0,
      "proteinPerDollar": 11.5,
      "caloriesPerDollar": 143.9,
      "satiety": 86.0,
      "nutrientDensity": 82.0,
      "affordability": 64.0,
      "simplicity": 61.25,
      "mealPrep": 92.0,
      "calories": 82.0,
      "fibre": 60.000299999999996
    },
    "ingredientPattern": "Cook rice/chicken; assemble with beans, veg and salsa.",
    "method": "Scales well.",
    "notes": "",
    "nutritionSource": "estimated"
  },
  {
    "id": "R006",
    "name": "Tuna Pasta Salad",
    "category": "Lunch",
    "diet": "Pescatarian",
    "goalTags": [
      "Muscle Gain",
      "Budget Friendly",
      "Time Efficient"
    ],
    "servings": 2,
    "prepMin": 10,
    "cookMin": 10,
    "totalMin": 20,
    "costPerServe": 2.5,
    "calories": 520,
    "protein": 39,
    "carbs": 70,
    "fat": 9,
    "fibre": 7,
    "scores": {
      "proteinDensity": 7.5,
      "proteinPerDollar": 15.6,
      "caloriesPerDollar": 208.0,
      "satiety": 79.0,
      "nutrientDensity": 72.0,
      "affordability": 80.0,
      "simplicity": 80.0,
      "mealPrep": 70.0,
      "calories": 96.0,
      "fibre": 46.6669
    },
    "ingredientPattern": "Cook pasta; mix tuna, veg and dressing.",
    "method": "Use Greek yoghurt instead of mayo.",
    "notes": "",
    "nutritionSource": "estimated"
  },
  {
    "id": "R007",
    "name": "Lentil Chilli",
    "category": "Dinner",
    "diet": "Vegan",
    "goalTags": [
      "Fat Loss",
      "Budget Friendly",
      "Vegetarian / Plant-Based"
    ],
    "servings": 6,
    "prepMin": 15,
    "cookMin": 35,
    "totalMin": 50,
    "costPerServe": 1.8,
    "calories": 410,
    "protein": 24,
    "carbs": 66,
    "fat": 6,
    "fibre": 17,
    "scores": {
      "proteinDensity": 5.9,
      "proteinPerDollar": 13.3,
      "caloriesPerDollar": 227.8,
      "satiety": 92.0,
      "nutrientDensity": 90.0,
      "affordability": 87.0,
      "simplicity": 42.5,
      "mealPrep": 95.0,
      "calories": 82.0,
      "fibre": 100.0
    },
    "ingredientPattern": "Simmer lentils, beans, tomatoes and spices.",
    "method": "Excellent freezer meal.",
    "notes": "",
    "nutritionSource": "estimated"
  },
  {
    "id": "R008",
    "name": "Lean Beef & Veg Bolognese",
    "category": "Dinner",
    "diet": "Omnivore",
    "goalTags": [
      "General Health",
      "Family Friendly"
    ],
    "servings": 6,
    "prepMin": 15,
    "cookMin": 40,
    "totalMin": 55,
    "costPerServe": 3.2,
    "calories": 520,
    "protein": 38,
    "carbs": 60,
    "fat": 14,
    "fibre": 9,
    "scores": {
      "proteinDensity": 7.3,
      "proteinPerDollar": 11.9,
      "caloriesPerDollar": 162.5,
      "satiety": 82.0,
      "nutrientDensity": 78.0,
      "affordability": 73.0,
      "simplicity": 36.25,
      "mealPrep": 95.0,
      "calories": 96.0,
      "fibre": 60.000299999999996
    },
    "ingredientPattern": "Cook mince/veg/tomato sauce; serve with pasta.",
    "method": "Add mushrooms/carrot for volume.",
    "notes": "",
    "nutritionSource": "estimated"
  },
  {
    "id": "R009",
    "name": "Tofu Stir Fry Rice Bowl",
    "category": "Dinner",
    "diet": "Vegan",
    "goalTags": [
      "General Health",
      "Time Efficient",
      "Vegetarian / Plant-Based"
    ],
    "servings": 3,
    "prepMin": 15,
    "cookMin": 15,
    "totalMin": 30,
    "costPerServe": 3.2,
    "calories": 500,
    "protein": 25,
    "carbs": 66,
    "fat": 16,
    "fibre": 9,
    "scores": {
      "proteinDensity": 5.0,
      "proteinPerDollar": 7.8,
      "caloriesPerDollar": 156.2,
      "satiety": 80.0,
      "nutrientDensity": 86.0,
      "affordability": 73.0,
      "simplicity": 67.5,
      "mealPrep": 65.0,
      "calories": 100.0,
      "fibre": 60.000299999999996
    },
    "ingredientPattern": "Pan-fry tofu; stir-fry veg; serve with rice.",
    "method": "Use edamame to boost protein.",
    "notes": "",
    "nutritionSource": "estimated"
  },
  {
    "id": "R010",
    "name": "Chicken & Frozen Veg Stir Fry",
    "category": "Dinner",
    "diet": "Omnivore",
    "goalTags": [
      "Fat Loss",
      "Muscle Gain",
      "Time Efficient"
    ],
    "servings": 4,
    "prepMin": 10,
    "cookMin": 15,
    "totalMin": 25,
    "costPerServe": 3.5,
    "calories": 450,
    "protein": 42,
    "carbs": 43,
    "fat": 10,
    "fibre": 7,
    "scores": {
      "proteinDensity": 9.3,
      "proteinPerDollar": 12.0,
      "caloriesPerDollar": 128.6,
      "satiety": 84.0,
      "nutrientDensity": 80.0,
      "affordability": 70.0,
      "simplicity": 73.75,
      "mealPrep": 65.0,
      "calories": 90.0,
      "fibre": 46.6669
    },
    "ingredientPattern": "Cook chicken, veg and sauce; serve over rice.",
    "method": "Low waste.",
    "notes": "",
    "nutritionSource": "estimated"
  },
  {
    "id": "R011",
    "name": "Chickpea Coconut Curry",
    "category": "Dinner",
    "diet": "Vegan",
    "goalTags": [
      "Budget Friendly",
      "Vegetarian / Plant-Based"
    ],
    "servings": 4,
    "prepMin": 10,
    "cookMin": 25,
    "totalMin": 35,
    "costPerServe": 2.4,
    "calories": 480,
    "protein": 16,
    "carbs": 62,
    "fat": 18,
    "fibre": 12,
    "scores": {
      "proteinDensity": 3.3,
      "proteinPerDollar": 6.7,
      "caloriesPerDollar": 200.0,
      "satiety": 83.0,
      "nutrientDensity": 88.0,
      "affordability": 81.0,
      "simplicity": 61.25,
      "mealPrep": 90.0,
      "calories": 96.0,
      "fibre": 80.0004
    },
    "ingredientPattern": "Simmer chickpeas in curry sauce; serve with rice.",
    "method": "Add tofu for protein.",
    "notes": "",
    "nutritionSource": "estimated"
  },
  {
    "id": "R012",
    "name": "Turkey & Sweet Potato Tray Bake",
    "category": "Dinner",
    "diet": "Omnivore",
    "goalTags": [
      "Muscle Gain",
      "General Health"
    ],
    "servings": 4,
    "prepMin": 15,
    "cookMin": 35,
    "totalMin": 50,
    "costPerServe": 4.2,
    "calories": 540,
    "protein": 39,
    "carbs": 55,
    "fat": 18,
    "fibre": 9,
    "scores": {
      "proteinDensity": 7.2,
      "proteinPerDollar": 9.3,
      "caloriesPerDollar": 128.6,
      "satiety": 84.0,
      "nutrientDensity": 85.0,
      "affordability": 63.0,
      "simplicity": 42.5,
      "mealPrep": 80.0,
      "calories": 92.0,
      "fibre": 60.000299999999996
    },
    "ingredientPattern": "Roast ingredients on tray.",
    "method": "Minimal clean-up.",
    "notes": "",
    "nutritionSource": "estimated"
  },
  {
    "id": "R013",
    "name": "Bean & Rice Burritos",
    "category": "Lunch",
    "diet": "Vegetarian",
    "goalTags": [
      "Budget Friendly",
      "Family Friendly"
    ],
    "servings": 6,
    "prepMin": 15,
    "cookMin": 20,
    "totalMin": 35,
    "costPerServe": 1.9,
    "calories": 460,
    "protein": 18,
    "carbs": 76,
    "fat": 10,
    "fibre": 12,
    "scores": {
      "proteinDensity": 3.9,
      "proteinPerDollar": 9.5,
      "caloriesPerDollar": 242.1,
      "satiety": 86.0,
      "nutrientDensity": 78.0,
      "affordability": 86.0,
      "simplicity": 61.25,
      "mealPrep": 88.0,
      "calories": 92.0,
      "fibre": 80.0004
    },
    "ingredientPattern": "Fill wraps with rice/beans/salsa; toast or freeze.",
    "method": "Very scalable.",
    "notes": "",
    "nutritionSource": "estimated"
  },
  {
    "id": "R014",
    "name": "Salmon Potato Plate",
    "category": "Dinner",
    "diet": "Pescatarian",
    "goalTags": [
      "Fat Loss",
      "General Health"
    ],
    "servings": 2,
    "prepMin": 10,
    "cookMin": 25,
    "totalMin": 35,
    "costPerServe": 6.2,
    "calories": 520,
    "protein": 36,
    "carbs": 45,
    "fat": 22,
    "fibre": 7,
    "scores": {
      "proteinDensity": 6.9,
      "proteinPerDollar": 5.8,
      "caloriesPerDollar": 83.9,
      "satiety": 84.0,
      "nutrientDensity": 92.0,
      "affordability": 43.0,
      "simplicity": 61.25,
      "mealPrep": 40.0,
      "calories": 96.0,
      "fibre": 46.6669
    },
    "ingredientPattern": "Bake salmon and potato; serve with greens.",
    "method": "High nutrient quality but costly.",
    "notes": "",
    "nutritionSource": "estimated"
  },
  {
    "id": "R015",
    "name": "Vegetable Omelette & Toast",
    "category": "Breakfast",
    "diet": "Vegetarian",
    "goalTags": [
      "Fat Loss",
      "General Health",
      "Time Efficient"
    ],
    "servings": 1,
    "prepMin": 8,
    "cookMin": 8,
    "totalMin": 16,
    "costPerServe": 2.1,
    "calories": 390,
    "protein": 27,
    "carbs": 32,
    "fat": 17,
    "fibre": 7,
    "scores": {
      "proteinDensity": 6.9,
      "proteinPerDollar": 12.9,
      "caloriesPerDollar": 185.7,
      "satiety": 80.0,
      "nutrientDensity": 82.0,
      "affordability": 84.0,
      "simplicity": 85.0,
      "mealPrep": 40.0,
      "calories": 78.0,
      "fibre": 46.6669
    },
    "ingredientPattern": "Cook omelette; serve with toast.",
    "method": "Flexible veg.",
    "notes": "",
    "nutritionSource": "estimated"
  },
  {
    "id": "R016",
    "name": "Protein Smoothie Bowl",
    "category": "Breakfast",
    "diet": "Vegetarian",
    "goalTags": [
      "Muscle Gain",
      "Time Efficient"
    ],
    "servings": 1,
    "prepMin": 5,
    "cookMin": 0,
    "totalMin": 5,
    "costPerServe": 3.1,
    "calories": 520,
    "protein": 35,
    "carbs": 68,
    "fat": 12,
    "fibre": 8,
    "scores": {
      "proteinDensity": 6.7,
      "proteinPerDollar": 11.3,
      "caloriesPerDollar": 167.7,
      "satiety": 76.0,
      "nutrientDensity": 80.0,
      "affordability": 74.0,
      "simplicity": 98.75,
      "mealPrep": 50.0,
      "calories": 96.0,
      "fibre": 53.3336
    },
    "ingredientPattern": "Blend and top with oats/seeds.",
    "method": "Useful when appetite is low.",
    "notes": "",
    "nutritionSource": "estimated"
  },
  {
    "id": "R017",
    "name": "Minestrone with Lentils",
    "category": "Dinner",
    "diet": "Vegan",
    "goalTags": [
      "Fat Loss",
      "General Health",
      "Budget Friendly"
    ],
    "servings": 6,
    "prepMin": 15,
    "cookMin": 35,
    "totalMin": 50,
    "costPerServe": 1.7,
    "calories": 330,
    "protein": 18,
    "carbs": 55,
    "fat": 5,
    "fibre": 15,
    "scores": {
      "proteinDensity": 5.5,
      "proteinPerDollar": 10.6,
      "caloriesPerDollar": 194.1,
      "satiety": 90.0,
      "nutrientDensity": 91.0,
      "affordability": 88.0,
      "simplicity": 42.5,
      "mealPrep": 92.0,
      "calories": 66.0,
      "fibre": 100.0
    },
    "ingredientPattern": "Simmer veg, lentils and pasta/rice.",
    "method": "Very filling for calories.",
    "notes": "",
    "nutritionSource": "estimated"
  },
  {
    "id": "R018",
    "name": "Chicken Caesar-ish Salad Bowl",
    "category": "Lunch",
    "diet": "Omnivore",
    "goalTags": [
      "Fat Loss",
      "Time Efficient"
    ],
    "servings": 2,
    "prepMin": 10,
    "cookMin": 10,
    "totalMin": 20,
    "costPerServe": 4.0,
    "calories": 420,
    "protein": 42,
    "carbs": 22,
    "fat": 18,
    "fibre": 7,
    "scores": {
      "proteinDensity": 10.0,
      "proteinPerDollar": 10.5,
      "caloriesPerDollar": 105.0,
      "satiety": 83.0,
      "nutrientDensity": 78.0,
      "affordability": 65.0,
      "simplicity": 80.0,
      "mealPrep": 45.0,
      "calories": 84.0,
      "fibre": 46.6669
    },
    "ingredientPattern": "Cook chicken; assemble greens and dressing.",
    "method": "Use potatoes/croutons if more carbs needed.",
    "notes": "",
    "nutritionSource": "estimated"
  },
  {
    "id": "R019",
    "name": "Cottage Cheese Tuna Melt",
    "category": "Lunch",
    "diet": "Pescatarian",
    "goalTags": [
      "Muscle Gain",
      "Budget Friendly",
      "Time Efficient"
    ],
    "servings": 1,
    "prepMin": 5,
    "cookMin": 7,
    "totalMin": 12,
    "costPerServe": 2.8,
    "calories": 430,
    "protein": 42,
    "carbs": 34,
    "fat": 12,
    "fibre": 5,
    "scores": {
      "proteinDensity": 9.8,
      "proteinPerDollar": 15.0,
      "caloriesPerDollar": 153.6,
      "satiety": 77.0,
      "nutrientDensity": 70.0,
      "affordability": 77.0,
      "simplicity": 90.0,
      "mealPrep": 35.0,
      "calories": 86.0,
      "fibre": 33.3335
    },
    "ingredientPattern": "Mix topping; grill on toast.",
    "method": "High protein, familiar.",
    "notes": "",
    "nutritionSource": "estimated"
  },
  {
    "id": "R020",
    "name": "Tofu Edamame Noodle Bowl",
    "category": "Dinner",
    "diet": "Vegan",
    "goalTags": [
      "Muscle Gain",
      "General Health",
      "Vegetarian / Plant-Based"
    ],
    "servings": 3,
    "prepMin": 15,
    "cookMin": 15,
    "totalMin": 30,
    "costPerServe": 4.1,
    "calories": 610,
    "protein": 34,
    "carbs": 76,
    "fat": 19,
    "fibre": 11,
    "scores": {
      "proteinDensity": 5.6,
      "proteinPerDollar": 8.3,
      "caloriesPerDollar": 148.8,
      "satiety": 82.0,
      "nutrientDensity": 88.0,
      "affordability": 64.0,
      "simplicity": 67.5,
      "mealPrep": 70.0,
      "calories": 78.0,
      "fibre": 73.3337
    },
    "ingredientPattern": "Cook noodles; stir-fry tofu/veg; combine.",
    "method": "Strong plant-protein option.",
    "notes": "",
    "nutritionSource": "estimated"
  },
  {
    "id": "R021",
    "name": "Baked Potato with Beans & Yoghurt",
    "category": "Lunch",
    "diet": "Vegetarian",
    "goalTags": [
      "Fat Loss",
      "Budget Friendly",
      "Family Friendly"
    ],
    "servings": 1,
    "prepMin": 8,
    "cookMin": 40,
    "totalMin": 48,
    "costPerServe": 2.2,
    "calories": 470,
    "protein": 23,
    "carbs": 78,
    "fat": 8,
    "fibre": 14,
    "scores": {
      "proteinDensity": 4.9,
      "proteinPerDollar": 10.5,
      "caloriesPerDollar": 213.6,
      "satiety": 93.0,
      "nutrientDensity": 82.0,
      "affordability": 83.0,
      "simplicity": 45.0,
      "mealPrep": 55.0,
      "calories": 94.0,
      "fibre": 93.3338
    },
    "ingredientPattern": "Bake/microwave potato; top with beans/yoghurt.",
    "method": "Very high satiety.",
    "notes": "",
    "nutritionSource": "estimated"
  },
  {
    "id": "R022",
    "name": "Peanut Chicken Rice Noodles",
    "category": "Dinner",
    "diet": "Omnivore",
    "goalTags": [
      "Muscle Gain",
      "Family Friendly"
    ],
    "servings": 4,
    "prepMin": 15,
    "cookMin": 20,
    "totalMin": 35,
    "costPerServe": 4.3,
    "calories": 680,
    "protein": 43,
    "carbs": 78,
    "fat": 22,
    "fibre": 6,
    "scores": {
      "proteinDensity": 6.3,
      "proteinPerDollar": 10.0,
      "caloriesPerDollar": 158.1,
      "satiety": 76.0,
      "nutrientDensity": 74.0,
      "affordability": 62.0,
      "simplicity": 61.25,
      "mealPrep": 65.0,
      "calories": 64.0,
      "fibre": 40.0002
    },
    "ingredientPattern": "Cook chicken/veg/noodles; toss with sauce.",
    "method": "Energy-dense for active users.",
    "notes": "",
    "nutritionSource": "estimated"
  },
  {
    "id": "R023",
    "name": "Mediterranean Chickpea Salad",
    "category": "Lunch",
    "diet": "Vegetarian",
    "goalTags": [
      "General Health",
      "Time Efficient"
    ],
    "servings": 2,
    "prepMin": 10,
    "cookMin": 0,
    "totalMin": 10,
    "costPerServe": 3.0,
    "calories": 420,
    "protein": 17,
    "carbs": 50,
    "fat": 18,
    "fibre": 12,
    "scores": {
      "proteinDensity": 4.0,
      "proteinPerDollar": 5.7,
      "caloriesPerDollar": 140.0,
      "satiety": 82.0,
      "nutrientDensity": 91.0,
      "affordability": 75.0,
      "simplicity": 92.5,
      "mealPrep": 35.0,
      "calories": 84.0,
      "fibre": 80.0004
    },
    "ingredientPattern": "Combine ingredients and dressing.",
    "method": "No-cook option.",
    "notes": "",
    "nutritionSource": "estimated"
  },
  {
    "id": "R024",
    "name": "Beef Chilli Con Carne",
    "category": "Dinner",
    "diet": "Omnivore",
    "goalTags": [
      "Muscle Gain",
      "Family Friendly"
    ],
    "servings": 6,
    "prepMin": 15,
    "cookMin": 45,
    "totalMin": 60,
    "costPerServe": 3.1,
    "calories": 560,
    "protein": 39,
    "carbs": 55,
    "fat": 18,
    "fibre": 12,
    "scores": {
      "proteinDensity": 7.0,
      "proteinPerDollar": 12.6,
      "caloriesPerDollar": 180.6,
      "satiety": 88.0,
      "nutrientDensity": 81.0,
      "affordability": 74.0,
      "simplicity": 30.0,
      "mealPrep": 96.0,
      "calories": 88.0,
      "fibre": 80.0004
    },
    "ingredientPattern": "Simmer beef, beans, tomato and spices.",
    "method": "Freezes well.",
    "notes": "",
    "nutritionSource": "estimated"
  },
  {
    "id": "R025",
    "name": "Egg Fried Rice with Edamame",
    "category": "Dinner",
    "diet": "Vegetarian",
    "goalTags": [
      "Budget Friendly",
      "Time Efficient",
      "Family Friendly"
    ],
    "servings": 3,
    "prepMin": 10,
    "cookMin": 12,
    "totalMin": 22,
    "costPerServe": 2.0,
    "calories": 480,
    "protein": 23,
    "carbs": 68,
    "fat": 13,
    "fibre": 8,
    "scores": {
      "proteinDensity": 4.8,
      "proteinPerDollar": 11.5,
      "caloriesPerDollar": 240.0,
      "satiety": 78.0,
      "nutrientDensity": 78.0,
      "affordability": 85.0,
      "simplicity": 77.5,
      "mealPrep": 65.0,
      "calories": 96.0,
      "fibre": 53.3336
    },
    "ingredientPattern": "Stir-fry rice, egg, edamame and veg.",
    "method": "Use leftover rice.",
    "notes": "",
    "nutritionSource": "estimated"
  },
  {
    "id": "R026",
    "name": "High-Protein Yoghurt Bark",
    "category": "Snack",
    "diet": "Vegetarian",
    "goalTags": [
      "Fat Loss",
      "Family Friendly"
    ],
    "servings": 6,
    "prepMin": 10,
    "cookMin": 0,
    "totalMin": 10,
    "costPerServe": 1.2,
    "calories": 160,
    "protein": 13,
    "carbs": 16,
    "fat": 5,
    "fibre": 3,
    "scores": {
      "proteinDensity": 8.1,
      "proteinPerDollar": 10.8,
      "caloriesPerDollar": 133.3,
      "satiety": 64.0,
      "nutrientDensity": 68.0,
      "affordability": 93.0,
      "simplicity": 92.5,
      "mealPrep": 70.0,
      "calories": 32.0,
      "fibre": 20.0001
    },
    "ingredientPattern": "Spread yoghurt with toppings; freeze.",
    "method": "Dessert/snack.",
    "notes": "",
    "nutritionSource": "estimated"
  },
  {
    "id": "R027",
    "name": "Hummus Veg & Egg Snack Plate",
    "category": "Snack",
    "diet": "Vegetarian",
    "goalTags": [
      "Fat Loss",
      "General Health",
      "Time Efficient"
    ],
    "servings": 1,
    "prepMin": 8,
    "cookMin": 0,
    "totalMin": 8,
    "costPerServe": 2.5,
    "calories": 380,
    "protein": 22,
    "carbs": 32,
    "fat": 19,
    "fibre": 9,
    "scores": {
      "proteinDensity": 5.8,
      "proteinPerDollar": 8.8,
      "caloriesPerDollar": 152.0,
      "satiety": 82.0,
      "nutrientDensity": 88.0,
      "affordability": 80.0,
      "simplicity": 95.0,
      "mealPrep": 20.0,
      "calories": 76.0,
      "fibre": 60.000299999999996
    },
    "ingredientPattern": "Assemble snack plate.",
    "method": "Good low-cook option.",
    "notes": "",
    "nutritionSource": "estimated"
  },
  {
    "id": "R028",
    "name": "Lentil Dahl with Rice",
    "category": "Dinner",
    "diet": "Vegan",
    "goalTags": [
      "Budget Friendly",
      "Vegetarian / Plant-Based"
    ],
    "servings": 6,
    "prepMin": 10,
    "cookMin": 35,
    "totalMin": 45,
    "costPerServe": 1.6,
    "calories": 470,
    "protein": 22,
    "carbs": 76,
    "fat": 8,
    "fibre": 14,
    "scores": {
      "proteinDensity": 4.7,
      "proteinPerDollar": 13.8,
      "caloriesPerDollar": 293.8,
      "satiety": 91.0,
      "nutrientDensity": 89.0,
      "affordability": 89.0,
      "simplicity": 48.75,
      "mealPrep": 94.0,
      "calories": 94.0,
      "fibre": 93.3338
    },
    "ingredientPattern": "Simmer lentils; serve with rice.",
    "method": "One of the best value meals.",
    "notes": "",
    "nutritionSource": "estimated"
  },
  {
    "id": "R029",
    "name": "Chicken Pasta Bake",
    "category": "Dinner",
    "diet": "Omnivore",
    "goalTags": [
      "Muscle Gain",
      "Family Friendly"
    ],
    "servings": 6,
    "prepMin": 15,
    "cookMin": 30,
    "totalMin": 45,
    "costPerServe": 3.3,
    "calories": 620,
    "protein": 43,
    "carbs": 72,
    "fat": 17,
    "fibre": 7,
    "scores": {
      "proteinDensity": 6.9,
      "proteinPerDollar": 13.0,
      "caloriesPerDollar": 187.9,
      "satiety": 78.0,
      "nutrientDensity": 74.0,
      "affordability": 72.0,
      "simplicity": 48.75,
      "mealPrep": 92.0,
      "calories": 76.0,
      "fibre": 46.6669
    },
    "ingredientPattern": "Combine cooked pasta/chicken/sauce; bake.",
    "method": "Family-friendly bulk meal.",
    "notes": "",
    "nutritionSource": "estimated"
  },
  {
    "id": "R030",
    "name": "Quinoa Black Bean Bowl",
    "category": "Lunch",
    "diet": "Vegan",
    "goalTags": [
      "General Health",
      "Vegetarian / Plant-Based"
    ],
    "servings": 3,
    "prepMin": 15,
    "cookMin": 20,
    "totalMin": 35,
    "costPerServe": 3.6,
    "calories": 520,
    "protein": 22,
    "carbs": 82,
    "fat": 12,
    "fibre": 14,
    "scores": {
      "proteinDensity": 4.2,
      "proteinPerDollar": 6.1,
      "caloriesPerDollar": 144.4,
      "satiety": 88.0,
      "nutrientDensity": 93.0,
      "affordability": 69.0,
      "simplicity": 61.25,
      "mealPrep": 70.0,
      "calories": 96.0,
      "fibre": 93.3338
    },
    "ingredientPattern": "Cook quinoa; assemble with beans/veg/salsa.",
    "method": "High fibre and micronutrients.",
    "notes": "",
    "nutritionSource": "estimated"
  },
  {
    "id": "R031",
    "name": "Chicken Chipotle Burrito Bowl",
    "category": "Lunch",
    "diet": "Omnivore",
    "goalTags": [
      "Fat Loss",
      "Muscle Gain",
      "Family Friendly"
    ],
    "servings": 1,
    "prepMin": 12,
    "cookMin": 18,
    "totalMin": 30,
    "costPerServe": 4.4,
    "calories": 560,
    "protein": 46,
    "carbs": 58,
    "fat": 14,
    "fibre": 9,
    "scores": {
      "proteinDensity": 8.2,
      "proteinPerDollar": 10.5,
      "caloriesPerDollar": 127.3,
      "satiety": 86.0,
      "nutrientDensity": 84.0,
      "affordability": 61.0,
      "simplicity": 67.5,
      "mealPrep": 78.0,
      "calories": 88.0,
      "fibre": 60.000299999999996
    },
    "ingredientPattern": "Burrito Bowl | Chicken + rice + beans + salsa + yoghurt",
    "method": "Batch chicken and rice; assemble with salad and salsa.",
    "notes": "Inspired by provider burrito bowl patterns.",
    "nutritionSource": "estimated"
  },
  {
    "id": "R032",
    "name": "Lean Beef Burrito Bowl",
    "category": "Lunch",
    "diet": "Omnivore",
    "goalTags": [
      "Muscle Gain",
      "Family Friendly"
    ],
    "servings": 1,
    "prepMin": 12,
    "cookMin": 20,
    "totalMin": 32,
    "costPerServe": 4.8,
    "calories": 620,
    "protein": 44,
    "carbs": 64,
    "fat": 19,
    "fibre": 8,
    "scores": {
      "proteinDensity": 7.1,
      "proteinPerDollar": 9.2,
      "caloriesPerDollar": 129.2,
      "satiety": 84.0,
      "nutrientDensity": 80.0,
      "affordability": 57.0,
      "simplicity": 65.0,
      "mealPrep": 76.0,
      "calories": 76.0,
      "fibre": 53.3336
    },
    "ingredientPattern": "Burrito Bowl | Lean beef mince + rice + beans + veg",
    "method": "Cook mince with spices; serve with rice, beans, corn and salsa.",
    "notes": "Comfort bowl, strong adherence.",
    "nutritionSource": "estimated"
  },
  {
    "id": "R033",
    "name": "Tofu Black Bean Burrito Bowl",
    "category": "Lunch",
    "diet": "Vegan",
    "goalTags": [
      "Budget Friendly",
      "Vegetarian / Plant-Based"
    ],
    "servings": 1,
    "prepMin": 12,
    "cookMin": 18,
    "totalMin": 30,
    "costPerServe": 3.3,
    "calories": 520,
    "protein": 27,
    "carbs": 70,
    "fat": 14,
    "fibre": 13,
    "scores": {
      "proteinDensity": 5.2,
      "proteinPerDollar": 8.2,
      "caloriesPerDollar": 157.6,
      "satiety": 88.0,
      "nutrientDensity": 86.0,
      "affordability": 72.0,
      "simplicity": 67.5,
      "mealPrep": 80.0,
      "calories": 96.0,
      "fibre": 86.66709999999999
    },
    "ingredientPattern": "Burrito Bowl | Tofu + beans + rice + salsa",
    "method": "Crisp tofu; serve with beans, rice, salad and salsa.",
    "notes": "Higher fibre plant option.",
    "nutritionSource": "estimated"
  },
  {
    "id": "R034",
    "name": "Low-Carb Chicken Burrito Bowl",
    "category": "Dinner",
    "diet": "Omnivore",
    "goalTags": [
      "Fat Loss",
      "Time Efficient"
    ],
    "servings": 1,
    "prepMin": 10,
    "cookMin": 16,
    "totalMin": 26,
    "costPerServe": 4.3,
    "calories": 390,
    "protein": 44,
    "carbs": 18,
    "fat": 15,
    "fibre": 9,
    "scores": {
      "proteinDensity": 11.3,
      "proteinPerDollar": 10.2,
      "caloriesPerDollar": 90.7,
      "satiety": 90.0,
      "nutrientDensity": 82.0,
      "affordability": 62.0,
      "simplicity": 72.5,
      "mealPrep": 72.0,
      "calories": 78.0,
      "fibre": 60.000299999999996
    },
    "ingredientPattern": "Burrito Bowl | Chicken + cauliflower rice + salad + salsa",
    "method": "Swap rice for cauli rice and extra salad.",
    "notes": "Low-carb variant of same flavour.",
    "nutritionSource": "estimated"
  },
  {
    "id": "R035",
    "name": "Chicken Butter Curry Lean",
    "category": "Dinner",
    "diet": "Omnivore",
    "goalTags": [
      "Fat Loss",
      "Family Friendly"
    ],
    "servings": 1,
    "prepMin": 10,
    "cookMin": 25,
    "totalMin": 35,
    "costPerServe": 4.2,
    "calories": 470,
    "protein": 40,
    "carbs": 42,
    "fat": 15,
    "fibre": 6,
    "scores": {
      "proteinDensity": 8.5,
      "proteinPerDollar": 9.5,
      "caloriesPerDollar": 111.9,
      "satiety": 82.0,
      "nutrientDensity": 80.0,
      "affordability": 63.0,
      "simplicity": 61.25,
      "mealPrep": 75.0,
      "calories": 94.0,
      "fibre": 40.0002
    },
    "ingredientPattern": "Curry Bowl | Chicken + yoghurt curry sauce + rice + peas",
    "method": "Simmer chicken in yoghurt tomato curry; serve with rice.",
    "notes": "Home-cook version of lean curry pattern.",
    "nutritionSource": "estimated"
  },
  {
    "id": "R036",
    "name": "Chicken Butter Curry Gain",
    "category": "Dinner",
    "diet": "Omnivore",
    "goalTags": [
      "Muscle Gain"
    ],
    "servings": 1,
    "prepMin": 10,
    "cookMin": 25,
    "totalMin": 35,
    "costPerServe": 4.7,
    "calories": 670,
    "protein": 55,
    "carbs": 75,
    "fat": 18,
    "fibre": 7,
    "scores": {
      "proteinDensity": 8.2,
      "proteinPerDollar": 11.7,
      "caloriesPerDollar": 142.6,
      "satiety": 78.0,
      "nutrientDensity": 78.0,
      "affordability": 58.0,
      "simplicity": 61.25,
      "mealPrep": 82.0,
      "calories": 66.0,
      "fibre": 46.6669
    },
    "ingredientPattern": "Curry Bowl | More chicken + more rice + curry sauce",
    "method": "Use larger rice and chicken portions.",
    "notes": "Goal variant: gain.",
    "nutritionSource": "estimated"
  },
  {
    "id": "R037",
    "name": "Low-Carb Butter Chicken with Veg",
    "category": "Dinner",
    "diet": "Omnivore",
    "goalTags": [
      "Fat Loss"
    ],
    "servings": 1,
    "prepMin": 10,
    "cookMin": 25,
    "totalMin": 35,
    "costPerServe": 4.4,
    "calories": 360,
    "protein": 42,
    "carbs": 12,
    "fat": 17,
    "fibre": 7,
    "scores": {
      "proteinDensity": 11.7,
      "proteinPerDollar": 9.5,
      "caloriesPerDollar": 81.8,
      "satiety": 86.0,
      "nutrientDensity": 76.0,
      "affordability": 61.0,
      "simplicity": 61.25,
      "mealPrep": 64.0,
      "calories": 72.0,
      "fibre": 46.6669
    },
    "ingredientPattern": "Curry Bowl | Chicken curry + roasted veg",
    "method": "Replace rice with cauliflower, zucchini and beans.",
    "notes": "Goal variant: low carb.",
    "nutritionSource": "estimated"
  },
  {
    "id": "R038",
    "name": "Chickpea Tikka Masala",
    "category": "Dinner",
    "diet": "Vegan",
    "goalTags": [
      "General Health",
      "Budget Friendly",
      "Vegetarian / Plant-Based"
    ],
    "servings": 1,
    "prepMin": 8,
    "cookMin": 25,
    "totalMin": 33,
    "costPerServe": 2.3,
    "calories": 470,
    "protein": 20,
    "carbs": 72,
    "fat": 11,
    "fibre": 15,
    "scores": {
      "proteinDensity": 4.3,
      "proteinPerDollar": 8.7,
      "caloriesPerDollar": 204.3,
      "satiety": 88.0,
      "nutrientDensity": 86.0,
      "affordability": 82.0,
      "simplicity": 63.75,
      "mealPrep": 80.0,
      "calories": 94.0,
      "fibre": 100.0
    },
    "ingredientPattern": "Curry Bowl | Chickpeas + tomato curry + rice + spinach",
    "method": "Simmer chickpeas in tikka sauce; add spinach and rice.",
    "notes": "Budget plant curry.",
    "nutritionSource": "estimated"
  },
  {
    "id": "R039",
    "name": "Thai Green Chicken Curry",
    "category": "Dinner",
    "diet": "Omnivore",
    "goalTags": [
      "Family Friendly"
    ],
    "servings": 1,
    "prepMin": 10,
    "cookMin": 20,
    "totalMin": 30,
    "costPerServe": 4.5,
    "calories": 520,
    "protein": 38,
    "carbs": 52,
    "fat": 18,
    "fibre": 7,
    "scores": {
      "proteinDensity": 7.3,
      "proteinPerDollar": 8.4,
      "caloriesPerDollar": 115.6,
      "satiety": 80.0,
      "nutrientDensity": 78.0,
      "affordability": 60.0,
      "simplicity": 67.5,
      "mealPrep": 76.0,
      "calories": 96.0,
      "fibre": 46.6669
    },
    "ingredientPattern": "Curry Bowl | Chicken + coconut curry + veg + rice",
    "method": "Cook curry paste, chicken, veg and coconut milk; serve with rice.",
    "notes": "Commercially common high-protein curry.",
    "nutritionSource": "estimated"
  },
  {
    "id": "R040",
    "name": "Thai Yellow Tofu Curry",
    "category": "Dinner",
    "diet": "Vegan",
    "goalTags": [
      "General Health",
      "Vegetarian / Plant-Based"
    ],
    "servings": 1,
    "prepMin": 10,
    "cookMin": 22,
    "totalMin": 32,
    "costPerServe": 3.8,
    "calories": 530,
    "protein": 24,
    "carbs": 62,
    "fat": 22,
    "fibre": 10,
    "scores": {
      "proteinDensity": 4.5,
      "proteinPerDollar": 6.3,
      "caloriesPerDollar": 139.5,
      "satiety": 82.0,
      "nutrientDensity": 84.0,
      "affordability": 67.0,
      "simplicity": 65.0,
      "mealPrep": 76.0,
      "calories": 94.0,
      "fibre": 66.667
    },
    "ingredientPattern": "Curry Bowl | Tofu + yellow curry + veg + rice",
    "method": "Simmer tofu and vegetables in yellow curry sauce.",
    "notes": "Plant comfort meal.",
    "nutritionSource": "estimated"
  },
  {
    "id": "R041",
    "name": "Asian Chicken Stir Fry",
    "category": "Dinner",
    "diet": "Omnivore",
    "goalTags": [
      "Muscle Gain",
      "General Health",
      "Time Efficient"
    ],
    "servings": 1,
    "prepMin": 10,
    "cookMin": 12,
    "totalMin": 22,
    "costPerServe": 4.2,
    "calories": 540,
    "protein": 48,
    "carbs": 58,
    "fat": 10,
    "fibre": 8,
    "scores": {
      "proteinDensity": 8.9,
      "proteinPerDollar": 11.4,
      "caloriesPerDollar": 128.6,
      "satiety": 86.0,
      "nutrientDensity": 82.0,
      "affordability": 63.0,
      "simplicity": 77.5,
      "mealPrep": 82.0,
      "calories": 92.0,
      "fibre": 53.3336
    },
    "ingredientPattern": "Stir Fry | Chicken + frozen veg + rice + soy garlic sauce",
    "method": "Stir fry chicken and veg; serve with rice.",
    "notes": "Fast repeatable formula.",
    "nutritionSource": "estimated"
  },
  {
    "id": "R042",
    "name": "Beef Noodle Stir Fry Lean",
    "category": "Dinner",
    "diet": "Omnivore",
    "goalTags": [
      "Time Efficient",
      "Family Friendly"
    ],
    "servings": 1,
    "prepMin": 10,
    "cookMin": 12,
    "totalMin": 22,
    "costPerServe": 4.7,
    "calories": 520,
    "protein": 38,
    "carbs": 55,
    "fat": 15,
    "fibre": 6,
    "scores": {
      "proteinDensity": 7.3,
      "proteinPerDollar": 8.1,
      "caloriesPerDollar": 110.6,
      "satiety": 78.0,
      "nutrientDensity": 76.0,
      "affordability": 58.0,
      "simplicity": 77.5,
      "mealPrep": 75.0,
      "calories": 96.0,
      "fibre": 40.0002
    },
    "ingredientPattern": "Stir Fry | Lean beef + noodles + veg",
    "method": "Stir fry beef and veg; toss with noodles and sauce.",
    "notes": "Inspired by Papa lean/gain stir fry variants.",
    "nutritionSource": "estimated"
  },
  {
    "id": "R043",
    "name": "Beef Noodle Stir Fry Gain",
    "category": "Dinner",
    "diet": "Omnivore",
    "goalTags": [
      "Muscle Gain"
    ],
    "servings": 1,
    "prepMin": 10,
    "cookMin": 12,
    "totalMin": 22,
    "costPerServe": 5.2,
    "calories": 690,
    "protein": 52,
    "carbs": 76,
    "fat": 20,
    "fibre": 7,
    "scores": {
      "proteinDensity": 7.5,
      "proteinPerDollar": 10.0,
      "caloriesPerDollar": 132.7,
      "satiety": 76.0,
      "nutrientDensity": 72.0,
      "affordability": 53.0,
      "simplicity": 77.5,
      "mealPrep": 84.0,
      "calories": 62.0,
      "fibre": 46.6669
    },
    "ingredientPattern": "Stir Fry | More beef + noodles + veg",
    "method": "Increase beef and noodle portions.",
    "notes": "Goal variant: gain.",
    "nutritionSource": "estimated"
  },
  {
    "id": "R044",
    "name": "Prawn Zucchini Spaghetti Lean",
    "category": "Dinner",
    "diet": "Pescatarian",
    "goalTags": [
      "Fat Loss",
      "General Health",
      "Time Efficient"
    ],
    "servings": 1,
    "prepMin": 8,
    "cookMin": 12,
    "totalMin": 20,
    "costPerServe": 5.3,
    "calories": 390,
    "protein": 32,
    "carbs": 44,
    "fat": 8,
    "fibre": 7,
    "scores": {
      "proteinDensity": 8.2,
      "proteinPerDollar": 6.0,
      "caloriesPerDollar": 73.6,
      "satiety": 84.0,
      "nutrientDensity": 70.0,
      "affordability": 52.0,
      "simplicity": 80.0,
      "mealPrep": 72.0,
      "calories": 78.0,
      "fibre": 46.6669
    },
    "ingredientPattern": "Protein Pasta | Prawns + pasta + zucchini + tomato",
    "method": "Cook prawns with zucchini and tomato; toss with pasta.",
    "notes": "Lean seafood pasta.",
    "nutritionSource": "estimated"
  },
  {
    "id": "R045",
    "name": "Chicken Vodka Penne Style",
    "category": "Dinner",
    "diet": "Omnivore",
    "goalTags": [
      "Muscle Gain",
      "Family Friendly"
    ],
    "servings": 1,
    "prepMin": 10,
    "cookMin": 20,
    "totalMin": 30,
    "costPerServe": 4.6,
    "calories": 620,
    "protein": 45,
    "carbs": 60,
    "fat": 20,
    "fibre": 6,
    "scores": {
      "proteinDensity": 7.3,
      "proteinPerDollar": 9.8,
      "caloriesPerDollar": 134.8,
      "satiety": 76.0,
      "nutrientDensity": 76.0,
      "affordability": 59.0,
      "simplicity": 67.5,
      "mealPrep": 80.0,
      "calories": 76.0,
      "fibre": 40.0002
    },
    "ingredientPattern": "Protein Pasta | Chicken + penne + tomato cream sauce",
    "method": "Cook chicken and sauce; toss with pasta and spinach.",
    "notes": "Comfort pasta, macro-adjusted.",
    "nutritionSource": "estimated"
  },
  {
    "id": "R046",
    "name": "Lean Turkey Bolognese",
    "category": "Dinner",
    "diet": "Omnivore",
    "goalTags": [
      "Fat Loss",
      "Family Friendly"
    ],
    "servings": 1,
    "prepMin": 12,
    "cookMin": 35,
    "totalMin": 47,
    "costPerServe": 3.5,
    "calories": 520,
    "protein": 42,
    "carbs": 58,
    "fat": 12,
    "fibre": 9,
    "scores": {
      "proteinDensity": 8.1,
      "proteinPerDollar": 12.0,
      "caloriesPerDollar": 148.6,
      "satiety": 84.0,
      "nutrientDensity": 86.0,
      "affordability": 70.0,
      "simplicity": 46.25,
      "mealPrep": 80.0,
      "calories": 96.0,
      "fibre": 60.000299999999996
    },
    "ingredientPattern": "Protein Pasta | Turkey mince + tomato + pasta + veg",
    "method": "Simmer turkey mince sauce; serve with pasta.",
    "notes": "Batch-friendly.",
    "nutritionSource": "estimated"
  },
  {
    "id": "R047",
    "name": "Lentil Bolognese",
    "category": "Dinner",
    "diet": "Vegan",
    "goalTags": [
      "Budget Friendly",
      "Family Friendly",
      "Vegetarian / Plant-Based"
    ],
    "servings": 1,
    "prepMin": 10,
    "cookMin": 35,
    "totalMin": 45,
    "costPerServe": 1.9,
    "calories": 480,
    "protein": 22,
    "carbs": 75,
    "fat": 8,
    "fibre": 16,
    "scores": {
      "proteinDensity": 4.6,
      "proteinPerDollar": 11.6,
      "caloriesPerDollar": 252.6,
      "satiety": 88.0,
      "nutrientDensity": 90.0,
      "affordability": 86.0,
      "simplicity": 48.75,
      "mealPrep": 78.0,
      "calories": 96.0,
      "fibre": 100.0
    },
    "ingredientPattern": "Protein Pasta | Lentils + tomato + pasta + mushrooms",
    "method": "Simmer lentils and mushrooms in tomato sauce.",
    "notes": "Cheap and filling.",
    "nutritionSource": "estimated"
  },
  {
    "id": "R048",
    "name": "Tuna Tomato Pasta",
    "category": "Lunch",
    "diet": "Pescatarian",
    "goalTags": [
      "Muscle Gain",
      "Budget Friendly",
      "Time Efficient"
    ],
    "servings": 1,
    "prepMin": 5,
    "cookMin": 12,
    "totalMin": 17,
    "costPerServe": 2.4,
    "calories": 520,
    "protein": 39,
    "carbs": 70,
    "fat": 8,
    "fibre": 7,
    "scores": {
      "proteinDensity": 7.5,
      "proteinPerDollar": 16.2,
      "caloriesPerDollar": 216.7,
      "satiety": 78.0,
      "nutrientDensity": 82.0,
      "affordability": 81.0,
      "simplicity": 83.75,
      "mealPrep": 80.0,
      "calories": 96.0,
      "fibre": 46.6669
    },
    "ingredientPattern": "Protein Pasta | Tuna + pasta + tomato + spinach",
    "method": "Combine tuna and tomato sauce with pasta and spinach.",
    "notes": "Pantry staple.",
    "nutritionSource": "estimated"
  },
  {
    "id": "R049",
    "name": "Chicken Carbonara Lite",
    "category": "Dinner",
    "diet": "Omnivore",
    "goalTags": [
      "Muscle Gain",
      "Family Friendly"
    ],
    "servings": 1,
    "prepMin": 10,
    "cookMin": 18,
    "totalMin": 28,
    "costPerServe": 4.3,
    "calories": 610,
    "protein": 43,
    "carbs": 58,
    "fat": 21,
    "fibre": 5,
    "scores": {
      "proteinDensity": 7.0,
      "proteinPerDollar": 10.0,
      "caloriesPerDollar": 141.9,
      "satiety": 72.0,
      "nutrientDensity": 74.0,
      "affordability": 62.0,
      "simplicity": 70.0,
      "mealPrep": 80.0,
      "calories": 78.0,
      "fibre": 33.3335
    },
    "ingredientPattern": "Protein Pasta | Chicken + pasta + egg/yoghurt sauce",
    "method": "Use egg/yoghurt sauce to reduce cream load.",
    "notes": "Health-conscious comfort remake.",
    "nutritionSource": "estimated"
  },
  {
    "id": "R050",
    "name": "Beef Lasagne Meal Prep",
    "category": "Dinner",
    "diet": "Omnivore",
    "goalTags": [
      "Muscle Gain",
      "Family Friendly"
    ],
    "servings": 1,
    "prepMin": 25,
    "cookMin": 40,
    "totalMin": 65,
    "costPerServe": 4.7,
    "calories": 650,
    "protein": 44,
    "carbs": 56,
    "fat": 24,
    "fibre": 7,
    "scores": {
      "proteinDensity": 6.8,
      "proteinPerDollar": 9.4,
      "caloriesPerDollar": 138.3,
      "satiety": 72.0,
      "nutrientDensity": 72.0,
      "affordability": 58.0,
      "simplicity": 23.75,
      "mealPrep": 82.0,
      "calories": 70.0,
      "fibre": 46.6669
    },
    "ingredientPattern": "Protein Pasta | Lean beef + pasta sheets + tomato + bechamel",
    "method": "Bake lasagne with extra veg and lean mince.",
    "notes": "Batch and freeze.",
    "nutritionSource": "estimated"
  },
  {
    "id": "R051",
    "name": "Chicken Tray Bake with Potato",
    "category": "Dinner",
    "diet": "Omnivore",
    "goalTags": [
      "General Health",
      "Time Efficient",
      "Family Friendly"
    ],
    "servings": 1,
    "prepMin": 10,
    "cookMin": 35,
    "totalMin": 45,
    "costPerServe": 4.1,
    "calories": 520,
    "protein": 42,
    "carbs": 45,
    "fat": 17,
    "fibre": 8,
    "scores": {
      "proteinDensity": 8.1,
      "proteinPerDollar": 10.2,
      "caloriesPerDollar": 126.8,
      "satiety": 82.0,
      "nutrientDensity": 82.0,
      "affordability": 64.0,
      "simplicity": 48.75,
      "mealPrep": 76.0,
      "calories": 96.0,
      "fibre": 53.3336
    },
    "ingredientPattern": "Tray Bake | Chicken + potato + vegetables",
    "method": "Season everything and roast on one tray.",
    "notes": "Low cognitive load.",
    "nutritionSource": "estimated"
  },
  {
    "id": "R052",
    "name": "Salmon Sweet Potato Tray Bake",
    "category": "Dinner",
    "diet": "Pescatarian",
    "goalTags": [
      "General Health",
      "Family Friendly"
    ],
    "servings": 1,
    "prepMin": 10,
    "cookMin": 25,
    "totalMin": 35,
    "costPerServe": 6.8,
    "calories": 580,
    "protein": 38,
    "carbs": 46,
    "fat": 25,
    "fibre": 9,
    "scores": {
      "proteinDensity": 6.6,
      "proteinPerDollar": 5.6,
      "caloriesPerDollar": 85.3,
      "satiety": 84.0,
      "nutrientDensity": 62.0,
      "affordability": 37.0,
      "simplicity": 61.25,
      "mealPrep": 72.0,
      "calories": 84.0,
      "fibre": 60.000299999999996
    },
    "ingredientPattern": "Tray Bake | Salmon + sweet potato + greens",
    "method": "Roast sweet potato then add salmon and greens.",
    "notes": "Nutrient dense but higher cost.",
    "nutritionSource": "estimated"
  },
  {
    "id": "R053",
    "name": "Tofu Sesame Tray Bake",
    "category": "Dinner",
    "diet": "Vegan",
    "goalTags": [
      "General Health",
      "Vegetarian / Plant-Based"
    ],
    "servings": 1,
    "prepMin": 12,
    "cookMin": 30,
    "totalMin": 42,
    "costPerServe": 3.4,
    "calories": 500,
    "protein": 26,
    "carbs": 55,
    "fat": 19,
    "fibre": 11,
    "scores": {
      "proteinDensity": 5.2,
      "proteinPerDollar": 7.6,
      "caloriesPerDollar": 147.1,
      "satiety": 84.0,
      "nutrientDensity": 82.0,
      "affordability": 71.0,
      "simplicity": 52.5,
      "mealPrep": 76.0,
      "calories": 100.0,
      "fibre": 73.3337
    },
    "ingredientPattern": "Tray Bake | Tofu + veg + rice + sesame sauce",
    "method": "Bake tofu and veg; serve over rice.",
    "notes": "Plant meal prep.",
    "nutritionSource": "estimated"
  },
  {
    "id": "R054",
    "name": "Sausage Veg Tray Bake Lite",
    "category": "Dinner",
    "diet": "Omnivore",
    "goalTags": [
      "Time Efficient",
      "Family Friendly"
    ],
    "servings": 1,
    "prepMin": 8,
    "cookMin": 30,
    "totalMin": 38,
    "costPerServe": 3.9,
    "calories": 540,
    "protein": 28,
    "carbs": 42,
    "fat": 26,
    "fibre": 8,
    "scores": {
      "proteinDensity": 5.2,
      "proteinPerDollar": 7.2,
      "caloriesPerDollar": 138.5,
      "satiety": 68.0,
      "nutrientDensity": 76.0,
      "affordability": 66.0,
      "simplicity": 57.5,
      "mealPrep": 72.0,
      "calories": 92.0,
      "fibre": 53.3336
    },
    "ingredientPattern": "Tray Bake | Lean sausages + potato + vegetables",
    "method": "Use lean sausages and lots of veg.",
    "notes": "Familiar family option.",
    "nutritionSource": "estimated"
  },
  {
    "id": "R055",
    "name": "Lean Chilli Con Carne",
    "category": "Dinner",
    "diet": "Omnivore",
    "goalTags": [
      "Fat Loss",
      "Budget Friendly"
    ],
    "servings": 1,
    "prepMin": 10,
    "cookMin": 35,
    "totalMin": 45,
    "costPerServe": 2.9,
    "calories": 430,
    "protein": 38,
    "carbs": 42,
    "fat": 10,
    "fibre": 12,
    "scores": {
      "proteinDensity": 8.8,
      "proteinPerDollar": 13.1,
      "caloriesPerDollar": 148.3,
      "satiety": 90.0,
      "nutrientDensity": 88.0,
      "affordability": 76.0,
      "simplicity": 48.75,
      "mealPrep": 80.0,
      "calories": 86.0,
      "fibre": 80.0004
    },
    "ingredientPattern": "Chilli | Lean beef + beans + tomato + rice",
    "method": "Simmer mince, beans and tomato; serve with rice.",
    "notes": "Inspired by Papa lean/gain chilli pattern.",
    "nutritionSource": "estimated"
  },
  {
    "id": "R056",
    "name": "Chilli Con Carne Gain Bowl",
    "category": "Dinner",
    "diet": "Omnivore",
    "goalTags": [
      "Muscle Gain"
    ],
    "servings": 1,
    "prepMin": 10,
    "cookMin": 35,
    "totalMin": 45,
    "costPerServe": 3.5,
    "calories": 650,
    "protein": 52,
    "carbs": 72,
    "fat": 16,
    "fibre": 13,
    "scores": {
      "proteinDensity": 8.0,
      "proteinPerDollar": 14.9,
      "caloriesPerDollar": 185.7,
      "satiety": 84.0,
      "nutrientDensity": 84.0,
      "affordability": 70.0,
      "simplicity": 48.75,
      "mealPrep": 86.0,
      "calories": 70.0,
      "fibre": 86.66709999999999
    },
    "ingredientPattern": "Chilli | More mince + rice + beans",
    "method": "Larger protein and carb portions.",
    "notes": "Goal variant: gain.",
    "nutritionSource": "estimated"
  },
  {
    "id": "R057",
    "name": "Turkey White Bean Chilli",
    "category": "Dinner",
    "diet": "Omnivore",
    "goalTags": [
      "Fat Loss",
      "General Health"
    ],
    "servings": 1,
    "prepMin": 10,
    "cookMin": 35,
    "totalMin": 45,
    "costPerServe": 3.4,
    "calories": 450,
    "protein": 41,
    "carbs": 45,
    "fat": 11,
    "fibre": 11,
    "scores": {
      "proteinDensity": 9.1,
      "proteinPerDollar": 12.1,
      "caloriesPerDollar": 132.4,
      "satiety": 90.0,
      "nutrientDensity": 84.0,
      "affordability": 71.0,
      "simplicity": 48.75,
      "mealPrep": 78.0,
      "calories": 90.0,
      "fibre": 73.3337
    },
    "ingredientPattern": "Chilli | Turkey mince + white beans + veg",
    "method": "Simmer turkey, beans, corn and spices.",
    "notes": "High satiety.",
    "nutritionSource": "estimated"
  },
  {
    "id": "R058",
    "name": "Three Bean Veg Chilli",
    "category": "Dinner",
    "diet": "Vegan",
    "goalTags": [
      "Budget Friendly",
      "Vegetarian / Plant-Based"
    ],
    "servings": 1,
    "prepMin": 10,
    "cookMin": 35,
    "totalMin": 45,
    "costPerServe": 1.7,
    "calories": 420,
    "protein": 22,
    "carbs": 65,
    "fat": 7,
    "fibre": 18,
    "scores": {
      "proteinDensity": 5.2,
      "proteinPerDollar": 12.9,
      "caloriesPerDollar": 247.1,
      "satiety": 92.0,
      "nutrientDensity": 92.0,
      "affordability": 88.0,
      "simplicity": 48.75,
      "mealPrep": 78.0,
      "calories": 84.0,
      "fibre": 100.0
    },
    "ingredientPattern": "Chilli | Beans + tomato + veg",
    "method": "Simmer beans, tomato and vegetables.",
    "notes": "Very affordable.",
    "nutritionSource": "estimated"
  },
  {
    "id": "R059",
    "name": "Loaded Tuna Potato",
    "category": "Lunch",
    "diet": "Pescatarian",
    "goalTags": [
      "Fat Loss",
      "Budget Friendly"
    ],
    "servings": 1,
    "prepMin": 8,
    "cookMin": 10,
    "totalMin": 18,
    "costPerServe": 2.3,
    "calories": 430,
    "protein": 35,
    "carbs": 52,
    "fat": 8,
    "fibre": 8,
    "scores": {
      "proteinDensity": 8.1,
      "proteinPerDollar": 15.2,
      "caloriesPerDollar": 187.0,
      "satiety": 88.0,
      "nutrientDensity": 88.0,
      "affordability": 82.0,
      "simplicity": 82.5,
      "mealPrep": 74.0,
      "calories": 86.0,
      "fibre": 53.3336
    },
    "ingredientPattern": "Loaded Potato | Potato + tuna + yoghurt + salad",
    "method": "Microwave potato; top with tuna yoghurt mix and salad.",
    "notes": "Satiety-focused budget meal.",
    "nutritionSource": "estimated"
  },
  {
    "id": "R060",
    "name": "Loaded Bean Chilli Potato",
    "category": "Dinner",
    "diet": "Vegan",
    "goalTags": [
      "Budget Friendly",
      "Vegetarian / Plant-Based"
    ],
    "servings": 1,
    "prepMin": 8,
    "cookMin": 12,
    "totalMin": 20,
    "costPerServe": 1.8,
    "calories": 460,
    "protein": 20,
    "carbs": 78,
    "fat": 6,
    "fibre": 16,
    "scores": {
      "proteinDensity": 4.3,
      "proteinPerDollar": 11.1,
      "caloriesPerDollar": 255.6,
      "satiety": 92.0,
      "nutrientDensity": 90.0,
      "affordability": 87.0,
      "simplicity": 80.0,
      "mealPrep": 76.0,
      "calories": 92.0,
      "fibre": 100.0
    },
    "ingredientPattern": "Loaded Potato | Potato + bean chilli + salsa",
    "method": "Top potato with leftover bean chilli and salsa.",
    "notes": "Cheap and filling.",
    "nutritionSource": "estimated"
  },
  {
    "id": "R061",
    "name": "Chicken Fajita Wrap",
    "category": "Lunch",
    "diet": "Omnivore",
    "goalTags": [
      "Time Efficient",
      "Family Friendly"
    ],
    "servings": 1,
    "prepMin": 10,
    "cookMin": 12,
    "totalMin": 22,
    "costPerServe": 3.7,
    "calories": 510,
    "protein": 39,
    "carbs": 52,
    "fat": 15,
    "fibre": 6,
    "scores": {
      "proteinDensity": 7.6,
      "proteinPerDollar": 10.5,
      "caloriesPerDollar": 137.8,
      "satiety": 78.0,
      "nutrientDensity": 80.0,
      "affordability": 68.0,
      "simplicity": 77.5,
      "mealPrep": 78.0,
      "calories": 98.0,
      "fibre": 40.0002
    },
    "ingredientPattern": "Wrap / Taco | Chicken + wrap + capsicum + salsa",
    "method": "Cook fajita chicken and veg; wrap with salsa.",
    "notes": "Provider-friendly familiar flavour.",
    "nutritionSource": "estimated"
  },
  {
    "id": "R062",
    "name": "Fish Taco Bowl",
    "category": "Dinner",
    "diet": "Pescatarian",
    "goalTags": [
      "General Health",
      "Family Friendly"
    ],
    "servings": 1,
    "prepMin": 10,
    "cookMin": 15,
    "totalMin": 25,
    "costPerServe": 5.2,
    "calories": 480,
    "protein": 34,
    "carbs": 50,
    "fat": 14,
    "fibre": 8,
    "scores": {
      "proteinDensity": 7.1,
      "proteinPerDollar": 6.5,
      "caloriesPerDollar": 92.3,
      "satiety": 82.0,
      "nutrientDensity": 70.0,
      "affordability": 53.0,
      "simplicity": 73.75,
      "mealPrep": 76.0,
      "calories": 96.0,
      "fibre": 53.3336
    },
    "ingredientPattern": "Wrap / Taco | Fish + slaw + tortilla/rice + salsa",
    "method": "Pan-cook fish; serve with slaw and salsa.",
    "notes": "Fresh high-adherence meal.",
    "nutritionSource": "estimated"
  },
  {
    "id": "R063",
    "name": "Egg Breakfast Burrito Bowl",
    "category": "Breakfast",
    "diet": "Vegetarian",
    "goalTags": [
      "Budget Friendly",
      "Time Efficient",
      "Family Friendly"
    ],
    "servings": 1,
    "prepMin": 8,
    "cookMin": 10,
    "totalMin": 18,
    "costPerServe": 2.2,
    "calories": 420,
    "protein": 25,
    "carbs": 42,
    "fat": 16,
    "fibre": 7,
    "scores": {
      "proteinDensity": 6.0,
      "proteinPerDollar": 11.4,
      "caloriesPerDollar": 190.9,
      "satiety": 76.0,
      "nutrientDensity": 86.0,
      "affordability": 83.0,
      "simplicity": 82.5,
      "mealPrep": 74.0,
      "calories": 84.0,
      "fibre": 46.6669
    },
    "ingredientPattern": "Omelette / Egg Bowl | Eggs + potato/rice + salsa + veg",
    "method": "Scramble eggs; serve with potato, salsa and veg.",
    "notes": "Inspired by breakfast burrito bowl pattern.",
    "nutritionSource": "estimated"
  },
  {
    "id": "R064",
    "name": "Feta Potato Omelette",
    "category": "Breakfast",
    "diet": "Vegetarian",
    "goalTags": [
      "Fat Loss",
      "Budget Friendly",
      "Time Efficient"
    ],
    "servings": 1,
    "prepMin": 8,
    "cookMin": 12,
    "totalMin": 20,
    "costPerServe": 2.4,
    "calories": 390,
    "protein": 27,
    "carbs": 30,
    "fat": 18,
    "fibre": 6,
    "scores": {
      "proteinDensity": 6.9,
      "proteinPerDollar": 11.2,
      "caloriesPerDollar": 162.5,
      "satiety": 78.0,
      "nutrientDensity": 84.0,
      "affordability": 81.0,
      "simplicity": 80.0,
      "mealPrep": 70.0,
      "calories": 78.0,
      "fibre": 40.0002
    },
    "ingredientPattern": "Omelette / Egg Bowl | Eggs + potato + feta + spinach",
    "method": "Cook potato and spinach; add eggs and feta.",
    "notes": "Cheap breakfast/lunch.",
    "nutritionSource": "estimated"
  },
  {
    "id": "R065",
    "name": "Greek Yoghurt Apple Crunch Bowl",
    "category": "Breakfast",
    "diet": "Vegetarian",
    "goalTags": [
      "Fat Loss",
      "General Health",
      "Time Efficient"
    ],
    "servings": 1,
    "prepMin": 4,
    "cookMin": 0,
    "totalMin": 4,
    "costPerServe": 2.2,
    "calories": 330,
    "protein": 31,
    "carbs": 38,
    "fat": 7,
    "fibre": 8,
    "scores": {
      "proteinDensity": 9.4,
      "proteinPerDollar": 14.1,
      "caloriesPerDollar": 150.0,
      "satiety": 88.0,
      "nutrientDensity": 84.0,
      "affordability": 83.0,
      "simplicity": 100.0,
      "mealPrep": 68.0,
      "calories": 66.0,
      "fibre": 53.3336
    },
    "ingredientPattern": "Greek Yoghurt Bowl | Greek yoghurt + apple + oats + cinnamon",
    "method": "Assemble bowl.",
    "notes": "No-cook.",
    "nutritionSource": "estimated"
  },
  {
    "id": "R066",
    "name": "Chocolate Protein Yoghurt Pudding",
    "category": "Snack",
    "diet": "Vegetarian",
    "goalTags": [
      "Fat Loss",
      "Time Efficient"
    ],
    "servings": 1,
    "prepMin": 3,
    "cookMin": 0,
    "totalMin": 3,
    "costPerServe": 2.5,
    "calories": 290,
    "protein": 35,
    "carbs": 22,
    "fat": 6,
    "fibre": 5,
    "scores": {
      "proteinDensity": 12.1,
      "proteinPerDollar": 14.0,
      "caloriesPerDollar": 116.0,
      "satiety": 86.0,
      "nutrientDensity": 78.0,
      "affordability": 80.0,
      "simplicity": 100.0,
      "mealPrep": 62.0,
      "calories": 58.0,
      "fibre": 33.3335
    },
    "ingredientPattern": "Greek Yoghurt Bowl | Greek yoghurt + protein + cocoa + berries",
    "method": "Mix yoghurt, protein and cocoa; top with berries.",
    "notes": "High-protein dessert substitute.",
    "nutritionSource": "estimated"
  },
  {
    "id": "R067",
    "name": "Berry Peanut Butter Overnight Oats",
    "category": "Breakfast",
    "diet": "Vegetarian",
    "goalTags": [
      "Budget Friendly"
    ],
    "servings": 1,
    "prepMin": 5,
    "cookMin": 0,
    "totalMin": 5,
    "costPerServe": 1.9,
    "calories": 520,
    "protein": 32,
    "carbs": 60,
    "fat": 18,
    "fibre": 11,
    "scores": {
      "proteinDensity": 6.2,
      "proteinPerDollar": 16.8,
      "caloriesPerDollar": 273.7,
      "satiety": 78.0,
      "nutrientDensity": 88.0,
      "affordability": 86.0,
      "simplicity": 98.75,
      "mealPrep": 80.0,
      "calories": 96.0,
      "fibre": 73.3337
    },
    "ingredientPattern": "Overnight Oats | Oats + milk + yoghurt + berries + peanut butter",
    "method": "Mix and refrigerate overnight.",
    "notes": "Meal prep breakfast.",
    "nutritionSource": "estimated"
  },
  {
    "id": "R068",
    "name": "Apple Cinnamon Overnight Oats",
    "category": "Breakfast",
    "diet": "Vegetarian",
    "goalTags": [
      "General Health",
      "Budget Friendly"
    ],
    "servings": 1,
    "prepMin": 5,
    "cookMin": 0,
    "totalMin": 5,
    "costPerServe": 1.6,
    "calories": 440,
    "protein": 24,
    "carbs": 62,
    "fat": 10,
    "fibre": 12,
    "scores": {
      "proteinDensity": 5.5,
      "proteinPerDollar": 15.0,
      "caloriesPerDollar": 275.0,
      "satiety": 82.0,
      "nutrientDensity": 92.0,
      "affordability": 89.0,
      "simplicity": 98.75,
      "mealPrep": 76.0,
      "calories": 88.0,
      "fibre": 80.0004
    },
    "ingredientPattern": "Overnight Oats | Oats + yoghurt + apple + cinnamon",
    "method": "Mix and refrigerate overnight.",
    "notes": "Cheaper variant.",
    "nutritionSource": "estimated"
  },
  {
    "id": "R069",
    "name": "Mocha Protein Overnight Oats",
    "category": "Breakfast",
    "diet": "Vegetarian",
    "goalTags": [
      "Muscle Gain",
      "Time Efficient"
    ],
    "servings": 1,
    "prepMin": 5,
    "cookMin": 0,
    "totalMin": 5,
    "costPerServe": 2.4,
    "calories": 560,
    "protein": 42,
    "carbs": 62,
    "fat": 15,
    "fibre": 10,
    "scores": {
      "proteinDensity": 7.5,
      "proteinPerDollar": 17.5,
      "caloriesPerDollar": 233.3,
      "satiety": 82.0,
      "nutrientDensity": 84.0,
      "affordability": 81.0,
      "simplicity": 98.75,
      "mealPrep": 84.0,
      "calories": 88.0,
      "fibre": 66.667
    },
    "ingredientPattern": "Overnight Oats | Oats + coffee + protein + yoghurt",
    "method": "Mix and refrigerate overnight.",
    "notes": "Active-user breakfast.",
    "nutritionSource": "estimated"
  },
  {
    "id": "R070",
    "name": "Chicken Fried Rice",
    "category": "Dinner",
    "diet": "Omnivore",
    "goalTags": [
      "Budget Friendly",
      "Time Efficient",
      "Family Friendly"
    ],
    "servings": 1,
    "prepMin": 10,
    "cookMin": 12,
    "totalMin": 22,
    "costPerServe": 2.8,
    "calories": 540,
    "protein": 38,
    "carbs": 68,
    "fat": 12,
    "fibre": 7,
    "scores": {
      "proteinDensity": 7.0,
      "proteinPerDollar": 13.6,
      "caloriesPerDollar": 192.9,
      "satiety": 78.0,
      "nutrientDensity": 86.0,
      "affordability": 77.0,
      "simplicity": 77.5,
      "mealPrep": 78.0,
      "calories": 92.0,
      "fibre": 46.6669
    },
    "ingredientPattern": "Fried Rice | Chicken + rice + egg + frozen veg",
    "method": "Use leftover rice; stir fry with chicken, egg and veg.",
    "notes": "Leftover-friendly.",
    "nutritionSource": "estimated"
  },
  {
    "id": "R071",
    "name": "Egg Fried Rice with Edamame",
    "category": "Dinner",
    "diet": "Vegetarian",
    "goalTags": [
      "Budget Friendly",
      "Time Efficient",
      "Vegetarian / Plant-Based"
    ],
    "servings": 1,
    "prepMin": 8,
    "cookMin": 10,
    "totalMin": 18,
    "costPerServe": 2.3,
    "calories": 500,
    "protein": 25,
    "carbs": 66,
    "fat": 14,
    "fibre": 8,
    "scores": {
      "proteinDensity": 5.0,
      "proteinPerDollar": 10.9,
      "caloriesPerDollar": 217.4,
      "satiety": 78.0,
      "nutrientDensity": 88.0,
      "affordability": 82.0,
      "simplicity": 82.5,
      "mealPrep": 76.0,
      "calories": 100.0,
      "fibre": 53.3336
    },
    "ingredientPattern": "Fried Rice | Egg + rice + edamame + veg",
    "method": "Stir fry rice, egg, edamame and vegetables.",
    "notes": "Cheap vegetarian protein.",
    "nutritionSource": "estimated"
  },
  {
    "id": "R072",
    "name": "Japanese Beef Fried Rice Lean",
    "category": "Dinner",
    "diet": "Omnivore",
    "goalTags": [
      "Muscle Gain",
      "Time Efficient"
    ],
    "servings": 1,
    "prepMin": 10,
    "cookMin": 12,
    "totalMin": 22,
    "costPerServe": 4.3,
    "calories": 520,
    "protein": 40,
    "carbs": 58,
    "fat": 14,
    "fibre": 6,
    "scores": {
      "proteinDensity": 7.7,
      "proteinPerDollar": 9.3,
      "caloriesPerDollar": 120.9,
      "satiety": 76.0,
      "nutrientDensity": 78.0,
      "affordability": 62.0,
      "simplicity": 77.5,
      "mealPrep": 80.0,
      "calories": 96.0,
      "fibre": 40.0002
    },
    "ingredientPattern": "Fried Rice | Lean beef + rice + egg + veg",
    "method": "Stir fry lean beef and rice with soy-ginger sauce.",
    "notes": "Commercially validated pattern.",
    "nutritionSource": "estimated"
  },
  {
    "id": "R073",
    "name": "Burger Bowl Lean",
    "category": "Dinner",
    "diet": "Omnivore",
    "goalTags": [
      "Fat Loss",
      "Family Friendly"
    ],
    "servings": 1,
    "prepMin": 10,
    "cookMin": 15,
    "totalMin": 25,
    "costPerServe": 3.8,
    "calories": 480,
    "protein": 38,
    "carbs": 35,
    "fat": 19,
    "fibre": 7,
    "scores": {
      "proteinDensity": 7.9,
      "proteinPerDollar": 10.0,
      "caloriesPerDollar": 126.3,
      "satiety": 78.0,
      "nutrientDensity": 80.0,
      "affordability": 67.0,
      "simplicity": 73.75,
      "mealPrep": 74.0,
      "calories": 96.0,
      "fibre": 46.6669
    },
    "ingredientPattern": "Burger / Fakeaway Bowl | Lean mince + potato + salad + burger sauce",
    "method": "Cook mince; serve with potato wedges and salad.",
    "notes": "Fakeaway without the blowout.",
    "nutritionSource": "estimated"
  },
  {
    "id": "R074",
    "name": "Chicken Parmigiana Bowl",
    "category": "Dinner",
    "diet": "Omnivore",
    "goalTags": [
      "Muscle Gain",
      "Family Friendly"
    ],
    "servings": 1,
    "prepMin": 12,
    "cookMin": 25,
    "totalMin": 37,
    "costPerServe": 4.6,
    "calories": 620,
    "protein": 48,
    "carbs": 52,
    "fat": 20,
    "fibre": 6,
    "scores": {
      "proteinDensity": 7.7,
      "proteinPerDollar": 10.4,
      "caloriesPerDollar": 134.8,
      "satiety": 76.0,
      "nutrientDensity": 74.0,
      "affordability": 59.0,
      "simplicity": 58.75,
      "mealPrep": 82.0,
      "calories": 76.0,
      "fibre": 40.0002
    },
    "ingredientPattern": "Burger / Fakeaway Bowl | Chicken + potato + tomato + cheese + veg",
    "method": "Bake chicken with tomato and cheese; serve with potato and salad.",
    "notes": "Comfort remake.",
    "nutritionSource": "estimated"
  },
  {
    "id": "R075",
    "name": "Kebab / Yeeros Bowl Lean",
    "category": "Lunch",
    "diet": "Omnivore",
    "goalTags": [
      "Time Efficient",
      "Family Friendly"
    ],
    "servings": 1,
    "prepMin": 10,
    "cookMin": 12,
    "totalMin": 22,
    "costPerServe": 4.0,
    "calories": 470,
    "protein": 36,
    "carbs": 38,
    "fat": 18,
    "fibre": 7,
    "scores": {
      "proteinDensity": 7.7,
      "proteinPerDollar": 9.0,
      "caloriesPerDollar": 117.5,
      "satiety": 76.0,
      "nutrientDensity": 76.0,
      "affordability": 65.0,
      "simplicity": 77.5,
      "mealPrep": 74.0,
      "calories": 94.0,
      "fibre": 46.6669
    },
    "ingredientPattern": "Burger / Fakeaway Bowl | Chicken/lamb + pita/rice + salad + yoghurt sauce",
    "method": "Cook spiced meat; serve as bowl.",
    "notes": "Provider pattern from yeeros-style meals.",
    "nutritionSource": "estimated"
  },
  {
    "id": "R076",
    "name": "Lentil Vegetable Soup",
    "category": "Lunch",
    "diet": "Vegan",
    "goalTags": [
      "Fat Loss",
      "Budget Friendly"
    ],
    "servings": 1,
    "prepMin": 10,
    "cookMin": 30,
    "totalMin": 40,
    "costPerServe": 1.5,
    "calories": 360,
    "protein": 20,
    "carbs": 52,
    "fat": 6,
    "fibre": 15,
    "scores": {
      "proteinDensity": 5.6,
      "proteinPerDollar": 13.3,
      "caloriesPerDollar": 240.0,
      "satiety": 92.0,
      "nutrientDensity": 94.0,
      "affordability": 90.0,
      "simplicity": 55.0,
      "mealPrep": 72.0,
      "calories": 72.0,
      "fibre": 100.0
    },
    "ingredientPattern": "Soup / Stew | Lentils + vegetables + broth",
    "method": "Simmer lentils and vegetables until tender.",
    "notes": "Cheap satiety.",
    "nutritionSource": "estimated"
  },
  {
    "id": "R077",
    "name": "Chicken Minestrone Soup",
    "category": "Lunch",
    "diet": "Omnivore",
    "goalTags": [
      "Fat Loss",
      "General Health"
    ],
    "servings": 1,
    "prepMin": 10,
    "cookMin": 30,
    "totalMin": 40,
    "costPerServe": 2.9,
    "calories": 390,
    "protein": 34,
    "carbs": 42,
    "fat": 8,
    "fibre": 10,
    "scores": {
      "proteinDensity": 8.7,
      "proteinPerDollar": 11.7,
      "caloriesPerDollar": 134.5,
      "satiety": 90.0,
      "nutrientDensity": 86.0,
      "affordability": 76.0,
      "simplicity": 55.0,
      "mealPrep": 72.0,
      "calories": 78.0,
      "fibre": 66.667
    },
    "ingredientPattern": "Soup / Stew | Chicken + beans + pasta + vegetables",
    "method": "Simmer chicken, beans, pasta and vegetables.",
    "notes": "Balanced soup.",
    "nutritionSource": "estimated"
  },
  {
    "id": "R078",
    "name": "Beef and Barley Stew",
    "category": "Dinner",
    "diet": "Omnivore",
    "goalTags": [
      "Family Friendly"
    ],
    "servings": 1,
    "prepMin": 15,
    "cookMin": 60,
    "totalMin": 75,
    "costPerServe": 4.2,
    "calories": 520,
    "protein": 38,
    "carbs": 52,
    "fat": 16,
    "fibre": 10,
    "scores": {
      "proteinDensity": 7.3,
      "proteinPerDollar": 9.0,
      "caloriesPerDollar": 123.8,
      "satiety": 82.0,
      "nutrientDensity": 78.0,
      "affordability": 63.0,
      "simplicity": 11.25,
      "mealPrep": 74.0,
      "calories": 96.0,
      "fibre": 66.667
    },
    "ingredientPattern": "Soup / Stew | Beef + barley + vegetables",
    "method": "Slow simmer beef, barley and vegetables.",
    "notes": "Longer cook, great batch meal.",
    "nutritionSource": "estimated"
  },
  {
    "id": "R079",
    "name": "Cottage Cheese Savoury Bowl",
    "category": "Lunch",
    "diet": "Vegetarian",
    "goalTags": [
      "Fat Loss",
      "Time Efficient"
    ],
    "servings": 1,
    "prepMin": 5,
    "cookMin": 0,
    "totalMin": 5,
    "costPerServe": 2.8,
    "calories": 330,
    "protein": 35,
    "carbs": 28,
    "fat": 9,
    "fibre": 6,
    "scores": {
      "proteinDensity": 10.6,
      "proteinPerDollar": 12.5,
      "caloriesPerDollar": 117.9,
      "satiety": 86.0,
      "nutrientDensity": 78.0,
      "affordability": 77.0,
      "simplicity": 98.75,
      "mealPrep": 65.0,
      "calories": 66.0,
      "fibre": 40.0002
    },
    "ingredientPattern": "Greek Yoghurt Bowl | Cottage cheese + potato/crackers + salad",
    "method": "Assemble cottage cheese bowl with salad and potato.",
    "notes": "No-cook high-protein lunch.",
    "nutritionSource": "estimated"
  },
  {
    "id": "R080",
    "name": "Protein Smoothie Bowl",
    "category": "Breakfast",
    "diet": "Vegetarian",
    "goalTags": [
      "Muscle Gain",
      "Time Efficient"
    ],
    "servings": 1,
    "prepMin": 5,
    "cookMin": 0,
    "totalMin": 5,
    "costPerServe": 3.1,
    "calories": 480,
    "protein": 40,
    "carbs": 55,
    "fat": 11,
    "fibre": 8,
    "scores": {
      "proteinDensity": 8.3,
      "proteinPerDollar": 12.9,
      "caloriesPerDollar": 154.8,
      "satiety": 80.0,
      "nutrientDensity": 76.0,
      "affordability": 74.0,
      "simplicity": 98.75,
      "mealPrep": 78.0,
      "calories": 96.0,
      "fibre": 53.3336
    },
    "ingredientPattern": "Greek Yoghurt Bowl | Protein + yoghurt + fruit + oats",
    "method": "Blend and serve with oats/fruit.",
    "notes": "Fast active-user breakfast.",
    "nutritionSource": "estimated"
  },
  {
    "id": "R081",
    "name": "Tuna Rice Bowl",
    "category": "Lunch",
    "diet": "Pescatarian",
    "goalTags": [
      "Muscle Gain",
      "Budget Friendly",
      "Time Efficient"
    ],
    "servings": 1,
    "prepMin": 5,
    "cookMin": 2,
    "totalMin": 7,
    "costPerServe": 2.2,
    "calories": 520,
    "protein": 38,
    "carbs": 68,
    "fat": 7,
    "fibre": 5,
    "scores": {
      "proteinDensity": 7.3,
      "proteinPerDollar": 17.3,
      "caloriesPerDollar": 236.4,
      "satiety": 76.0,
      "nutrientDensity": 90.0,
      "affordability": 83.0,
      "simplicity": 96.25,
      "mealPrep": 82.0,
      "calories": 96.0,
      "fibre": 33.3335
    },
    "ingredientPattern": "Burrito Bowl | Tuna + rice + cucumber + sauce",
    "method": "Use microwave rice; assemble with tuna and salad.",
    "notes": "Fast pantry meal.",
    "nutritionSource": "estimated"
  },
  {
    "id": "R082",
    "name": "Cottage Cheese Pasta Bake",
    "category": "Dinner",
    "diet": "Vegetarian",
    "goalTags": [
      "Muscle Gain",
      "Family Friendly"
    ],
    "servings": 1,
    "prepMin": 15,
    "cookMin": 30,
    "totalMin": 45,
    "costPerServe": 3.1,
    "calories": 560,
    "protein": 36,
    "carbs": 62,
    "fat": 16,
    "fibre": 7,
    "scores": {
      "proteinDensity": 6.4,
      "proteinPerDollar": 11.6,
      "caloriesPerDollar": 180.6,
      "satiety": 76.0,
      "nutrientDensity": 82.0,
      "affordability": 74.0,
      "simplicity": 48.75,
      "mealPrep": 80.0,
      "calories": 88.0,
      "fibre": 46.6669
    },
    "ingredientPattern": "Protein Pasta | Cottage cheese + pasta + tomato + spinach",
    "method": "Blend cottage cheese into tomato sauce and bake.",
    "notes": "Vegetarian high-protein comfort.",
    "nutritionSource": "estimated"
  },
  {
    "id": "R083",
    "name": "Lean Meatball Pasta",
    "category": "Dinner",
    "diet": "Omnivore",
    "goalTags": [
      "Family Friendly"
    ],
    "servings": 1,
    "prepMin": 15,
    "cookMin": 25,
    "totalMin": 40,
    "costPerServe": 4.0,
    "calories": 590,
    "protein": 42,
    "carbs": 58,
    "fat": 18,
    "fibre": 7,
    "scores": {
      "proteinDensity": 7.1,
      "proteinPerDollar": 10.5,
      "caloriesPerDollar": 147.5,
      "satiety": 76.0,
      "nutrientDensity": 78.0,
      "affordability": 65.0,
      "simplicity": 55.0,
      "mealPrep": 80.0,
      "calories": 82.0,
      "fibre": 46.6669
    },
    "ingredientPattern": "Protein Pasta | Lean meatballs + pasta + tomato + veg",
    "method": "Bake/simmer meatballs; serve with pasta and sauce.",
    "notes": "Family-friendly.",
    "nutritionSource": "estimated"
  },
  {
    "id": "R084",
    "name": "Chicken Satay Rice Bowl",
    "category": "Dinner",
    "diet": "Omnivore",
    "goalTags": [
      "Muscle Gain",
      "Family Friendly"
    ],
    "servings": 1,
    "prepMin": 10,
    "cookMin": 18,
    "totalMin": 28,
    "costPerServe": 4.3,
    "calories": 610,
    "protein": 44,
    "carbs": 62,
    "fat": 20,
    "fibre": 7,
    "scores": {
      "proteinDensity": 7.2,
      "proteinPerDollar": 10.2,
      "caloriesPerDollar": 141.9,
      "satiety": 78.0,
      "nutrientDensity": 76.0,
      "affordability": 62.0,
      "simplicity": 70.0,
      "mealPrep": 82.0,
      "calories": 78.0,
      "fibre": 46.6669
    },
    "ingredientPattern": "Curry Bowl | Chicken + rice + veg + satay sauce",
    "method": "Cook chicken and veg; coat with lighter satay sauce.",
    "notes": "Common provider flavour.",
    "nutritionSource": "estimated"
  },
  {
    "id": "R085",
    "name": "Satay Tofu Bowl",
    "category": "Dinner",
    "diet": "Vegan",
    "goalTags": [
      "General Health",
      "Vegetarian / Plant-Based"
    ],
    "servings": 1,
    "prepMin": 10,
    "cookMin": 18,
    "totalMin": 28,
    "costPerServe": 3.6,
    "calories": 560,
    "protein": 27,
    "carbs": 62,
    "fat": 22,
    "fibre": 10,
    "scores": {
      "proteinDensity": 4.8,
      "proteinPerDollar": 7.5,
      "caloriesPerDollar": 155.6,
      "satiety": 80.0,
      "nutrientDensity": 80.0,
      "affordability": 69.0,
      "simplicity": 70.0,
      "mealPrep": 78.0,
      "calories": 88.0,
      "fibre": 66.667
    },
    "ingredientPattern": "Curry Bowl | Tofu + rice + veg + satay sauce",
    "method": "Crisp tofu; serve with rice, veg and satay sauce.",
    "notes": "Plant variant.",
    "nutritionSource": "estimated"
  },
  {
    "id": "R086",
    "name": "Portuguese Chicken Rice Bowl",
    "category": "Dinner",
    "diet": "Omnivore",
    "goalTags": [
      "Muscle Gain",
      "Family Friendly"
    ],
    "servings": 1,
    "prepMin": 10,
    "cookMin": 18,
    "totalMin": 28,
    "costPerServe": 4.2,
    "calories": 560,
    "protein": 43,
    "carbs": 55,
    "fat": 16,
    "fibre": 6,
    "scores": {
      "proteinDensity": 7.7,
      "proteinPerDollar": 10.2,
      "caloriesPerDollar": 133.3,
      "satiety": 78.0,
      "nutrientDensity": 78.0,
      "affordability": 63.0,
      "simplicity": 70.0,
      "mealPrep": 80.0,
      "calories": 88.0,
      "fibre": 40.0002
    },
    "ingredientPattern": "Protein + Carb + Veg | Chicken + rice + peas + peri sauce",
    "method": "Cook chicken with Portuguese seasoning; serve with rice and veg.",
    "notes": "Ready-meal pattern.",
    "nutritionSource": "estimated"
  },
  {
    "id": "R087",
    "name": "Lemon Herb Chicken Low Carb",
    "category": "Dinner",
    "diet": "Omnivore",
    "goalTags": [
      "Fat Loss",
      "Time Efficient"
    ],
    "servings": 1,
    "prepMin": 8,
    "cookMin": 18,
    "totalMin": 26,
    "costPerServe": 4.3,
    "calories": 360,
    "protein": 45,
    "carbs": 14,
    "fat": 13,
    "fibre": 7,
    "scores": {
      "proteinDensity": 12.5,
      "proteinPerDollar": 10.5,
      "caloriesPerDollar": 83.7,
      "satiety": 86.0,
      "nutrientDensity": 76.0,
      "affordability": 62.0,
      "simplicity": 72.5,
      "mealPrep": 64.0,
      "calories": 72.0,
      "fibre": 46.6669
    },
    "ingredientPattern": "Protein + Veg | Chicken + greens + roasted veg",
    "method": "Cook chicken and serve with roasted non-starchy veg.",
    "notes": "Lean low-carb meal.",
    "nutritionSource": "estimated"
  },
  {
    "id": "R088",
    "name": "Rump Steak Jasmine Rice Bowl",
    "category": "Dinner",
    "diet": "Omnivore",
    "goalTags": [
      "Muscle Gain"
    ],
    "servings": 1,
    "prepMin": 10,
    "cookMin": 15,
    "totalMin": 25,
    "costPerServe": 6.2,
    "calories": 650,
    "protein": 52,
    "carbs": 62,
    "fat": 18,
    "fibre": 5,
    "scores": {
      "proteinDensity": 8.0,
      "proteinPerDollar": 8.4,
      "caloriesPerDollar": 104.8,
      "satiety": 76.0,
      "nutrientDensity": 62.0,
      "affordability": 43.0,
      "simplicity": 73.75,
      "mealPrep": 84.0,
      "calories": 70.0,
      "fibre": 33.3335
    },
    "ingredientPattern": "Protein + Carb + Veg | Steak + rice + greens",
    "method": "Sear steak; serve with rice and greens.",
    "notes": "Higher-cost active meal.",
    "nutritionSource": "estimated"
  },
  {
    "id": "R089",
    "name": "Barramundi Salsa Verde Low Carb",
    "category": "Dinner",
    "diet": "Pescatarian",
    "goalTags": [
      "Fat Loss",
      "General Health"
    ],
    "servings": 1,
    "prepMin": 8,
    "cookMin": 15,
    "totalMin": 23,
    "costPerServe": 6.5,
    "calories": 360,
    "protein": 38,
    "carbs": 10,
    "fat": 16,
    "fibre": 5,
    "scores": {
      "proteinDensity": 10.6,
      "proteinPerDollar": 5.8,
      "caloriesPerDollar": 55.4,
      "satiety": 82.0,
      "nutrientDensity": 60.0,
      "affordability": 40.0,
      "simplicity": 76.25,
      "mealPrep": 64.0,
      "calories": 72.0,
      "fibre": 33.3335
    },
    "ingredientPattern": "Protein + Veg | Fish + salsa verde + veg",
    "method": "Pan-cook fish; serve with salsa verde and veg.",
    "notes": "Premium lean option.",
    "nutritionSource": "estimated"
  },
  {
    "id": "R090",
    "name": "Chicken Enchilada Stack",
    "category": "Dinner",
    "diet": "Omnivore",
    "goalTags": [
      "Family Friendly"
    ],
    "servings": 1,
    "prepMin": 15,
    "cookMin": 25,
    "totalMin": 40,
    "costPerServe": 4.2,
    "calories": 560,
    "protein": 42,
    "carbs": 50,
    "fat": 18,
    "fibre": 8,
    "scores": {
      "proteinDensity": 7.5,
      "proteinPerDollar": 10.0,
      "caloriesPerDollar": 133.3,
      "satiety": 78.0,
      "nutrientDensity": 78.0,
      "affordability": 63.0,
      "simplicity": 55.0,
      "mealPrep": 80.0,
      "calories": 88.0,
      "fibre": 53.3336
    },
    "ingredientPattern": "Burger / Fakeaway Bowl | Chicken + tortillas + tomato + beans + cheese",
    "method": "Layer chicken, tortillas, beans and sauce; bake.",
    "notes": "Comfort/family meal.",
    "nutritionSource": "estimated"
  }
];

export const INGREDIENTS = [
  {
    "name": "Rolled oats",
    "category": "Grain",
    "unit": "100g",
    "costPerUnit": 0.35,
    "calories": 389,
    "protein": 16.9,
    "carbs": 66.3,
    "fat": 6.9,
    "fibre": 10.6,
    "primaryValue": "Cheap fibre-rich carb",
    "notes": "Excellent breakfast base."
  },
  {
    "name": "Brown rice",
    "category": "Grain",
    "unit": "100g dry",
    "costPerUnit": 0.45,
    "calories": 370,
    "protein": 7.5,
    "carbs": 77.0,
    "fat": 2.7,
    "fibre": 3.5,
    "primaryValue": "Budget carb",
    "notes": "Batch-cooks well."
  },
  {
    "name": "Pasta",
    "category": "Grain",
    "unit": "100g dry",
    "costPerUnit": 0.4,
    "calories": 371,
    "protein": 13.0,
    "carbs": 75.0,
    "fat": 1.5,
    "fibre": 3.2,
    "primaryValue": "Cheap carb",
    "notes": "Choose wholemeal for more fibre."
  },
  {
    "name": "Potato",
    "category": "Starchy veg",
    "unit": "250g",
    "costPerUnit": 0.7,
    "calories": 193,
    "protein": 5.0,
    "carbs": 44.0,
    "fat": 0.2,
    "fibre": 5.5,
    "primaryValue": "Satiety",
    "notes": "High satiety per calorie."
  },
  {
    "name": "Sweet potato",
    "category": "Starchy veg",
    "unit": "250g",
    "costPerUnit": 1.0,
    "calories": 215,
    "protein": 4.0,
    "carbs": 50.0,
    "fat": 0.3,
    "fibre": 7.5,
    "primaryValue": "Nutrient carb",
    "notes": "Good fibre and micronutrients."
  },
  {
    "name": "Eggs",
    "category": "Protein",
    "unit": "2 large",
    "costPerUnit": 1.2,
    "calories": 144,
    "protein": 12.6,
    "carbs": 1.0,
    "fat": 9.5,
    "fibre": 0.0,
    "primaryValue": "Affordable protein",
    "notes": "Versatile and filling."
  },
  {
    "name": "Chicken breast",
    "category": "Protein",
    "unit": "100g",
    "costPerUnit": 1.6,
    "calories": 165,
    "protein": 31.0,
    "carbs": 0.0,
    "fat": 3.6,
    "fibre": 0.0,
    "primaryValue": "Lean protein",
    "notes": "High protein density."
  },
  {
    "name": "Lean beef mince",
    "category": "Protein",
    "unit": "100g",
    "costPerUnit": 1.9,
    "calories": 176,
    "protein": 26.0,
    "carbs": 0.0,
    "fat": 8.0,
    "fibre": 0.0,
    "primaryValue": "Iron/protein",
    "notes": "Useful for family meals."
  },
  {
    "name": "Turkey mince",
    "category": "Protein",
    "unit": "100g",
    "costPerUnit": 1.8,
    "calories": 170,
    "protein": 24.0,
    "carbs": 0.0,
    "fat": 8.0,
    "fibre": 0.0,
    "primaryValue": "Lean protein",
    "notes": "Swap for beef/chicken."
  },
  {
    "name": "Canned tuna",
    "category": "Protein",
    "unit": "95g can",
    "costPerUnit": 1.4,
    "calories": 110,
    "protein": 24.0,
    "carbs": 0.0,
    "fat": 1.0,
    "fibre": 0.0,
    "primaryValue": "Protein per dollar",
    "notes": "Pantry staple."
  },
  {
    "name": "Salmon",
    "category": "Protein",
    "unit": "100g",
    "costPerUnit": 4.0,
    "calories": 208,
    "protein": 20.0,
    "carbs": 0.0,
    "fat": 13.0,
    "fibre": 0.0,
    "primaryValue": "Omega-3",
    "notes": "Higher cost."
  },
  {
    "name": "Greek yoghurt",
    "category": "Dairy",
    "unit": "170g",
    "costPerUnit": 1.4,
    "calories": 100,
    "protein": 17.0,
    "carbs": 6.0,
    "fat": 0.7,
    "fibre": 0.0,
    "primaryValue": "Protein/snack",
    "notes": "Use plain unsweetened."
  },
  {
    "name": "Cottage cheese",
    "category": "Dairy",
    "unit": "150g",
    "costPerUnit": 1.8,
    "calories": 147,
    "protein": 20.0,
    "carbs": 5.0,
    "fat": 5.0,
    "fibre": 0.0,
    "primaryValue": "High protein",
    "notes": "Good snack or sauce base."
  },
  {
    "name": "Milk",
    "category": "Dairy",
    "unit": "250ml",
    "costPerUnit": 0.45,
    "calories": 155,
    "protein": 8.0,
    "carbs": 12.0,
    "fat": 8.0,
    "fibre": 0.0,
    "primaryValue": "Convenience",
    "notes": "Use reduced-fat if preferred."
  },
  {
    "name": "Whey protein",
    "category": "Supplement",
    "unit": "30g",
    "costPerUnit": 1.2,
    "calories": 120,
    "protein": 24.0,
    "carbs": 3.0,
    "fat": 2.0,
    "fibre": 0.0,
    "primaryValue": "Convenience protein",
    "notes": "Optional, not required."
  },
  {
    "name": "Lentils dry",
    "category": "Legume",
    "unit": "100g dry",
    "costPerUnit": 0.55,
    "calories": 352,
    "protein": 25.0,
    "carbs": 63.0,
    "fat": 1.1,
    "fibre": 10.7,
    "primaryValue": "Budget protein/fibre",
    "notes": "Excellent for batch meals."
  },
  {
    "name": "Canned lentils",
    "category": "Legume",
    "unit": "125g drained",
    "costPerUnit": 0.7,
    "calories": 145,
    "protein": 10.0,
    "carbs": 24.0,
    "fat": 0.5,
    "fibre": 8.0,
    "primaryValue": "Fast fibre",
    "notes": "Convenient."
  },
  {
    "name": "Black beans",
    "category": "Legume",
    "unit": "125g drained",
    "costPerUnit": 0.75,
    "calories": 165,
    "protein": 10.0,
    "carbs": 30.0,
    "fat": 0.5,
    "fibre": 8.0,
    "primaryValue": "Budget fibre",
    "notes": "Great in bowls/chilli."
  },
  {
    "name": "Chickpeas",
    "category": "Legume",
    "unit": "125g drained",
    "costPerUnit": 0.75,
    "calories": 205,
    "protein": 10.0,
    "carbs": 34.0,
    "fat": 3.0,
    "fibre": 9.0,
    "primaryValue": "Plant protein",
    "notes": "Curries and salads."
  },
  {
    "name": "Tofu firm",
    "category": "Protein",
    "unit": "150g",
    "costPerUnit": 1.8,
    "calories": 180,
    "protein": 18.0,
    "carbs": 3.0,
    "fat": 10.0,
    "fibre": 2.0,
    "primaryValue": "Plant protein",
    "notes": "Press for best texture."
  },
  {
    "name": "Tempeh",
    "category": "Protein",
    "unit": "100g",
    "costPerUnit": 2.2,
    "calories": 193,
    "protein": 20.0,
    "carbs": 9.0,
    "fat": 11.0,
    "fibre": 4.0,
    "primaryValue": "Plant protein",
    "notes": "Higher protein vegan option."
  },
  {
    "name": "Frozen mixed veg",
    "category": "Vegetable",
    "unit": "150g",
    "costPerUnit": 0.75,
    "calories": 75,
    "protein": 4.0,
    "carbs": 12.0,
    "fat": 0.5,
    "fibre": 5.0,
    "primaryValue": "Cheap micronutrients",
    "notes": "Reduces waste."
  },
  {
    "name": "Spinach",
    "category": "Vegetable",
    "unit": "75g",
    "costPerUnit": 1.2,
    "calories": 17,
    "protein": 2.2,
    "carbs": 1.1,
    "fat": 0.3,
    "fibre": 1.7,
    "primaryValue": "Micronutrients",
    "notes": "Fresh or frozen."
  },
  {
    "name": "Broccoli",
    "category": "Vegetable",
    "unit": "150g",
    "costPerUnit": 1.2,
    "calories": 51,
    "protein": 4.2,
    "carbs": 10.0,
    "fat": 0.6,
    "fibre": 5.0,
    "primaryValue": "Fibre/micronutrients",
    "notes": "High-volume side."
  },
  {
    "name": "Carrot",
    "category": "Vegetable",
    "unit": "100g",
    "costPerUnit": 0.3,
    "calories": 41,
    "protein": 0.9,
    "carbs": 10.0,
    "fat": 0.2,
    "fibre": 2.8,
    "primaryValue": "Budget veg",
    "notes": "Good in soups/bolognese."
  },
  {
    "name": "Onion",
    "category": "Vegetable",
    "unit": "100g",
    "costPerUnit": 0.3,
    "calories": 40,
    "protein": 1.1,
    "carbs": 9.0,
    "fat": 0.1,
    "fibre": 1.7,
    "primaryValue": "Flavour base",
    "notes": "Cheap flavour."
  },
  {
    "name": "Capsicum",
    "category": "Vegetable",
    "unit": "100g",
    "costPerUnit": 1.1,
    "calories": 31,
    "protein": 1.0,
    "carbs": 6.0,
    "fat": 0.3,
    "fibre": 2.1,
    "primaryValue": "Vitamin C",
    "notes": "Can be pricey seasonal."
  },
  {
    "name": "Tomato canned",
    "category": "Pantry",
    "unit": "400g can",
    "costPerUnit": 1.1,
    "calories": 92,
    "protein": 4.0,
    "carbs": 16.0,
    "fat": 0.8,
    "fibre": 4.0,
    "primaryValue": "Sauce base",
    "notes": "Cheap meal prep base."
  },
  {
    "name": "Tomato passata",
    "category": "Pantry",
    "unit": "500g",
    "costPerUnit": 1.8,
    "calories": 150,
    "protein": 7.0,
    "carbs": 27.0,
    "fat": 1.0,
    "fibre": 5.0,
    "primaryValue": "Sauce base",
    "notes": "Good bolognese/chilli."
  },
  {
    "name": "Salsa",
    "category": "Pantry",
    "unit": "50g",
    "costPerUnit": 0.35,
    "calories": 20,
    "protein": 1.0,
    "carbs": 4.0,
    "fat": 0.2,
    "fibre": 1.0,
    "primaryValue": "Low-cal sauce",
    "notes": "Bowls/wraps."
  },
  {
    "name": "Olive oil",
    "category": "Fat",
    "unit": "1 tbsp",
    "costPerUnit": 0.25,
    "calories": 119,
    "protein": 0.0,
    "carbs": 0.0,
    "fat": 13.5,
    "fibre": 0.0,
    "primaryValue": "Healthy fat",
    "notes": "Energy-dense."
  },
  {
    "name": "Peanut butter",
    "category": "Fat",
    "unit": "20g",
    "costPerUnit": 0.35,
    "calories": 118,
    "protein": 5.0,
    "carbs": 4.0,
    "fat": 10.0,
    "fibre": 1.5,
    "primaryValue": "Calories/flavour",
    "notes": "Good for gain/energy."
  },
  {
    "name": "Avocado",
    "category": "Fat",
    "unit": "75g",
    "costPerUnit": 1.5,
    "calories": 120,
    "protein": 1.5,
    "carbs": 6.0,
    "fat": 11.0,
    "fibre": 5.0,
    "primaryValue": "Healthy fat/fibre",
    "notes": "Seasonal price varies."
  },
  {
    "name": "Banana",
    "category": "Fruit",
    "unit": "1 medium",
    "costPerUnit": 0.5,
    "calories": 105,
    "protein": 1.3,
    "carbs": 27.0,
    "fat": 0.4,
    "fibre": 3.1,
    "primaryValue": "Cheap carb",
    "notes": "Good pre/post training."
  },
  {
    "name": "Apple",
    "category": "Fruit",
    "unit": "1 medium",
    "costPerUnit": 0.8,
    "calories": 95,
    "protein": 0.5,
    "carbs": 25.0,
    "fat": 0.3,
    "fibre": 4.4,
    "primaryValue": "Fibre snack",
    "notes": "Portable."
  },
  {
    "name": "Berries frozen",
    "category": "Fruit",
    "unit": "100g",
    "costPerUnit": 1.2,
    "calories": 50,
    "protein": 0.7,
    "carbs": 12.0,
    "fat": 0.3,
    "fibre": 5.0,
    "primaryValue": "Fibre/micronutrients",
    "notes": "Lower waste."
  },
  {
    "name": "Tortilla wholemeal",
    "category": "Grain",
    "unit": "1 wrap",
    "costPerUnit": 0.6,
    "calories": 180,
    "protein": 6.0,
    "carbs": 30.0,
    "fat": 4.0,
    "fibre": 4.0,
    "primaryValue": "Convenience carb",
    "notes": "Good for wraps/burritos."
  },
  {
    "name": "Bread wholegrain",
    "category": "Grain",
    "unit": "2 slices",
    "costPerUnit": 0.55,
    "calories": 180,
    "protein": 8.0,
    "carbs": 30.0,
    "fat": 3.0,
    "fibre": 5.0,
    "primaryValue": "Convenience carb",
    "notes": "Use higher-fibre bread."
  },
  {
    "name": "Quinoa",
    "category": "Grain",
    "unit": "100g dry",
    "costPerUnit": 1.5,
    "calories": 368,
    "protein": 14.0,
    "carbs": 64.0,
    "fat": 6.0,
    "fibre": 7.0,
    "primaryValue": "Plant protein/carb",
    "notes": "Higher cost."
  },
  {
    "name": "Couscous",
    "category": "Grain",
    "unit": "100g dry",
    "costPerUnit": 0.5,
    "calories": 376,
    "protein": 13.0,
    "carbs": 77.0,
    "fat": 0.6,
    "fibre": 5.0,
    "primaryValue": "Fast carb",
    "notes": "Very quick side."
  },
  {
    "name": "Coconut milk light",
    "category": "Pantry",
    "unit": "100ml",
    "costPerUnit": 0.55,
    "calories": 75,
    "protein": 1.0,
    "carbs": 2.0,
    "fat": 7.0,
    "fibre": 0.0,
    "primaryValue": "Curry base",
    "notes": "Use light for lower calories."
  },
  {
    "name": "Curry paste",
    "category": "Pantry",
    "unit": "25g",
    "costPerUnit": 0.45,
    "calories": 35,
    "protein": 1.0,
    "carbs": 5.0,
    "fat": 1.0,
    "fibre": 1.0,
    "primaryValue": "Flavour base",
    "notes": "Check sodium."
  },
  {
    "name": "Soy sauce",
    "category": "Pantry",
    "unit": "1 tbsp",
    "costPerUnit": 0.1,
    "calories": 10,
    "protein": 1.0,
    "carbs": 1.0,
    "fat": 0.0,
    "fibre": 0.0,
    "primaryValue": "Flavour",
    "notes": "High sodium."
  },
  {
    "name": "Cheese reduced-fat",
    "category": "Dairy",
    "unit": "30g",
    "costPerUnit": 0.7,
    "calories": 80,
    "protein": 9.0,
    "carbs": 1.0,
    "fat": 5.0,
    "fibre": 0.0,
    "primaryValue": "Protein/flavour",
    "notes": "Useful in family meals."
  },
  {
    "name": "Hummus",
    "category": "Legume/fat",
    "unit": "50g",
    "costPerUnit": 0.75,
    "calories": 120,
    "protein": 4.0,
    "carbs": 10.0,
    "fat": 8.0,
    "fibre": 3.0,
    "primaryValue": "Plant snack",
    "notes": "Pair with veg."
  },
  {
    "name": "Pumpkin seeds",
    "category": "Fat/protein",
    "unit": "20g",
    "costPerUnit": 0.6,
    "calories": 112,
    "protein": 6.0,
    "carbs": 3.0,
    "fat": 9.0,
    "fibre": 1.0,
    "primaryValue": "Minerals",
    "notes": "Calorie-dense."
  },
  {
    "name": "Mushrooms",
    "category": "Vegetable",
    "unit": "100g",
    "costPerUnit": 1.0,
    "calories": 22,
    "protein": 3.0,
    "carbs": 3.0,
    "fat": 0.3,
    "fibre": 1.0,
    "primaryValue": "Volume/flavour",
    "notes": "Good mince extender."
  },
  {
    "name": "Cauliflower rice",
    "category": "Vegetable",
    "unit": "150g",
    "costPerUnit": 1.5,
    "calories": 38,
    "protein": 3.0,
    "carbs": 8.0,
    "fat": 0.4,
    "fibre": 3.0,
    "primaryValue": "Low-cal volume",
    "notes": "Useful fat-loss swap."
  },
  {
    "name": "Edamame",
    "category": "Legume",
    "unit": "100g",
    "costPerUnit": 1.5,
    "calories": 121,
    "protein": 11.0,
    "carbs": 9.0,
    "fat": 5.0,
    "fibre": 5.0,
    "primaryValue": "Plant protein",
    "notes": "Good bowls/snacks."
  }
];

export const GOALS = [
  {
    "name": "Fat Loss",
    "weights": {
      "proteinDensity": 0.3,
      "satiety": 0.35,
      "nutrientDensity": 0.2,
      "affordability": 0.05,
      "simplicity": 0.05,
      "mealPrep": 0.05,
      "calories": 0.0,
      "fibre": 0.0
    },
    "logic": "High satiety, high protein per calorie, lower calorie density."
  },
  {
    "name": "Muscle Gain",
    "weights": {
      "proteinDensity": 0.3,
      "satiety": 0.1,
      "nutrientDensity": 0.1,
      "affordability": 0.1,
      "simplicity": 0.05,
      "mealPrep": 0.15,
      "calories": 0.15,
      "fibre": 0.05
    },
    "logic": "Protein, sufficient calories, meal-prep practicality and value."
  },
  {
    "name": "General Health",
    "weights": {
      "proteinDensity": 0.18,
      "satiety": 0.15,
      "nutrientDensity": 0.32,
      "affordability": 0.1,
      "simplicity": 0.05,
      "mealPrep": 0.05,
      "calories": 0.0,
      "fibre": 0.15
    },
    "logic": "Nutrient density, fibre, variety, and adequate protein."
  },
  {
    "name": "Budget Friendly",
    "weights": {
      "proteinDensity": 0.18,
      "satiety": 0.1,
      "nutrientDensity": 0.17,
      "affordability": 0.35,
      "simplicity": 0.12,
      "mealPrep": 0.08,
      "calories": 0.0,
      "fibre": 0.0
    },
    "logic": "Lowest cost per serve and protein/nutrients per dollar."
  },
  {
    "name": "Time Efficient",
    "weights": {
      "proteinDensity": 0.16,
      "satiety": 0.12,
      "nutrientDensity": 0.14,
      "affordability": 0.08,
      "simplicity": 0.32,
      "mealPrep": 0.18,
      "calories": 0.0,
      "fibre": 0.0
    },
    "logic": "Fast prep, simple method, batch-friendly when possible."
  },
  {
    "name": "Family Friendly",
    "weights": {
      "proteinDensity": 0.18,
      "satiety": 0.14,
      "nutrientDensity": 0.16,
      "affordability": 0.12,
      "simplicity": 0.18,
      "mealPrep": 0.12,
      "calories": 0.05,
      "fibre": 0.05
    },
    "logic": "Familiar flavours, simple prep, balanced nutrition, affordable."
  },
  {
    "name": "Vegetarian / Plant-Based",
    "weights": {
      "proteinDensity": 0.22,
      "satiety": 0.18,
      "nutrientDensity": 0.25,
      "affordability": 0.15,
      "simplicity": 0.08,
      "mealPrep": 0.07,
      "calories": 0.0,
      "fibre": 0.05
    },
    "logic": "Plant-based protein adequacy, fibre, nutrients, and affordability."
  },
  {
    "name": "Endurance / Active",
    "weights": {
      "proteinDensity": 0.18,
      "satiety": 0.12,
      "nutrientDensity": 0.18,
      "affordability": 0.08,
      "simplicity": 0.08,
      "mealPrep": 0.12,
      "calories": 0.16,
      "fibre": 0.08
    },
    "logic": "Carbohydrate/fuel support, recovery protein, nutrients, and prep."
  }
];


/**
 * Recipe Archetypes — meal-template patterns used to generate variations.
 * Source: "Recipe Archetypes" sheet. Useful if you later want to generate
 * additional recipe variants programmatically rather than hand-authoring them.
 */
export const ARCHETYPES = [
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

/**
 * Situation filters — maps a casual "what's going on today" choice to a hard
 * filter applied before scoring. Source: "User Filters" sheet, Situation rows.
 */
export const SITUATION_FILTERS = {
  quick: { label: "I only have 10-20 minutes", test: (r) => r.totalMin <= 20 },
  comfort: { label: "I want comfort food", test: (r) => ["Burger / Fakeaway Bowl", "Protein Pasta", "Curry Bowl"].some((a) => r.ingredientPattern.startsWith(a)) },
  workLunches: { label: "I need work lunches", test: (r) => r.scores.mealPrep >= 70 },
  lowEffort: { label: "I want low effort", test: (r) => r.totalMin <= 30 && r.prepMin <= 15 },
};

/**
 * Score a single recipe against a goal's weights.
 * Returns a 0-100ish weighted score (component scores are already 0-100 scale
 * except proteinDensity/proteinPerDollar/caloriesPerDollar, which are raw
 * ratios — see normalizeComponent below for how those get folded in safely).
 */
function normalizeComponent(key, recipe) {
  // proteinDensity, proteinPerDollar, caloriesPerDollar are NOT 0-100 scores in
  // the source data (they're raw ratios like "8.8g protein per 100kcal").
  // The "Overall Base Score" / "Selected Goal Score" columns in the workbook
  // already fold every component into a 0-100 composite using the goal weights,
  // so for fidelity to the original spreadsheet, prefer scoreRecipeForGoal()
  // over re-deriving from raw components. This helper exists for future
  // extensibility (e.g. a custom goal not in GOALS).
  const raw = recipe.scores[key];
  if (raw === undefined) return 0;
  if (key === "proteinDensity") return Math.min(100, raw * 10); // ~10g/100kcal ≈ 100
  if (key === "proteinPerDollar") return Math.min(100, raw * 5);
  if (key === "caloriesPerDollar") return Math.min(100, raw / 3);
  return raw; // already 0-100
}

/**
 * Score a recipe against a named goal using that goal's weights.
 * This recomputes from component scores + weights rather than trusting the
 * spreadsheet's pre-baked "Selected Goal Score" column, so it works for ANY
 * goal in GOALS, not just whichever one the original dashboard had selected.
 */
export function scoreRecipeForGoal(recipe, goalName) {
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

/**
 * Main recommendation function.
 * @param {Object} params
 * @param {string} params.goal - one of GOALS[].name
 * @param {string} [params.situation] - one of SITUATION_FILTERS keys
 * @param {string} [params.diet] - "Omnivore" | "Vegetarian" | "Vegan" | "Pescatarian" | undefined for any
 * @param {number} [params.maxCostPerServe]
 * @param {number} [params.maxTotalMin]
 * @param {number} [params.minProtein]
 * @param {string[]} [params.pantryItems] - ingredient names the user already
 *   has at home (e.g. ["chicken", "rice", "eggs"]). Recipes that use more of
 *   these get a scoring boost and a "Uses what you have" badge. This is a
 *   SOFT boost, not a hard filter — per the "Architecture notes" above, the
 *   data only has free-text `ingredientPattern` per recipe (no structured
 *   recipe-ingredient join table yet), so exact pantry matching isn't
 *   reliable enough to filter on. Treat this as directional until a real
 *   ingredient-quantity table exists (see buildShoppingList's notes).
 * @param {number} [params.count=6] - how many recipes to return
 * @returns {Array} ranked recipes with `_score` and `_badges` attached
 */
export function recommendRecipes({
  goal,
  situation,
  diet,
  maxCostPerServe,
  maxTotalMin,
  minProtein,
  pantryItems,
  count = 6,
}) {
  let pool = RECIPES.slice();

  if (diet) pool = pool.filter((r) => r.diet === diet || (diet === "Vegetarian" && r.diet === "Vegan"));
  if (maxCostPerServe) pool = pool.filter((r) => r.costPerServe <= maxCostPerServe);
  if (maxTotalMin) pool = pool.filter((r) => r.totalMin <= maxTotalMin);
  if (minProtein) pool = pool.filter((r) => r.protein >= minProtein);
  if (situation && SITUATION_FILTERS[situation]) pool = pool.filter(SITUATION_FILTERS[situation].test);

  const scored = pool.map((r) => {
    const pantryHits = pantryMatchCount(r, pantryItems);
    const baseScore = scoreRecipeForGoal(r, goal);
    // Soft boost: up to +8 points for strong pantry overlap, scaled by how
    // many distinct pantry items the recipe's ingredient pattern mentions.
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

/**
 * Count how many of the user's pantry items appear in a recipe's free-text
 * ingredient pattern. Simple substring matching — see the param doc above
 * on recommendRecipes for why this is a soft signal, not exact.
 */
function pantryMatchCount(recipe, pantryItems) {
  if (!pantryItems || pantryItems.length === 0) return 0;
  const pattern = recipe.ingredientPattern.toLowerCase();
  return pantryItems.filter((item) => pattern.includes(item.toLowerCase())).length;
}

/**
 * Generate simple user-facing badges from thresholds — per the source
 * workbook's UX principle: "Trust without clutter... Badges are generated
 * from thresholds" rather than exposing raw scores to the user.
 */
export function badgesForRecipe(recipe) {
  const badges = [];
  if (recipe.protein >= 35) badges.push("High Protein");
  if (recipe.costPerServe <= 2.5) badges.push("Budget");
  if (recipe.totalMin <= 20) badges.push(`${recipe.totalMin} min`);
  if (recipe.scores.mealPrep >= 80) badges.push("Meal Prep");
  if (recipe.fibre >= 10) badges.push("High Fibre");
  if (recipe.diet === "Vegan" || recipe.diet === "Vegetarian") badges.push(recipe.diet);
  return badges;
}

/**
 * Grocery aisle groupings — maps INGREDIENTS categories to the aisle labels
 * shoppers actually navigate by, per the leading 2026 meal-planning apps'
 * pattern of "shopping lists categorised by grocery aisle." Order here also
 * defines display order in the UI (produce/fresh first, pantry last).
 */
const AISLE_LABELS = {
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

/**
 * Aggregate a shopping list from a set of chosen recipes, grouped by grocery
 * aisle (per the "categorised by grocery aisle, with smart quantity merging"
 * pattern leading 2026 apps use).
 *
 * HONEST LIMITATION — read before treating quantities as precise:
 * The source workbook has no per-recipe ingredient-quantity table, only a
 * free-text `ingredientPattern` (e.g. "Oats + milk/yoghurt + fruit"). This
 * function matches each pattern fragment against the INGREDIENTS reference
 * table where possible (to get a real unit/cost), but the QUANTITY per
 * recipe is always an estimate (one typical serving unit from INGREDIENTS),
 * not derived from the recipe's actual macros. Every returned item is
 * tagged `quantityConfidence: "estimated"` so the UI can disclose this
 * (e.g. "~" prefix on amounts) rather than presenting it as exact.
 *
 * For a production build: add a real recipe_ingredients join table with
 * (recipe_id, ingredient_name, quantity, unit) rows — likely sourced from
 * Josh manually quantifying each of the 90 recipes once, or a future LLM
 * pass cross-checked against each recipe's known macro totals.
 */
export function buildShoppingList(selectedRecipes) {
  const items = {};
  selectedRecipes.forEach((r) => {
    const parts = r.ingredientPattern.split(/[+,]/).map((s) => s.trim()).filter(Boolean);
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
          aisle: matched ? (AISLE_LABELS[matched.category] || "Pantry & Sauces") : "Other",
          quantityConfidence: "estimated",
        };
      }
      items[key].recipes.push(r.name);
    });
  });

  const grouped = {};
  Object.values(items).forEach((item) => {
    if (!grouped[item.aisle]) grouped[item.aisle] = [];
    grouped[item.aisle].push(item);
  });

  const aisleDisplayOrder = ["Fresh Produce", "Meat, Fish & Protein", "Dairy & Eggs", "Grains & Bakery", "Legumes & Canned", "Pantry & Sauces", "Oils & Fats", "Supplements", "Other"];
  return aisleDisplayOrder
    .filter((aisle) => grouped[aisle])
    .map((aisle) => ({ aisle, items: grouped[aisle] }));
}

/**
 * Find an ingredient's reference cost/macro data by fuzzy name match.
 * Useful for the shopping list / cost estimate features.
 */
export function lookupIngredient(name) {
  const n = name.toLowerCase();
  return INGREDIENTS.find((i) => n.includes(i.name.toLowerCase()) || i.name.toLowerCase().includes(n));
}
