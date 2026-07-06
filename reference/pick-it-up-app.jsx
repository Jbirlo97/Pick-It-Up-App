import { useState, useEffect, useRef, useCallback } from "react";

const C = {
  gd: "#1A4A2E",
  go: "#C8A96A",
  cr: "#F5EDD8",
  sg: "#6B8F71",
  sl: "#C8DDD0",
  ch: "#1C1C1C",
  ow: "#FAF7F2",
  mu: "#8A8A7A",
  wh: "#FFFFFF",
  rd: "#C0392B",
  am: "#E8A020",
};

const MDB = {
  goblet_squat: { name: "Goblet Squat", tier: 1, tags: ["strength", "lower"], muscles: "Quad, Glute, Core", primary: ["quad", "glute"], cues: ["Chest tall, elbows inside knees", "Drive through the whole foot", "Pause at the bottom"], errors: ["Heels rising — widen stance", "Knees caving — push out", "Forward lean"], regression: "Box squat", progression: "Bulgarian split squat", contra: ["acute knee injury"] },
  pushup: { name: "Push-up", tier: 1, tags: ["strength", "upper"], muscles: "Chest, Tricep, Shoulder", primary: ["chest", "tricep"], cues: ["Body rigid — glutes on", "Lower to an inch from floor", "Elbows at 45°"], errors: ["Hips sagging — elevate hands", "Head jutting — pack neck", "Half reps"], regression: "Elevated push-up", progression: "Archer push-up", contra: ["shoulder impingement", "wrist injury"] },
  hip_hinge: { name: "Hip Hinge", tier: 1, tags: ["strength", "lower"], muscles: "Hamstring, Glute, Low Back", primary: ["hamstring", "glute"], cues: ["Hinge at hip not waist", "Soft knee — not a squat", "Feel hamstring tension"], errors: ["Rounding lower back", "Squatting it — hips back", "Overextending at top"], regression: "Wall hip hinge", progression: "Single-leg RDL", contra: ["acute low back pain"] },
  glute_bridge: { name: "Glute Bridge", tier: 1, tags: ["strength", "lower"], muscles: "Glute, Hamstring, Core", primary: ["glute", "hamstring"], cues: ["Drive through heels", "Squeeze at top — 2s hold", "Neutral spine"], errors: ["Pushing through toes", "Over-arching — ribs down", "Short range"], regression: "Supine hip extension", progression: "Single-leg glute bridge", contra: ["acute low back pain"] },
  plank: { name: "Plank", tier: 1, tags: ["strength", "core"], muscles: "Core, Shoulder, Glute", primary: ["core"], cues: ["Straight line heel to crown", "Squeeze glutes and brace abs", "Eyes down — neck neutral"], errors: ["Hips sagging", "Hips too high", "Holding breath"], regression: "Knee plank", progression: "RKC plank", contra: ["acute shoulder injury"] },
  dead_bug: { name: "Dead Bug", tier: 1, tags: ["strength", "core"], muscles: "Deep Core, Anti-rotation", primary: ["core"], cues: ["Low back into floor — always", "Opposite arm and leg slowly", "Exhale as you extend"], errors: ["Back arching — reduce range", "Moving too fast", "Holding breath"], regression: "Arm-only version", progression: "Dead bug with band", contra: ["acute low back pain"] },
  hip_90_90: { name: "90/90 Hip Stretch", tier: 1, tags: ["mobility", "lower"], muscles: "Hip Flexor, Glute, External Rotator", primary: ["hipflexor", "glute"], cues: ["Both hips heavy — sit tall", "Lean into front shin", "Rotate to back leg for glute"], errors: ["Lifting hip — keep grounded", "Collapsing spine", "Rushing — go slow"], regression: "Supine figure-4", progression: "90/90 active rotations", contra: ["acute hip labral tear"] },
  breath_work: { name: "Box Breathing", tier: 1, tags: ["recovery", "mobility"], muscles: "Diaphragm, Nervous System", primary: [], cues: ["Inhale 4s — belly first", "Hold 4s — stay relaxed", "Exhale 4s — let go", "Hold 4s — empty"], errors: ["Chest breathing", "Forcing it", "Counting too fast"], regression: "2-2-2-2 pattern", progression: "6-6-6-6 pattern", contra: [] },
  inchworm: { name: "Inchworm", tier: 1, tags: ["mobility", "full body"], muscles: "Hamstring, Shoulder, Core", primary: ["hamstring", "shoulder"], cues: ["Hinge at hips — hands to floor", "Walk hands to plank", "Walk feet to hands"], errors: ["Bending knees too much", "Rushing", "Losing core in plank"], regression: "Short range", progression: "Inchworm with push-up", contra: ["acute low back pain"] },
  lunge: { name: "Reverse Lunge", tier: 1, tags: ["strength", "lower"], muscles: "Quad, Glute, Hip Flexor", primary: ["quad", "glute"], cues: ["Step back — front foot stays", "Front knee tracks toe", "Tall torso"], errors: ["Knee caving", "Leaning forward", "Short step"], regression: "Split squat", progression: "Bulgarian split squat", contra: ["acute knee injury"] },
  squat_jump: { name: "Squat Jump", tier: 2, tags: ["power", "lower"], muscles: "Quad, Glute, Calf", primary: ["quad", "glute", "calf"], cues: ["Land soft — toes then heels", "Absorb into squat on landing", "Drive arms on takeoff"], errors: ["Landing stiff", "Collapsing forward", "Shallow squat"], regression: "Squat to calf raise", progression: "Weighted squat jump", contra: ["acute knee injury"] },
  superman: { name: "Superman", tier: 1, tags: ["strength", "back"], muscles: "Erector Spinae, Glute", primary: ["lowback", "glute"], cues: ["Lift opposite arm and leg", "Hold 2s at top", "Lower with control"], errors: ["Jerking — slow down", "Neck hyperextending", "Not lifting high enough"], regression: "Alternating limbs only", progression: "Superman hold 30s", contra: ["acute low back pain"] },
  wall_sit: { name: "Wall Sit", tier: 1, tags: ["strength", "lower"], muscles: "Quad, Glute, Core", primary: ["quad", "glute"], cues: ["90° at hip and knee", "Back flat against wall", "Breathe — this is endurance"], errors: ["Knees past toes", "Back peeling off wall", "Looking down"], regression: "Partial wall sit", progression: "Single-leg wall sit", contra: ["acute knee injury"] },
  calf_raise: { name: "Calf Raise", tier: 1, tags: ["strength", "lower"], muscles: "Gastrocnemius, Soleus", primary: ["calf"], cues: ["Full range top to bottom", "Slow 3s descent", "Balance on one if too easy"], errors: ["Bouncing", "Partial range", "Momentum"], regression: "Seated calf raise", progression: "Single-leg calf raise", contra: ["acute achilles injury"] },
  bear_crawl: { name: "Bear Crawl", tier: 2, tags: ["strength", "core", "full body"], muscles: "Shoulder, Core, Hip Flexor", primary: ["shoulder", "core"], cues: ["Knees 1 inch off floor", "Opposite hand and foot together", "Hips level — no swaying"], errors: ["Knees dropping", "Hips too high", "Moving too fast"], regression: "Bear hold only", progression: "Bear crawl with band", contra: ["wrist injury"] },
  t_pushup: { name: "T Push-up", tier: 2, tags: ["strength", "upper", "core"], muscles: "Chest, Tricep, Oblique, Shoulder", primary: ["chest", "oblique"], cues: ["Push up, rotate, reach to ceiling", "Stack or stagger feet", "Hold the top for a beat"], errors: ["Rotating before pushing", "Hips dropping", "Rushing"], regression: "Push-up only", progression: "T push-up with DB row", contra: ["shoulder impingement"] },
  hollow_hold: { name: "Hollow Hold", tier: 2, tags: ["strength", "core"], muscles: "Deep Core, Hip Flexor", primary: ["core"], cues: ["Low back into floor", "Arms overhead, legs low and straight", "Point toes, squeeze inner thighs"], errors: ["Back lifting — raise legs higher", "Arms drifting", "Holding breath"], regression: "Bent-knee hollow hold", progression: "Hollow rock", contra: ["acute low back pain"] },
  sl_rdl: { name: "Single-leg RDL", tier: 2, tags: ["strength", "lower"], muscles: "Posterior Chain, Glute, Balance", primary: ["hamstring", "glute"], cues: ["Hinge and reach — back leg rises", "Square the hips", "Touch down lightly for balance"], errors: ["Hip rotation", "Standing knee buckling", "Too much range"], regression: "Kickstand RDL", progression: "Loaded single-leg RDL", contra: ["acute ankle instability"] },
  dead_hang: { name: "Dead Hang", tier: 2, tags: ["mobility", "upper"], muscles: "Grip, Lat, Shoulder Capsule", primary: ["lat", "shoulder"], cues: ["Full passive hang, then pull shoulders down", "Breathe — don't hold it", "Build to 60s over weeks"], errors: ["Shrugging up", "Swinging", "Jumping off"], regression: "Assisted hang", progression: "Active hang scapular pulls", contra: ["acute shoulder dislocation"] },
  row_bodyweight: { name: "Bodyweight Row", tier: 2, tags: ["strength", "upper"], muscles: "Lat, Bicep, Rear Delt", primary: ["lat", "bicep"], cues: ["Body rigid — legs straight for harder", "Pull chest to bar", "Elbows draw back, not out"], errors: ["Hips dropping", "Only using arms", "Partial range"], regression: "Incline row", progression: "Weighted row", contra: ["acute shoulder impingement"] },
  nordic_curl: { name: "Nordic Curl", tier: 3, tags: ["strength", "lower"], muscles: "Hamstring (eccentric), Glute", primary: ["hamstring"], cues: ["Lower as slowly as possible", "Catch yourself at the bottom", "Drive hips into extension to return"], errors: ["Dropping too fast", "Hips breaking", "Skipping range"], regression: "Assisted Nordic with band", progression: "Unassisted Nordic", contra: ["acute hamstring tear"] },
  side_plank: { name: "Side Plank", tier: 1, tags: ["strength", "core"], muscles: "Oblique, Glute Medius, Shoulder", primary: ["oblique", "glute"], cues: ["Stack hips and shoulders", "Lift hips high — straight line", "Top arm reaches to ceiling"], errors: ["Hips sagging", "Rolling forward", "Holding breath"], regression: "Knee-down side plank", progression: "Side plank with leg lift", contra: ["acute shoulder injury"] },
  pike_pushup: { name: "Pike Push-up", tier: 2, tags: ["strength", "upper"], muscles: "Shoulder, Tricep, Upper Chest", primary: ["shoulder", "tricep"], cues: ["Hips high — inverted V shape", "Crown of head toward floor", "Push through whole hand"], errors: ["Hips dropping too low", "Elbows flaring wide", "Short range"], regression: "Elevated pike push-up", progression: "Wall-assisted handstand push-up", contra: ["shoulder impingement"] },
  step_up: { name: "Step-up", tier: 1, tags: ["strength", "lower"], muscles: "Quad, Glute, Balance", primary: ["quad", "glute"], cues: ["Drive through the front heel", "Stand tall at the top", "Control the descent"], errors: ["Pushing off back leg", "Leaning forward", "Banging the knee"], regression: "Lower step height", progression: "Weighted step-up", contra: ["acute knee injury"] },
  farmer_carry: { name: "Farmer's Carry", tier: 2, tags: ["strength", "full body"], muscles: "Grip, Core, Trapezius", primary: ["core", "grip"], cues: ["Shoulders back and down", "Walk with control, no swaying", "Brace core like a punch is coming"], errors: ["Shrugging shoulders up", "Leaning to one side", "Rushing the steps"], regression: "Shorter distance, lighter load", progression: "Heavier load or single-arm carry", contra: ["acute grip or wrist injury"] },
  bird_dog: { name: "Bird Dog", tier: 1, tags: ["strength", "core"], muscles: "Core, Glute, Erector Spinae", primary: ["core", "glute"], cues: ["Extend opposite arm and leg slowly", "Keep hips level — don't rotate", "Pause at full extension"], errors: ["Hips rotating open", "Back arching", "Moving too fast"], regression: "Arm-only or leg-only", progression: "Bird dog with pause and pulse", contra: ["acute low back pain"] },
  cossack_squat: { name: "Cossack Squat", tier: 2, tags: ["mobility", "lower"], muscles: "Adductor, Glute, Quad", primary: ["quad", "glute"], cues: ["Shift weight fully to one side", "Keep the straight leg's foot flat", "Sit deep into the bent knee"], errors: ["Heel lifting on bent-knee side", "Rushing the shift", "Losing balance forward"], regression: "Assisted Cossack (hold support)", progression: "Loaded Cossack squat", contra: ["acute groin strain"] },
  mountain_climber: { name: "Mountain Climber", tier: 2, tags: ["power", "core", "full body"], muscles: "Core, Hip Flexor, Shoulder", primary: ["core", "hipflexor"], cues: ["Hips stay low — plank position", "Drive knees toward chest quickly", "Keep shoulders stacked over wrists"], errors: ["Hips bouncing up", "Half range of motion", "Hands creeping forward"], regression: "Slow controlled tempo", progression: "Mountain climber with sliders", contra: ["wrist injury"] },
  archer_pushup: { name: "Archer Push-up", tier: 3, tags: ["strength", "upper"], muscles: "Chest, Tricep, Shoulder", primary: ["chest", "tricep"], cues: ["Shift weight fully to one arm", "Other arm stays straight and low", "Push back to centre with control"], errors: ["Bent support arm collapsing", "Hips sagging", "Incomplete shift"], regression: "Wide push-up", progression: "Full one-arm push-up progression", contra: ["shoulder impingement", "wrist injury"] },
  pistol_squat_prep: { name: "Pistol Squat Prep", tier: 3, tags: ["strength", "lower"], muscles: "Quad, Glute, Balance", primary: ["quad", "glute"], cues: ["Hold support lightly for balance", "Sit back and down on one leg", "Extended leg stays off the floor"], errors: ["Knee caving inward", "Heel lifting", "Using too much hand support"], regression: "Box-assisted pistol squat", progression: "Full unassisted pistol squat", contra: ["acute knee injury"] },
  scapular_pushup: { name: "Scapular Push-up", tier: 1, tags: ["mobility", "upper"], muscles: "Serratus Anterior, Shoulder Stability", primary: ["shoulder"], cues: ["Start in plank, arms straight", "Let shoulder blades pinch together", "Push the floor away — blades spread"], errors: ["Bending the elbows", "Moving too fast", "Tiny range of motion"], regression: "Knee version", progression: "Scapular push-up at the top of a push-up", contra: [] },
  thread_needle: { name: "Thread the Needle", tier: 1, tags: ["mobility", "core"], muscles: "Thoracic Spine, Shoulder", primary: ["shoulder"], cues: ["Start on hands and knees", "Thread one arm under the body", "Rotate and reach up to open the chest"], errors: ["Hips shifting off centre", "Rushing the rotation", "Locking the supporting elbow"], regression: "Smaller range of rotation", progression: "Add a reach and hold at end range", contra: [] },
  copenhagen_plank: { name: "Copenhagen Plank", tier: 3, tags: ["strength", "core", "lower"], muscles: "Adductor, Oblique, Hip", primary: ["oblique", "hipflexor"], cues: ["Top foot rests on a bench or chair", "Hips lift into a straight line", "Bottom leg hovers, fully engaged"], errors: ["Hips sagging or rotating", "Top leg doing all the work", "Short hold time"], regression: "Bent bottom-knee version", progression: "Full straight-leg Copenhagen plank", contra: ["acute groin strain"] },
  jump_rope: { name: "Jump Rope", tier: 2, tags: ["power", "lower", "full body"], muscles: "Calf, Coordination, Cardio", primary: ["calf"], cues: ["Small jumps — an inch off the floor", "Wrists do the turning, not arms", "Land softly on the balls of your feet"], errors: ["Jumping too high", "Whole-arm turning", "Landing flat-footed"], regression: "Imaginary rope, same rhythm", progression: "Double-unders", contra: ["acute ankle injury"] },
  hip_circle: { name: "Standing Hip Circle", tier: 1, tags: ["mobility", "lower"], muscles: "Hip Capsule, Glute", primary: ["hipflexor", "glute"], cues: ["Hold support for balance if needed", "Trace a slow, full circle with the knee", "Equal reps both directions"], errors: ["Rushing the circle", "Tiny range of motion", "Letting the torso sway"], regression: "Smaller circles, seated", progression: "Standing on an unstable surface", contra: [] },
  cat_cow: { name: "Cat-Cow", tier: 1, tags: ["mobility", "recovery"], muscles: "Spine, Core", primary: ["core", "lowback"], cues: ["Inhale — drop belly, lift chest (cow)", "Exhale — round spine, tuck chin (cat)", "Move slowly through the full spine"], errors: ["Moving only the neck", "Holding the breath", "Rushing the transitions"], regression: "Smaller range", progression: "Add a pause at end range", contra: [] },
  banded_pull_apart: { name: "Band Pull-Apart", tier: 1, tags: ["strength", "upper"], muscles: "Rear Delt, Upper Back", primary: ["shoulder"], cues: ["Arms straight out in front, shoulder height", "Pull the band apart, squeeze shoulder blades", "Control the return — don't snap back"], errors: ["Bending the elbows", "Shrugging the shoulders", "Using momentum"], regression: "Lighter band", progression: "Heavier band or slow tempo", contra: [] },
};


const MOVS = Object.values(MDB);

function checkMovementContraindications(movement, injuryFlags) {
  if (!injuryFlags || injuryFlags.length === 0) return { blocked: false, matches: [] };
  const matches = movement.contra.filter(function (c) {
    return injuryFlags.some(function (flag) { return c.toLowerCase().indexOf(flag.toLowerCase()) !== -1; });
  });
  return { blocked: matches.length > 0, matches: matches };
}

function detectReadinessTrendDeterministic(sessionHistory, windowSize) {
  const win = windowSize || 3;
  const recent = (sessionHistory || []).slice(-win).map(function (s) { return s.readiness; });
  if (recent.length < 2) return "unknown";
  const diffs = [];
  for (let i = 1; i < recent.length; i++) diffs.push(recent[i] - recent[i - 1]);
  const allUp = diffs.every(function (d) { return d > 0; });
  const allDown = diffs.every(function (d) { return d < 0; });
  const allFlat = diffs.every(function (d) { return d === 0; });
  if (allFlat) return "stable";
  if (allUp) return "improving";
  if (allDown) return "declining";
  return "volatile";
}

function generateDeterministicSession(context) {
  const readiness = context.readiness || 3;
  const injuryFlags = context.injuryFlags || [];
  const trend = detectReadinessTrendDeterministic(context.sessionHistory);

  let pool = MOVS.slice();
  if (readiness <= 2) pool = pool.filter(function (m) { return m.tier === 1; });
  else if (readiness === 3) pool = pool.filter(function (m) { return m.tier <= 2; });

  const flagged = [];
  pool.forEach(function (m) {
    const check = checkMovementContraindications(m, injuryFlags);
    if (check.blocked) flagged.push({ movement: m, matchedInjuries: check.matches });
  });
  // SAFETY: contraindicated movements are removed from the selection pool,
  // not just listed. The flagged list is returned so the UI can tell the
  // user what was worked around and why.
  const flaggedNames = flagged.map(function (f) { return f.movement.name; });
  const safePool = pool.filter(function (m) { return flaggedNames.indexOf(m.name) === -1; });

  let exerciseCount = readiness <= 2 ? 2 : readiness === 3 ? 3 : readiness === 4 ? 4 : 5;
  let sets = readiness <= 2 ? 2 : readiness >= 4 ? 4 : 3;
  if (trend === "declining" && exerciseCount > 2) exerciseCount -= 1;
  if (trend === "volatile" && sets > 2) sets -= 1;
  if (exerciseCount > safePool.length) exerciseCount = safePool.length;

  const shuffled = safePool.slice().sort(function () { return Math.random() - 0.5; });
  const main = shuffled.slice(0, exerciseCount).map(function (m) {
    return { name: m.name, sets: sets, reps: readiness <= 2 ? "easy, 10-12" : "10", cue: m.cues[0], contra: m.contra };
  });

  return { main: main, flagged: flagged, trend: trend, readiness: readiness };
}


const FOODS = [
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

const DEMO_RECIPES = [
  {
    "id": "R068",
    "name": "Apple Cinnamon Overnight Oats",
    "category": "Breakfast",
    "diet": "Vegetarian",
    "servings": 1,
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
    "nutritionSource": "estimated"
  },
  {
    "id": "R065",
    "name": "Greek Yoghurt Apple Crunch Bowl",
    "category": "Breakfast",
    "diet": "Vegetarian",
    "servings": 1,
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
    "nutritionSource": "estimated"
  },
  {
    "id": "R002",
    "name": "Greek Yoghurt Berry Bowl",
    "category": "Breakfast",
    "diet": "Vegetarian",
    "servings": 1,
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
    "nutritionSource": "estimated"
  },
  {
    "id": "R001",
    "name": "High-Protein Overnight Oats",
    "category": "Breakfast",
    "diet": "Vegetarian",
    "servings": 1,
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
    "nutritionSource": "estimated"
  },
  {
    "id": "R076",
    "name": "Lentil Vegetable Soup",
    "category": "Lunch",
    "diet": "Vegan",
    "servings": 1,
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
    "nutritionSource": "estimated"
  },
  {
    "id": "R030",
    "name": "Quinoa Black Bean Bowl",
    "category": "Lunch",
    "diet": "Vegan",
    "servings": 3,
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
    "nutritionSource": "estimated"
  },
  {
    "id": "R059",
    "name": "Loaded Tuna Potato",
    "category": "Lunch",
    "diet": "Pescatarian",
    "servings": 1,
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
    "nutritionSource": "estimated"
  },
  {
    "id": "R077",
    "name": "Chicken Minestrone Soup",
    "category": "Lunch",
    "diet": "Omnivore",
    "servings": 1,
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
    "nutritionSource": "estimated"
  },
  {
    "id": "R021",
    "name": "Baked Potato with Beans & Yoghurt",
    "category": "Lunch",
    "diet": "Vegetarian",
    "servings": 1,
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
    "nutritionSource": "estimated"
  },
  {
    "id": "R033",
    "name": "Tofu Black Bean Burrito Bowl",
    "category": "Lunch",
    "diet": "Vegan",
    "servings": 1,
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
    "nutritionSource": "estimated"
  },
  {
    "id": "R058",
    "name": "Three Bean Veg Chilli",
    "category": "Dinner",
    "diet": "Vegan",
    "servings": 1,
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
    "nutritionSource": "estimated"
  },
  {
    "id": "R007",
    "name": "Lentil Chilli",
    "category": "Dinner",
    "diet": "Vegan",
    "servings": 6,
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
    "nutritionSource": "estimated"
  },
  {
    "id": "R060",
    "name": "Loaded Bean Chilli Potato",
    "category": "Dinner",
    "diet": "Vegan",
    "servings": 1,
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
    "nutritionSource": "estimated"
  },
  {
    "id": "R017",
    "name": "Minestrone with Lentils",
    "category": "Dinner",
    "diet": "Vegan",
    "servings": 6,
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
    "nutritionSource": "estimated"
  },
  {
    "id": "R028",
    "name": "Lentil Dahl with Rice",
    "category": "Dinner",
    "diet": "Vegan",
    "servings": 6,
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
    "nutritionSource": "estimated"
  },
  {
    "id": "R047",
    "name": "Lentil Bolognese",
    "category": "Dinner",
    "diet": "Vegan",
    "servings": 1,
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
    "nutritionSource": "estimated"
  },
  {
    "id": "R055",
    "name": "Lean Chilli Con Carne",
    "category": "Dinner",
    "diet": "Omnivore",
    "servings": 1,
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
    "nutritionSource": "estimated"
  },
  {
    "id": "R014",
    "name": "Salmon Potato Plate",
    "category": "Dinner",
    "diet": "Pescatarian",
    "servings": 2,
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
    "nutritionSource": "estimated"
  },
  {
    "id": "R038",
    "name": "Chickpea Tikka Masala",
    "category": "Dinner",
    "diet": "Vegan",
    "servings": 1,
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
    "nutritionSource": "estimated"
  },
  {
    "id": "R057",
    "name": "Turkey White Bean Chilli",
    "category": "Dinner",
    "diet": "Omnivore",
    "servings": 1,
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
    "nutritionSource": "estimated"
  },
  {
    "id": "R034",
    "name": "Low-Carb Chicken Burrito Bowl",
    "category": "Dinner",
    "diet": "Omnivore",
    "servings": 1,
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
    "nutritionSource": "estimated"
  },
  {
    "id": "R011",
    "name": "Chickpea Coconut Curry",
    "category": "Dinner",
    "diet": "Vegan",
    "servings": 4,
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
    "nutritionSource": "estimated"
  },
  {
    "id": "R020",
    "name": "Tofu Edamame Noodle Bowl",
    "category": "Dinner",
    "diet": "Vegan",
    "servings": 3,
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
    "nutritionSource": "estimated"
  },
  {
    "id": "R046",
    "name": "Lean Turkey Bolognese",
    "category": "Dinner",
    "diet": "Omnivore",
    "servings": 1,
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
    "nutritionSource": "estimated"
  },
  {
    "id": "R012",
    "name": "Turkey & Sweet Potato Tray Bake",
    "category": "Dinner",
    "diet": "Omnivore",
    "servings": 4,
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
    "nutritionSource": "estimated"
  },
  {
    "id": "R024",
    "name": "Beef Chilli Con Carne",
    "category": "Dinner",
    "diet": "Omnivore",
    "servings": 6,
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
    "nutritionSource": "estimated"
  },
  {
    "id": "R041",
    "name": "Asian Chicken Stir Fry",
    "category": "Dinner",
    "diet": "Omnivore",
    "servings": 1,
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
    "nutritionSource": "estimated"
  },
  {
    "id": "R056",
    "name": "Chilli Con Carne Gain Bowl",
    "category": "Dinner",
    "diet": "Omnivore",
    "servings": 1,
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
    "nutritionSource": "estimated"
  },
  {
    "id": "R027",
    "name": "Hummus Veg & Egg Snack Plate",
    "category": "Snack",
    "diet": "Vegetarian",
    "servings": 1,
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
    "nutritionSource": "estimated"
  },
  {
    "id": "R066",
    "name": "Chocolate Protein Yoghurt Pudding",
    "category": "Snack",
    "diet": "Vegetarian",
    "servings": 1,
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
    "nutritionSource": "estimated"
  }
];

const RECIPE_GOALS = [
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

const GOAL_GROUPS = [
  { label: "Body composition", goals: ["Fat Loss", "Muscle Gain", "Endurance / Active"] },
  { label: "Lifestyle fit", goals: ["Budget Friendly", "Time Efficient", "Family Friendly"] },
  { label: "Diet style", goals: ["General Health", "Vegetarian / Plant-Based"] },
];

const INJURY_OPTIONS = ["lower back", "knee", "shoulder", "wrist", "ankle", "hip"];

function scoreRecipeForGoal(recipe, goalName) {
  const goal = RECIPE_GOALS.find(function (g) { return g.name === goalName; });
  if (!goal) return 0;
  const w = goal.weights;
  let score = 0;
  score += Math.min(100, recipe.scores.proteinDensity * 10) * w.proteinDensity;
  score += recipe.scores.satiety * w.satiety;
  score += recipe.scores.nutrientDensity * w.nutrientDensity;
  score += recipe.scores.affordability * w.affordability;
  score += recipe.scores.simplicity * w.simplicity;
  score += recipe.scores.mealPrep * w.mealPrep;
  score += recipe.scores.calories * w.calories;
  score += recipe.scores.fibre * w.fibre;
  return Math.round(score * 10) / 10;
}

function badgesForDemoRecipe(recipe) {
  const badges = [];
  if (recipe.protein >= 35) badges.push("High Protein");
  if (recipe.costPerServe <= 2.5) badges.push("Budget");
  if (recipe.totalMin <= 20) badges.push(recipe.totalMin + " min");
  if (recipe.scores.mealPrep >= 80) badges.push("Meal Prep");
  if (recipe.fibre >= 10) badges.push("High Fibre");
  if (recipe.diet === "Vegan" || recipe.diet === "Vegetarian") badges.push(recipe.diet);
  return badges;
}

function recommendDemoRecipes(goal, pantryText, count) {
  const pantryItems = pantryText ? pantryText.split(",").map(function (s) { return s.trim().toLowerCase(); }).filter(Boolean) : [];
  const scored = DEMO_RECIPES.map(function (r) {
    const baseScore = scoreRecipeForGoal(r, goal);
    const pattern = r.ingredientPattern.toLowerCase();
    const pantryHits = pantryItems.filter(function (item) { return pattern.indexOf(item) !== -1; }).length;
    const pantryBoost = Math.min(8, pantryHits * 3);
    const badges = badgesForDemoRecipe(r);
    if (pantryHits >= 2) badges.unshift("Uses what you have");
    return Object.assign({}, r, { _score: Math.round((baseScore + pantryBoost) * 10) / 10, _badges: badges });
  });
  scored.sort(function (a, b) { return b._score - a._score; });
  return scored.slice(0, count || 6);
}

const PILLARS = [
  { name: "Thrownness", icon: "◎", desc: "What you were handed — and what you do with it.", lineage: "Heidegger's Geworfenheit, by way of Existentialism", philosophy: "You didn't choose your starting conditions — your body, your family, the decade you were born into. Heidegger called this 'thrownness': we find ourselves already in a situation we didn't pick. Pick It Up takes this seriously rather than glossing over it. Naming what you were handed isn't an excuse — it's the honest starting line every plan has to work from.", scripture: "\"For I know the plans I have for you,\" declares the Lord, \"plans to prosper you and not to harm you, plans to give you hope and a future.\" — Jeremiah 29:11" },
  { name: "Radical Responsibility", icon: "↑", desc: "You are not your circumstances. You are your response.", lineage: "Stoicism (Epictetus) and Frankl's Logotherapy", philosophy: "Epictetus drew a hard line between what's in your control and what isn't — and insisted that line is where freedom actually lives. Frankl, writing from inside a concentration camp, found the same thing: circumstances can be taken from you, but the choice of how to respond cannot. This pillar isn't about blame. It's about the one lever that's always, unconditionally, yours.", scripture: "\"I can do all things through him who strengthens me.\" — Philippians 4:13" },
  { name: "The Trickle", icon: "∿", desc: "Small, consistent action compounds into identity.", lineage: "Aristotelian virtue ethics and habit psychology", philosophy: "Aristotle argued we don't become courageous by feeling brave once — we become courageous by repeatedly acting courageously until it's who we are. Identity isn't declared, it's built rep by rep, day by ordinary day. The Trickle is the conviction that nobody changes in one dramatic moment; they change in the unglamorous accumulation nobody's watching.", scripture: "\"Do not despise these small beginnings, for the Lord rejoices to see the work begin.\" — Zechariah 4:10" },
  { name: "Projection", icon: "◈", desc: "The future self already exists. Walk toward it.", lineage: "Sartre's existential 'project' and possibility-oriented psychology", philosophy: "Sartre argued that humans are defined less by what they are than by what they're projecting themselves toward — existence as a constant reaching forward. You're not trying to invent a new person from nothing. You're closing the distance to someone you've already glimpsed and decided is worth becoming.", scripture: "\"Forgetting what lies behind and straining forward to what lies ahead, I press on toward the goal.\" — Philippians 3:13-14" },
];

const EXTERNAL_QUOTES = [
  { author: "Marcus Aurelius", school: "Stoicism", text: "You have power over your mind, not outside events. Realize this, and you will find strength." },
  { author: "Epictetus", school: "Stoicism", text: "It's not what happens to you, but how you react to it that matters." },
  { author: "Seneca", school: "Stoicism", text: "We suffer more in imagination than in reality." },
  { author: "Viktor Frankl", school: "Logotherapy", text: "Between stimulus and response there is a space. In that space is our power to choose our response." },
  { author: "Carl Jung", school: "Depth Psychology", text: "I am not what happened to me. I am what I choose to become." },
  { author: "Søren Kierkegaard", school: "Existentialism", text: "Life can only be understood backwards, but it must be lived forwards." },
  { author: "Albert Camus", school: "Existentialism", text: "In the depth of winter, I finally learned that within me there lay an invincible summer." },
  { author: "Jean-Paul Sartre", school: "Existentialism", text: "Freedom is what you do with what's been done to you." },
  { author: "Friedrich Nietzsche", school: "Existentialism", text: "He who has a why to live can bear almost any how." },
  { author: "William James", school: "Psychology", text: "The greatest discovery of any generation is that a human can alter their life by altering their attitude." },
  { author: "Lao Tzu", school: "Eastern Philosophy", text: "A journey of a thousand miles begins with a single step." },
  { author: "Marcus Aurelius", school: "Stoicism", text: "Waste no more time arguing what a good man should be. Be one." },
  { author: "Carl Rogers", school: "Humanistic Psychology", text: "The curious paradox is that when I accept myself just as I am, then I can change." },
  { author: "Viktor Frankl", school: "Logotherapy", text: "When we are no longer able to change a situation, we are challenged to change ourselves." },
  { author: "Epictetus", school: "Stoicism", text: "First say to yourself what you would be, and then do what you have to do." },
];

const REGULATION_PRACTICES = [
  {
    id: "physiological_sigh",
    name: "Physiological Sigh",
    category: "breath",
    durationMin: 2,
    intensity: "fastest",
    mechanism: "Two inhales through the nose (the second short, on top of the first) followed by one long exhale through the mouth. The double-inhale re-opens collapsed alveoli; the long exhale is what does the actual work — it's the most efficient single tool for rapidly lowering heart rate and arousal, because exhale-dominant breathing directly increases vagal (parasympathetic) tone.",
    steps: ["Inhale through the nose until your lungs feel full", "Without exhaling, take a second short sharp inhale on top of it", "Exhale slowly and fully through your mouth — make the exhale longer than the two inhales combined", "Repeat for 1-3 rounds"],
    bestFor: "Acute spikes — right before a hard conversation, mid-panic, or when you need to come down fast.",
    contraindications: "Generally very safe. If you feel lightheaded, stop and breathe normally.",
  },
  {
    id: "box_breathing",
    name: "Box Breathing",
    category: "breath",
    durationMin: 4,
    intensity: "steady",
    mechanism: "Equal-count inhale, hold, exhale, hold (e.g. 4-4-4-4). The holds give you something concrete to focus attention on, which interrupts rumination, while the even rhythm itself is mildly parasympathetic-dominant. Used widely in operational/high-stress training contexts because it's simple to execute even when stressed.",
    steps: ["Inhale through the nose for a count of 4", "Hold gently for a count of 4", "Exhale through the nose for a count of 4", "Hold empty for a count of 4", "Repeat for 4-8 rounds"],
    bestFor: "Steadying yourself before something — a session, a hard task, a moment you know is coming.",
    contraindications: "Avoid long breath-holds if you have uncontrolled high blood pressure or a history of fainting. Shorten the holds if it feels straining, not calming.",
  },
  {
    id: "extended_exhale",
    name: "Extended Exhale",
    category: "breath",
    durationMin: 3,
    intensity: "gentle",
    mechanism: "Simply making the exhale roughly twice as long as the inhale (e.g. inhale 4, exhale 8). No holds, no complexity — just a longer out-breath. This is the single clearest lever on the autonomic nervous system available through breath alone, because exhalation itself stimulates the vagus nerve.",
    steps: ["Inhale gently through the nose for a count of 4", "Exhale slowly through the nose or mouth for a count of 8", "Don't force it — if 8 feels like a stretch, try 6", "Continue for 2-4 minutes"],
    bestFor: "Background regulation — winding down, settling before sleep, or general high-stress days.",
    contraindications: "Safe for almost everyone. Very gentle.",
  },
  {
    id: "body_scan",
    name: "Body Scan",
    category: "somatic",
    durationMin: 6,
    intensity: "gentle",
    mechanism: "Slowly moving attention through each part of the body in sequence, noticing sensation without trying to change it. This builds interoception — the ability to actually feel what's happening in your body — which is the foundation other regulation skills rely on. You can't regulate a signal you can't notice.",
    steps: ["Sit or lie down somewhere you won't be interrupted", "Start at your feet — just notice what's there, no need to relax anything on purpose", "Slowly move attention upward: legs, torso, hands, arms, shoulders, face", "If your mind wanders, just come back to wherever you left off", "Finish by noticing your body as a whole for a few breaths"],
    bestFor: "Reconnecting when you feel disconnected from your body, or as a wind-down practice.",
    contraindications: "If a specific body area brings up strong distress, it's okay to skip past it — this isn't trauma processing, and you're never obligated to stay with something that feels like too much. If that happens often, that's worth raising with a counsellor directly, not working through alone.",
  },
  {
    id: "grounding_54321",
    name: "5-4-3-2-1 Grounding",
    category: "somatic",
    durationMin: 3,
    intensity: "gentle",
    mechanism: "Naming 5 things you see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste. This works by deliberately engaging sensory processing and present-moment attention, which competes with the kind of abstract, future/past-focused thinking that anxiety spirals run on.",
    steps: ["Name 5 things you can see right now", "Name 4 things you can physically feel (the chair, your clothes, the floor)", "Name 3 things you can hear", "Name 2 things you can smell", "Name 1 thing you can taste"],
    bestFor: "Anxiety spirals, racing thoughts, or feeling overwhelmed and needing to come back to the present.",
    contraindications: "Very safe, no real contraindications. Works best done out loud or written, not just in your head.",
  },
  {
    id: "progressive_release",
    name: "Progressive Muscle Release",
    category: "somatic",
    durationMin: 8,
    intensity: "steady",
    mechanism: "Deliberately tensing a muscle group for a few seconds, then fully releasing it. The contrast makes the relaxed state more noticeable than just trying to relax directly, and it works through real physiological tension you may not have noticed you were holding — most people carry chronic low-grade tension in the jaw, shoulders, and hands without realising.",
    steps: ["Start at your feet — tense the muscles hard for 5 seconds", "Release completely and notice the difference for 10 seconds", "Move upward: calves, thighs, glutes, stomach, hands, arms, shoulders, face", "Finish with your whole body tensed for 5 seconds, then released"],
    bestFor: "Physical tension that's built up over a day, or trouble winding down before sleep.",
    contraindications: "Skip or go gently on any muscle group with a current injury. Not recommended for uncontrolled hypertension without medical clearance, since brief tensing raises blood pressure momentarily.",
  },
  {
    id: "shaking_release",
    name: "Shake It Out",
    category: "somatic",
    durationMin: 3,
    intensity: "active",
    mechanism: "Loose, full-body shaking — arms, legs, torso. This isn't just a saying; many mammals visibly shake after a stress response to discharge residual physiological activation, and there's real interest in voluntary shaking as a way to help the nervous system complete a stress cycle rather than staying keyed up. It's a fast way to burn off adrenaline-type energy that breathing alone doesn't always touch.",
    steps: ["Stand with space around you", "Start shaking your hands, then let it move up through your arms", "Let your legs and torso join in — loose, not choreographed", "Keep going for 60-90 seconds, then stand still and notice the difference"],
    bestFor: "After something activating — a stressful interaction, a hard workout, a wired-but-can't-settle feeling.",
    contraindications: "Skip if you have a current injury that this would aggravate, or any condition where vigorous movement is contraindicated. Not appropriate as a stand-in for medical treatment of seizure-related conditions.",
  },
  {
    id: "orienting",
    name: "Orienting",
    category: "somatic",
    durationMin: 2,
    intensity: "gentle",
    mechanism: "Slowly turning your head and eyes to look around the room, letting your gaze land on things that feel neutral or pleasant. This is a core nervous-system signal — when you orient to your actual surroundings and confirm there's no threat, it's one of the most direct ways to tell your nervous system the alert can stand down.",
    steps: ["Sit or stand comfortably", "Slowly turn your head to look around the room, without rushing", "Let your gaze rest on a few things that feel neutral or pleasant", "Notice you're actually here, in this room, right now", "Take one slow breath before continuing your day"],
    bestFor: "Quick resets between tasks, or after checking your phone/news has spiked your stress.",
    contraindications: "Very safe, takes seconds, no real downside.",
  },
];

const QUOTES = [
  { pillar: "Thrownness", text: "You didn't choose where you started. But every choice you make becomes the ground someone else starts on." },
  { pillar: "Thrownness", text: "The hand you were dealt isn't the game. What you do with it is." },
  { pillar: "Radical Responsibility", text: "The gap between who you are and who you're becoming is closed one choice at a time." },
  { pillar: "Radical Responsibility", text: "Nobody is coming to do this for you. That's not a punishment — it's the whole point." },
  { pillar: "The Trickle", text: "Small, consistent action compounds into identity. Today doesn't have to be impressive. It has to happen." },
  { pillar: "The Trickle", text: "You don't rise to your best day. You fall to your standard on your worst one." },
  { pillar: "The Trickle", text: "Showing up tired is worth more than showing up perfect. Perfect doesn't show up most days." },
  { pillar: "Projection", text: "The future self already exists. Every rep today is a step toward meeting them." },
  { pillar: "Projection", text: "You're not trying to become someone new. You're becoming who you already decided to be." },
];

const CONSISTENCY_LINES = [
  "Mood is weather. Identity is climate. You're building climate.",
  "The version of you that shows up on a bad day is the one that actually changes things.",
  "Effort is not the metric. Presence is.",
  "Low energy isn't a reason to skip. It's a different instruction, not a cancelled one.",
  "You don't need motivation. You need a system that works without it.",
];

const TUTORIAL_CARDS = [
  { title: "Your daily check-in", body: "Rate how you're actually doing. It shapes everything else — your movement, your reflection, your tone today." },
  { title: "Your session adapts", body: "Low readiness gets a gentler session. Strong readiness gets more. The plan moves with you, not against you." },
  { title: "The wheel tracks the whole week", body: "Workouts, nourishment, sleep — not just one number. Consistency across all of it is the real win." },
  { title: "You're never locked out", body: "Miss a day, log late, change your mind — none of it resets your progress. Just pick it back up." },
];

const DEFAULT = {
  onboarded: false,
  firstWinPending: false,
  onboardStep: 0,
  userName: "",
  weeklyTarget: 3,
  bodyStats: { weight: "", height: "", age: "", waist: "", unit: "metric", sex: "" },
  tone: "Balanced",
  day: 1,
  week: 1,
  christianLens: false,
  checkIn: null,
  checkInDate: null,
  aiInsight: null,
  aiLoading: false,
  sessionHistory: [],
  currentSession: null,
  sessionLoading: false,
  trainingLocation: "bodyweight",
  equipment: ["bodyweight"],
  injuries: [],
  meals: [],
  sleepLog: [],
  sobriety: null,
  goals: [],
  steps: 0,
  communityPosts: [
    { id: 1, user: "M.", day: 22, pillar: "The Trickle", text: "Third walk this week. Nothing heroic. Just consistent.", seen: [], flagged: false },
    { id: 2, user: "D.", day: 7, pillar: "Thrownness", text: "First time I named the pattern. Harder than I expected.", seen: [], flagged: false },
    { id: 3, user: "K.", day: 45, pillar: "Radical Responsibility", text: "Moved the appointment I kept postponing. One small thing.", seen: [], flagged: false },
  ],
  buddy: null,
  weeklyDigest: null,
  digestLoading: false,
  spotifyConnected: false,
  cravingLog: [],
  tutorialSeen: false,
  quoteCycle: 0,
  isPremium: false,
  email: "",
  emailCaptured: false,
  emailPromptDismissed: false,
};

// ---------------------------------------------------------------------------
// AI LAYER — currently running in DETERMINISTIC MODE (no API calls).
// callClaude is kept here so Claude Code can reactivate AI features in one
// focused pass when ready. To reconnect: uncomment callClaude, then swap
// getInsight / getSession / getDigest back to their AI versions (see
// backend-brief.md for the full reactivation plan including the Supabase
// Edge Function proxy that should hold the API key server-side).
// ---------------------------------------------------------------------------

/*
async function callClaude(system, userMsg, tokens) {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: tokens || 1000,
      system: system,
      messages: [{ role: "user", content: userMsg }],
    }),
  });
  const data = await r.json();
  const block = data.content && data.content.find(function (b) { return b.type === "text"; });
  const text = block ? block.text : "{}";
  return text.replace(/```json|```/g, "").trim();
}
*/

// DETERMINISTIC INSIGHT — selects content from curated pools based on
// actual check-in scores. Pillar selection is score-driven, not random.
// Movement suggestions are readiness-calibrated. Reflections are
// tone-branched. Christian lens shows scripture in the UI via PILLARS data
// (no function change needed — PillarDetail and Today's Focus handle it).
function getInsight(args) {
  const tone = args.tone || "Balanced";
  const checkIn = args.checkIn;
  const userName = args.userName || "";
  const r = checkIn.readiness;
  const sl = checkIn.sleep;
  const m = checkIn.mood;
  const st = checkIn.stress;

  // Pillar selection: driven by which dimension is most in need of attention.
  // Low readiness/sleep/mood points toward stabilising pillars (Thrownness,
  // The Trickle). High stress points toward Radical Responsibility. High
  // scores across the board open up Projection.
  const avg = (r + sl + m + (6 - st)) / 4;
  var pillarName;
  if (st >= 4) {
    pillarName = "Radical Responsibility";
  } else if (r <= 2 || sl <= 2) {
    pillarName = "The Trickle";
  } else if (m <= 2) {
    pillarName = "Thrownness";
  } else if (avg >= 4) {
    pillarName = "Projection";
  } else {
    const cycle = (new Date().getDate()) % 4;
    pillarName = ["Thrownness", "Radical Responsibility", "The Trickle", "Projection"][cycle];
  }

  // Quote: pick from pool matching the selected pillar
  const matchingQuotes = QUOTES.filter(function (q) { return q.pillar === pillarName; });
  const quote = matchingQuotes[Math.floor(Math.random() * matchingQuotes.length)];

  // Consistency line: cycle through so it varies day to day
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const consistencyLine = CONSISTENCY_LINES[dayOfYear % CONSISTENCY_LINES.length];

  // Message: tone-branched, score-responsive
  var message;
  if (tone === "Stoic") {
    message = r <= 2
      ? "Readiness is low. That changes the instruction, not whether you show up. " + consistencyLine
      : st >= 4
        ? "Stress is high. The controllables are still yours. " + consistencyLine
        : "Check-in logged. " + consistencyLine;
  } else if (tone === "Empathic") {
    message = r <= 2
      ? "Lower energy today — that's real information, not a failure. " + consistencyLine
      : sl <= 2
        ? "Rest was rough. Be honest with yourself about what today asks for. " + consistencyLine
        : m <= 2
          ? "Mood is its own kind of weather. You still showed up and checked in. " + consistencyLine
          : "You're in a solid place today. " + consistencyLine;
  } else {
    message = r <= 2
      ? "Low readiness day. Adjust, don't cancel. " + consistencyLine
      : avg >= 4
        ? "Strong day across the board — use it well. " + consistencyLine
        : "Check-in recorded. " + consistencyLine;
  }

  // Movement: readiness-calibrated
  var movement;
  if (r <= 1) {
    movement = "Rest and a 10-minute walk outside if you can manage it. Full recovery counts.";
  } else if (r === 2) {
    movement = "Gentle movement only today — mobility work, a slow walk, or light stretching.";
  } else if (r === 3) {
    movement = st >= 4
      ? "A moderate session, then a regulation practice from the Regulate tab to bring stress down."
      : "A steady, moderate session. Nothing heroic today — just consistent.";
  } else if (r === 4) {
    movement = "Good readiness. A solid session is right — push within your current program.";
  } else {
    movement = "Strong readiness. This is a day to train with intent. Make it count.";
  }

  // Reflection: pillar-matched, tone-aware
  const reflections = {
    "Thrownness": {
      Stoic: "What did you not choose — and what will you do with it anyway?",
      Empathic: "What's something you were handed that you're still learning to work with?",
      Balanced: "What's one thing outside your control that you've been trying to carry?",
    },
    "Radical Responsibility": {
      Stoic: "What is in your control right now?",
      Empathic: "Where are you still waiting for someone else to fix something you could move on?",
      Balanced: "What's one thing today you could own rather than observe?",
    },
    "The Trickle": {
      Stoic: "What is the smallest thing that still counts?",
      Empathic: "What would showing up imperfectly look like today — and is that enough?",
      Balanced: "What does consistency look like on a day like this one?",
    },
    "Projection": {
      Stoic: "Who are you becoming? Is today's action aligned with that?",
      Empathic: "What does the version of you six months from now wish you'd done today?",
      Balanced: "What's one small thing today that closes the distance to who you're becoming?",
    },
  };
  const reflection = reflections[pillarName][tone] || reflections[pillarName]["Balanced"];

  return {
    message: message,
    movement: movement,
    reflection: reflection,
    pillar: pillarName,
    quote: quote ? quote.text : consistencyLine,
  };
}

// DETERMINISTIC SESSION — wraps generateDeterministicSession output into the
// exact shape the Player component expects, so the UI needs no changes.
function getSession(args) {
  const checkIn = args.checkIn || { readiness: 3, stress: 3 };
  const readiness = checkIn.readiness || 3;
  const result = generateDeterministicSession({
    readiness: readiness,
    injuryFlags: args.injuries || [],
    sessionHistory: args.sessionHistory || [],
    trainingLocation: args.trainingLocation || "bodyweight",
    equipment: args.equipment || [],
  });

  const tonePrefix = args.tone === "Stoic"
    ? "Logged. "
    : args.tone === "Empathic"
      ? "Here's what today looks like. "
      : "";

  const rationale = readiness <= 2
    ? tonePrefix + "Readiness is low. This session is minimal on purpose — showing up gently counts."
    : readiness === 3
      ? tonePrefix + "Moderate readiness. A steady, sustainable session."
      : tonePrefix + "Strong readiness. Built to match it.";

  const exercises = result.main.map(function (m) {
    const movKey = Object.keys(MDB).find(function (k) { return MDB[k].name === m.name; });
    return {
      movementKey: movKey || "goblet_squat",
      movement: MDB[movKey] || MDB.goblet_squat,
      sets: m.sets,
      reps: m.reps,
      rest: readiness <= 2 ? 30 : 60,
      coachNote: m.cue || "",
    };
  });

  return {
    sessionTitle: readiness <= 2 ? "Rest & Restore" : readiness >= 4 ? "Strong Session" : "Foundation Session",
    sessionRationale: rationale,
    coachCue: "Every rep is a vote for who you're becoming.",
    estimatedMinutes: exercises.length * (readiness <= 2 ? 5 : 8),
    exercises: exercises,
    flaggedExercises: result.flagged,
    trend: result.trend,
  };
}

// DETERMINISTIC DIGEST — weekly summary from session count and pillar pool.
// Returns the same shape as the AI version so the UI needs no changes.
function getDigest(args) {
  const done = (args.sessionHistory || []).slice(-7).filter(function (s) { return s.completed; }).length;
  const week = args.week || 1;
  const tone = args.tone || "Balanced";
  const pillar = PILLARS[week % 4];

  const headlines = [
    "You showed up this week.",
    "Another week in the trickle.",
    "Small things, stacking up.",
    "Consistency over perfection.",
    "One more week of building.",
  ];
  const headline = headlines[done >= 3 ? 0 : done >= 2 ? 1 : 2];

  const body = done >= 3
    ? "You hit your sessions this week. That's not nothing — that's the whole thing. The Trickle compounds exactly like this, session by session, week by week."
    : done >= 2
      ? "Not a full week, but not nothing either. Two sessions is two more than zero. The trickle doesn't stop just because one week is harder than another."
      : done === 1
        ? "One session. Lower than you'd probably like, and also: one session is one session. It happened. It counts."
        : "This week was what it was. The app is here next week. So are you.";

  const confidence = tone === "Stoic"
    ? "You are building. The results follow the reps, not the other way around."
    : tone === "Empathic"
      ? "Every week you come back to this is a vote for who you're becoming. That matters more than the number."
      : "Consistency isn't about perfect weeks. It's about more weeks than not.";

  return {
    headline: headline,
    body: body,
    confidence: confidence,
    pillar: pillar.name,
    nextWeekIntent: done >= 3
      ? "Keep the streak. Same target, same commitment."
      : "Three sessions next week. That's it. Just three.",
  };
}

function PillarDetail(props) {
  const pl = props.pillar;
  const christianLens = props.christianLens;
  const pillarIndex = PILLARS.findIndex(function (p) { return p.name === pl.name; });
  const numeral = ["I", "II", "III", "IV"][pillarIndex] || "I";
  return (
    <div style={{ position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 420, height: "100%", background: "rgba(26,74,46,0.97)", zIndex: 260, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 28px", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -10, right: 6, fontSize: 200, color: "rgba(200,169,106,0.06)", fontFamily: "'Georgia',serif", fontWeight: 700, lineHeight: 1, pointerEvents: "none" }}>{numeral}</div>
      <button onClick={props.onClose} style={{ position: "absolute", top: 24, right: 24, width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "none", color: C.sl, fontSize: 16, cursor: "pointer", zIndex: 2 }}>✕</button>
      <div style={{ fontSize: 34, color: C.go, marginBottom: 14, position: "relative" }}>{pl.icon}</div>
      <div style={{ fontFamily: "'Georgia',serif", fontSize: 28, color: C.cr, marginBottom: 6, position: "relative" }}>{pl.name}</div>
      <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.go, letterSpacing: 1, marginBottom: 18, position: "relative" }}>{pl.lineage}</div>
      <div style={{ fontFamily: "'Georgia',serif", fontSize: 15, color: C.sl, lineHeight: 1.7, fontStyle: "italic", position: "relative" }}>{pl.philosophy}</div>
      {christianLens && pl.scripture ? (
        <div style={{ marginTop: 20, paddingTop: 18, borderTop: "1px solid rgba(200,221,208,0.2)", position: "relative" }}>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 10, color: C.go, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>Christian Lens</div>
          <div style={{ fontFamily: "'Georgia',serif", fontSize: 14, color: C.cr, lineHeight: 1.6, fontStyle: "italic" }}>{pl.scripture}</div>
        </div>
      ) : null}
    </div>
  );
}

function RotatingQuote(props) {
  const cycle = (props.cycle || 0) + (props.offset || 0);
  const useExternal = cycle % 2 === 0;
  const q = useExternal ? EXTERNAL_QUOTES[cycle % EXTERNAL_QUOTES.length] : QUOTES[cycle % QUOTES.length];
  const attribution = useExternal ? (q.author + " · " + q.school) : ("Pick It Up · " + q.pillar);
  return (
    <div style={{ margin: props.margin || "14px 24px 0", padding: "13px 15px", borderRadius: 12, background: useExternal ? C.gd : C.ow, border: "1px solid " + (useExternal ? C.gd : C.sl) }}>
      <div style={{ fontFamily: "'Georgia',serif", fontSize: 13, color: useExternal ? C.cr : C.gd, fontStyle: "italic", lineHeight: 1.6 }}>"{q.text}"</div>
      <div style={{ fontFamily: "Inter,sans-serif", fontSize: 10, color: useExternal ? C.go : C.mu, marginTop: 5 }}>{attribution}</div>
    </div>
  );
}

function SectionLabel(props) {
  return (
    <div style={{ fontSize: 11, letterSpacing: 2, color: C.mu, fontFamily: "Inter,sans-serif", fontWeight: 600, textTransform: "uppercase", marginBottom: 14 }}>
      {props.label}
    </div>
  );
}

function PillarBadge(props) {
  const found = PILLARS.find(function (x) { return x.name === props.name; });
  const icon = found ? found.icon : "◎";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(200,169,106,0.15)", border: "1px solid " + C.go, borderRadius: 20, padding: "3px 10px", fontFamily: "Inter,sans-serif", fontSize: 11, color: C.go, fontWeight: 600 }}>
      {icon} {props.name}
    </span>
  );
}

function Spinner(props) {
  const msg = props.msg || "Loading...";
  const sub = props.sub || "";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "60px 24px", gap: 16 }}>
      <div style={{ width: 48, height: 48, borderRadius: "50%", border: "3px solid " + C.sl, borderTopColor: C.gd, animation: "spin 1s linear infinite" }} />
      <style>{"@keyframes spin{to{transform:rotate(360deg);}}"}</style>
      <div style={{ fontFamily: "'Georgia',serif", fontSize: 15, color: C.gd, textAlign: "center", fontStyle: "italic" }}>{msg}</div>
      {sub ? <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.mu, textAlign: "center", lineHeight: 1.5, maxWidth: 260 }}>{sub}</div> : null}
    </div>
  );
}

function GreenButton(props) {
  return (
    <button onClick={props.onClick} disabled={props.disabled} style={{ width: props.full ? "100%" : "auto", padding: "13px 24px", background: props.disabled ? "#ccc" : C.gd, color: C.cr, border: "none", borderRadius: 10, fontFamily: "Inter,sans-serif", fontSize: 14, fontWeight: 700, cursor: props.disabled ? "default" : "pointer" }}>
      {props.label}
    </button>
  );
}

function SliderField(props) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 600, color: C.ch }}>{props.label}</span>
        <span style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.go, fontWeight: 700 }}>{props.value}/5</span>
      </div>
      <input type="range" min={1} max={5} value={props.value} onChange={function (e) { props.onChange(Number(e.target.value)); }} style={{ width: "100%", accentColor: C.gd }} />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
        <span style={{ fontSize: 10, color: C.mu, fontFamily: "Inter,sans-serif" }}>{props.low}</span>
        <span style={{ fontSize: 10, color: C.mu, fontFamily: "Inter,sans-serif" }}>{props.high}</span>
      </div>
    </div>
  );
}

function ToneToggle(props) {
  const dark = props.dark;
  return (
    <div style={{ display: "flex", gap: 6 }}>
      {["Stoic", "Balanced", "Empathic"].map(function (t) {
        const active = t === props.value;
        return (
          <button key={t} onClick={function () { props.onChange(t); }} style={{ padding: "5px 11px", borderRadius: 20, border: "1px solid " + (active ? C.go : dark ? "rgba(200,221,208,0.3)" : C.sl), background: active ? "rgba(200,169,106,0.18)" : "transparent", color: active ? C.go : dark ? C.sl : C.mu, fontSize: 11, fontFamily: "Inter,sans-serif", cursor: "pointer", fontWeight: active ? 700 : 400 }}>
            {t}
          </button>
        );
      })}
    </div>
  );
}

function AccountabilityWheel(props) {
  const segs = props.segments;
  const size = 116, cx = 58, cy = 58;
  const rings = [
    { r: 50, key: "workouts", color: C.gd },
    { r: 39, key: "nourish", color: C.go },
    { r: 28, key: "sleep", color: C.sg },
  ];
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        {rings.map(function (ring) {
          const seg = segs[ring.key] || { done: 0, target: 1 };
          const circ = 2 * Math.PI * ring.r;
          const pct = Math.min(seg.done / Math.max(seg.target, 1), 1);
          const dash = pct * circ;
          return (
            <g key={ring.key}>
              <circle cx={cx} cy={cy} r={ring.r} fill="none" stroke={C.sl} strokeWidth={7} opacity={0.4} />
              <circle cx={cx} cy={cy} r={ring.r} fill="none" stroke={ring.color} strokeWidth={7} strokeDasharray={dash + " " + (circ - dash)} strokeLinecap="round" />
            </g>
          );
        })}
      </svg>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center" }}>
        <div style={{ fontFamily: "'Georgia',serif", fontSize: 20, color: C.gd, lineHeight: 1 }}>{props.overallPct}%</div>
      </div>
    </div>
  );
}

function ProgressCalendar(props) {
  const sessionHistory = props.sessionHistory;
  const today = new Date();
  const days = [];
  for (let i = 27; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const ds = d.toDateString();
    const found = sessionHistory.find(function (x) { return x.date === ds; });
    days.push({ short: d.getDate(), done: !!found, r: found ? found.readiness : 0 });
  }
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
      {days.map(function (d, i) {
        let bg = C.ow;
        if (d.done) {
          if (d.r >= 4) bg = C.gd;
          else if (d.r >= 3) bg = C.sg;
          else bg = C.sl;
        }
        return (
          <div key={i} style={{ width: 28, height: 28, borderRadius: 5, background: bg, border: "1px solid " + C.sl, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: d.done ? C.cr : C.mu, fontFamily: "Inter,sans-serif", fontWeight: 600 }}>
            {d.short}
          </div>
        );
      })}
    </div>
  );
}

function expandCue(cueText, mov) {
  const muscleNote = mov.muscles ? "This is keeping tension on your " + mov.muscles.toLowerCase() + " through the rep rather than letting another muscle group take over." : "";
  return {
    headline: cueText,
    detail: "Why it matters: " + muscleNote + " Think of it as the difference between doing the movement and doing the exercise — the cue is what makes it count.",
    tryThis: "Slow the rep down and check this specific position before adding speed or load back in.",
  };
}

function expandError(errorText, mov) {
  const parts = errorText.split("—");
  const whatItLooksLike = parts[0] ? parts[0].trim() : errorText;
  const fix = parts[1] ? parts[1].trim() : "Slow down and reset the position before continuing.";
  return {
    headline: whatItLooksLike,
    detail: "This usually shows up when fatigue, speed, or unfamiliarity with the movement causes a shortcut. It doesn't mean you're doing it wrong overall — just that this rep needs a small correction.",
    fix: "Fix: " + fix + (mov.regression ? " If it keeps happening, " + mov.regression.toLowerCase() + " is a good regression to rebuild the pattern." : ""),
  };
}

function ExerciseDemoComingSoon(props) {
  const mov = props.movement;
  return (
    <div>
      <div style={{ background: C.gd, borderRadius: 16, padding: "32px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -10, right: -6, fontSize: 90, color: "rgba(200,169,106,0.07)", fontFamily: "'Georgia',serif", fontWeight: 700, lineHeight: 1, pointerEvents: "none" }}>○</div>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(200,169,106,0.15)", border: "1px solid " + C.go, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <svg width="18" height="18" viewBox="0 0 18 18" style={{ marginLeft: 2 }}>
            <polygon points="3,1 16,9 3,17" fill={C.go} />
          </svg>
        </div>
        <div style={{ fontFamily: "'Georgia',serif", fontSize: 16, color: C.cr, marginBottom: 8 }}>Video demo coming soon</div>
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.sl, lineHeight: 1.6, maxWidth: 260, margin: "0 auto" }}>Real footage of {mov.name} is being filmed and will replace this. For now, lean on the cues and common mistakes above — they cover what the video will show.</div>
      </div>
    </div>
  );
}


function Player(props) {
  const session = props.session;
  const onComplete = props.onComplete;
  const onExit = props.onExit;
  const state = props.state;

  const [phase, setPhase] = useState("intro");
  const [exIdx, setExIdx] = useState(0);
  const [setNum, setSetNum] = useState(1);
  const [timer, setTimer] = useState(0);
  const [tab, setTab] = useState("cues");
  const [expandedCue, setExpandedCue] = useState(null);
  const [expandedError, setExpandedError] = useState(null);
  const intervalRef = useRef(null);

  const ex = session.exercises[exIdx];
  const mov = ex ? ex.movement : null;
  const totalEx = session.exercises.length;
  const sets = ex ? ex.sets : 3;
  const rest = ex ? ex.rest : 60;
  const pct = ((exIdx * sets + (setNum - 1)) / (totalEx * sets)) * 100;

  useEffect(function () {
    clearInterval(intervalRef.current);
    if (phase === "rest" && timer > 0) {
      intervalRef.current = setInterval(function () {
        setTimer(function (t) {
          if (t <= 1) {
            clearInterval(intervalRef.current);
            setPhase("active");
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return function () { clearInterval(intervalRef.current); };
  }, [phase, timer]);

  const goNext = function () {
    if (setNum < sets) {
      setSetNum(setNum + 1);
      setTimer(rest);
      setPhase("rest");
    } else if (exIdx < totalEx - 1) {
      setExIdx(exIdx + 1);
      setSetNum(1);
      setTab("cues");
      const nextRest = session.exercises[exIdx + 1] ? session.exercises[exIdx + 1].rest : 60;
      setTimer(nextRest);
      setPhase("rest");
    } else {
      setPhase("complete");
    }
  };

  if (phase === "intro") {
    return (
      <div style={{ minHeight: "100vh", background: C.gd, padding: "40px 24px", display: "flex", flexDirection: "column", overflowY: "auto" }}>
        <button onClick={onExit} style={{ background: "none", border: "none", color: C.sl, fontFamily: "Inter,sans-serif", fontSize: 13, cursor: "pointer", alignSelf: "flex-start", marginBottom: 24 }}>← Back</button>
        <div style={{ fontSize: 11, letterSpacing: 3, color: C.go, fontFamily: "Inter,sans-serif", fontWeight: 600, textTransform: "uppercase", marginBottom: 8 }}>Your Session</div>
        <div style={{ fontFamily: "'Georgia',serif", fontSize: 26, color: C.cr, lineHeight: 1.2, marginBottom: 10 }}>{session.sessionTitle}</div>
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: C.sl, lineHeight: 1.6, marginBottom: 16 }}>{session.sessionRationale}</div>
        {session.flaggedExercises && session.flaggedExercises.length > 0 ? (
          <div style={{ background: "rgba(200,169,106,0.12)", border: "1px solid rgba(200,169,106,0.35)", borderRadius: 10, padding: "10px 13px", marginBottom: 16 }}>
            <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.go, fontWeight: 600, marginBottom: 3 }}>Worked around your flags</div>
            <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.sl, lineHeight: 1.5 }}>{session.flaggedExercises.length} exercise{session.flaggedExercises.length === 1 ? " was" : "s were"} excluded because of the injuries you flagged ({session.flaggedExercises.map(function (f) { return f.movement.name; }).slice(0, 3).join(", ")}{session.flaggedExercises.length > 3 ? "…" : ""}). Not medical advice — if pain persists, see a professional.</div>
          </div>
        ) : null}
        <div style={{ background: "rgba(200,169,106,0.12)", border: "1px solid " + C.go, borderRadius: 12, padding: "14px", marginBottom: 16 }}>
          <div style={{ fontSize: 10, letterSpacing: 2, color: C.go, fontFamily: "Inter,sans-serif", fontWeight: 600, textTransform: "uppercase", marginBottom: 6 }}>Coach Cue</div>
          <div style={{ fontFamily: "'Georgia',serif", fontSize: 14, color: C.cr, fontStyle: "italic" }}>"{session.coachCue}"</div>
        </div>
        {state.aiInsight && state.aiInsight.reflection ? (
          <div style={{ background: "rgba(200,221,208,0.08)", borderRadius: 10, padding: "12px", marginBottom: 16 }}>
            <div style={{ fontSize: 10, color: C.sl, fontFamily: "Inter,sans-serif", fontWeight: 600, textTransform: "uppercase", marginBottom: 5 }}>Carry into this session</div>
            <div style={{ fontFamily: "'Georgia',serif", fontSize: 13, color: C.sl, fontStyle: "italic" }}>{state.aiInsight.reflection}</div>
          </div>
        ) : null}
        {session.exercises.map(function (e, i) {
          return (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", padding: "9px 0", borderBottom: "1px solid rgba(200,221,208,0.1)" }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(200,221,208,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: C.go, fontWeight: 700, flexShrink: 0, fontFamily: "Inter,sans-serif" }}>{i + 1}</div>
              <div>
                <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 600, color: C.cr }}>{e.movement ? e.movement.name : ""}</div>
                <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.sl }}>{e.sets}×{e.reps}</div>
              </div>
            </div>
          );
        })}
        <div style={{ fontSize: 12, color: C.sl, fontFamily: "Inter,sans-serif", margin: "14px 0", textAlign: "center" }}>~{session.estimatedMinutes} min · {totalEx} exercises</div>
        <div style={{ background: "rgba(29,185,84,0.12)", border: "1px solid rgba(29,185,84,0.35)", borderRadius: 12, padding: "12px 14px", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 18 }}>♫</span>
            <div>
              <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, fontWeight: 600, color: C.cr }}>{state.spotifyConnected ? "Training Playlist" : "Spotify"}</div>
              <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.sl }}>{state.spotifyConnected ? "Ready to play during your session" : "Connect to play music while you train"}</div>
            </div>
          </div>
          {state.spotifyConnected ? (
            <span style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: "#1DB954", fontWeight: 600 }}>Connected</span>
          ) : (
            <button onClick={function () { props.setState(function (s) { return Object.assign({}, s, { spotifyConnected: true }); }); }} style={{ padding: "6px 14px", borderRadius: 16, background: "#1DB954", color: "#fff", border: "none", fontFamily: "Inter,sans-serif", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Connect</button>
          )}
        </div>
        <button onClick={function () { setPhase("active"); }} style={{ width: "100%", padding: "16px", borderRadius: 12, background: C.go, color: C.gd, border: "none", fontFamily: "Inter,sans-serif", fontSize: 16, fontWeight: 700, cursor: "pointer", marginTop: "auto" }}>Start Session →</button>
      </div>
    );
  }

  if (phase === "complete") {
    const wasLowReadiness = (state.checkIn ? state.checkIn.readiness : 3) <= 2;
    return (
      <div style={{ minHeight: "100vh", background: C.gd, padding: "60px 24px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        <div style={{ fontSize: 60, marginBottom: 16 }}>✓</div>
        <div style={{ fontFamily: "'Georgia',serif", fontSize: 28, color: C.cr, marginBottom: 10 }}>Session complete.</div>
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 14, color: C.sl, lineHeight: 1.7, marginBottom: 16, maxWidth: 280 }}>{totalEx} exercises. Every set counted. The trickle continues.</div>
        {state.aiInsight && state.aiInsight.reflection ? (
          <div style={{ background: "rgba(200,221,208,0.08)", borderRadius: 10, padding: "14px", marginBottom: 24, maxWidth: 300 }}>
            <div style={{ fontFamily: "'Georgia',serif", fontSize: 13, color: C.cr, fontStyle: "italic" }}>{state.aiInsight.reflection}</div>
          </div>
        ) : null}
        {wasLowReadiness && props.onWantMore ? (
          <div style={{ background: "rgba(200,169,106,0.12)", border: "1px solid " + C.go, borderRadius: 12, padding: "14px", marginBottom: 16, maxWidth: 300 }}>
            <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.go, fontWeight: 600, marginBottom: 4 }}>Feeling more capable than expected?</div>
            <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.sl, lineHeight: 1.5, marginBottom: 10 }}>You can unlock a slightly fuller session right now — no need to wait for tomorrow.</div>
            <button onClick={function () { props.onWantMore(); }} style={{ width: "100%", padding: "10px", borderRadius: 8, background: "transparent", color: C.go, border: "1px solid " + C.go, fontFamily: "Inter,sans-serif", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Unlock a fuller session →</button>
          </div>
        ) : null}
        <button onClick={onComplete} style={{ width: "100%", padding: "15px", borderRadius: 12, background: C.go, color: C.gd, border: "none", fontFamily: "Inter,sans-serif", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Back to Home</button>
      </div>
    );
  }

  if (phase === "rest") {
    const upNext = setNum < sets ? (mov ? mov.name : "") + " — Set " + (setNum + 1) + " of " + sets : (session.exercises[exIdx + 1] && session.exercises[exIdx + 1].movement ? session.exercises[exIdx + 1].movement.name : "Final set");
    return (
      <div style={{ minHeight: "100vh", background: C.ch, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <div style={{ fontSize: 11, color: C.mu, fontFamily: "Inter,sans-serif", letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>Rest</div>
        <div style={{ fontFamily: "'Georgia',serif", fontSize: 80, color: C.go, lineHeight: 1 }}>{timer}</div>
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: C.mu, marginTop: 4, marginBottom: 32 }}>seconds</div>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 10, color: C.mu, fontFamily: "Inter,sans-serif", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Coming up</div>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 16, color: C.wh, fontWeight: 600 }}>{upNext}</div>
        </div>
        <button onClick={function () { clearInterval(intervalRef.current); setTimer(0); setPhase("active"); }} style={{ padding: "12px 28px", borderRadius: 24, background: "transparent", color: C.sl, border: "1px solid " + C.sl, fontFamily: "Inter,sans-serif", fontSize: 13, cursor: "pointer" }}>Skip →</button>
      </div>
    );
  }

  const buttonLabel = setNum < sets
    ? "Set " + setNum + " Done — Rest " + rest + "s"
    : (exIdx < totalEx - 1 ? "Finish " + (mov ? mov.name : "") + " — Next" : "Complete Session ✓");

  return (
    <div style={{ minHeight: "100vh", background: C.wh, display: "flex", flexDirection: "column" }}>
      <div style={{ height: 4, background: C.sl }}>
        <div style={{ height: "100%", width: pct + "%", background: C.gd, transition: "width 0.4s" }} />
      </div>
      <div style={{ background: C.gd, padding: "18px 24px 22px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <button onClick={onExit} style={{ background: "none", border: "none", color: C.sl, fontSize: 13, fontFamily: "Inter,sans-serif", cursor: "pointer" }}>✕ Exit</button>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.sl }}>{exIdx + 1}/{totalEx} · {Math.round(pct)}%</div>
        </div>
        <div style={{ fontSize: 11, color: C.go, fontFamily: "Inter,sans-serif", letterSpacing: 2, textTransform: "uppercase", marginBottom: 5 }}>Set {setNum} of {sets}</div>
        <div style={{ fontFamily: "'Georgia',serif", fontSize: 22, color: C.cr, marginBottom: 3 }}>{mov ? mov.name : ""}</div>
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.sl }}>{ex.reps} · {ex.rest}s rest</div>
      </div>
      <div style={{ background: "rgba(200,169,106,0.08)", padding: "10px 24px", borderBottom: "1px solid " + C.sl }}>
        <div style={{ fontFamily: "'Georgia',serif", fontSize: 13, color: C.gd, fontStyle: "italic" }}>"{ex.coachNote}"</div>
      </div>
      {state.spotifyConnected ? (
        <div style={{ background: "rgba(29,185,84,0.08)", padding: "8px 24px", borderBottom: "1px solid " + C.sl, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14 }}>♫</span>
          <span style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.sg }}>Now playing — Training Playlist</span>
        </div>
      ) : null}
      <div style={{ display: "flex", borderBottom: "1px solid " + C.sl }}>
        {[["cues", "Cues"], ["errors", "Errors"], ["demo", "Demo"], ["detail", "Detail"]].map(function (pair) {
          const id = pair[0];
          const label = pair[1];
          const active = tab === id;
          return (
            <button key={id} onClick={function () { setTab(id); }} style={{ flex: 1, padding: "11px 0", background: active ? C.ow : "transparent", border: "none", borderBottom: "2px solid " + (active ? C.gd : "transparent"), fontFamily: "Inter,sans-serif", fontSize: 12, fontWeight: active ? 700 : 400, color: active ? C.gd : C.mu, cursor: "pointer" }}>
              {label}
            </button>
          );
        })}
      </div>
      <div style={{ flex: 1, padding: "18px 24px", overflowY: "auto" }}>
        {tab === "cues" && mov ? mov.cues.map(function (c, i) {
          const isOpen = expandedCue === i;
          const expanded = isOpen ? expandCue(c, mov) : null;
          return (
            <div key={i} style={{ marginBottom: 10 }}>
              <div onClick={function () { setExpandedCue(isOpen ? null : i); }} style={{ display: "flex", gap: 10, cursor: "pointer", padding: "4px 0" }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: C.gd, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: C.go, fontWeight: 700, flexShrink: 0, fontFamily: "Inter,sans-serif" }}>{i + 1}</div>
                <div style={{ flex: 1, fontFamily: "Inter,sans-serif", fontSize: 14, color: C.ch, lineHeight: 1.5, paddingTop: 1 }}>{c}</div>
                <div style={{ color: C.mu, fontSize: 12, paddingTop: 3 }}>{isOpen ? "−" : "+"}</div>
              </div>
              {isOpen ? (
                <div style={{ marginLeft: 32, marginTop: 6, padding: "10px 12px", background: C.ow, borderRadius: 8, border: "1px solid " + C.sl }}>
                  <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.ch, lineHeight: 1.6, marginBottom: 8 }}>{expanded.detail}</div>
                  <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.sg, fontWeight: 600 }}>{expanded.tryThis}</div>
                  <div onClick={function () { setTab("demo"); }} style={{ marginTop: 8, fontFamily: "Inter,sans-serif", fontSize: 11, color: C.go, cursor: "pointer", textDecoration: "underline" }}>Check the demo tab →</div>
                </div>
              ) : null}
            </div>
          );
        }) : null}
        {tab === "errors" && mov ? (
          <div>
            <SectionLabel label="Common mistakes" />
            {mov.errors.map(function (e, i) {
              const isOpen = expandedError === i;
              const expanded = isOpen ? expandError(e, mov) : null;
              return (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div onClick={function () { setExpandedError(isOpen ? null : i); }} style={{ display: "flex", gap: 10, cursor: "pointer", padding: "10px", background: "rgba(192,57,43,0.05)", borderRadius: 8, border: "1px solid rgba(192,57,43,0.12)" }}>
                    <div style={{ color: C.rd, flexShrink: 0 }}>✕</div>
                    <div style={{ flex: 1, fontFamily: "Inter,sans-serif", fontSize: 13, color: C.ch, lineHeight: 1.5 }}>{e}</div>
                    <div style={{ color: C.mu, fontSize: 12 }}>{isOpen ? "−" : "+"}</div>
                  </div>
                  {isOpen ? (
                    <div style={{ marginTop: 6, padding: "10px 12px", background: C.ow, borderRadius: 8, border: "1px solid " + C.sl }}>
                      <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.ch, lineHeight: 1.6, marginBottom: 8 }}>{expanded.detail}</div>
                      <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.gd, fontWeight: 600 }}>{expanded.fix}</div>
                      <div onClick={function () { setTab("demo"); }} style={{ marginTop: 8, fontFamily: "Inter,sans-serif", fontSize: 11, color: C.go, cursor: "pointer", textDecoration: "underline" }}>Check the demo tab →</div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : null}
        {tab === "demo" && mov ? <ExerciseDemoComingSoon movement={mov} /> : null}
        {tab === "detail" && mov ? (
          <div>
            {[["Muscles", mov.muscles], ["If too hard", mov.regression], ["To progress", mov.progression]].map(function (pair) {
              return (
                <div key={pair[0]} style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 10, letterSpacing: 1.5, color: C.mu, fontFamily: "Inter,sans-serif", fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>{pair[0]}</div>
                  <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: C.ch, lineHeight: 1.5 }}>{pair[1]}</div>
                </div>
              );
            })}
            {mov.contra.length > 0 ? (
              <div style={{ padding: "10px", background: "rgba(192,57,43,0.05)", borderRadius: 8, border: "1px solid rgba(192,57,43,0.15)" }}>
                <div style={{ fontSize: 10, color: C.rd, fontFamily: "Inter,sans-serif", fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>Contraindications</div>
                {mov.contra.map(function (c, i) {
                  return <div key={i} style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.ch }}>· {c}</div>;
                })}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
      <div style={{ padding: "14px 24px 30px", borderTop: "1px solid " + C.sl }}>
        <button onClick={goNext} style={{ width: "100%", padding: "15px", background: C.gd, color: C.cr, border: "none", borderRadius: 12, fontFamily: "Inter,sans-serif", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}

function Onboarding(props) {
  const state = props.state;
  const setState = props.setState;
  const step = state.onboardStep || 0;
  const TOTAL = 6;
  const progressPct = Math.round(((step) / TOTAL) * 100);

  const [ls, setLs] = useState({
    age: state.bodyStats && state.bodyStats.age ? state.bodyStats.age : "",
    weight: state.bodyStats && state.bodyStats.weight ? state.bodyStats.weight : "",
    height: state.bodyStats && state.bodyStats.height ? state.bodyStats.height : "",
    unit: state.bodyStats && state.bodyStats.unit ? state.bodyStats.unit : "metric",
    sex: state.bodyStats && state.bodyStats.sex ? state.bodyStats.sex : "",
  });

  const canGo = step === 1 ? (state.userName || "").trim().length > 0
    : step === 2 ? !!state.tone
    : step === 5 ? (state.whys || []).length > 0
    : true;

  const goForward = function () {
    if (step === 3) {
      setState(function (s) { return Object.assign({}, s, { bodyStats: Object.assign({}, ls) }); });
    }
    if (step === TOTAL - 1) {
      setState(function (s) { return Object.assign({}, s, { onboarded: true, firstWinPending: true }); });
    } else {
      setState(function (s) { return Object.assign({}, s, { onboardStep: (s.onboardStep || 0) + 1 }); });
    }
  };

  const goBack = function () {
    if (step === 3) {
      setState(function (s) { return Object.assign({}, s, { bodyStats: Object.assign({}, ls) }); });
    }
    setState(function (s) { return Object.assign({}, s, { onboardStep: (s.onboardStep || 1) - 1 }); });
  };

  const eqOpts = ["dumbbells", "barbell", "bench", "pull-up bar", "resistance bands", "kettlebell", "cable machine", "squat rack"];
  const whyOpts = ["Build physical strength", "Manage stress and anxiety", "Create consistent habits", "Reconnect with my body", "Support my mental health", "Prove something to myself", "Be a better example for others", "Break a pattern holding me back"];

  function renderBody() {
    if (step === 0) {
      return (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 11, letterSpacing: 3, color: C.go, fontFamily: "Inter,sans-serif", fontWeight: 600, textTransform: "uppercase", marginBottom: 16 }}>Welcome</div>
          <div style={{ fontFamily: "'Georgia',serif", fontSize: 36, color: C.cr, lineHeight: 1.1, marginBottom: 16 }}>Pick It Up.</div>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 14, color: C.sl, lineHeight: 1.8, marginBottom: 32 }}>
            Built on the philosophy of change.<br />
            <em>Muscle is built in the gym.<br />Strength begins in the mind.</em>
          </div>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: "rgba(200,221,208,0.5)" }}>Five minutes. Then we begin.</div>
        </div>
      );
    }
    if (step === 1) {
      return (
        <div>
          <div style={{ fontFamily: "'Georgia',serif", fontSize: 28, color: C.cr, marginBottom: 8 }}>What do we call you?</div>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: C.sl, marginBottom: 24, lineHeight: 1.5 }}>Not your username. Your name.</div>
          <input
            value={state.userName || ""}
            onChange={function (e) { setState(function (s) { return Object.assign({}, s, { userName: e.target.value }); }); }}
            placeholder="First name"
            style={{ width: "100%", padding: "14px", borderRadius: 10, border: "1px solid rgba(200,221,208,0.3)", background: "rgba(255,255,255,0.08)", color: C.cr, fontFamily: "Inter,sans-serif", fontSize: 16, outline: "none", boxSizing: "border-box" }}
          />
        </div>
      );
    }
    if (step === 2) {
      const tones = [["Stoic", "Direct, minimal. No reassurance."], ["Balanced", "Warm but honest. Grounded."], ["Empathic", "Genuinely caring. Still boundaried."]];
      return (
        <div>
          <div style={{ fontFamily: "'Georgia',serif", fontSize: 28, color: C.cr, marginBottom: 8 }}>How do you want to be spoken to?</div>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: C.sl, marginBottom: 24 }}>Shapes every message. Change any time.</div>
          {!state.tone ? <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: "rgba(200,169,106,0.7)", marginBottom: 14 }}>Pick one to continue</div> : null}
          {tones.map(function (pair) {
            const t = pair[0];
            const d = pair[1];
            const active = state.tone === t;
            return (
              <div key={t} onClick={function () { setState(function (s) { return Object.assign({}, s, { tone: t }); }); }} style={{ border: "1px solid " + (active ? C.go : "rgba(200,221,208,0.2)"), borderRadius: 12, padding: "16px", marginBottom: 12, background: active ? "rgba(200,169,106,0.1)" : "transparent", cursor: "pointer" }}>
                <div style={{ fontFamily: "Inter,sans-serif", fontSize: 14, fontWeight: 700, color: active ? C.go : C.cr, marginBottom: 4 }}>{t}</div>
                <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.sl }}>{d}</div>
              </div>
            );
          })}
        </div>
      );
    }
    if (step === 3) {
      const fields = [
        ["Age", "age", "years", "e.g. 32"],
        ["Weight", "weight", ls.unit === "imperial" ? "lbs" : "kg", "e.g. 80"],
        ["Height", "height", ls.unit === "imperial" ? "inches" : "cm", "e.g. 178"],
      ];
      return (
        <div>
          <div style={{ fontFamily: "'Georgia',serif", fontSize: 28, color: C.cr, marginBottom: 8 }}>Body stats</div>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: C.sl, marginBottom: 20, lineHeight: 1.5 }}>For BMI and macro calculations. Optional — skip freely.</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
            {["metric", "imperial"].map(function (u) {
              const active = ls.unit === u;
              return (
                <button key={u} onClick={function () { setLs(function (s) { return Object.assign({}, s, { unit: u }); }); }} style={{ flex: 1, padding: "8px", borderRadius: 8, border: "1px solid " + (active ? C.go : "rgba(200,221,208,0.2)"), background: active ? "rgba(200,169,106,0.15)" : "transparent", color: active ? C.go : C.sl, fontFamily: "Inter,sans-serif", fontSize: 13, cursor: "pointer" }}>{u}</button>
              );
            })}
          </div>
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.sl, marginBottom: 6 }}>Sex</div>
            <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: "rgba(200,221,208,0.6)", marginBottom: 8, lineHeight: 1.4 }}>Used only for accurate calorie and macro estimates — biology, not identity.</div>
            <div style={{ display: "flex", gap: 8 }}>
              {[["male", "Male"], ["female", "Female"], ["unspecified", "Prefer not to say"]].map(function (f) {
                const id = f[0], label = f[1];
                const active = ls.sex === id;
                return (
                  <button key={id} onClick={function () { setLs(function (s) { return Object.assign({}, s, { sex: id }); }); }} style={{ flex: 1, padding: "8px 4px", borderRadius: 8, border: "1px solid " + (active ? C.go : "rgba(200,221,208,0.2)"), background: active ? "rgba(200,169,106,0.15)" : "transparent", color: active ? C.go : C.sl, fontFamily: "Inter,sans-serif", fontSize: 11, cursor: "pointer" }}>{label}</button>
                );
              })}
            </div>
          </div>
          {fields.map(function (f) {
            const label = f[0], key = f[1], unit = f[2], ph = f[3];
            return (
              <div key={key} style={{ marginBottom: 16 }}>
                <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.sl, marginBottom: 6 }}>{label} ({unit})</div>
                <input
                  type="number"
                  value={ls[key]}
                  onChange={function (e) { setLs(function (s) { const next = Object.assign({}, s); next[key] = e.target.value; return next; }); }}
                  placeholder={ph}
                  style={{ width: "100%", padding: "12px", borderRadius: 8, border: "1px solid rgba(200,221,208,0.25)", background: "rgba(255,255,255,0.07)", color: C.cr, fontFamily: "Inter,sans-serif", fontSize: 16, outline: "none", boxSizing: "border-box" }}
                />
              </div>
            );
          })}
        </div>
      );
    }
    if (step === 4) {
      const loc = state.trainingLocation || "bodyweight";
      return (
        <div>
          <div style={{ fontFamily: "'Georgia',serif", fontSize: 28, color: C.cr, marginBottom: 8 }}>Set up your training</div>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: C.sl, marginBottom: 20 }}>Where do you train?</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 22 }}>
            {[["commercial", "Commercial Gym", "Full equipment access"], ["home", "Home Gym", "Pick what you've got"], ["bodyweight", "Bodyweight Only", "No equipment needed"]].map(function (f) {
              const id = f[0], label = f[1], sub = f[2];
              const active = loc === id;
              return (
                <button key={id} onClick={function () {
                  setState(function (s) {
                    const eq = id === "commercial" ? eqOpts.concat(["bodyweight"]) : id === "bodyweight" ? ["bodyweight"] : (s.equipment && s.equipment.length && s.trainingLocation === "home" ? s.equipment : ["bodyweight"]);
                    return Object.assign({}, s, { trainingLocation: id, equipment: eq });
                  });
                }} style={{ padding: "14px 16px", borderRadius: 12, border: "1px solid " + (active ? C.go : "rgba(200,221,208,0.2)"), background: active ? "rgba(200,169,106,0.12)" : "transparent", textAlign: "left", cursor: "pointer" }}>
                  <div style={{ fontFamily: "Inter,sans-serif", fontSize: 14, fontWeight: 700, color: active ? C.go : C.cr, marginBottom: 2 }}>{label}</div>
                  <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.sl }}>{sub}</div>
                </button>
              );
            })}
          </div>
          {loc === "home" ? (
            <div style={{ marginBottom: 22 }}>
              <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.sl, marginBottom: 10 }}>What do you have at home?</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {eqOpts.map(function (eq) {
                  const active = (state.equipment || []).indexOf(eq) !== -1;
                  return (
                    <button key={eq} onClick={function () {
                      setState(function (s) {
                        const base = (s.equipment || []).filter(function (e) { return e !== "bodyweight"; });
                        const list = active ? base.filter(function (e) { return e !== eq; }) : base.concat([eq]);
                        return Object.assign({}, s, { equipment: list.length ? list : ["bodyweight"] });
                      });
                    }} style={{ padding: "8px 14px", borderRadius: 20, border: "1px solid " + (active ? C.go : "rgba(200,221,208,0.25)"), background: active ? "rgba(200,169,106,0.15)" : "transparent", color: active ? C.go : C.sl, fontFamily: "Inter,sans-serif", fontSize: 12, cursor: "pointer", fontWeight: active ? 600 : 400 }}>{eq}</button>
                  );
                })}
              </div>
            </div>
          ) : null}
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.sl, marginBottom: 10 }}>Weekly session target</div>
          <div style={{ display: "flex", gap: 8 }}>
            {[2, 3, 4, 5, 6].map(function (n) {
              const active = (state.weeklyTarget || 3) === n;
              return (
                <button key={n} onClick={function () { setState(function (s) { return Object.assign({}, s, { weeklyTarget: n }); }); }} style={{ flex: 1, padding: "12px 0", borderRadius: 8, border: "1px solid " + (active ? C.go : "rgba(200,221,208,0.2)"), background: active ? "rgba(200,169,106,0.15)" : "transparent", color: active ? C.go : C.sl, fontFamily: "Inter,sans-serif", fontSize: 15, fontWeight: active ? 700 : 400, cursor: "pointer" }}>{n}</button>
              );
            })}
          </div>
        </div>
      );
    }
    if (step === 5) {
      return (
        <div>
          <div style={{ fontFamily: "'Georgia',serif", fontSize: 28, color: C.cr, marginBottom: 8 }}>Why are you here?</div>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: C.sl, marginBottom: 20 }}>Be honest. Pick all that apply.</div>
          {(state.whys || []).length === 0 ? <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: "rgba(200,169,106,0.7)", marginBottom: 14 }}>Pick at least one to continue</div> : null}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {whyOpts.map(function (w) {
              const active = (state.whys || []).indexOf(w) !== -1;
              return (
                <button key={w} onClick={function () {
                  setState(function (s) {
                    const list = active ? (s.whys || []).filter(function (x) { return x !== w; }) : (s.whys || []).concat([w]);
                    return Object.assign({}, s, { whys: list });
                  });
                }} style={{ padding: "12px 16px", borderRadius: 10, border: "1px solid " + (active ? C.go : "rgba(200,221,208,0.2)"), background: active ? "rgba(200,169,106,0.1)" : "transparent", color: active ? C.go : C.sl, fontFamily: "Inter,sans-serif", fontSize: 13, cursor: "pointer", textAlign: "left", fontWeight: active ? 600 : 400 }}>{w}</button>
              );
            })}
          </div>
        </div>
      );
    }
    return null;
  }

  const buttonText = step === TOTAL - 1 ? ("Let's go, " + (state.userName || "")) : (step === 0 ? "Begin →" : "Continue →");

  return (
    <div style={{ minHeight: "100vh", background: C.gd, display: "flex", flexDirection: "column", padding: "56px 28px 40px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -20, right: -10, fontSize: 140, color: "rgba(200,169,106,0.05)", fontFamily: "'Georgia',serif", fontWeight: 700, lineHeight: 1, pointerEvents: "none" }}>PIU</div>
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 10, letterSpacing: 1.5, color: "rgba(200,169,106,0.6)", textTransform: "uppercase" }}>Step {step + 1} of {TOTAL}</div>
          {step > 0 ? <button onClick={goBack} style={{ background: "none", border: "none", fontFamily: "Inter,sans-serif", fontSize: 11, color: "rgba(200,221,208,0.5)", cursor: "pointer" }}>← Back</button> : null}
        </div>
        <div style={{ height: 3, background: "rgba(200,221,208,0.15)", borderRadius: 2 }}>
          <div style={{ height: "100%", width: progressPct + "%", background: C.go, borderRadius: 2, transition: "width 0.4s ease" }} />
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>{renderBody()}</div>
      <div style={{ marginTop: 28 }}>
        <button onClick={goForward} disabled={!canGo} style={{ width: "100%", padding: "15px", background: canGo ? C.go : "rgba(200,169,106,0.3)", color: canGo ? C.gd : "rgba(26,74,46,0.5)", border: "none", borderRadius: 12, fontFamily: "Inter,sans-serif", fontSize: 15, fontWeight: 700, cursor: canGo ? "pointer" : "default" }}>
          {buttonText}
        </button>
        {step > 0 ? (
          <button onClick={goBack} style={{ width: "100%", marginTop: 10, padding: "10px", background: "transparent", color: C.sl, border: "none", fontFamily: "Inter,sans-serif", fontSize: 13, cursor: "pointer" }}>← Back</button>
        ) : null}
      </div>
    </div>
  );
}

function Home(props) {
  const state = props.state;
  const setState = props.setState;
  const setScreen = props.setScreen;
  const [pillarOpen, setPillarOpen] = useState(null);
  const tone = state.tone;
  const day = state.day;
  const week = state.week;
  const checkIn = state.checkIn;
  const checkInIsToday = state.checkInDate === new Date().toDateString();
  const aiInsight = state.aiInsight;
  const userName = state.userName;
  const weeklyTarget = state.weeklyTarget;
  const sessionHistory = state.sessionHistory;
  const weeklyDigest = state.weeklyDigest;
  const digestLoading = state.digestLoading;
  const quoteCycle = state.quoteCycle || 0;
  const name = userName || "you";

  const fallbackMsg = {
    Stoic: "Day " + day + ". You're here. Keep going.",
    Balanced: "Welcome back, " + name + ". Let's see where you are.",
    Empathic: "Hey " + name + " — really glad you showed up.",
  };

  const wkStart = new Date();
  wkStart.setDate(wkStart.getDate() - wkStart.getDay());
  const wkDone = sessionHistory.filter(function (s) { return new Date(s.date) >= wkStart && s.completed; }).length;
  const wkMeals = state.meals.length > 0 ? Math.min(7, Math.ceil(state.meals.length / 1)) : 0;
  const wkSleep = state.sleepLog.filter(function (s) { return new Date(s.date) >= wkStart; }).length;
  const segments = {
    workouts: { done: wkDone, target: weeklyTarget || 3 },
    nourish: { done: state.meals.length, target: 7 },
    sleep: { done: wkSleep, target: 7 },
  };
  const overallPct = Math.round(
    ((Math.min(segments.workouts.done / segments.workouts.target, 1)) +
      (Math.min(segments.nourish.done / segments.nourish.target, 1)) +
      (Math.min(segments.sleep.done / segments.sleep.target, 1))) / 3 * 100
  );

  const fetchDigest = async function () {
    setState(function (s) { return Object.assign({}, s, { digestLoading: true }); });
    const d = getDigest({ userName: state.userName, tone: state.tone, sessionHistory: state.sessionHistory, week: state.week });
    setState(function (s) { return Object.assign({}, s, { weeklyDigest: d, digestLoading: false }); });
  };

  const todayItems = [
    { label: "Check-In", done: !!checkIn, icon: "◎", detail: checkIn ? ("Readiness " + checkIn.readiness + "/5 · Mood " + checkIn.mood + "/5") : "Shapes your whole day", sc: "checkin" },
    { label: "Movement", done: sessionHistory.some(function (s) { return s.date === new Date().toDateString(); }), icon: "↑", detail: state.currentSession ? state.currentSession.sessionTitle : (aiInsight ? "Ready to generate" : "Check in first"), sc: "movement" },
    { label: "Nourishment", done: state.meals.length > 0, icon: "◇", detail: state.meals.length > 0 ? (state.meals.length + " meal" + (state.meals.length > 1 ? "s" : "") + " logged") : "Log what you ate", sc: "nourish" },
    { label: "Tracking", done: state.sleepLog.some(function (s) { return s.date === new Date().toDateString(); }), icon: "◎", detail: "Sleep, sobriety & goals", sc: "track" },
  ];

  return (
    <div style={{ paddingBottom: 90 }}>
      <div style={{ background: C.gd, padding: "50px 24px 30px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -20, right: -10, fontSize: 150, color: "rgba(200,169,106,0.06)", fontFamily: "'Georgia',serif", fontWeight: 700, lineHeight: 1, pointerEvents: "none" }}>PIU</div>
        <div style={{ fontSize: 11, letterSpacing: 3, color: C.go, fontFamily: "Inter,sans-serif", fontWeight: 600, marginBottom: 6, textTransform: "uppercase" }}>Day {day} · Week {week}</div>
        <div style={{ fontFamily: "'Georgia',serif", fontSize: 25, color: C.cr, fontWeight: 400, lineHeight: 1.3, marginBottom: 14 }}>
          {checkIn && aiInsight ? aiInsight.message : fallbackMsg[tone]}
        </div>
        <ToneToggle value={tone} onChange={function (v) { setState(function (s) { return Object.assign({}, s, { tone: v }); }); }} dark={true} />
      </div>

      <div style={{ margin: "16px 24px 0" }}>
        <div style={{ background: C.wh, borderRadius: 18, border: "1px solid " + C.sl, padding: "18px", display: "flex", alignItems: "center", gap: 16, boxShadow: "0 2px 10px rgba(26,74,46,0.05)" }}>
          <AccountabilityWheel segments={segments} overallPct={overallPct} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Georgia',serif", fontSize: 16, color: C.gd, marginBottom: 3 }}>This Week</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.gd }} />
                <span style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu }}>Workouts {wkDone}/{weeklyTarget || 3}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.go }} />
                <span style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu }}>Nourishment {state.meals.length}/7</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.sg }} />
                <span style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu }}>Sleep logs {wkSleep}/7</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {aiInsight && aiInsight.quote ? (
        <div style={{ margin: "10px 24px 0", padding: "13px 15px", borderRadius: 12, background: C.ow, border: "1px solid " + C.sl }}>
          <div style={{ fontFamily: "'Georgia',serif", fontSize: 13, color: C.gd, fontStyle: "italic", lineHeight: 1.6 }}>"{aiInsight.quote}"</div>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 10, color: C.mu, marginTop: 5 }}>Pick It Up · Day {day}</div>
        </div>
      ) : null}

      {(function () {
        const extQ = EXTERNAL_QUOTES[quoteCycle % EXTERNAL_QUOTES.length];
        return (
          <div style={{ margin: "10px 24px 0", padding: "13px 15px", borderRadius: 12, background: C.gd, border: "1px solid " + C.gd }}>
            <div style={{ fontFamily: "'Georgia',serif", fontSize: 13, color: C.cr, fontStyle: "italic", lineHeight: 1.6 }}>"{extQ.text}"</div>
            <div style={{ fontFamily: "Inter,sans-serif", fontSize: 10, color: C.go, marginTop: 5 }}>{extQ.author} · {extQ.school}</div>
          </div>
        );
      })()}

      {checkIn && aiInsight && checkInIsToday ? (
        <div style={{ margin: "14px 24px 0", background: C.gd, borderRadius: 18, padding: "20px", boxShadow: "0 8px 24px rgba(26,74,46,0.18)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
            <div style={{ fontFamily: "'Georgia',serif", fontSize: 13, letterSpacing: 1, color: C.go, fontStyle: "italic" }}>Today's Focus</div>
            <PillarBadge name={aiInsight.pillar} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 10, letterSpacing: 1.5, color: C.sl, fontFamily: "Inter,sans-serif", fontWeight: 600, textTransform: "uppercase", marginBottom: 5 }}>Movement</div>
            <div style={{ fontFamily: "Inter,sans-serif", fontSize: 14, color: C.cr, lineHeight: 1.6 }}>{aiInsight.movement}</div>
          </div>
          <div style={{ borderTop: "1px solid rgba(200,221,208,0.25)", paddingTop: 14 }}>
            <div style={{ fontSize: 10, letterSpacing: 1.5, color: C.sl, fontFamily: "Inter,sans-serif", fontWeight: 600, textTransform: "uppercase", marginBottom: 5 }}>Sit with this</div>
            <div style={{ fontFamily: "'Georgia',serif", fontSize: 16, color: C.cr, fontStyle: "italic", lineHeight: 1.6 }}>{aiInsight.reflection}</div>
          </div>
          {state.christianLens ? (function () {
            const matchedPillar = PILLARS.find(function (p) { return p.name === aiInsight.pillar; });
            return matchedPillar && matchedPillar.scripture ? (
              <div style={{ borderTop: "1px solid rgba(200,221,208,0.25)", marginTop: 14, paddingTop: 14 }}>
                <div style={{ fontSize: 10, letterSpacing: 1.5, color: C.go, fontFamily: "Inter,sans-serif", fontWeight: 600, textTransform: "uppercase", marginBottom: 5 }}>Christian Lens</div>
                <div style={{ fontFamily: "'Georgia',serif", fontSize: 13, color: C.go, lineHeight: 1.6, fontStyle: "italic" }}>{matchedPillar.scripture}</div>
              </div>
            ) : null;
          })() : null}
        </div>
      ) : null}

      {checkIn && aiInsight && !checkInIsToday ? (
        <div style={{ margin: "14px 24px 0", background: C.cr, borderRadius: 14, padding: "18px", border: "1px solid " + C.sl, textAlign: "center" }}>
          <div style={{ fontFamily: "'Georgia',serif", fontSize: 16, color: C.gd, marginBottom: 8 }}>Yesterday's focus has expired.</div>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.mu, marginBottom: 14, lineHeight: 1.5 }}>A new day means a new check-in — today's instruction is built fresh, not carried over.</div>
          <GreenButton label="Do My Check-In" onClick={function () { setScreen("checkin"); }} />
        </div>
      ) : null}

      {!checkIn ? (
        <div style={{ margin: "14px 24px 0", background: C.cr, borderRadius: 14, padding: "18px", border: "1px solid " + C.sl, textAlign: "center" }}>
          <div style={{ fontFamily: "'Georgia',serif", fontSize: 16, color: C.gd, marginBottom: 8 }}>Start with where you actually are.</div>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.mu, marginBottom: 14, lineHeight: 1.5 }}>Your check-in shapes your movement, reflection, and session.</div>
          <GreenButton label="Do My Check-In" onClick={function () { setScreen("checkin"); }} />
        </div>
      ) : null}

      {sessionHistory.length >= 3 ? (
        <div style={{ margin: "12px 24px 0" }}>
          {digestLoading ? <Spinner msg="Writing your weekly digest..." /> : weeklyDigest ? (
            <div style={{ background: C.gd, borderRadius: 14, padding: "18px" }}>
              <div style={{ fontSize: 10, letterSpacing: 2, color: C.go, fontFamily: "Inter,sans-serif", fontWeight: 600, textTransform: "uppercase", marginBottom: 6 }}>Weekly Digest</div>
              <div style={{ fontFamily: "'Georgia',serif", fontSize: 19, color: C.cr, marginBottom: 8 }}>{weeklyDigest.headline}</div>
              <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: C.sl, lineHeight: 1.6, marginBottom: 10 }}>{weeklyDigest.body}</div>
              <div style={{ background: "rgba(200,169,106,0.12)", borderRadius: 10, padding: "12px", marginBottom: 10 }}>
                <div style={{ fontFamily: "'Georgia',serif", fontSize: 13, color: C.go, fontStyle: "italic" }}>{weeklyDigest.confidence}</div>
              </div>
              <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.sl }}><strong style={{ color: C.go }}>Next week:</strong> {weeklyDigest.nextWeekIntent}</div>
            </div>
          ) : (
            <button onClick={fetchDigest} style={{ width: "100%", padding: "14px", borderRadius: 12, background: "transparent", color: C.gd, border: "2px solid " + C.gd, fontFamily: "Inter,sans-serif", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>◈ Get Your Weekly Digest</button>
          )}
        </div>
      ) : null}

      <div style={{ padding: "22px 24px 0" }}>
        <SectionLabel label="Today" />
        {todayItems.map(function (item) {
          return (
            <div key={item.label} onClick={function () { setScreen(item.sc); }} style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 0", borderBottom: "1px solid " + C.sl, cursor: "pointer" }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", flexShrink: 0, background: item.done ? C.gd : C.sl, display: "flex", alignItems: "center", justifyContent: "center", color: item.done ? C.go : C.mu, fontSize: 15 }}>{item.done ? "✓" : item.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "Inter,sans-serif", fontSize: 14, fontWeight: 600, color: C.ch }}>{item.label}</div>
                <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.mu }}>{item.detail}</div>
              </div>
              <div style={{ color: C.sg, fontSize: 18 }}>›</div>
            </div>
          );
        })}
      </div>

      {checkIn && checkInIsToday && checkIn.stress >= 4 ? (
        <div style={{ padding: "0 24px" }}>
          <div onClick={function () { setScreen("regulate"); }} style={{ background: "rgba(192,57,43,0.06)", border: "1px solid rgba(192,57,43,0.25)", borderRadius: 16, padding: "15px 18px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }}>
            <div style={{ fontSize: 20, color: C.rd }}>∿</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Georgia',serif", fontSize: 14, color: C.gd }}>Today's stress is logged high</div>
              <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu }}>A 2-minute reset is in Regulate, bottom nav</div>
            </div>
            <div style={{ color: C.sg, fontSize: 18 }}>›</div>
          </div>
        </div>
      ) : null}

      <div style={{ padding: "26px 24px 0" }}>
        <div style={{ fontFamily: "'Georgia',serif", fontSize: 12, letterSpacing: 3, color: C.mu, textTransform: "uppercase", marginBottom: 3 }}>The Four Pillars</div>
        <div style={{ height: 2, width: 36, background: C.go, marginBottom: 16 }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {PILLARS.map(function (pl, i) {
            const active = aiInsight && aiInsight.pillar === pl.name;
            const numeral = ["I", "II", "III", "IV"][i];
            return (
              <div key={pl.name} onClick={function () { setPillarOpen(pl); }} style={{ display: "flex", alignItems: "center", gap: 16, background: active ? C.gd : C.wh, border: active ? "none" : "1px solid " + C.sl, borderRadius: 16, padding: "16px 18px", cursor: "pointer", boxShadow: active ? "0 6px 20px rgba(26,74,46,0.22)" : "0 1px 3px rgba(26,74,46,0.04)", transition: "all 0.35s ease" }}>
                <div style={{ fontFamily: "'Georgia',serif", fontSize: 11, color: active ? "rgba(250,247,242,0.45)" : C.sl, width: 16, flexShrink: 0 }}>{numeral}</div>
                <div style={{ fontSize: 26, color: active ? C.go : C.gd, flexShrink: 0, width: 32, textAlign: "center" }}>{pl.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Georgia',serif", fontSize: 16, fontWeight: 700, color: active ? C.cr : C.gd, marginBottom: 2 }}>{pl.name}</div>
                  <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: active ? C.sl : C.mu, lineHeight: 1.4 }}>{pl.desc}</div>
                </div>
                {active ? <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.go, flexShrink: 0 }} /> : null}
              </div>
            );
          })}
        </div>
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 10, color: C.mu, marginTop: 10, textAlign: "center" }}>
          {aiInsight && aiInsight.pillar ? "Highlighted: what today's check-in points to. Tap any pillar for the philosophy behind it." : "Tap a pillar for the philosophy behind it"}
        </div>
      </div>
      {pillarOpen ? <PillarDetail pillar={pillarOpen} onClose={function () { setPillarOpen(null); }} christianLens={state.christianLens} /> : null}
    </div>
  );
}

function CheckIn(props) {
  const state = props.state;
  const setState = props.setState;
  const setScreen = props.setScreen;
  const [d, setD] = useState(state.checkIn || { readiness: 3, sleep: 3, mood: 3, stress: 3 });
  const avg = ((d.readiness + d.sleep + d.mood + (6 - d.stress)) / 4).toFixed(1);

  const submit = useCallback(function () {
    const ins = getInsight({ tone: state.tone, checkIn: d, christianLens: state.christianLens, userName: state.userName, sex: state.bodyStats ? state.bodyStats.sex : "" });
    setState(function (s) { return Object.assign({}, s, { checkIn: d, checkInDate: new Date().toDateString(), aiInsight: ins, aiLoading: false }); });
    setScreen("home");
  }, [d, state.tone, state.christianLens, state.userName]);

  return (
    <div style={{ padding: "30px 24px 100px" }}>
      <div style={{ fontFamily: "'Georgia',serif", fontSize: 24, color: C.gd, marginBottom: 4 }}>Daily Check-In</div>
      <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: C.mu, marginBottom: 26, lineHeight: 1.5 }}>Rate honestly{state.userName ? (", " + state.userName) : ""}. This shapes your session.</div>
      <SliderField label="Physical Readiness" low="Depleted" high="Ready" value={d.readiness} onChange={function (v) { setD(function (x) { return Object.assign({}, x, { readiness: v }); }); }} />
      <SliderField label="Sleep Quality" low="Rough" high="Restored" value={d.sleep} onChange={function (v) { setD(function (x) { return Object.assign({}, x, { sleep: v }); }); }} />
      <SliderField label="Mood" low="Low" high="Strong" value={d.mood} onChange={function (v) { setD(function (x) { return Object.assign({}, x, { mood: v }); }); }} />
      <SliderField label="Stress Load" low="Clear" high="Heavy" value={d.stress} onChange={function (v) { setD(function (x) { return Object.assign({}, x, { stress: v }); }); }} />
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 600, color: C.ch, marginBottom: 10 }}>Today's tone</div>
        <ToneToggle value={state.tone} onChange={function (v) { setState(function (s) { return Object.assign({}, s, { tone: v }); }); }} />
      </div>
      <div style={{ background: Number(avg) >= 3.5 ? "rgba(26,74,46,0.07)" : "rgba(200,169,106,0.12)", border: "1px solid " + (Number(avg) >= 3.5 ? C.sl : C.go), borderRadius: 10, padding: "13px 15px", marginBottom: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: C.ch, fontWeight: 600 }}>Readiness</div>
          <div style={{ fontFamily: "'Georgia',serif", fontSize: 22, color: Number(avg) >= 3.5 ? C.gd : C.go }}>{avg}/5</div>
        </div>
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.mu, marginTop: 3 }}>
          {Number(avg) >= 4 ? "Strong. Your session will reflect it." : Number(avg) >= 3 ? "Solid. Build sustainably." : Number(avg) >= 2 ? "Lower energy. Session adjusts." : "Rest is the work."}
        </div>
      </div>
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 600, color: C.ch, marginBottom: 4 }}>Anything bothering you today?</div>
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu, marginBottom: 8 }}>Flag it and today's session will work around it. Standing injuries live in Profile — this is just for today.</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
          {INJURY_OPTIONS.map(function (inj) {
            const active = (state.injuries || []).indexOf(inj) !== -1;
            return (
              <button key={inj} onClick={function () {
                setState(function (s) {
                  const list = active ? s.injuries.filter(function (i) { return i !== inj; }) : s.injuries.concat([inj]);
                  return Object.assign({}, s, { injuries: list });
                });
              }} style={{ padding: "6px 12px", borderRadius: 20, border: "1px solid " + (active ? C.rd : C.sl), background: active ? "rgba(192,57,43,0.08)" : "transparent", color: active ? C.rd : C.mu, fontFamily: "Inter,sans-serif", fontSize: 12, cursor: "pointer" }}>{inj}</button>
            );
          })}
        </div>
      </div>
      <GreenButton label="Complete Check-In" onClick={submit} full={true} />
    </div>
  );
}

function Movement(props) {
  const state = props.state;
  const setState = props.setState;
  const [open, setOpen] = useState(false);
  const [exp, setExp] = useState(null);
  const [playing, setPlaying] = useState(false);
  const checkIn = state.checkIn;
  const aiInsight = state.aiInsight;
  const currentSession = state.currentSession;
  const sessionLoading = state.sessionLoading;
  const week = state.week;
  const tone = state.tone;
  const equipment = state.equipment;
  const injuries = state.injuries;
  const sessionHistory = state.sessionHistory;
  const christianLens = state.christianLens;
  const userName = state.userName;
  const [detailedSession, setDetailedSession] = useState(null);
  const [showContraWarning, setShowContraWarning] = useState(false);
  const [contraWarningAcked, setContraWarningAcked] = useState(false);

  const genDetailed = function () {
    const r = checkIn ? checkIn.readiness : 3;
    const session = generateDeterministicSession({ readiness: r, injuryFlags: injuries, sessionHistory: sessionHistory });
    setDetailedSession(session);
    setContraWarningAcked(false);
    if (session.flagged.length > 0) setShowContraWarning(true);
  };

  const gen = useCallback(function () {
    setState(function (s) { return Object.assign({}, s, { sessionLoading: true, currentSession: null }); });
    const ses = getSession({ tone: tone, checkIn: checkIn, week: week, equipment: equipment, injuries: injuries, sessionHistory: sessionHistory, christianLens: christianLens, userName: userName });
    setState(function (s) { return Object.assign({}, s, { sessionLoading: false, currentSession: ses }); });
  }, [tone, checkIn, week, equipment, injuries, sessionHistory, christianLens, userName]);

  const finishSession = useCallback(function () {
    setState(function (s) {
      const entry = { date: new Date().toDateString(), readiness: s.checkIn ? s.checkIn.readiness : 3, completed: true };
      return Object.assign({}, s, { sessionHistory: s.sessionHistory.concat([entry]), currentSession: null, day: s.day + 1 });
    });
    setPlaying(false);
  }, []);

  const wantMore = useCallback(function () {
    setState(function (s) { return Object.assign({}, s, { sessionLoading: true }); });
    const boostedCheckIn = Object.assign({}, checkIn, { readiness: 3 });
    const ses = getSession({ tone: tone, checkIn: boostedCheckIn, week: week, equipment: equipment, injuries: injuries, sessionHistory: sessionHistory, christianLens: christianLens, userName: userName });
    setState(function (s) { return Object.assign({}, s, { sessionLoading: false, currentSession: ses }); });
  }, [tone, checkIn, week, equipment, injuries, sessionHistory, christianLens, userName]);

  if (playing && currentSession) {
    return <Player key={currentSession.sessionTitle + currentSession.exercises.length} session={currentSession} onComplete={finishSession} onExit={function () { setPlaying(false); }} state={state} setState={setState} onWantMore={wantMore} />;
  }

  const r = checkIn ? checkIn.readiness : 3;
  const filtered = r <= 2
    ? MOVS.filter(function (m) { return m.tags.indexOf("mobility") !== -1 || m.tags.indexOf("recovery") !== -1; })
    : r >= 4
      ? MOVS.filter(function (m) { return m.tags.indexOf("strength") !== -1 || m.tags.indexOf("power") !== -1; })
      : MOVS;

  const recent = sessionHistory.slice(-3).map(function (s) { return s.readiness; });
  let trend = null;
  if (recent.length >= 2) {
    const last = recent[recent.length - 1];
    if (last > recent[0]) trend = "↑ Improving";
    else if (last < recent[0]) trend = "↓ Declining";
    else trend = "→ Stable";
  }

  const headline = !checkIn ? "Foundation Program" : r <= 2 ? "Rest & restore." : r >= 4 ? "Strong window. Load it up." : "Build with intention.";
  const isFirstVisit = sessionHistory.length === 0;

  return (
    <div style={{ paddingBottom: 90 }}>
      <div style={{ background: C.gd, padding: "38px 24px 26px", position: "relative" }}>
        <div style={{ position: "absolute", top: 18, right: 24, width: 36, height: 36, borderRadius: "50%", border: "2px solid rgba(200,169,106,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: C.go }}>↑</div>
        <div style={{ fontFamily: "'Georgia',serif", fontSize: 24, color: C.cr, lineHeight: 1.3, marginBottom: 8, maxWidth: 260 }}>{headline}</div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {checkIn ? <span style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.sl }}>Readiness {r}/5</span> : null}
          {trend ? <span style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.go }}>Trend: {trend}</span> : null}
          <span style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.sl }}>Week {week} · {sessionHistory.length} done</span>
        </div>
      </div>
      {isFirstVisit ? (
        <div style={{ margin: "16px 24px 0", padding: "14px 16px", borderRadius: 12, background: "rgba(200,169,106,0.1)", border: "1px solid " + C.go }}>
          <div style={{ fontFamily: "'Georgia',serif", fontSize: 14, color: C.gd, marginBottom: 4 }}>Your first session lives here.</div>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.mu, lineHeight: 1.5 }}>{checkIn ? "Generate it below — built from how you're actually doing today, not a generic plan." : "Do your check-in first so this session is built around today, not guessed at."}</div>
        </div>
      ) : <RotatingQuote cycle={state.quoteCycle} offset={1} margin="16px 24px 0" />}
      <div style={{ padding: "18px 24px 0" }}>
        {checkIn ? (
          <div style={{ marginBottom: 18 }}>
            {sessionLoading ? <Spinner msg="Building your session..." sub="Claude is selecting movements based on your readiness." /> :
              currentSession ? (
                <div style={{ background: C.cr, borderRadius: 14, border: "1px solid " + C.go, padding: "16px" }}>
                  <div style={{ fontSize: 10, letterSpacing: 1.5, color: C.go, fontFamily: "Inter,sans-serif", fontWeight: 700, textTransform: "uppercase", marginBottom: 5 }}>Today's Program</div>
                  <div style={{ fontFamily: "'Georgia',serif", fontSize: 18, color: C.gd, marginBottom: 6 }}>{currentSession.sessionTitle}</div>
                  <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.mu, lineHeight: 1.5, marginBottom: 10 }}>{currentSession.sessionRationale}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 12 }}>
                    {currentSession.exercises.map(function (e, i) {
                      return <span key={i} style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.sg, background: C.sl, borderRadius: 20, padding: "3px 10px" }}>{e.movement ? e.movement.name : ""}</span>;
                    })}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={function () { setPlaying(true); }} style={{ flex: 2, padding: "12px", borderRadius: 10, background: C.gd, color: C.cr, border: "none", fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>▶ Start — ~{currentSession.estimatedMinutes} min</button>
                    <button onClick={gen} style={{ flex: 1, padding: "12px", borderRadius: 10, background: "transparent", color: C.sg, border: "1px solid " + C.sg, fontFamily: "Inter,sans-serif", fontSize: 12, cursor: "pointer" }}>↺ New</button>
                  </div>
                </div>
              ) : (
                <button onClick={gen} style={{ width: "100%", padding: "14px", borderRadius: 12, background: C.gd, color: C.cr, border: "none", fontFamily: "Inter,sans-serif", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>◈ Generate Today's Session</button>
              )}
            {!currentSession ? (
              <button onClick={genDetailed} style={{ width: "100%", padding: "11px", borderRadius: 10, background: "transparent", color: C.gd, border: "1px dashed " + C.sl, fontFamily: "Inter,sans-serif", fontSize: 12, cursor: "pointer", marginTop: 8 }}>⚙ Or generate a detailed session (shows injury warnings, no AI wait)</button>
            ) : null}
            {showContraWarning && detailedSession ? (
              <div style={{ position: "fixed", inset: 0, background: "rgba(26,74,46,0.94)", display: "flex", flexDirection: "column", justifyContent: "center", padding: 28, zIndex: 300 }}>
                <div style={{ fontSize: 30, color: C.am, marginBottom: 14, textAlign: "center" }}>⚠</div>
                <div style={{ fontFamily: "'Georgia',serif", fontSize: 19, color: C.cr, textAlign: "center", marginBottom: 10 }}>This session includes something flagged against an injury you logged.</div>
                <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 12, padding: 16, marginBottom: 20 }}>
                  {detailedSession.flagged.map(function (f) {
                    return (
                      <div key={f.movement.name} style={{ marginBottom: 10 }}>
                        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 700, color: C.cr }}>{f.movement.name}</div>
                        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.am }}>Flagged for: {f.matchedInjuries.join(", ")}</div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.sl, lineHeight: 1.6, marginBottom: 24, textAlign: "center" }}>You know your body better than this app does. These suggestions are not medical advice and don't replace professional guidance.</div>
                <button onClick={function () { setContraWarningAcked(true); setShowContraWarning(false); }} style={{ width: "100%", padding: 15, borderRadius: 12, background: C.go, color: C.gd, border: "none", fontFamily: "Inter,sans-serif", fontSize: 14, fontWeight: 700, cursor: "pointer", marginBottom: 10 }}>I understand, continue anyway</button>
                <button onClick={function () { genDetailed(); }} style={{ width: "100%", padding: 15, borderRadius: 12, background: "transparent", color: C.sl, border: "1px solid " + C.sl, fontFamily: "Inter,sans-serif", fontSize: 14, cursor: "pointer" }}>Regenerate without it</button>
              </div>
            ) : null}
            {detailedSession && !showContraWarning ? (
              <div style={{ background: C.ow, borderRadius: 14, border: "1px solid " + C.sl, padding: "16px", marginTop: 10 }}>
                <div style={{ fontSize: 10, letterSpacing: 1.5, color: C.mu, fontFamily: "Inter,sans-serif", fontWeight: 700, textTransform: "uppercase", marginBottom: 5 }}>Detailed Session</div>
                {detailedSession.trend && detailedSession.trend !== "unknown" ? (
                  <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: detailedSession.trend === "declining" ? C.am : detailedSession.trend === "improving" ? C.sg : C.mu, marginBottom: 8 }}>
                    {detailedSession.trend === "improving" ? "↑ Trending up the last few sessions" : detailedSession.trend === "declining" ? "↓ Trending down — volume trimmed slightly to match" : detailedSession.trend === "volatile" ? "∿ Readiness has been inconsistent — keeping it steady today" : "→ Holding steady"}
                  </div>
                ) : null}
                {detailedSession.main.map(function (m, i) {
                  return (
                    <div key={i} style={{ borderBottom: i < detailedSession.main.length - 1 ? "1px solid " + C.sl : "none", padding: "9px 0" }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontFamily: "'Georgia',serif", fontSize: 14, color: C.gd }}>{m.name}</span>
                        <span style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.mu }}>{m.sets} × {m.reps}</span>
                      </div>
                      <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.sg, fontStyle: "italic" }}>{m.cue}</div>
                    </div>
                  );
                })}
                <div style={{ fontFamily: "Inter,sans-serif", fontSize: 10, color: C.mu, marginTop: 10 }}>Not medical advice — not yet wired to the session player in this demo.</div>
              </div>
            ) : null}
            {aiInsight && aiInsight.movement && !currentSession && !sessionLoading ? (
              <div style={{ background: "rgba(200,169,106,0.1)", borderRadius: 10, padding: "11px 14px", marginTop: 10, border: "1px solid rgba(200,169,106,0.3)" }}>
                <div style={{ fontSize: 10, color: C.go, fontFamily: "Inter,sans-serif", fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 3 }}>From your check-in</div>
                <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: C.ch, lineHeight: 1.5 }}>{aiInsight.movement}</div>
              </div>
            ) : null}
          </div>
        ) : null}

        <button onClick={function () { setOpen(!open); }} style={{ width: "100%", padding: "11px 14px", borderRadius: 10, background: open ? C.gd : C.ow, border: "1px solid " + (open ? C.gd : C.sl), display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", marginBottom: 2 }}>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 600, color: open ? C.cr : C.ch }}>Movement Library ({filtered.length})</div>
          <div style={{ color: open ? C.go : C.mu, transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "none" }}>▼</div>
        </button>

        {open ? (
          <div style={{ border: "1px solid " + C.sl, borderTop: "none", borderRadius: "0 0 10px 10px", padding: "10px", marginBottom: 14 }}>
            {filtered.map(function (m, i) {
              const isExp = exp === i;
              return (
                <div key={m.name} onClick={function () { setExp(isExp ? null : i); }} style={{ border: "1px solid " + (isExp ? C.gd : C.sl), borderRadius: 10, padding: "12px", marginBottom: 8, background: isExp ? C.ow : C.wh, cursor: "pointer" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: m.tier === 1 ? C.sg : m.tier === 2 ? C.go : C.gd }} />
                      <span style={{ fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 600, color: C.ch }}>{m.name}</span>
                    </div>
                    <span style={{ color: C.mu, fontSize: 13 }}>{isExp ? "↑" : "↓"}</span>
                  </div>
                  {isExp ? (
                    <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid " + C.sl }}>
                      <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.mu, marginBottom: 6 }}>{m.muscles}</div>
                      {m.cues.map(function (c, j) {
                        return <div key={j} style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.ch, marginBottom: 3 }}>· {c}</div>;
                      })}
                      <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu, marginTop: 6 }}>{m.regression} → {m.progression}</div>
                      {m.contra.length > 0 ? (
                        <div style={{ padding: "5px 8px", background: "rgba(192,57,43,0.06)", borderRadius: 6, marginTop: 8 }}>
                          <span style={{ fontFamily: "Inter,sans-serif", fontSize: 10, color: C.rd }}>⚠ {m.contra.join(" · ")}</span>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Nourish(props) {
  const state = props.state;
  const setState = props.setState;
  const setScreen = props.setScreen;
  const [tab, setTab] = useState("log");
  const [adding, setAdding] = useState(false);
  const [d, setD] = useState({ name: "", kcal: "", protein: "", carbs: "", fat: "", notes: "" });
  const [showSuggest, setShowSuggest] = useState(false);
  const [showMacroEdu, setShowMacroEdu] = useState(false);
  const [discoverGoal, setDiscoverGoal] = useState(null);
  const [pantryText, setPantryText] = useState("");
  const [openDiscoverRecipe, setOpenDiscoverRecipe] = useState(null);
  const meals = state.meals;
  const bodyStats = state.bodyStats;

  const discoverResults = discoverGoal ? recommendDemoRecipes(discoverGoal, pantryText, 6) : [];

  const foodMatches = d.name.trim().length > 1
    ? FOODS.filter(function (f) { return f.name.toLowerCase().indexOf(d.name.toLowerCase()) !== -1; }).slice(0, 5)
    : [];

  const pickFood = function (f) {
    setD(function (x) { return Object.assign({}, x, { name: f.name, kcal: String(f.kcal), protein: String(f.protein), carbs: String(f.carbs), fat: String(f.fat) }); });
    setShowSuggest(false);
  };

  const totK = meals.reduce(function (a, m) { return a + (Number(m.kcal) || 0); }, 0);
  const totP = meals.reduce(function (a, m) { return a + (Number(m.protein) || 0); }, 0);
  const totC = meals.reduce(function (a, m) { return a + (Number(m.carbs) || 0); }, 0);
  const totF = meals.reduce(function (a, m) { return a + (Number(m.fat) || 0); }, 0);

  const w = Number(bodyStats ? bodyStats.weight : 0);
  const h = Number(bodyStats ? bodyStats.height : 0);
  const age = Number(bodyStats ? bodyStats.age : 0);
  const unit = bodyStats ? bodyStats.unit : "metric";
  const sex = bodyStats ? bodyStats.sex : "";
  const hm = unit === "imperial" ? h * 0.0254 : h / 100;
  const wkg = unit === "imperial" ? w * 0.453592 : w;
  const hcm = unit === "imperial" ? h * 2.54 : h;
  const bmi = (w && h) ? (wkg / (hm * hm)).toFixed(1) : null;
  const bmiCat = bmi ? (Number(bmi) < 18.5 ? "Underweight" : Number(bmi) < 25 ? "Healthy" : Number(bmi) < 30 ? "Overweight" : "Obese") : null;
  const waist = Number(bodyStats ? bodyStats.waist : 0);
  const waistCm = unit === "imperial" ? waist * 2.54 : waist;
  const whtr = (waistCm && hcm) ? (waistCm / hcm).toFixed(2) : null;
  const whtrCat = whtr ? (Number(whtr) < 0.5 ? "Healthy range" : Number(whtr) < 0.6 ? "Increased risk" : "High risk") : null;
  const sexOffset = sex === "male" ? 5 : sex === "female" ? -161 : -78;
  const tdee = (w && h && age) ? Math.round((10 * wkg + 6.25 * hcm - 5 * age + sexOffset) * 1.55) : null;
  const macros = tdee ? { p: Math.round(tdee * 0.3 / 4), c: Math.round(tdee * 0.4 / 4), f: Math.round(tdee * 0.3 / 9) } : null;

  const addMeal = function () {
    if (!d.name.trim()) return;
    const entry = Object.assign({}, d, { id: Date.now(), time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) });
    setState(function (s) { return Object.assign({}, s, { meals: s.meals.concat([entry]) }); });
    setD({ name: "", kcal: "", protein: "", carbs: "", fat: "", notes: "" });
    setAdding(false);
  };

  const mealFields = [
    ["What did you eat?", "name", "text", "e.g. Eggs on toast"],
    ["Calories", "kcal", "number", "e.g. 450"],
    ["Protein (g)", "protein", "number", ""],
    ["Carbs (g)", "carbs", "number", ""],
    ["Fat (g)", "fat", "number", ""],
    ["How did it make you feel?", "notes", "textarea", "Energised, heavy..."],
  ];

  return (
    <div style={{ paddingBottom: 90 }}>
      <div style={{ background: C.ow, padding: "38px 24px 24px", borderBottom: "3px solid " + C.go }}>
        <div style={{ fontFamily: "'Georgia',serif", fontSize: 24, color: C.gd, marginBottom: 5 }}>Fuel with intention.</div>
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.mu }}>Not calorie counting. A relationship with what you eat.</div>
      </div>
      {meals.length === 0 ? (
        <div style={{ margin: "16px 24px 0", padding: "14px 16px", borderRadius: 12, background: "rgba(200,169,106,0.1)", border: "1px solid " + C.go }}>
          <div style={{ fontFamily: "'Georgia',serif", fontSize: 14, color: C.gd, marginBottom: 4 }}>Nothing logged yet — that's fine.</div>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.mu, lineHeight: 1.5 }}>Log your next meal whenever it happens. No pressure to backfill the day.</div>
        </div>
      ) : <RotatingQuote cycle={state.quoteCycle} offset={2} margin="16px 24px 0" />}
      <div style={{ padding: "0 24px" }}>
        <div style={{ display: "flex", borderBottom: "1px solid " + C.sl, marginBottom: 16, marginTop: meals.length === 0 ? 16 : 0 }}>
          {[["log", "Log"], ["discover", "Discover"], ["macros", "Macros"], ["bmi", "BMI"]].map(function (pair) {
            const id = pair[0], label = pair[1];
            const active = tab === id;
            return (
              <button key={id} onClick={function () { setTab(id); }} style={{ flex: 1, padding: "12px 0", background: "transparent", border: "none", borderBottom: "2px solid " + (active ? C.gd : "transparent"), fontFamily: "Inter,sans-serif", fontSize: 12, fontWeight: active ? 700 : 400, color: active ? C.gd : C.mu, cursor: "pointer" }}>{label}</button>
            );
          })}
        </div>

        {tab === "log" ? (
          <div>
            {totK > 0 ? (
              <div style={{ background: C.ow, borderRadius: 10, padding: "12px", marginBottom: 14, border: "1px solid " + C.sl, display: "flex", justifyContent: "space-around", textAlign: "center" }}>
                {[["Meals", meals.length], ["kcal", totK || "—"], ["P", totP ? totP + "g" : "—"], ["C", totC ? totC + "g" : "—"], ["F", totF ? totF + "g" : "—"]].map(function (pair) {
                  return (
                    <div key={pair[0]}>
                      <div style={{ fontFamily: "'Georgia',serif", fontSize: 20, color: C.gd }}>{pair[1]}</div>
                      <div style={{ fontFamily: "Inter,sans-serif", fontSize: 9, color: C.mu, textTransform: "uppercase" }}>{pair[0]}</div>
                    </div>
                  );
                })}
              </div>
            ) : null}

            {adding ? (
              <div style={{ background: C.cr, borderRadius: 12, padding: "16px", marginBottom: 14, border: "1px solid " + C.sl }}>
                <div style={{ marginBottom: 10, position: "relative" }}>
                  <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu, marginBottom: 3 }}>What did you eat?</div>
                  <input
                    type="text"
                    value={d.name}
                    onChange={function (e) { setD(function (x) { return Object.assign({}, x, { name: e.target.value }); }); setShowSuggest(true); }}
                    onFocus={function () { setShowSuggest(true); }}
                    placeholder="e.g. Eggs on toast — start typing for suggestions"
                    style={{ width: "100%", padding: "8px", borderRadius: 7, border: "1px solid " + C.sl, fontFamily: "Inter,sans-serif", fontSize: 13, boxSizing: "border-box", outline: "none" }}
                  />
                  {showSuggest && foodMatches.length > 0 ? (
                    <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: C.wh, border: "1px solid " + C.sl, borderRadius: 8, marginTop: 4, zIndex: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                      {foodMatches.map(function (f) {
                        return (
                          <div key={f.name} onClick={function () { pickFood(f); }} style={{ padding: "9px 12px", borderBottom: "1px solid " + C.sl, cursor: "pointer" }}>
                            <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, fontWeight: 600, color: C.ch }}>{f.name}</div>
                            <div style={{ fontFamily: "Inter,sans-serif", fontSize: 10, color: C.mu }}>{f.kcal} kcal · P{f.protein} C{f.carbs} F{f.fat}</div>
                          </div>
                        );
                      })}
                    </div>
                  ) : null}
                  {d.kcal ? <div style={{ fontFamily: "Inter,sans-serif", fontSize: 10, color: C.sg, marginTop: 4 }}>Macros autofilled — edit any value below if needed.</div> : null}
                </div>
                {mealFields.slice(1).map(function (f) {
                  const label = f[0], key = f[1], type = f[2], ph = f[3];
                  return (
                    <div key={key} style={{ marginBottom: 10 }}>
                      <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu, marginBottom: 3 }}>{label}</div>
                      {type === "textarea" ? (
                        <textarea value={d[key]} onChange={function (e) { setD(function (x) { const next = Object.assign({}, x); next[key] = e.target.value; return next; }); }} placeholder={ph} rows={2} style={{ width: "100%", padding: "8px", borderRadius: 7, border: "1px solid " + C.sl, fontFamily: "Inter,sans-serif", fontSize: 13, resize: "none", boxSizing: "border-box", outline: "none" }} />
                      ) : (
                        <input type={type} value={d[key]} onChange={function (e) { setD(function (x) { const next = Object.assign({}, x); next[key] = e.target.value; return next; }); }} placeholder={ph} style={{ width: "100%", padding: "8px", borderRadius: 7, border: "1px solid " + C.sl, fontFamily: "Inter,sans-serif", fontSize: 13, boxSizing: "border-box", outline: "none" }} />
                      )}
                    </div>
                  );
                })}
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={addMeal} style={{ flex: 2, padding: "10px", borderRadius: 8, background: C.gd, color: C.cr, border: "none", fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Log meal</button>
                  <button onClick={function () { setAdding(false); }} style={{ flex: 1, padding: "10px", borderRadius: 8, background: "transparent", color: C.mu, border: "1px solid " + C.sl, fontFamily: "Inter,sans-serif", fontSize: 12, cursor: "pointer" }}>Cancel</button>
                </div>
              </div>
            ) : (
              <button onClick={function () { setAdding(true); }} style={{ width: "100%", padding: "13px", borderRadius: 12, background: C.gd, color: C.cr, border: "none", fontFamily: "Inter,sans-serif", fontSize: 14, fontWeight: 700, cursor: "pointer", marginBottom: 14 }}>+ Log a meal</button>
            )}

            {meals.map(function (m) {
              return (
                <div key={m.id} style={{ border: "1px solid " + C.sl, borderRadius: 10, padding: "12px", marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <div style={{ fontFamily: "Inter,sans-serif", fontSize: 14, fontWeight: 600, color: C.ch }}>{m.name}</div>
                    <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu }}>{m.time}</div>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {m.kcal ? <span style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.sg }}>{m.kcal} kcal</span> : null}
                    {m.protein ? <span style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu }}>P:{m.protein}g</span> : null}
                    {m.carbs ? <span style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu }}>C:{m.carbs}g</span> : null}
                    {m.fat ? <span style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu }}>F:{m.fat}g</span> : null}
                  </div>
                  {m.notes ? <div style={{ fontFamily: "'Georgia',serif", fontSize: 12, color: C.mu, fontStyle: "italic", marginTop: 3 }}>{m.notes}</div> : null}
                </div>
              );
            })}
          </div>
        ) : null}

        {tab === "discover" ? (
          <div>
            <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.mu, lineHeight: 1.5, marginBottom: 14 }}>Tell us the goal and we'll find meals that fit — not the whole library, just what makes sense today.</div>
            {GOAL_GROUPS.map(function (group) {
              return (
                <div key={group.label} style={{ marginBottom: 14 }}>
                  <div style={{ fontFamily: "Inter,sans-serif", fontSize: 10, letterSpacing: 1, color: C.mu, textTransform: "uppercase", marginBottom: 6 }}>{group.label}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {group.goals.map(function (gName) {
                      const active = discoverGoal === gName;
                      const isPopular = gName === "General Health";
                      return (
                        <button key={gName} onClick={function () { setDiscoverGoal(gName); }} style={{ position: "relative", padding: "10px 8px", borderRadius: 10, border: "1px solid " + (active ? C.go : C.sl), background: active ? "rgba(200,169,106,0.15)" : C.wh, color: active ? C.go : C.ch, fontFamily: "Inter,sans-serif", fontSize: 11, cursor: "pointer", fontWeight: active ? 600 : 400 }}>
                          {gName}
                          {isPopular && !active ? <span style={{ position: "absolute", top: -7, right: 4, fontSize: 8, color: C.go, background: C.ow, padding: "1px 5px", borderRadius: 8, border: "1px solid " + C.go }}>Most popular</span> : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            {discoverGoal ? (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu, marginBottom: 6 }}>What's already in your kitchen? (optional)</div>
                <input value={pantryText} onChange={function (e) { setPantryText(e.target.value); }} placeholder="e.g. chicken, rice, eggs" style={{ width: "100%", padding: "9px", borderRadius: 7, border: "1px solid " + C.sl, fontFamily: "Inter,sans-serif", fontSize: 13, boxSizing: "border-box", outline: "none" }} />
              </div>
            ) : null}
            {discoverGoal ? discoverResults.map(function (r) {
              return (
                <div key={r.id} onClick={function () { setOpenDiscoverRecipe(r); }} style={{ background: C.wh, border: "1px solid " + C.sl, borderRadius: 12, padding: 14, marginBottom: 10, cursor: "pointer" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <div style={{ fontFamily: "'Georgia',serif", fontSize: 14, color: C.gd, maxWidth: 220 }}>{r.name}</div>
                    <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu, whiteSpace: "nowrap" }}>{r.totalMin} min</div>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", marginBottom: 6 }}>
                    {r._badges.map(function (b) {
                      return <span key={b} style={{ fontFamily: "Inter,sans-serif", fontSize: 10, color: C.go, background: "rgba(200,169,106,0.12)", border: "1px solid rgba(200,169,106,0.3)", borderRadius: 12, padding: "3px 9px", marginRight: 5, marginBottom: 5, display: "inline-block" }}>{b}</span>;
                    })}
                  </div>
                  <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu, display: "flex", gap: 12 }}>
                    <span>{r.calories} kcal</span>
                    <span>{r.protein}g protein</span>
                    <span>${r.costPerServe.toFixed(2)}/serve</span>
                  </div>
                </div>
              );
            }) : null}
            {openDiscoverRecipe ? (
              <div style={{ position: "fixed", inset: 0, background: "rgba(26,74,46,0.5)", display: "flex", alignItems: "flex-end", zIndex: 200 }} onClick={function () { setOpenDiscoverRecipe(null); }}>
                <div style={{ background: C.cr, width: "100%", maxWidth: 420, maxHeight: "80vh", overflowY: "auto", borderRadius: "20px 20px 0 0", padding: 22 }} onClick={function (e) { e.stopPropagation(); }}>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button onClick={function () { setOpenDiscoverRecipe(null); }} style={{ background: "none", border: "none", fontSize: 18, color: C.mu, cursor: "pointer" }}>✕</button>
                  </div>
                  <div style={{ fontFamily: "'Georgia',serif", fontSize: 22, color: C.gd, marginBottom: 12 }}>{openDiscoverRecipe.name}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 16, background: C.ow, borderRadius: 10, padding: 12 }}>
                    {[["Calories", openDiscoverRecipe.calories], ["Protein", openDiscoverRecipe.protein + "g"], ["Carbs", openDiscoverRecipe.carbs + "g"], ["Fat", openDiscoverRecipe.fat + "g"]].map(function (pair) {
                      return (
                        <div key={pair[0]} style={{ textAlign: "center" }}>
                          <div style={{ fontFamily: "'Georgia',serif", fontSize: 15, color: C.gd }}>{pair[1]}</div>
                          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 9, color: C.mu, textTransform: "uppercase" }}>{pair[0]}</div>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu, marginBottom: 4 }}>~ estimated nutrition, not yet verified against AUSNUT/FSANZ</div>
                  <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 700, color: C.ch, marginTop: 14, marginBottom: 6 }}>What goes in it</div>
                  <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: C.ch, lineHeight: 1.6, marginBottom: 14 }}>{openDiscoverRecipe.ingredientPattern}</div>
                  <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 700, color: C.ch, marginBottom: 6 }}>Method</div>
                  <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: C.ch, lineHeight: 1.6 }}>{openDiscoverRecipe.method}</div>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        {tab === "macros" ? (
          macros ? (
            <div>
              <div style={{ background: C.cr, borderRadius: 12, padding: "16px", marginBottom: 14, border: "1px solid " + C.sl }}>
                <div style={{ fontSize: 10, letterSpacing: 1.5, color: C.mu, fontFamily: "Inter,sans-serif", fontWeight: 600, textTransform: "uppercase", marginBottom: 10 }}>Daily Targets (estimated)</div>
                <div style={{ display: "flex", justifyContent: "space-around", textAlign: "center", marginBottom: 10 }}>
                  {[["Calories", tdee, "kcal"], ["Protein", macros.p, "g"], ["Carbs", macros.c, "g"], ["Fat", macros.f, "g"]].map(function (pair) {
                    return (
                      <div key={pair[0]}>
                        <div style={{ fontFamily: "'Georgia',serif", fontSize: 22, color: C.gd }}>{pair[1]}</div>
                        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 9, color: C.mu, textTransform: "uppercase" }}>{pair[0]}</div>
                        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 10, color: C.sg }}>{pair[2]}</div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu }}>Estimated for moderate activity. Consult a dietitian for precision.</div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <div onClick={function () { setShowMacroEdu(!showMacroEdu); }} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", padding: "11px 14px", background: C.wh, border: "1px solid " + C.sl, borderRadius: 10 }}>
                  <span style={{ fontFamily: "Inter,sans-serif", fontSize: 12, fontWeight: 600, color: C.gd }}>What does this actually mean?</span>
                  <span style={{ color: C.mu, fontSize: 12 }}>{showMacroEdu ? "−" : "+"}</span>
                </div>
                {showMacroEdu ? (
                  <div style={{ padding: "12px 14px", background: C.ow, borderRadius: 10, marginTop: 6, border: "1px solid " + C.sl }}>
                    <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, fontWeight: 700, color: C.ch, marginBottom: 3 }}>Calorie deficit / surplus</div>
                    <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.ch, lineHeight: 1.6, marginBottom: 10 }}>Your body burns a certain amount of energy a day just existing, plus whatever you move. Eat less than that total and you're in a "deficit" — over time this tends toward fat loss. Eat more and you're in a "surplus" — useful when the goal is building muscle or size. Neither is good or bad on its own; it depends what you're going for.</div>
                    <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, fontWeight: 700, color: C.ch, marginBottom: 3 }}>Protein, carbs, fat</div>
                    <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.ch, lineHeight: 1.6 }}>Protein repairs and builds muscle tissue — useful in any goal. Carbs are your body's preferred fuel, especially for harder training. Fat supports hormones and longer-lasting energy. The numbers above are a starting estimate, not a rule to chase perfectly.</div>
                  </div>
                ) : null}
              </div>
              {totK > 0 ? (
                <div style={{ background: C.ow, borderRadius: 10, padding: "14px", border: "1px solid " + C.sl }}>
                  {[["Calories", totK, tdee, "kcal"], ["Protein", totP, macros.p, "g"], ["Carbs", totC, macros.c, "g"], ["Fat", totF, macros.f, "g"]].map(function (row) {
                    const label = row[0], v = row[1], t = row[2], u = row[3];
                    const pct = Math.min(v / t * 100, 100);
                    return (
                      <div key={label} style={{ marginBottom: 10 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                          <span style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.ch }}>{label}</span>
                          <span style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.mu }}>{v}/{t}{u}</span>
                        </div>
                        <div style={{ height: 5, background: C.sl, borderRadius: 3 }}>
                          <div style={{ height: "100%", width: pct + "%", background: v >= t ? C.go : C.gd, borderRadius: 3 }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>
          ) : (function () {
            const missing = [];
            if (!bodyStats || !bodyStats.weight) missing.push("weight");
            if (!bodyStats || !bodyStats.height) missing.push("height");
            if (!bodyStats || !bodyStats.age) missing.push("age");
            return (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <div style={{ fontFamily: "'Georgia',serif", fontSize: 16, color: C.gd, marginBottom: 8 }}>Add a few details for personalized targets.</div>
                <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.mu, marginBottom: 4 }}>Still missing: {missing.join(", ")}.</div>
                <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu, marginBottom: 18 }}>Used only for the calorie/macro formula — nothing else.</div>
                <button onClick={function () { setScreen("profile"); }} style={{ padding: "11px 22px", borderRadius: 10, background: C.gd, color: C.cr, border: "none", fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Add in Profile →</button>
              </div>
            );
          })()
        ) : null}

        {tab === "bmi" ? (
          bmi ? (
            <div style={{ padding: "12px 0" }}>
              <div style={{ textAlign: "center", marginBottom: 22 }}>
                <div style={{ fontFamily: "'Georgia',serif", fontSize: 64, color: Number(bmi) < 25 ? C.gd : Number(bmi) < 30 ? C.am : C.rd, lineHeight: 1 }}>{bmi}</div>
                <div style={{ fontFamily: "Inter,sans-serif", fontSize: 15, color: C.ch, marginTop: 4, marginBottom: 10 }}>{bmiCat}</div>
                <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.mu, lineHeight: 1.6, maxWidth: 280, margin: "0 auto" }}>BMI is weight relative to height — it can't tell muscle from fat. If you're muscular or athletic, it will often read higher than it should. Better Health Channel and the Heart Foundation both recommend pairing it with a waist-based measure.</div>
              </div>
              {whtr ? (
                <div style={{ background: C.ow, borderRadius: 12, padding: 16, marginBottom: 14, border: "1px solid " + C.sl }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                    <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, fontWeight: 700, color: C.ch }}>Waist-to-Height Ratio</div>
                    <div style={{ fontFamily: "'Georgia',serif", fontSize: 20, color: Number(whtr) < 0.5 ? C.gd : Number(whtr) < 0.6 ? C.am : C.rd }}>{whtr}</div>
                  </div>
                  <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: C.ch, marginBottom: 6 }}>{whtrCat}</div>
                  <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu, lineHeight: 1.5 }}>Simple rule: keep your waist under half your height. This doesn't get thrown off by muscle the way BMI does — it's tracking abdominal fat specifically, which is what matters most for health risk.</div>
                </div>
              ) : (
                <div style={{ background: C.ow, borderRadius: 12, padding: 16, marginBottom: 14, border: "1px dashed " + C.sl, textAlign: "center" }}>
                  <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.mu, lineHeight: 1.6 }}>Add your waist measurement in Profile to see your waist-to-height ratio — a more muscle-aware supplement to BMI.</div>
                </div>
              )}
              <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu, lineHeight: 1.6, fontStyle: "italic" }}>Neither of these are diagnoses. They're one data point each, not a verdict on your health — especially if you're pregnant, an older adult, or carrying a lot of muscle.</div>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ fontFamily: "'Georgia',serif", fontSize: 15, color: C.gd, marginBottom: 6 }}>No body stats yet.</div>
              <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.mu }}>Add them in Profile.</div>
            </div>
          )
        ) : null}
      </div>
    </div>
  );
}

function Track(props) {
  const state = props.state;
  const setState = props.setState;
  const [tab, setTab] = useState("sleep");
  const [sd, setSd] = useState({ hours: 7, quality: 3 });
  const [sobrietySetup, setSobrietySetup] = useState(false);
  const [sobD, setSobD] = useState({ substance: "alcohol", startDate: "" });
  const [gd, setGd] = useState({ name: "", target: "", unit: "" });
  const [addingG, setAddingG] = useState(false);
  const [cd, setCd] = useState({ intensity: 3, trigger: "stress", note: "" });
  const sleepLog = state.sleepLog;
  const sobriety = state.sobriety;
  const goals = state.goals;
  const steps = state.steps;
  const cravingLog = state.cravingLog || [];

  const sobDays = (sobriety && sobriety.startDate) ? Math.floor((Date.now() - new Date(sobriety.startDate).getTime()) / 86400000) : 0;
  const last7 = sleepLog.slice(-7);
  const avgSl = last7.length ? (last7.reduce(function (a, s) { return a + s.hours; }, 0) / last7.length).toFixed(1) : null;
  const lastNight = sleepLog.length ? sleepLog[sleepLog.length - 1] : null;
  const trackIsEmpty = sleepLog.length === 0 && !sobriety && goals.length === 0 && cravingLog.length === 0 && (steps || 0) === 0;

  return (
    <div style={{ paddingBottom: 90 }}>
      <div style={{ background: C.gd, padding: "44px 24px 28px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -20, right: -10, fontSize: 150, color: "rgba(200,169,106,0.05)", fontFamily: "'Georgia',serif", fontWeight: 700, lineHeight: 1, pointerEvents: "none" }}>◎</div>
        <div style={{ fontSize: 11, letterSpacing: 3, color: C.go, fontFamily: "Inter,sans-serif", fontWeight: 600, marginBottom: 6, textTransform: "uppercase" }}>Track</div>
        <div style={{ fontFamily: "'Georgia',serif", fontSize: 25, color: C.cr, fontWeight: 400, lineHeight: 1.3 }}>Private. Honest. Yours.</div>
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: C.sl, marginTop: 8 }}>Sleep, sobriety, mind, goals, steps.</div>
      </div>
      {trackIsEmpty ? (
        <div style={{ margin: "0 24px 16px", padding: "14px 16px", borderRadius: 12, background: "rgba(200,169,106,0.1)", border: "1px solid " + C.go }}>
          <div style={{ fontFamily: "'Georgia',serif", fontSize: 14, color: C.gd, marginBottom: 4 }}>An empty page, not a blank score.</div>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.mu, lineHeight: 1.5 }}>Pick whichever tab matters to you right now. None of it needs to be filled in order.</div>
        </div>
      ) : <RotatingQuote cycle={state.quoteCycle} offset={3} margin="0 24px 16px" />}
      <div style={{ padding: "16px 24px 0" }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 18, overflowX: "auto" }}>
          {[["sleep", "Sleep"], ["sobriety", "Sobriety"], ["mind", "Mind"], ["goals", "Goals"], ["steps", "Steps"]].map(function (pair) {
            const id = pair[0], label = pair[1];
            const active = tab === id;
            return (
              <button key={id} onClick={function () { setTab(id); }} style={{ flexShrink: 0, padding: "7px 13px", borderRadius: 20, background: active ? C.gd : "transparent", border: "1px solid " + (active ? C.gd : C.sl), color: active ? C.cr : C.mu, fontFamily: "Inter,sans-serif", fontSize: 12, fontWeight: active ? 600 : 400, cursor: "pointer" }}>{label}</button>
            );
          })}
        </div>

        {tab === "sleep" ? (
          <div>
            {avgSl ? (
              <div style={{ background: C.ow, borderRadius: 10, padding: "12px", marginBottom: 14, border: "1px solid " + C.sl, display: "flex", justifyContent: "space-around", textAlign: "center" }}>
                <div>
                  <div style={{ fontFamily: "'Georgia',serif", fontSize: 26, color: C.gd }}>{avgSl}h</div>
                  <div style={{ fontFamily: "Inter,sans-serif", fontSize: 9, color: C.mu, textTransform: "uppercase" }}>7-day avg</div>
                </div>
                <div>
                  <div style={{ fontFamily: "'Georgia',serif", fontSize: 26, color: lastNight && lastNight.hours >= 7 ? C.gd : C.am }}>{lastNight ? lastNight.hours : "—"}h</div>
                  <div style={{ fontFamily: "Inter,sans-serif", fontSize: 9, color: C.mu, textTransform: "uppercase" }}>Last night</div>
                </div>
              </div>
            ) : null}
            <div style={{ background: C.cr, borderRadius: 12, padding: "16px", marginBottom: 14, border: "1px solid " + C.sl }}>
              <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 600, color: C.ch, marginBottom: 12 }}>Log last night</div>
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: C.ch }}>Hours slept</span>
                  <span style={{ fontFamily: "'Georgia',serif", fontSize: 18, color: C.gd }}>{sd.hours}h</span>
                </div>
                <input type="range" min={0} max={12} step={0.5} value={sd.hours} onChange={function (e) { setSd(function (x) { return Object.assign({}, x, { hours: Number(e.target.value) }); }); }} style={{ width: "100%", accentColor: C.gd }} />
              </div>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: C.ch, marginBottom: 6 }}>Quality</div>
                <div style={{ display: "flex", gap: 6 }}>
                  {[1, 2, 3, 4, 5].map(function (n) {
                    const active = sd.quality === n;
                    return (
                      <button key={n} onClick={function () { setSd(function (x) { return Object.assign({}, x, { quality: n }); }); }} style={{ flex: 1, padding: "9px 0", borderRadius: 8, border: "1px solid " + (active ? C.gd : C.sl), background: active ? C.gd : "transparent", color: active ? C.cr : C.mu, fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: active ? 700 : 400, cursor: "pointer" }}>{n}</button>
                    );
                  })}
                </div>
              </div>
              <GreenButton label="Log Sleep" onClick={function () {
                const entry = { date: new Date().toDateString(), hours: sd.hours, quality: sd.quality };
                setState(function (s) { return Object.assign({}, s, { sleepLog: s.sleepLog.concat([entry]) }); });
              }} full={true} />
            </div>
            {sleepLog.slice().reverse().slice(0, 6).map(function (s, i) {
              return (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid " + C.sl }}>
                  <div>
                    <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 600, color: C.ch }}>{s.date}</div>
                    <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu }}>Quality: {s.quality}/5</div>
                  </div>
                  <div style={{ fontFamily: "'Georgia',serif", fontSize: 22, color: s.hours >= 7 ? C.gd : s.hours >= 6 ? C.am : C.rd }}>{s.hours}h</div>
                </div>
              );
            })}
          </div>
        ) : null}

        {tab === "sobriety" ? (
          <div>
            <div style={{ background: "rgba(26,74,46,0.04)", border: "1px solid " + C.sl, borderRadius: 10, padding: "12px", marginBottom: 14 }}>
              <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.mu, lineHeight: 1.6 }}>Private by default. No one sees this. No shame — only honesty.</div>
            </div>
            {sobriety ? (
              <div style={{ textAlign: "center", padding: "16px 0" }}>
                <div style={{ fontFamily: "'Georgia',serif", fontSize: 80, color: C.gd, lineHeight: 1 }}>{sobDays}</div>
                <div style={{ fontFamily: "Inter,sans-serif", fontSize: 14, color: C.mu, marginTop: 3, marginBottom: 16 }}>days without {sobriety.substance}</div>
                <div style={{ fontFamily: "'Georgia',serif", fontSize: 14, color: C.gd, fontStyle: "italic", lineHeight: 1.6, marginBottom: 20, maxWidth: 260, margin: "0 auto 20px" }}>
                  {sobDays === 0 ? "Day one. That's not nothing." : sobDays < 7 ? "The first week is the hardest. You're in it." : sobDays < 30 ? "The trickle is building." : sobDays < 90 ? "A month. This is becoming who you are." : "The proof is in the pattern."}
                </div>
                <button onClick={function () { setState(function (s) { return Object.assign({}, s, { sobriety: null }); }); }} style={{ padding: "7px 18px", borderRadius: 20, border: "1px solid " + C.sl, background: "transparent", color: C.mu, fontFamily: "Inter,sans-serif", fontSize: 12, cursor: "pointer" }}>Reset counter</button>
              </div>
            ) : sobrietySetup ? (
              <div style={{ background: C.cr, borderRadius: 12, padding: "16px", border: "1px solid " + C.sl }}>
                {[["What are you tracking?", "substance", "text", "e.g. alcohol"], ["Start date", "startDate", "date", ""]].map(function (f) {
                  const label = f[0], key = f[1], type = f[2], ph = f[3];
                  return (
                    <div key={key} style={{ marginBottom: 12 }}>
                      <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu, marginBottom: 4 }}>{label}</div>
                      <input type={type} value={sobD[key]} onChange={function (e) { setSobD(function (x) { const next = Object.assign({}, x); next[key] = e.target.value; return next; }); }} placeholder={ph} style={{ width: "100%", padding: "9px", borderRadius: 7, border: "1px solid " + C.sl, fontFamily: "Inter,sans-serif", fontSize: 13, boxSizing: "border-box", outline: "none" }} />
                    </div>
                  );
                })}
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={function () {
                    if (sobD.substance && sobD.startDate) {
                      setState(function (s) { return Object.assign({}, s, { sobriety: Object.assign({}, sobD, { private: true }) }); });
                      setSobrietySetup(false);
                    }
                  }} style={{ flex: 2, padding: "10px", borderRadius: 8, background: C.gd, color: C.cr, border: "none", fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Start tracking</button>
                  <button onClick={function () { setSobrietySetup(false); }} style={{ flex: 1, padding: "10px", borderRadius: 8, background: "transparent", color: C.mu, border: "1px solid " + C.sl, fontFamily: "Inter,sans-serif", fontSize: 12, cursor: "pointer" }}>Cancel</button>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <div style={{ fontFamily: "'Georgia',serif", fontSize: 18, color: C.gd, marginBottom: 10 }}>Start a counter</div>
                <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: C.mu, lineHeight: 1.6, marginBottom: 20 }}>Track time without something holding you back.</div>
                <GreenButton label="Set up my counter" onClick={function () { setSobrietySetup(true); }} />
              </div>
            )}
          </div>
        ) : null}

        {tab === "mind" ? (
          <div>
            <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.mu, lineHeight: 1.5, marginBottom: 14 }}>Most people don't fail from not knowing what to do. They fail from stress, cravings, and emotional pulls nobody helped them name. Log it here — pattern over time, not shame in the moment.</div>
            <div style={{ background: C.cr, borderRadius: 12, padding: "16px", marginBottom: 16, border: "1px solid " + C.sl }}>
              <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 600, color: C.ch, marginBottom: 12 }}>Log a craving or trigger</div>
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: C.ch }}>Intensity</span>
                  <span style={{ fontFamily: "'Georgia',serif", fontSize: 16, color: C.gd }}>{cd.intensity}/5</span>
                </div>
                <input type="range" min={1} max={5} value={cd.intensity} onChange={function (e) { setCd(function (x) { return Object.assign({}, x, { intensity: Number(e.target.value) }); }); }} style={{ width: "100%", accentColor: C.gd }} />
              </div>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: C.ch, marginBottom: 6 }}>What triggered it?</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {["stress", "boredom", "loneliness", "fatigue", "social", "habit/time of day"].map(function (t) {
                    const active = cd.trigger === t;
                    return (
                      <button key={t} onClick={function () { setCd(function (x) { return Object.assign({}, x, { trigger: t }); }); }} style={{ padding: "6px 12px", borderRadius: 18, border: "1px solid " + (active ? C.go : C.sl), background: active ? "rgba(200,169,106,0.15)" : "transparent", color: active ? C.go : C.mu, fontFamily: "Inter,sans-serif", fontSize: 11, cursor: "pointer" }}>{t}</button>
                    );
                  })}
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu, marginBottom: 4 }}>Optional note</div>
                <input value={cd.note} onChange={function (e) { setCd(function (x) { return Object.assign({}, x, { note: e.target.value }); }); }} placeholder="What was happening right before?" style={{ width: "100%", padding: "9px", borderRadius: 7, border: "1px solid " + C.sl, fontFamily: "Inter,sans-serif", fontSize: 13, boxSizing: "border-box", outline: "none" }} />
              </div>
              <GreenButton label="Log it" onClick={function () {
                const entry = { id: Date.now(), date: new Date().toDateString(), time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), intensity: cd.intensity, trigger: cd.trigger, note: cd.note };
                setState(function (s) { return Object.assign({}, s, { cravingLog: (s.cravingLog || []).concat([entry]) }); });
                setCd({ intensity: 3, trigger: "stress", note: "" });
              }} full={true} />
            </div>
            {cravingLog.length > 0 ? (
              <div>
                <div style={{ background: C.ow, borderRadius: 10, padding: "12px", marginBottom: 14, border: "1px solid " + C.sl }}>
                  <div style={{ fontSize: 10, letterSpacing: 1.5, color: C.mu, fontFamily: "Inter,sans-serif", fontWeight: 600, textTransform: "uppercase", marginBottom: 8 }}>Most common trigger</div>
                  <div style={{ fontFamily: "'Georgia',serif", fontSize: 16, color: C.gd }}>
                    {(function () {
                      const counts = {};
                      cravingLog.forEach(function (c) { counts[c.trigger] = (counts[c.trigger] || 0) + 1; });
                      let top = "—", max = 0;
                      Object.keys(counts).forEach(function (k) { if (counts[k] > max) { max = counts[k]; top = k; } });
                      return top;
                    })()}
                  </div>
                </div>
                {cravingLog.slice().reverse().slice(0, 8).map(function (c) {
                  return (
                    <div key={c.id} style={{ border: "1px solid " + C.sl, borderRadius: 10, padding: "11px", marginBottom: 8 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                        <span style={{ fontFamily: "Inter,sans-serif", fontSize: 12, fontWeight: 600, color: C.ch, textTransform: "capitalize" }}>{c.trigger}</span>
                        <span style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu }}>{c.time}</span>
                      </div>
                      <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu }}>Intensity {c.intensity}/5{c.note ? (" · " + c.note) : ""}</div>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        ) : null}

        {tab === "goals" ? (
          <div>
            <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.mu, lineHeight: 1.5, marginBottom: 14 }}>Personal goals. Habit tracking. Custom counters. Things that matter to you.</div>
            {addingG ? (
              <div style={{ background: C.cr, borderRadius: 12, padding: "14px", marginBottom: 14, border: "1px solid " + C.sl }}>
                {[["Goal name", "name", "text", "e.g. Read daily"], ["Target", "target", "number", "e.g. 30"], ["Unit", "unit", "text", "e.g. days"]].map(function (f) {
                  const label = f[0], key = f[1], type = f[2], ph = f[3];
                  return (
                    <div key={key} style={{ marginBottom: 10 }}>
                      <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu, marginBottom: 3 }}>{label}</div>
                      <input type={type} value={gd[key]} onChange={function (e) { setGd(function (x) { const next = Object.assign({}, x); next[key] = e.target.value; return next; }); }} placeholder={ph} style={{ width: "100%", padding: "8px", borderRadius: 7, border: "1px solid " + C.sl, fontFamily: "Inter,sans-serif", fontSize: 13, boxSizing: "border-box", outline: "none" }} />
                    </div>
                  );
                })}
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={function () {
                    if (gd.name.trim()) {
                      const entry = Object.assign({}, gd, { id: Date.now(), progress: 0 });
                      setState(function (s) { return Object.assign({}, s, { goals: s.goals.concat([entry]) }); });
                      setGd({ name: "", target: "", unit: "" });
                      setAddingG(false);
                    }
                  }} style={{ flex: 2, padding: "10px", borderRadius: 8, background: C.gd, color: C.cr, border: "none", fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Add</button>
                  <button onClick={function () { setAddingG(false); }} style={{ flex: 1, padding: "10px", borderRadius: 8, background: "transparent", color: C.mu, border: "1px solid " + C.sl, fontFamily: "Inter,sans-serif", fontSize: 12, cursor: "pointer" }}>Cancel</button>
                </div>
              </div>
            ) : (
              <button onClick={function () { setAddingG(true); }} style={{ width: "100%", padding: "13px", borderRadius: 12, background: C.gd, color: C.cr, border: "none", fontFamily: "Inter,sans-serif", fontSize: 14, fontWeight: 700, cursor: "pointer", marginBottom: 14 }}>+ Add a goal</button>
            )}
            {goals.map(function (g) {
              const pct = Math.min((g.progress || 0) / Math.max(Number(g.target), 1) * 100, 100);
              return (
                <div key={g.id} style={{ border: "1px solid " + C.sl, borderRadius: 10, padding: "14px", marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <div style={{ fontFamily: "Inter,sans-serif", fontSize: 14, fontWeight: 600, color: C.ch }}>{g.name}</div>
                    <div style={{ fontFamily: "'Georgia',serif", fontSize: 15, color: C.gd }}>{g.progress || 0}/{g.target} {g.unit}</div>
                  </div>
                  <div style={{ height: 5, background: C.sl, borderRadius: 3, marginBottom: 10 }}>
                    <div style={{ height: "100%", width: pct + "%", background: C.gd, borderRadius: 3 }} />
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={function () {
                      setState(function (s) {
                        return Object.assign({}, s, {
                          goals: s.goals.map(function (x) { return x.id === g.id ? Object.assign({}, x, { progress: (x.progress || 0) + 1 }) : x; }),
                        });
                      });
                    }} style={{ flex: 1, padding: "7px", borderRadius: 8, background: C.gd, color: C.cr, border: "none", fontFamily: "Inter,sans-serif", fontSize: 12, cursor: "pointer" }}>+ Log one</button>
                    <button onClick={function () {
                      setState(function (s) { return Object.assign({}, s, { goals: s.goals.filter(function (x) { return x.id !== g.id; }) }); });
                    }} style={{ padding: "7px 12px", borderRadius: 8, background: "transparent", color: C.mu, border: "1px solid " + C.sl, fontFamily: "Inter,sans-serif", fontSize: 12, cursor: "pointer" }}>✕</button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}

        {tab === "steps" ? (
          <div>
            <div style={{ textAlign: "center", padding: "16px 0 10px" }}>
              <div style={{ fontFamily: "'Georgia',serif", fontSize: 72, color: C.gd, lineHeight: 1 }}>{(steps || 0).toLocaleString()}</div>
              <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: C.mu, marginTop: 3, marginBottom: 14 }}>steps today</div>
              <div style={{ height: 5, background: C.sl, borderRadius: 3, marginBottom: 4 }}>
                <div style={{ height: "100%", width: Math.min((steps || 0) / 10000 * 100, 100) + "%", background: C.gd, borderRadius: 3 }} />
              </div>
              <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu, marginBottom: 20 }}>{Math.min((steps || 0) / 10000 * 100, 100).toFixed(0)}% of 10,000</div>
              <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 20 }}>
                {[1000, 2500, 5000].map(function (n) {
                  return (
                    <button key={n} onClick={function () { setState(function (s) { return Object.assign({}, s, { steps: (s.steps || 0) + n }); }); }} style={{ padding: "10px 14px", borderRadius: 10, background: C.ow, border: "1px solid " + C.sl, fontFamily: "Inter,sans-serif", fontSize: 12, color: C.ch, cursor: "pointer" }}>+{n.toLocaleString()}</button>
                  );
                })}
              </div>
            </div>
            <div style={{ background: C.cr, borderRadius: 10, padding: "14px", border: "1px solid " + C.sl }}>
              <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, fontWeight: 600, color: C.ch, marginBottom: 5 }}>Watch & Health Integration</div>
              <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.mu, lineHeight: 1.5 }}>Apple Watch, Garmin, Fitbit sync coming in the full app via HealthKit (iOS) or Health Connect (Android).</div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function PracticeDetail(props) {
  const p = props.practice;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(26,74,46,0.5)", display: "flex", alignItems: "flex-end", zIndex: 250 }} onClick={props.onClose}>
      <div style={{ background: C.cr, width: "100%", maxWidth: 420, maxHeight: "85vh", overflowY: "auto", borderRadius: "20px 20px 0 0", padding: 24, margin: "0 auto" }} onClick={function (e) { e.stopPropagation(); }}>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button onClick={props.onClose} style={{ background: "none", border: "none", fontSize: 18, color: C.mu, cursor: "pointer" }}>✕</button>
        </div>
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 10, letterSpacing: 1.5, color: C.go, textTransform: "uppercase", marginBottom: 4 }}>{p.category === "breath" ? "Breathwork" : "Somatic Movement"} · {p.durationMin} min</div>
        <div style={{ fontFamily: "'Georgia',serif", fontSize: 24, color: C.gd, marginBottom: 14 }}>{p.name}</div>
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 700, color: C.ch, marginBottom: 6 }}>What's happening physiologically</div>
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: C.ch, lineHeight: 1.6, marginBottom: 16 }}>{p.mechanism}</div>
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 700, color: C.ch, marginBottom: 8 }}>How to do it</div>
        {p.steps.map(function (s, i) {
          return (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: C.gd, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: C.go, fontWeight: 700, flexShrink: 0, fontFamily: "Inter,sans-serif" }}>{i + 1}</div>
              <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: C.ch, lineHeight: 1.5, paddingTop: 1 }}>{s}</div>
            </div>
          );
        })}
        <div style={{ background: C.ow, borderRadius: 10, padding: "12px 14px", marginTop: 14, marginBottom: 14 }}>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, fontWeight: 700, color: C.sg, marginBottom: 3 }}>Best for</div>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.ch, lineHeight: 1.5 }}>{p.bestFor}</div>
        </div>
        <div style={{ borderTop: "1px solid " + C.sl, paddingTop: 12 }}>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, fontWeight: 700, color: C.mu, marginBottom: 3 }}>Before you start</div>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu, lineHeight: 1.5 }}>{p.contraindications}</div>
        </div>
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 10, color: C.mu, marginTop: 14, fontStyle: "italic", textAlign: "center" }}>This is a self-regulation tool, not trauma therapy. If something difficult comes up consistently, that's worth bringing to a counsellor directly.</div>
      </div>
    </div>
  );
}

function Regulate(props) {
  const state = props.state;
  const [openPractice, setOpenPractice] = useState(null);
  const [filter, setFilter] = useState("all");
  const checkIn = state.checkIn;
  const checkInIsToday = state.checkInDate === new Date().toDateString();
  const highStress = checkIn && checkInIsToday && checkIn.stress >= 4;

  const suggested = highStress ? REGULATION_PRACTICES.find(function (p) { return p.id === "physiological_sigh"; }) : null;
  const filtered = filter === "all" ? REGULATION_PRACTICES : REGULATION_PRACTICES.filter(function (p) { return p.category === filter; });

  return (
    <div style={{ paddingBottom: 90 }}>
      <div style={{ background: C.gd, padding: "50px 24px 30px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -20, right: -10, fontSize: 150, color: "rgba(200,169,106,0.06)", fontFamily: "'Georgia',serif", fontWeight: 700, lineHeight: 1, pointerEvents: "none" }}>∿</div>
        <div style={{ fontSize: 11, letterSpacing: 3, color: C.go, fontFamily: "Inter,sans-serif", fontWeight: 600, marginBottom: 6, textTransform: "uppercase" }}>Nervous System</div>
        <div style={{ fontFamily: "'Georgia',serif", fontSize: 25, color: C.cr, fontWeight: 400, lineHeight: 1.3 }}>Regulate</div>
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: C.sl, marginTop: 8, lineHeight: 1.5 }}>Breathwork and somatic practices for steadying your body, not just your mind.</div>
      </div>

      {suggested ? (
        <div style={{ margin: "16px 24px 0" }}>
          <div onClick={function () { setOpenPractice(suggested); }} style={{ background: "rgba(192,57,43,0.06)", border: "1px solid rgba(192,57,43,0.25)", borderRadius: 16, padding: "16px 18px", cursor: "pointer" }}>
            <div style={{ fontFamily: "Inter,sans-serif", fontSize: 10, letterSpacing: 1.5, color: C.rd, textTransform: "uppercase", marginBottom: 6 }}>Today's stress is logged high</div>
            <div style={{ fontFamily: "'Georgia',serif", fontSize: 16, color: C.gd, marginBottom: 4 }}>Try {suggested.name} — {suggested.durationMin} min</div>
            <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.mu, lineHeight: 1.4 }}>The fastest tool here for bringing your system down quickly.</div>
          </div>
        </div>
      ) : null}

      <div style={{ padding: "20px 24px 0" }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
          {[["all", "All"], ["breath", "Breathwork"], ["somatic", "Somatic"]].map(function (f) {
            const active = filter === f[0];
            return (
              <button key={f[0]} onClick={function () { setFilter(f[0]); }} style={{ padding: "7px 16px", borderRadius: 20, border: "1px solid " + (active ? C.gd : C.sl), background: active ? C.gd : "transparent", color: active ? C.cr : C.mu, fontFamily: "Inter,sans-serif", fontSize: 12, cursor: "pointer" }}>{f[1]}</button>
            );
          })}
        </div>
        {filtered.map(function (p) {
          return (
            <div key={p.id} onClick={function () { setOpenPractice(p); }} style={{ background: C.wh, border: "1px solid " + C.sl, borderRadius: 14, padding: "15px 16px", marginBottom: 10, cursor: "pointer", boxShadow: "0 1px 3px rgba(26,74,46,0.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 5 }}>
                <div style={{ fontFamily: "'Georgia',serif", fontSize: 15, color: C.gd }}>{p.name}</div>
                <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu, whiteSpace: "nowrap" }}>{p.durationMin} min</div>
              </div>
              <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.mu, lineHeight: 1.4 }}>{p.bestFor}</div>
            </div>
          );
        })}
      </div>
      {openPractice ? <PracticeDetail practice={openPractice} onClose={function () { setOpenPractice(null); }} /> : null}
    </div>
  );
}

function Community(props) {
  const state = props.state;
  const setState = props.setState;
  const [layer, setLayer] = useState(1);
  const [sharing, setSharing] = useState(false);
  const [sd, setSd] = useState({ text: "", pillar: "The Trickle" });
  const [bd, setBd] = useState("");
  const communityPosts = state.communityPosts;
  const userName = state.userName;
  const day = state.day;
  const buddy = state.buddy;

  const GUIDE = ["No unsolicited advice — witness, don't fix", "No performance or comparison", "No promotion or external links", "Be honest about where you actually are", "This is not a crisis service — call 000 or Lifeline 13 11 14 if needed"];

  const see = function (id) {
    setState(function (s) {
      return Object.assign({}, s, {
        communityPosts: s.communityPosts.map(function (p) {
          if (p.id !== id) return p;
          const nextSeen = p.seen.indexOf("me") === -1 ? p.seen.concat(["me"]) : p.seen;
          return Object.assign({}, p, { seen: nextSeen });
        }),
      });
    });
  };

  const flag = function (id) {
    setState(function (s) {
      return Object.assign({}, s, {
        communityPosts: s.communityPosts.map(function (p) { return p.id === id ? Object.assign({}, p, { flagged: true }) : p; }),
      });
    });
  };

  const share = function () {
    if (!sd.text.trim()) return;
    const newPost = { id: Date.now(), user: (userName || "You").charAt(0) + ".", day: day, pillar: sd.pillar, text: sd.text, seen: [], flagged: false };
    setState(function (s) { return Object.assign({}, s, { communityPosts: [newPost].concat(s.communityPosts) }); });
    setSd({ text: "", pillar: "The Trickle" });
    setSharing(false);
  };

  return (
    <div style={{ paddingBottom: 90 }}>
      <div style={{ background: C.cr, padding: "40px 24px 22px", borderLeft: "4px solid " + C.gd }}>
        <div style={{ fontFamily: "'Georgia',serif", fontSize: 24, color: C.gd, marginBottom: 5 }}>Witness, don't fix.</div>
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.mu }}>Three layers. Different depths.</div>
      </div>
      {communityPosts.filter(function (p) { return p.user === ((userName || "You").charAt(0) + "."); }).length === 0 ? (
        <div style={{ margin: "16px 24px 0", padding: "12px 14px", borderRadius: 10, background: "rgba(26,74,46,0.04)", border: "1px solid " + C.sl }}>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.mu, lineHeight: 1.5 }}>You haven't shared anything yet — these are other people's moments below. No pressure to post. Read first, share when it feels right.</div>
        </div>
      ) : null}
      <RotatingQuote cycle={state.quoteCycle} offset={4} margin="16px 24px 0" />
      <div style={{ padding: "16px 24px 0" }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
          {[{ id: 1, l: "Shared" }, { id: 2, l: "Cohort" }, { id: 3, l: "Guided" }, { id: 4, l: "Buddy" }].map(function (x) {
            const active = layer === x.id;
            return (
              <button key={x.id} onClick={function () { setLayer(x.id); }} style={{ flex: 1, padding: "8px 0", borderRadius: 8, background: active ? C.gd : "transparent", border: "1px solid " + (active ? C.gd : C.sl), color: active ? C.cr : C.mu, fontSize: 11, fontFamily: "Inter,sans-serif", cursor: "pointer", fontWeight: active ? 600 : 400 }}>L{x.id}: {x.l}</button>
            );
          })}
        </div>

        {layer === 1 ? (
          <div>
            <div style={{ background: "rgba(26,74,46,0.04)", borderRadius: 10, padding: "10px 12px", marginBottom: 12, border: "1px solid " + C.sl }}>
              {GUIDE.map(function (g, i) {
                return <div key={i} style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu, marginBottom: 2 }}>· {g}</div>;
              })}
            </div>
            {sharing ? (
              <div style={{ background: C.cr, borderRadius: 12, padding: "16px", marginBottom: 14, border: "1px solid " + C.sl }}>
                <textarea value={sd.text} onChange={function (e) { setSd(function (x) { return Object.assign({}, x, { text: e.target.value }); }); }} placeholder="What's real for you today?" rows={3} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid " + C.sl, fontFamily: "'Georgia',serif", fontSize: 14, resize: "none", boxSizing: "border-box", outline: "none", fontStyle: "italic", marginBottom: 10 }} />
                <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu, marginBottom: 6 }}>Which pillar?</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 12 }}>
                  {PILLARS.map(function (pl) {
                    const active = sd.pillar === pl.name;
                    return (
                      <button key={pl.name} onClick={function () { setSd(function (x) { return Object.assign({}, x, { pillar: pl.name }); }); }} style={{ padding: "4px 10px", borderRadius: 16, border: "1px solid " + (active ? C.go : C.sl), background: active ? "rgba(200,169,106,0.15)" : "transparent", color: active ? C.go : C.mu, fontFamily: "Inter,sans-serif", fontSize: 11, cursor: "pointer" }}>{pl.icon} {pl.name}</button>
                    );
                  })}
                </div>
                <div style={{ fontFamily: "Inter,sans-serif", fontSize: 10, color: C.mu, marginBottom: 10 }}>By posting you agree to the community guidelines above.</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={share} style={{ flex: 2, padding: "10px", borderRadius: 8, background: C.gd, color: C.cr, border: "none", fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Share</button>
                  <button onClick={function () { setSharing(false); }} style={{ flex: 1, padding: "10px", borderRadius: 8, background: "transparent", color: C.mu, border: "1px solid " + C.sl, fontFamily: "Inter,sans-serif", fontSize: 12, cursor: "pointer" }}>Cancel</button>
                </div>
              </div>
            ) : (
              <button onClick={function () { setSharing(true); }} style={{ width: "100%", padding: "12px", borderRadius: 12, background: C.gd, color: C.cr, border: "none", fontFamily: "Inter,sans-serif", fontSize: 14, fontWeight: 600, cursor: "pointer", marginBottom: 12 }}>Share a Moment</button>
            )}
            {communityPosts.filter(function (p) { return !p.flagged; }).map(function (post) {
              const isSeen = post.seen.indexOf("me") !== -1;
              return (
                <div key={post.id} style={{ border: "1px solid " + C.sl, borderRadius: 12, padding: "14px", marginBottom: 10, background: C.ow }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: C.sl, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 700, color: C.gd, flexShrink: 0 }}>{post.user}</div>
                    <div>
                      <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, fontWeight: 600, color: C.ch }}>Day {post.day}</div>
                      <PillarBadge name={post.pillar} />
                    </div>
                  </div>
                  <div style={{ fontFamily: "'Georgia',serif", fontSize: 14, color: C.ch, fontStyle: "italic", lineHeight: 1.6 }}>"{post.text}"</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
                    <button onClick={function () { see(post.id); }} style={{ padding: "4px 12px", borderRadius: 16, border: "1px solid " + (isSeen ? C.gd : C.sl), background: isSeen ? "rgba(26,74,46,0.08)" : "transparent", fontFamily: "Inter,sans-serif", fontSize: 11, color: isSeen ? C.gd : C.sg, cursor: "pointer" }}>{isSeen ? "Seen ◎" : "I see you ◎"}</button>
                    {post.seen.length > 0 ? <span style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu }}>{post.seen.length} seen</span> : null}
                    <button onClick={function () { flag(post.id); }} style={{ marginLeft: "auto", padding: "3px 8px", borderRadius: 12, border: "1px solid " + C.sl, background: "transparent", fontFamily: "Inter,sans-serif", fontSize: 10, color: C.mu, cursor: "pointer" }}>Flag</button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}

        {layer === 2 ? (
          <div style={{ textAlign: "center", padding: "36px 0" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>◎</div>
            <div style={{ fontFamily: "'Georgia',serif", fontSize: 20, color: C.gd, marginBottom: 10 }}>Your Cohort</div>
            <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: C.mu, lineHeight: 1.7 }}>
              6–10 people matched by life context, not performance.<br />
              Structured check-ins. Accountability pairs.<br />
              No comparison. No leaderboards.<br /><br />
              <strong style={{ color: day >= 21 ? C.gd : C.mu }}>{day >= 21 ? "Access unlocked." : ("Unlocks Day 21 — " + (21 - day) + " days to go.")}</strong>
            </div>
          </div>
        ) : null}

        {layer === 3 ? (
          <div style={{ padding: "16px 0" }}>
            <div style={{ fontFamily: "'Georgia',serif", fontSize: 20, color: C.gd, marginBottom: 10 }}>Guided Processing</div>
            <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: C.mu, lineHeight: 1.7, marginBottom: 16 }}>These are coaching sessions — not counselling or psychotherapy. If what you're carrying is heavier than coaching can hold, Josh will tell you, and help you find the right support.</div>
            <div style={{ background: C.cr, borderRadius: 10, padding: "14px", marginBottom: 16, border: "1px solid " + C.sl }}>
              <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, fontWeight: 600, color: C.ch, marginBottom: 4 }}>Action Potential Counselling</div>
              <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.mu, lineHeight: 1.5 }}>Integrative. ACT-informed. Focused on men's wellbeing (15–50).</div>
            </div>
            <GreenButton label="Book a session with Josh →" onClick={function () {}} full={true} />
            <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu, textAlign: "center", marginTop: 8, lineHeight: 1.5 }}>You don't have to be in crisis to use it.</div>
          </div>
        ) : null}

        {layer === 4 ? (
          <div>
            <div style={{ fontFamily: "'Georgia',serif", fontSize: 20, color: C.gd, marginBottom: 8 }}>Accountability Buddy</div>
            <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: C.mu, lineHeight: 1.6, marginBottom: 16 }}>Pair with a friend. See each other's streaks. No scores — just presence.</div>
            {buddy ? (
              <div style={{ background: C.cr, borderRadius: 12, padding: "16px", border: "1px solid " + C.sl }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: C.gd, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: C.go, fontWeight: 700, fontFamily: "Inter,sans-serif" }}>{buddy.charAt(0).toUpperCase()}</div>
                  <div>
                    <div style={{ fontFamily: "Inter,sans-serif", fontSize: 14, fontWeight: 600, color: C.ch }}>{buddy}</div>
                    <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.sg }}>Your accountability buddy</div>
                  </div>
                </div>
                <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu, marginBottom: 12 }}>Live buddy data syncs in the full app via mutual opt-in pairing.</div>
                <button onClick={function () { setState(function (s) { return Object.assign({}, s, { buddy: null }); }); }} style={{ width: "100%", padding: "9px", borderRadius: 8, background: "transparent", color: C.mu, border: "1px solid " + C.sl, fontFamily: "Inter,sans-serif", fontSize: 12, cursor: "pointer" }}>Remove buddy</button>
              </div>
            ) : (
              <div style={{ background: C.cr, borderRadius: 12, padding: "16px", border: "1px solid " + C.sl }}>
                <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 600, color: C.ch, marginBottom: 10 }}>Add a buddy</div>
                <input value={bd} onChange={function (e) { setBd(e.target.value); }} placeholder="Name or username" style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid " + C.sl, fontFamily: "Inter,sans-serif", fontSize: 13, boxSizing: "border-box", outline: "none", marginBottom: 10 }} />
                <GreenButton label="Send pairing request" onClick={function () { if (bd.trim()) { setState(function (s) { return Object.assign({}, s, { buddy: bd }); }); setBd(""); } }} full={true} />
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Profile(props) {
  const state = props.state;
  const setState = props.setState;
  const tone = state.tone;
  const christianLens = state.christianLens;
  const day = state.day;
  const sessionHistory = state.sessionHistory;
  const equipment = state.equipment;
  const injuries = state.injuries;
  const userName = state.userName;
  const bodyStats = state.bodyStats;
  const weeklyTarget = state.weeklyTarget;
  const [editStats, setEditStats] = useState(false);
  const [ls, setLs] = useState(bodyStats || { weight: "", height: "", age: "", unit: "metric", sex: "" });
  const [showPaywall, setShowPaywall] = useState(false);
  const isPremium = state.isPremium;
  const recent = sessionHistory.slice(-7).map(function (s) { return s.readiness; });
  const avgR = recent.length ? (recent.reduce(function (a, b) { return a + b; }, 0) / recent.length).toFixed(1) : "—";
  const eqOpts = ["dumbbells", "barbell", "bench", "pull-up bar", "resistance bands", "kettlebell", "cable machine", "squat rack"];
  const injOpts = INJURY_OPTIONS;

  if (showPaywall) {
    return <Paywall state={state} setState={setState} onClose={function () { setShowPaywall(false); }} />;
  }

  return (
    <div style={{ paddingBottom: 90 }}>
      <div style={{ background: C.gd, padding: "44px 24px 28px", display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(200,169,106,0.18)", border: "2px solid " + C.go, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Georgia',serif", fontSize: 22, color: C.go, flexShrink: 0 }}>{(userName || "Y").charAt(0).toUpperCase()}</div>
        <div>
          <div style={{ fontFamily: "'Georgia',serif", fontSize: 24, color: C.cr, lineHeight: 1.1 }}>{userName || "You"}</div>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.sl, marginTop: 3 }}>{isPremium ? "Premium member" : "Day " + day + " of the climb"}</div>
        </div>
      </div>
      {!isPremium ? (
        <div style={{ margin: "16px 24px 0" }} onClick={function () { setShowPaywall(true); }}>
          <div style={{ background: "linear-gradient(135deg, " + C.gd + ", #0F2E1C)", borderRadius: 14, padding: "16px", border: "1px solid " + C.go, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontFamily: "'Georgia',serif", fontSize: 15, color: C.go, marginBottom: 2 }}>Go Premium</div>
              <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.sl }}>Full movement library, training blocs & more</div>
            </div>
            <div style={{ color: C.go, fontSize: 18 }}>›</div>
          </div>
        </div>
      ) : null}
      <div style={{ padding: "18px 24px 0" }}>
        <div style={{ background: C.ow, borderRadius: 12, padding: "16px", border: "1px solid " + C.sl, marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-around", textAlign: "center", marginBottom: recent.length > 1 ? 12 : 0 }}>
            {[{ v: day, l: "Day" }, { v: sessionHistory.length, l: "Sessions" }, { v: avgR, l: "Avg Readiness" }].map(function (s) {
              return (
                <div key={s.l}>
                  <div style={{ fontFamily: "'Georgia',serif", fontSize: 26, color: C.gd, lineHeight: 1 }}>{s.v}</div>
                  <div style={{ fontFamily: "Inter,sans-serif", fontSize: 10, color: C.mu, marginTop: 3, textTransform: "uppercase", letterSpacing: 1 }}>{s.l}</div>
                </div>
              );
            })}
          </div>
          {recent.length > 1 ? (
            <div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 32 }}>
                {recent.map(function (r, i) {
                  const c = r >= 4 ? C.gd : r >= 3 ? C.sg : r >= 2 ? C.am : C.rd;
                  return <div key={i} style={{ flex: 1, background: c, borderRadius: "2px 2px 0 0", height: (r / 5 * 100) + "%", minHeight: 3 }} />;
                })}
              </div>
              <div style={{ fontFamily: "Inter,sans-serif", fontSize: 9, color: C.mu, marginTop: 3 }}>Last {recent.length} readiness scores</div>
            </div>
          ) : null}
        </div>

        <div style={{ marginBottom: 18, paddingBottom: 18, borderBottom: "1px solid " + C.sl }}>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 600, color: C.ch, marginBottom: 12 }}>Progress Calendar</div>
          <ProgressCalendar sessionHistory={sessionHistory} />
        </div>

        <div style={{ marginBottom: 18, paddingBottom: 18, borderBottom: "1px solid " + C.sl }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 600, color: C.ch }}>Body Stats</div>
            <button onClick={function () {
              if (editStats) setState(function (s) { return Object.assign({}, s, { bodyStats: Object.assign({}, ls) }); });
              setEditStats(!editStats);
            }} style={{ padding: "4px 12px", borderRadius: 16, border: "1px solid " + C.sl, background: "transparent", fontFamily: "Inter,sans-serif", fontSize: 11, color: C.sg, cursor: "pointer" }}>{editStats ? "Save" : "Edit"}</button>
          </div>
          {editStats ? (
            <div>
              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                {["metric", "imperial"].map(function (u) {
                  const active = ls.unit === u;
                  return (
                    <button key={u} onClick={function () { setLs(function (s) { return Object.assign({}, s, { unit: u }); }); }} style={{ flex: 1, padding: "7px", borderRadius: 8, border: "1px solid " + (active ? C.go : C.sl), background: active ? "rgba(200,169,106,0.1)" : "transparent", color: active ? C.go : C.mu, fontFamily: "Inter,sans-serif", fontSize: 12, cursor: "pointer" }}>{u}</button>
                  );
                })}
              </div>
              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                {[["male", "Male"], ["female", "Female"], ["unspecified", "N/A"]].map(function (f) {
                  const id = f[0], label = f[1];
                  const active = ls.sex === id;
                  return (
                    <button key={id} onClick={function () { setLs(function (s) { return Object.assign({}, s, { sex: id }); }); }} style={{ flex: 1, padding: "7px", borderRadius: 8, border: "1px solid " + (active ? C.go : C.sl), background: active ? "rgba(200,169,106,0.1)" : "transparent", color: active ? C.go : C.mu, fontFamily: "Inter,sans-serif", fontSize: 11, cursor: "pointer" }}>{label}</button>
                  );
                })}
              </div>
              {[["Age", "age", "years"], ["Weight", "weight", ls.unit === "imperial" ? "lbs" : "kg"], ["Height", "height", ls.unit === "imperial" ? "inches" : "cm"]].map(function (f) {
                const label = f[0], key = f[1], unit = f[2];
                return (
                  <div key={key} style={{ marginBottom: 10 }}>
                    <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu, marginBottom: 3 }}>{label} ({unit})</div>
                    <input type="number" value={ls[key] || ""} onChange={function (e) { setLs(function (s) { const next = Object.assign({}, s); next[key] = e.target.value; return next; }); }} style={{ width: "100%", padding: "9px", borderRadius: 7, border: "1px solid " + C.sl, fontFamily: "Inter,sans-serif", fontSize: 13, boxSizing: "border-box", outline: "none" }} />
                  </div>
                );
              })}
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu, marginBottom: 3 }}>Waist ({ls.unit === "imperial" ? "inches" : "cm"}) — optional</div>
                <input type="number" value={ls.waist || ""} onChange={function (e) { setLs(function (s) { return Object.assign({}, s, { waist: e.target.value }); }); }} style={{ width: "100%", padding: "9px", borderRadius: 7, border: "1px solid " + C.sl, fontFamily: "Inter,sans-serif", fontSize: 13, boxSizing: "border-box", outline: "none" }} />
                <div style={{ fontFamily: "Inter,sans-serif", fontSize: 10, color: C.mu, marginTop: 4, lineHeight: 1.4 }}>Measured around the belly button. Unlocks waist-to-height ratio — a more muscle-aware measure than BMI alone.</div>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              {[["Age", bodyStats ? bodyStats.age : "", "yr"], ["Weight", bodyStats ? bodyStats.weight : "", bodyStats && bodyStats.unit === "imperial" ? "lbs" : "kg"], ["Height", bodyStats ? bodyStats.height : "", bodyStats && bodyStats.unit === "imperial" ? "in" : "cm"]].map(function (f) {
                const label = f[0], v = f[1], u = f[2];
                return (
                  <div key={label}>
                    <div style={{ fontFamily: "Inter,sans-serif", fontSize: 10, color: C.mu, textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>{label}</div>
                    <div style={{ fontFamily: "'Georgia',serif", fontSize: 18, color: v ? C.gd : C.sl }}>{v || "—"}{v && u ? (" " + u) : ""}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div style={{ marginBottom: 18, paddingBottom: 18, borderBottom: "1px solid " + C.sl }}>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 600, color: C.ch, marginBottom: 10 }}>Weekly Target</div>
          <div style={{ display: "flex", gap: 8 }}>
            {[2, 3, 4, 5, 6].map(function (n) {
              const active = weeklyTarget === n;
              return (
                <button key={n} onClick={function () { setState(function (s) { return Object.assign({}, s, { weeklyTarget: n }); }); }} style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: "1px solid " + (active ? C.go : C.sl), background: active ? "rgba(200,169,106,0.1)" : "transparent", color: active ? C.go : C.mu, fontFamily: "Inter,sans-serif", fontSize: 14, fontWeight: active ? 700 : 400, cursor: "pointer" }}>{n}</button>
              );
            })}
          </div>
        </div>

        <div style={{ marginBottom: 18, paddingBottom: 18, borderBottom: "1px solid " + C.sl }}>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 600, color: C.ch, marginBottom: 10 }}>Tone</div>
          <ToneToggle value={tone} onChange={function (v) { setState(function (s) { return Object.assign({}, s, { tone: v }); }); }} />
        </div>

        <div style={{ marginBottom: 18, paddingBottom: 18, borderBottom: "1px solid " + C.sl }}>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 600, color: C.ch, marginBottom: 10 }}>Training Location</div>
          <div style={{ display: "flex", gap: 7, marginBottom: (state.trainingLocation === "home") ? 14 : 0 }}>
            {[["commercial", "Gym"], ["home", "Home"], ["bodyweight", "Bodyweight"]].map(function (f) {
              const id = f[0], label = f[1];
              const active = (state.trainingLocation || "bodyweight") === id;
              return (
                <button key={id} onClick={function () {
                  setState(function (s) {
                    const eq = id === "commercial" ? ["dumbbells", "barbell", "bench", "pull-up bar", "resistance bands", "kettlebell", "cable machine", "squat rack", "bodyweight"] : id === "bodyweight" ? ["bodyweight"] : (s.trainingLocation === "home" && s.equipment.length ? s.equipment : ["bodyweight"]);
                    return Object.assign({}, s, { trainingLocation: id, equipment: eq });
                  });
                }} style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: "1px solid " + (active ? C.gd : C.sl), background: active ? C.gd : "transparent", color: active ? C.cr : C.mu, fontFamily: "Inter,sans-serif", fontSize: 12, cursor: "pointer", fontWeight: active ? 600 : 400 }}>{label}</button>
              );
            })}
          </div>
          {state.trainingLocation === "home" ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {eqOpts.map(function (eq) {
                const active = (equipment || []).indexOf(eq) !== -1;
                return (
                  <button key={eq} onClick={function () {
                    setState(function (s) {
                      const base = (s.equipment || []).filter(function (e) { return e !== "bodyweight"; });
                      const list = active ? base.filter(function (e) { return e !== eq; }) : base.concat([eq]);
                      return Object.assign({}, s, { equipment: list.length ? list : ["bodyweight"] });
                    });
                  }} style={{ padding: "6px 12px", borderRadius: 20, border: "1px solid " + (active ? C.gd : C.sl), background: active ? C.gd : "transparent", color: active ? C.cr : C.mu, fontFamily: "Inter,sans-serif", fontSize: 12, cursor: "pointer" }}>{eq}</button>
                );
              })}
            </div>
          ) : null}
        </div>

        <div style={{ marginBottom: 18, paddingBottom: 18, borderBottom: "1px solid " + C.sl }}>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 600, color: C.ch, marginBottom: 4 }}>Injury Flags</div>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu, marginBottom: 8 }}>Standing injuries — always avoided. For something that's only bothering you today, flag it in your daily check-in instead.</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            {injOpts.map(function (inj) {
              const active = (injuries || []).indexOf(inj) !== -1;
              return (
                <button key={inj} onClick={function () {
                  setState(function (s) {
                    const list = active ? s.injuries.filter(function (i) { return i !== inj; }) : s.injuries.concat([inj]);
                    return Object.assign({}, s, { injuries: list });
                  });
                }} style={{ padding: "6px 12px", borderRadius: 20, border: "1px solid " + (active ? C.rd : C.sl), background: active ? "rgba(192,57,43,0.08)" : "transparent", color: active ? C.rd : C.mu, fontFamily: "Inter,sans-serif", fontSize: 12, cursor: "pointer" }}>{inj}</button>
              );
            })}
          </div>
        </div>

        <div style={{ marginBottom: 18, paddingBottom: 18, borderBottom: "1px solid " + C.sl }}>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 600, color: C.ch, marginBottom: 4 }}>Christian Lens</div>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu, marginBottom: 8 }}>Theological framing in insights. Off by default.</div>
          <button onClick={function () { setState(function (s) { return Object.assign({}, s, { christianLens: !s.christianLens }); }); }} style={{ padding: "7px 16px", borderRadius: 20, border: "1px solid " + (christianLens ? C.gd : C.sl), background: christianLens ? C.gd : "transparent", color: christianLens ? C.cr : C.mu, fontFamily: "Inter,sans-serif", fontSize: 12, cursor: "pointer" }}>{christianLens ? "Enabled — tap to disable" : "Enable"}</button>
        </div>

        <div style={{ marginBottom: 18, paddingBottom: 18, borderBottom: "1px solid " + C.sl }}>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 600, color: C.ch, marginBottom: 4 }}>Spotify</div>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu, marginBottom: 8 }}>Play music during workout sessions. Full OAuth requires backend setup beyond this prototype.</div>
          <button onClick={function () { setState(function (s) { return Object.assign({}, s, { spotifyConnected: !s.spotifyConnected }); }); }} style={{ padding: "7px 16px", borderRadius: 20, border: "1px solid " + (state.spotifyConnected ? "#1DB954" : C.sl), background: state.spotifyConnected ? "#1DB954" : "transparent", color: state.spotifyConnected ? "#fff" : C.mu, fontFamily: "Inter,sans-serif", fontSize: 12, cursor: "pointer" }}>{state.spotifyConnected ? "Connected — tap to disconnect" : "Connect Spotify"}</button>
        </div>

        <div style={{ marginBottom: 18, paddingBottom: 18, borderBottom: "1px solid " + C.sl }}>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 600, color: C.ch, marginBottom: 6 }}>Refer a Friend</div>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.mu, lineHeight: 1.5, marginBottom: 10 }}>Give a friend 1 month Premium free. When they subscribe, you get 1 month free.</div>
          <div style={{ background: C.ow, borderRadius: 8, padding: "10px 12px", border: "1px solid " + C.sl, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.ch, fontWeight: 600 }}>pickitup.app/join/{(userName || "you").toLowerCase()}</span>
            <button style={{ padding: "4px 10px", borderRadius: 12, background: C.gd, color: C.cr, border: "none", fontFamily: "Inter,sans-serif", fontSize: 11, cursor: "pointer" }}>Copy</button>
          </div>
        </div>

        <div style={{ padding: "14px", borderRadius: 12, background: C.cr, border: "1px solid " + C.sl }}>
          <div style={{ fontFamily: "'Georgia',serif", fontSize: 13, color: C.gd, fontStyle: "italic", lineHeight: 1.6 }}>"Muscle is built in the gym. Strength begins in the mind."</div>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 10, color: C.mu, marginTop: 5 }}>Pick It Up — Built on the philosophy of change.</div>
        </div>
      </div>
    </div>
  );
}

function Paywall(props) {
  const state = props.state;
  const setState = props.setState;
  const [plan, setPlan] = useState("annual");
  const plans = {
    monthly: { label: "Monthly", price: "$14.99", sub: "per month", save: null },
    annual: { label: "Annual", price: "$7.49", sub: "per month, billed yearly", save: "Save 50%" },
  };
  const features = [
    { icon: "↑", title: "Full movement library", body: "Tier 2 & 3 blocs unlocked — 36+ exercises, advanced progressions." },
    { icon: "◈", title: "Unlimited AI sessions", body: "Regenerate as many times as you want, every day." },
    { icon: "◎", title: "Coaching session credit", body: "One 1-on-1 Zoom session with Josh per month, included." },
    { icon: "∿", title: "Full cohort access", body: "Skip the Day 21 wait — join a cohort group immediately." },
  ];
  const activate = function () {
    setState(function (s) { return Object.assign({}, s, { isPremium: true }); });
    props.onClose();
  };
  return (
    <div style={{ minHeight: "100vh", background: C.gd, display: "flex", flexDirection: "column", padding: "0 0 40px" }}>
      <div style={{ padding: "20px 20px 0", display: "flex", justifyContent: "flex-end" }}>
        <button onClick={props.onClose} style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "none", color: C.sl, fontSize: 15, cursor: "pointer" }}>✕</button>
      </div>
      <div style={{ padding: "10px 28px 0", textAlign: "center" }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: C.go, fontFamily: "Inter,sans-serif", fontWeight: 600, textTransform: "uppercase", marginBottom: 10 }}>Pick It Up Premium</div>
        <div style={{ fontFamily: "'Georgia',serif", fontSize: 26, color: C.cr, lineHeight: 1.25, marginBottom: 6 }}>Strength begins in the mind.<br />Go further with it.</div>
      </div>
      <div style={{ padding: "20px 24px 0", flex: 1 }}>
        {features.map(function (f) {
          return (
            <div key={f.title} style={{ display: "flex", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(200,169,106,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: C.go, flexShrink: 0 }}>{f.icon}</div>
              <div>
                <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 700, color: C.cr, marginBottom: 2 }}>{f.title}</div>
                <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.sl, lineHeight: 1.4 }}>{f.body}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ padding: "8px 24px 0" }}>
        {Object.keys(plans).map(function (id) {
          const p = plans[id];
          const active = plan === id;
          return (
            <div key={id} onClick={function () { setPlan(id); }} style={{ border: "2px solid " + (active ? C.go : "rgba(200,221,208,0.2)"), background: active ? "rgba(200,169,106,0.1)" : "transparent", borderRadius: 14, padding: "14px 16px", marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", position: "relative" }}>
              {p.save ? <div style={{ position: "absolute", top: -9, left: 14, background: C.go, color: C.gd, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 8, fontFamily: "Inter,sans-serif" }}>{p.save}</div> : null}
              <div>
                <div style={{ fontFamily: "Inter,sans-serif", fontSize: 14, fontWeight: 700, color: active ? C.go : C.cr }}>{p.label}</div>
                <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.sl }}>{p.sub}</div>
              </div>
              <div style={{ fontFamily: "'Georgia',serif", fontSize: 20, color: active ? C.go : C.cr }}>{p.price}</div>
            </div>
          );
        })}
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: "rgba(200,221,208,0.6)", textAlign: "center", marginBottom: 14 }}>7-day free trial, then {plans[plan].price}/{plan === "annual" ? "mo billed yearly" : "mo"}. Cancel anytime before the trial ends and you won't be charged.</div>
        <button onClick={activate} style={{ width: "100%", padding: "16px", borderRadius: 12, background: C.go, color: C.gd, border: "none", fontFamily: "Inter,sans-serif", fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 10 }}>Start Free Trial →</button>
        <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
          <button onClick={props.onClose} style={{ background: "none", border: "none", color: C.sl, fontFamily: "Inter,sans-serif", fontSize: 11, cursor: "pointer", textDecoration: "underline" }}>Restore purchase</button>
          <button onClick={props.onClose} style={{ background: "none", border: "none", color: C.sl, fontFamily: "Inter,sans-serif", fontSize: 11, cursor: "pointer", textDecoration: "underline" }}>Terms & Privacy</button>
        </div>
      </div>
    </div>
  );
}

function EmailCapture(props) {
  const [email, setEmail] = useState("");
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  return (
    <div style={{ position: "fixed", bottom: 76, left: "50%", transform: "translateX(-50%)", width: "calc(100% - 32px)", maxWidth: 388, background: C.gd, borderRadius: 16, padding: "18px", zIndex: 250, boxShadow: "0 8px 30px rgba(0,0,0,0.3)" }}>
      <button onClick={props.onDismiss} style={{ position: "absolute", top: 10, right: 12, background: "none", border: "none", color: C.sl, fontSize: 16, cursor: "pointer" }}>✕</button>
      <div style={{ fontFamily: "'Georgia',serif", fontSize: 16, color: C.cr, marginBottom: 5, paddingRight: 20 }}>Don't lose this.</div>
      <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.sl, lineHeight: 1.5, marginBottom: 12 }}>Save your email and we'll keep your progress safe, plus send the occasional thing worth reading. No spam.</div>
      <div style={{ display: "flex", gap: 8 }}>
        <input type="email" value={email} onChange={function (e) { setEmail(e.target.value); }} placeholder="you@email.com" style={{ flex: 1, padding: "10px", borderRadius: 8, border: "1px solid rgba(200,221,208,0.3)", background: "rgba(255,255,255,0.08)", color: C.cr, fontFamily: "Inter,sans-serif", fontSize: 13, outline: "none" }} />
        <button onClick={function () { if (valid) props.onSave(email); }} disabled={!valid} style={{ padding: "10px 16px", borderRadius: 8, background: valid ? C.go : "rgba(200,169,106,0.3)", color: C.gd, border: "none", fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 700, cursor: valid ? "pointer" : "default" }}>Save</button>
      </div>
    </div>
  );
}

function Tutorial(props) {
  const [step, setStep] = useState(0);
  const card = TUTORIAL_CARDS[step];
  const isLast = step === TUTORIAL_CARDS.length - 1;
  return (
    <div style={{ position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 420, height: "100%", background: "rgba(26,74,46,0.94)", zIndex: 300, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 24px 110px" }}>
      <div style={{ background: C.cr, borderRadius: 16, padding: "22px" }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
          {TUTORIAL_CARDS.map(function (c, i) {
            return <div key={i} style={{ width: i === step ? 20 : 6, height: 6, borderRadius: 3, background: i === step ? C.gd : C.sl, transition: "all 0.3s" }} />;
          })}
        </div>
        <div style={{ fontFamily: "'Georgia',serif", fontSize: 19, color: C.gd, marginBottom: 8 }}>{card.title}</div>
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: C.ch, lineHeight: 1.6, marginBottom: 20 }}>{card.body}</div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={props.onSkip} style={{ flex: 1, padding: "12px", borderRadius: 10, background: "transparent", color: C.mu, border: "1px solid " + C.sl, fontFamily: "Inter,sans-serif", fontSize: 13, cursor: "pointer" }}>Skip</button>
          <button onClick={function () { if (isLast) props.onSkip(); else setStep(step + 1); }} style={{ flex: 2, padding: "12px", borderRadius: 10, background: C.gd, color: C.cr, border: "none", fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>{isLast ? "Let's go" : "Next →"}</button>
        </div>
      </div>
    </div>
  );
}

function Nav(props) {
  const active = props.active;
  const setScreen = props.setScreen;
  const state = props.state;
  const todayStr = new Date().toDateString();
  const movementDone = state.sessionHistory.some(function (s) { return s.date === todayStr; });
  const nourishDone = state.meals.length > 0;
  const trackDone = state.sleepLog.some(function (s) { return s.date === todayStr; });
  const hasCompletedSession = state.sessionHistory && state.sessionHistory.length > 0;
  const items = [
    { id: "home", icon: "⌂", l: "Home" },
    { id: "movement", icon: "↑", l: "Move", dot: !!state.checkIn && !movementDone },
    { id: "nourish", icon: "◇", l: "Nourish", dot: !nourishDone },
    { id: "regulate", icon: "∿", l: "Regulate", locked: !hasCompletedSession },
    { id: "track", icon: "◎", l: "Track", dot: !trackDone },
    { id: "community", icon: "◈", l: "Community", locked: !hasCompletedSession },
  ];
  return (
    <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 420, background: C.wh, borderTop: "1px solid " + C.sl, display: "flex", justifyContent: "space-around", alignItems: "center", padding: "8px 0 14px", zIndex: 100 }}>
      <style>{"@keyframes navpulse{0%{transform:scale(1);opacity:1;}70%{transform:scale(2.2);opacity:0;}100%{transform:scale(2.2);opacity:0;}}"}</style>
      {items.map(function (item) {
        const isActive = active === item.id;
        return (
          <button key={item.id} onClick={function () {
            if (item.locked) {
              alert("Complete your first session to unlock " + item.l + ".");
              return;
            }
            setScreen(item.id);
          }} style={{ background: "none", border: "none", cursor: item.locked ? "default" : "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, color: item.locked ? "rgba(138,138,122,0.35)" : isActive ? C.gd : C.mu, position: "relative", opacity: item.locked ? 0.45 : 1 }}>
            {item.dot && !item.locked ? (
              <div style={{ position: "absolute", top: -2, right: 0, width: 6, height: 6, borderRadius: "50%", background: C.go }}>
                <div style={{ position: "absolute", top: 0, left: 0, width: 6, height: 6, borderRadius: "50%", background: C.go, animation: "navpulse 1.8s ease-out infinite" }} />
              </div>
            ) : null}
            {item.locked ? <span style={{ fontSize: 9, position: "absolute", top: -1, right: -1, color: C.mu }}>🔒</span> : null}
            <span style={{ fontSize: 18, lineHeight: 1 }}>{item.icon}</span>
            <span style={{ fontSize: 9, fontFamily: "Inter,sans-serif", fontWeight: isActive ? 700 : 400 }}>{item.l}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function App() {
  const [screen, setScreenRaw] = useState("home");
  const [state, setState] = useState(DEFAULT);
  const setScreen = function (s) {
    setState(function (st) { return Object.assign({}, st, { quoteCycle: (st.quoteCycle || 0) + 1 }); });
    setScreenRaw(s);
  };

  if (!state.onboarded) {
    return <Onboarding state={state} setState={setState} />;
  }

  // Research-backed: get user to first win (check-in) immediately after onboarding
  // rather than landing on a full feature wall. firstWinPending clears after check-in.
  if (state.firstWinPending) {
    return (
      <div style={{ minHeight: "100vh", background: C.gd, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 28px" }}>
        <div style={{ position: "absolute", top: -20, right: -10, fontSize: 140, color: "rgba(200,169,106,0.05)", fontFamily: "'Georgia',serif", fontWeight: 700, lineHeight: 1, pointerEvents: "none" }}>PIU</div>
        <div style={{ fontFamily: "'Georgia',serif", fontSize: 32, color: C.cr, textAlign: "center", marginBottom: 10 }}>You're in, {state.userName || ""}.</div>
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 14, color: C.sl, textAlign: "center", lineHeight: 1.7, marginBottom: 36 }}>One thing before we go to the app. It takes two minutes and it shapes everything you see today.</div>
        <button onClick={function () {
          setState(function (s) { return Object.assign({}, s, { firstWinPending: false }); });
          setScreen("checkin");
        }} style={{ padding: "16px 36px", background: C.go, color: C.gd, border: "none", borderRadius: 12, fontFamily: "Inter,sans-serif", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Do my first check-in →</button>
        <button onClick={function () { setState(function (s) { return Object.assign({}, s, { firstWinPending: false }); }); }} style={{ marginTop: 16, background: "none", border: "none", fontFamily: "Inter,sans-serif", fontSize: 12, color: "rgba(200,221,208,0.4)", cursor: "pointer" }}>Skip for now</button>
      </div>
    );
  }

  let activeScreen;
  if (screen === "home") activeScreen = <Home state={state} setState={setState} setScreen={setScreen} />;
  else if (screen === "checkin") activeScreen = <CheckIn state={state} setState={setState} setScreen={setScreen} />;
  else if (screen === "movement") activeScreen = <Movement state={state} setState={setState} />;
  else if (screen === "nourish") activeScreen = <Nourish state={state} setState={setState} setScreen={setScreen} />;
  else if (screen === "track") activeScreen = <Track state={state} setState={setState} />;
  else if (screen === "regulate") activeScreen = <Regulate state={state} setState={setState} />;
  else if (screen === "community") activeScreen = <Community state={state} setState={setState} />;
  else if (screen === "profile") activeScreen = <Profile state={state} setState={setState} />;
  else activeScreen = <Home state={state} setState={setState} setScreen={setScreen} />;

  return (
    <div style={{ minHeight: "100vh", background: "#DDD9D1", display: "flex", justifyContent: "center", padding: "20px 0" }}>
      <div style={{ width: "100%", maxWidth: 420, background: C.wh, minHeight: "100vh", position: "relative", boxShadow: "0 0 60px rgba(0,0,0,0.18)", overflowX: "hidden" }}>
        {state.aiLoading ? (
          <div style={{ position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 420, height: "100%", background: "rgba(245,237,216,0.96)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Spinner msg="Reading your check-in..." sub="Your responses are being weighted against the four pillars." />
          </div>
        ) : null}
        {activeScreen}
        {!state.tutorialSeen ? <Tutorial onSkip={function () { setState(function (s) { return Object.assign({}, s, { tutorialSeen: true }); }); }} /> : null}
        {state.tutorialSeen && state.sessionHistory.length > 0 && !state.emailCaptured && !state.emailPromptDismissed ? (
          <EmailCapture
            onDismiss={function () { setState(function (s) { return Object.assign({}, s, { emailPromptDismissed: true }); }); }}
            onSave={function (em) { setState(function (s) { return Object.assign({}, s, { email: em, emailCaptured: true }); }); }}
          />
        ) : null}
        <Nav active={screen} setScreen={setScreen} state={state} />
        <button onClick={function () { setScreen("profile"); }} style={{ position: "fixed", bottom: 66, right: 12, width: 32, height: 32, borderRadius: "50%", background: C.gd, color: C.go, border: "none", fontSize: 13, cursor: "pointer", zIndex: 99, boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>◈</button>
      </div>
    </div>
  );
}
