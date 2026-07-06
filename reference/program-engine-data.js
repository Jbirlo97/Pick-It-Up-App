/**
 * Pick It Up — Exercise & Program Generation Engine
 * ============================================
 * Source: PickItUp_App_Program_Engine_Workbook.xlsx
 *
 * IMPORTANT — data provenance note:
 * The source workbook defines the FULL exercise schema (Exercise Schema sheet)
 * but contains zero actual exercise rows — only the field definitions. The
 * EXERCISES array below was built by taking Pick It Up's existing 36-exercise
 * library (already live in the main app, hand-authored with real coaching
 * cues/errors/regressions) and mechanically mapping each entry onto the new
 * schema fields (pattern, difficulty, coordination_demand, confidence_demand,
 * energy_demand, nervous_system_effect). That mapping was done with simple
 * heuristics off each exercise's existing tier/tags — it has NOT been
 * reviewed by a trainer. Treat `pattern`, `difficulty`, and the three demand
 * fields as a reasonable starting draft, not ground truth — a few entries
 * (e.g. "Superman") land in a generic "Full Body" pattern bucket because the
 * heuristic doesn't recognize "back" as a tag. Recommend a manual pass before
 * this goes live with real users.
 *
 * Architecture notes for implementation:
 * - Like the recipe engine, this is data + pure logic, no UI, no framework.
 * - Scoring is deterministic per the workbook's Scoring Rules sheet (fixed
 *   point values), NOT an AI call — this matters for the contraindication
 *   rule specifically: a -999 point exclusion needs to be a hard, auditable
 *   rule, not something an LLM might paraphrase past on a given day.
 * - Per your direction: contraindication hits do NOT silently filter the
 *   exercise out. They flag it and require an explicit one-tap acknowledgment
 *   before the user can proceed (see `checkContraindications` and the UI
 *   artifact's warning interstitial). This is a deliberate deviation from
 *   the workbook's literal "-999 = exclude" rule, chosen so the person stays
 *   informed and in control rather than having content silently hidden.
 */

export const EXERCISES = [
  {
    "exercise_id": "EX_GOBLET_SQUAT",
    "name": "Goblet Squat",
    "pattern": "Squat/Hinge",
    "subcategory": "strength, lower",
    "equipment": "Bodyweight",
    "environment": "Anywhere",
    "difficulty": "Beginner",
    "tier": 1,
    "primary_muscles": "Quad, Glute, Core",
    "primary_muscle_keys": [
      "quad",
      "glute"
    ],
    "coordination_demand": "Low",
    "confidence_demand": "Low",
    "energy_demand": "Moderate",
    "nervous_system_effect": "Neutral",
    "contraindications": [
      "acute knee injury"
    ],
    "sub_1": "Box squat",
    "sub_2": "Bulgarian split squat",
    "sub_3": "",
    "progression": "Bulgarian split squat",
    "regression": "Box squat",
    "coach_cue": "Chest tall, elbows inside knees",
    "all_cues": [
      "Chest tall, elbows inside knees",
      "Drive through the whole foot",
      "Pause at the bottom"
    ],
    "common_errors": [
      "Heels rising \u2014 widen stance",
      "Knees caving \u2014 push out",
      "Forward lean"
    ],
    "breath_cue": "Exhale on exertion",
    "video_url": "app://video/goblet_squat"
  },
  {
    "exercise_id": "EX_PUSHUP",
    "name": "Push-up",
    "pattern": "Push/Pull",
    "subcategory": "strength, upper",
    "equipment": "Bodyweight",
    "environment": "Anywhere",
    "difficulty": "Beginner",
    "tier": 1,
    "primary_muscles": "Chest, Tricep, Shoulder",
    "primary_muscle_keys": [
      "chest",
      "tricep"
    ],
    "coordination_demand": "Low",
    "confidence_demand": "Low",
    "energy_demand": "Moderate",
    "nervous_system_effect": "Neutral",
    "contraindications": [
      "shoulder impingement",
      "wrist injury"
    ],
    "sub_1": "Elevated push-up",
    "sub_2": "Archer push-up",
    "sub_3": "",
    "progression": "Archer push-up",
    "regression": "Elevated push-up",
    "coach_cue": "Body rigid \u2014 glutes on",
    "all_cues": [
      "Body rigid \u2014 glutes on",
      "Lower to an inch from floor",
      "Elbows at 45\u00b0"
    ],
    "common_errors": [
      "Hips sagging \u2014 elevate hands",
      "Head jutting \u2014 pack neck",
      "Half reps"
    ],
    "breath_cue": "Exhale on exertion",
    "video_url": "app://video/pushup"
  },
  {
    "exercise_id": "EX_HIP_HINGE",
    "name": "Hip Hinge",
    "pattern": "Squat/Hinge",
    "subcategory": "strength, lower",
    "equipment": "Bodyweight",
    "environment": "Anywhere",
    "difficulty": "Beginner",
    "tier": 1,
    "primary_muscles": "Hamstring, Glute, Low Back",
    "primary_muscle_keys": [
      "hamstring",
      "glute"
    ],
    "coordination_demand": "Low",
    "confidence_demand": "Low",
    "energy_demand": "Moderate",
    "nervous_system_effect": "Neutral",
    "contraindications": [
      "acute low back pain"
    ],
    "sub_1": "Wall hip hinge",
    "sub_2": "Single-leg RDL",
    "sub_3": "",
    "progression": "Single-leg RDL",
    "regression": "Wall hip hinge",
    "coach_cue": "Hinge at hip not waist",
    "all_cues": [
      "Hinge at hip not waist",
      "Soft knee \u2014 not a squat",
      "Feel hamstring tension"
    ],
    "common_errors": [
      "Rounding lower back",
      "Squatting it \u2014 hips back",
      "Overextending at top"
    ],
    "breath_cue": "Exhale on exertion",
    "video_url": "app://video/hip_hinge"
  },
  {
    "exercise_id": "EX_GLUTE_BRIDGE",
    "name": "Glute Bridge",
    "pattern": "Squat/Hinge",
    "subcategory": "strength, lower",
    "equipment": "Bodyweight",
    "environment": "Anywhere",
    "difficulty": "Beginner",
    "tier": 1,
    "primary_muscles": "Glute, Hamstring, Core",
    "primary_muscle_keys": [
      "glute",
      "hamstring"
    ],
    "coordination_demand": "Low",
    "confidence_demand": "Low",
    "energy_demand": "Moderate",
    "nervous_system_effect": "Neutral",
    "contraindications": [
      "acute low back pain"
    ],
    "sub_1": "Supine hip extension",
    "sub_2": "Single-leg glute bridge",
    "sub_3": "",
    "progression": "Single-leg glute bridge",
    "regression": "Supine hip extension",
    "coach_cue": "Drive through heels",
    "all_cues": [
      "Drive through heels",
      "Squeeze at top \u2014 2s hold",
      "Neutral spine"
    ],
    "common_errors": [
      "Pushing through toes",
      "Over-arching \u2014 ribs down",
      "Short range"
    ],
    "breath_cue": "Exhale on exertion",
    "video_url": "app://video/glute_bridge"
  },
  {
    "exercise_id": "EX_PLANK",
    "name": "Plank",
    "pattern": "Core",
    "subcategory": "strength, core",
    "equipment": "Bodyweight",
    "environment": "Anywhere",
    "difficulty": "Beginner",
    "tier": 1,
    "primary_muscles": "Core, Shoulder, Glute",
    "primary_muscle_keys": [
      "core"
    ],
    "coordination_demand": "Low",
    "confidence_demand": "Low",
    "energy_demand": "Moderate",
    "nervous_system_effect": "Neutral",
    "contraindications": [
      "acute shoulder injury"
    ],
    "sub_1": "Knee plank",
    "sub_2": "RKC plank",
    "sub_3": "",
    "progression": "RKC plank",
    "regression": "Knee plank",
    "coach_cue": "Straight line heel to crown",
    "all_cues": [
      "Straight line heel to crown",
      "Squeeze glutes and brace abs",
      "Eyes down \u2014 neck neutral"
    ],
    "common_errors": [
      "Hips sagging",
      "Hips too high",
      "Holding breath"
    ],
    "breath_cue": "Exhale on exertion",
    "video_url": "app://video/plank"
  },
  {
    "exercise_id": "EX_DEAD_BUG",
    "name": "Dead Bug",
    "pattern": "Core",
    "subcategory": "strength, core",
    "equipment": "Bodyweight",
    "environment": "Anywhere",
    "difficulty": "Beginner",
    "tier": 1,
    "primary_muscles": "Deep Core, Anti-rotation",
    "primary_muscle_keys": [
      "core"
    ],
    "coordination_demand": "Low",
    "confidence_demand": "Low",
    "energy_demand": "Moderate",
    "nervous_system_effect": "Neutral",
    "contraindications": [
      "acute low back pain"
    ],
    "sub_1": "Arm-only version",
    "sub_2": "Dead bug with band",
    "sub_3": "",
    "progression": "Dead bug with band",
    "regression": "Arm-only version",
    "coach_cue": "Low back into floor \u2014 always",
    "all_cues": [
      "Low back into floor \u2014 always",
      "Opposite arm and leg slowly",
      "Exhale as you extend"
    ],
    "common_errors": [
      "Back arching \u2014 reduce range",
      "Moving too fast",
      "Holding breath"
    ],
    "breath_cue": "Exhale on exertion",
    "video_url": "app://video/dead_bug"
  },
  {
    "exercise_id": "EX_HIP_90_90",
    "name": "90/90 Hip Stretch",
    "pattern": "Mobility",
    "subcategory": "mobility, lower",
    "equipment": "Bodyweight",
    "environment": "Anywhere",
    "difficulty": "Beginner",
    "tier": 1,
    "primary_muscles": "Hip Flexor, Glute, External Rotator",
    "primary_muscle_keys": [
      "hipflexor",
      "glute"
    ],
    "coordination_demand": "Low",
    "confidence_demand": "Low",
    "energy_demand": "Low",
    "nervous_system_effect": "Regulating",
    "contraindications": [
      "acute hip labral tear"
    ],
    "sub_1": "Supine figure-4",
    "sub_2": "90/90 active rotations",
    "sub_3": "",
    "progression": "90/90 active rotations",
    "regression": "Supine figure-4",
    "coach_cue": "Both hips heavy \u2014 sit tall",
    "all_cues": [
      "Both hips heavy \u2014 sit tall",
      "Lean into front shin",
      "Rotate to back leg for glute"
    ],
    "common_errors": [
      "Lifting hip \u2014 keep grounded",
      "Collapsing spine",
      "Rushing \u2014 go slow"
    ],
    "breath_cue": "Exhale on exertion",
    "video_url": "app://video/hip_90_90"
  },
  {
    "exercise_id": "EX_BREATH_WORK",
    "name": "Box Breathing",
    "pattern": "Recovery",
    "subcategory": "recovery, mobility",
    "equipment": "Bodyweight",
    "environment": "Anywhere",
    "difficulty": "Beginner",
    "tier": 1,
    "primary_muscles": "Diaphragm, Nervous System",
    "primary_muscle_keys": [],
    "coordination_demand": "Low",
    "confidence_demand": "Low",
    "energy_demand": "Low",
    "nervous_system_effect": "Regulating",
    "contraindications": [],
    "sub_1": "2-2-2-2 pattern",
    "sub_2": "6-6-6-6 pattern",
    "sub_3": "",
    "progression": "6-6-6-6 pattern",
    "regression": "2-2-2-2 pattern",
    "coach_cue": "Inhale 4s \u2014 belly first",
    "all_cues": [
      "Inhale 4s \u2014 belly first",
      "Hold 4s \u2014 stay relaxed",
      "Exhale 4s \u2014 let go",
      "Hold 4s \u2014 empty"
    ],
    "common_errors": [
      "Chest breathing",
      "Forcing it",
      "Counting too fast"
    ],
    "breath_cue": "Exhale on exertion",
    "video_url": "app://video/breath_work"
  },
  {
    "exercise_id": "EX_INCHWORM",
    "name": "Inchworm",
    "pattern": "Mobility",
    "subcategory": "mobility, full body",
    "equipment": "Bodyweight",
    "environment": "Anywhere",
    "difficulty": "Beginner",
    "tier": 1,
    "primary_muscles": "Hamstring, Shoulder, Core",
    "primary_muscle_keys": [
      "hamstring",
      "shoulder"
    ],
    "coordination_demand": "Low",
    "confidence_demand": "Low",
    "energy_demand": "Low",
    "nervous_system_effect": "Regulating",
    "contraindications": [
      "acute low back pain"
    ],
    "sub_1": "Short range",
    "sub_2": "Inchworm with push-up",
    "sub_3": "",
    "progression": "Inchworm with push-up",
    "regression": "Short range",
    "coach_cue": "Hinge at hips \u2014 hands to floor",
    "all_cues": [
      "Hinge at hips \u2014 hands to floor",
      "Walk hands to plank",
      "Walk feet to hands"
    ],
    "common_errors": [
      "Bending knees too much",
      "Rushing",
      "Losing core in plank"
    ],
    "breath_cue": "Exhale on exertion",
    "video_url": "app://video/inchworm"
  },
  {
    "exercise_id": "EX_LUNGE",
    "name": "Reverse Lunge",
    "pattern": "Squat/Hinge",
    "subcategory": "strength, lower",
    "equipment": "Bodyweight",
    "environment": "Anywhere",
    "difficulty": "Beginner",
    "tier": 1,
    "primary_muscles": "Quad, Glute, Hip Flexor",
    "primary_muscle_keys": [
      "quad",
      "glute"
    ],
    "coordination_demand": "Low",
    "confidence_demand": "Low",
    "energy_demand": "Moderate",
    "nervous_system_effect": "Neutral",
    "contraindications": [
      "acute knee injury"
    ],
    "sub_1": "Split squat",
    "sub_2": "Bulgarian split squat",
    "sub_3": "",
    "progression": "Bulgarian split squat",
    "regression": "Split squat",
    "coach_cue": "Step back \u2014 front foot stays",
    "all_cues": [
      "Step back \u2014 front foot stays",
      "Front knee tracks toe",
      "Tall torso"
    ],
    "common_errors": [
      "Knee caving",
      "Leaning forward",
      "Short step"
    ],
    "breath_cue": "Exhale on exertion",
    "video_url": "app://video/lunge"
  },
  {
    "exercise_id": "EX_SQUAT_JUMP",
    "name": "Squat Jump",
    "pattern": "Power",
    "subcategory": "power, lower",
    "equipment": "Bodyweight",
    "environment": "Anywhere",
    "difficulty": "Intermediate",
    "tier": 2,
    "primary_muscles": "Quad, Glute, Calf",
    "primary_muscle_keys": [
      "quad",
      "glute",
      "calf"
    ],
    "coordination_demand": "Moderate",
    "confidence_demand": "Moderate",
    "energy_demand": "High",
    "nervous_system_effect": "Activating",
    "contraindications": [
      "acute knee injury"
    ],
    "sub_1": "Squat to calf raise",
    "sub_2": "Weighted squat jump",
    "sub_3": "",
    "progression": "Weighted squat jump",
    "regression": "Squat to calf raise",
    "coach_cue": "Land soft \u2014 toes then heels",
    "all_cues": [
      "Land soft \u2014 toes then heels",
      "Absorb into squat on landing",
      "Drive arms on takeoff"
    ],
    "common_errors": [
      "Landing stiff",
      "Collapsing forward",
      "Shallow squat"
    ],
    "breath_cue": "Exhale on exertion",
    "video_url": "app://video/squat_jump"
  },
  {
    "exercise_id": "EX_SUPERMAN",
    "name": "Superman",
    "pattern": "Full Body",
    "subcategory": "strength, back",
    "equipment": "Bodyweight",
    "environment": "Anywhere",
    "difficulty": "Beginner",
    "tier": 1,
    "primary_muscles": "Erector Spinae, Glute",
    "primary_muscle_keys": [
      "lowback",
      "glute"
    ],
    "coordination_demand": "Low",
    "confidence_demand": "Low",
    "energy_demand": "Moderate",
    "nervous_system_effect": "Neutral",
    "contraindications": [
      "acute low back pain"
    ],
    "sub_1": "Alternating limbs only",
    "sub_2": "Superman hold 30s",
    "sub_3": "",
    "progression": "Superman hold 30s",
    "regression": "Alternating limbs only",
    "coach_cue": "Lift opposite arm and leg",
    "all_cues": [
      "Lift opposite arm and leg",
      "Hold 2s at top",
      "Lower with control"
    ],
    "common_errors": [
      "Jerking \u2014 slow down",
      "Neck hyperextending",
      "Not lifting high enough"
    ],
    "breath_cue": "Exhale on exertion",
    "video_url": "app://video/superman"
  },
  {
    "exercise_id": "EX_WALL_SIT",
    "name": "Wall Sit",
    "pattern": "Squat/Hinge",
    "subcategory": "strength, lower",
    "equipment": "Bodyweight",
    "environment": "Anywhere",
    "difficulty": "Beginner",
    "tier": 1,
    "primary_muscles": "Quad, Glute, Core",
    "primary_muscle_keys": [
      "quad",
      "glute"
    ],
    "coordination_demand": "Low",
    "confidence_demand": "Low",
    "energy_demand": "Moderate",
    "nervous_system_effect": "Neutral",
    "contraindications": [
      "acute knee injury"
    ],
    "sub_1": "Partial wall sit",
    "sub_2": "Single-leg wall sit",
    "sub_3": "",
    "progression": "Single-leg wall sit",
    "regression": "Partial wall sit",
    "coach_cue": "90\u00b0 at hip and knee",
    "all_cues": [
      "90\u00b0 at hip and knee",
      "Back flat against wall",
      "Breathe \u2014 this is endurance"
    ],
    "common_errors": [
      "Knees past toes",
      "Back peeling off wall",
      "Looking down"
    ],
    "breath_cue": "Exhale on exertion",
    "video_url": "app://video/wall_sit"
  },
  {
    "exercise_id": "EX_CALF_RAISE",
    "name": "Calf Raise",
    "pattern": "Squat/Hinge",
    "subcategory": "strength, lower",
    "equipment": "Bodyweight",
    "environment": "Anywhere",
    "difficulty": "Beginner",
    "tier": 1,
    "primary_muscles": "Gastrocnemius, Soleus",
    "primary_muscle_keys": [
      "calf"
    ],
    "coordination_demand": "Low",
    "confidence_demand": "Low",
    "energy_demand": "Moderate",
    "nervous_system_effect": "Neutral",
    "contraindications": [
      "acute achilles injury"
    ],
    "sub_1": "Seated calf raise",
    "sub_2": "Single-leg calf raise",
    "sub_3": "",
    "progression": "Single-leg calf raise",
    "regression": "Seated calf raise",
    "coach_cue": "Full range top to bottom",
    "all_cues": [
      "Full range top to bottom",
      "Slow 3s descent",
      "Balance on one if too easy"
    ],
    "common_errors": [
      "Bouncing",
      "Partial range",
      "Momentum"
    ],
    "breath_cue": "Exhale on exertion",
    "video_url": "app://video/calf_raise"
  },
  {
    "exercise_id": "EX_BEAR_CRAWL",
    "name": "Bear Crawl",
    "pattern": "Core",
    "subcategory": "strength, core, full body",
    "equipment": "Bodyweight",
    "environment": "Anywhere",
    "difficulty": "Intermediate",
    "tier": 2,
    "primary_muscles": "Shoulder, Core, Hip Flexor",
    "primary_muscle_keys": [
      "shoulder",
      "core"
    ],
    "coordination_demand": "Moderate",
    "confidence_demand": "Moderate",
    "energy_demand": "Moderate",
    "nervous_system_effect": "Neutral",
    "contraindications": [
      "wrist injury"
    ],
    "sub_1": "Bear hold only",
    "sub_2": "Bear crawl with band",
    "sub_3": "",
    "progression": "Bear crawl with band",
    "regression": "Bear hold only",
    "coach_cue": "Knees 1 inch off floor",
    "all_cues": [
      "Knees 1 inch off floor",
      "Opposite hand and foot together",
      "Hips level \u2014 no swaying"
    ],
    "common_errors": [
      "Knees dropping",
      "Hips too high",
      "Moving too fast"
    ],
    "breath_cue": "Exhale on exertion",
    "video_url": "app://video/bear_crawl"
  },
  {
    "exercise_id": "EX_T_PUSHUP",
    "name": "T Push-up",
    "pattern": "Push/Pull",
    "subcategory": "strength, upper, core",
    "equipment": "Bodyweight",
    "environment": "Anywhere",
    "difficulty": "Intermediate",
    "tier": 2,
    "primary_muscles": "Chest, Tricep, Oblique, Shoulder",
    "primary_muscle_keys": [
      "chest",
      "oblique"
    ],
    "coordination_demand": "Moderate",
    "confidence_demand": "Moderate",
    "energy_demand": "Moderate",
    "nervous_system_effect": "Neutral",
    "contraindications": [
      "shoulder impingement"
    ],
    "sub_1": "Push-up only",
    "sub_2": "T push-up with DB row",
    "sub_3": "",
    "progression": "T push-up with DB row",
    "regression": "Push-up only",
    "coach_cue": "Push up, rotate, reach to ceiling",
    "all_cues": [
      "Push up, rotate, reach to ceiling",
      "Stack or stagger feet",
      "Hold the top for a beat"
    ],
    "common_errors": [
      "Rotating before pushing",
      "Hips dropping",
      "Rushing"
    ],
    "breath_cue": "Exhale on exertion",
    "video_url": "app://video/t_pushup"
  },
  {
    "exercise_id": "EX_HOLLOW_HOLD",
    "name": "Hollow Hold",
    "pattern": "Core",
    "subcategory": "strength, core",
    "equipment": "Bodyweight",
    "environment": "Anywhere",
    "difficulty": "Intermediate",
    "tier": 2,
    "primary_muscles": "Deep Core, Hip Flexor",
    "primary_muscle_keys": [
      "core"
    ],
    "coordination_demand": "Moderate",
    "confidence_demand": "Moderate",
    "energy_demand": "Moderate",
    "nervous_system_effect": "Neutral",
    "contraindications": [
      "acute low back pain"
    ],
    "sub_1": "Bent-knee hollow hold",
    "sub_2": "Hollow rock",
    "sub_3": "",
    "progression": "Hollow rock",
    "regression": "Bent-knee hollow hold",
    "coach_cue": "Low back into floor",
    "all_cues": [
      "Low back into floor",
      "Arms overhead, legs low and straight",
      "Point toes, squeeze inner thighs"
    ],
    "common_errors": [
      "Back lifting \u2014 raise legs higher",
      "Arms drifting",
      "Holding breath"
    ],
    "breath_cue": "Exhale on exertion",
    "video_url": "app://video/hollow_hold"
  },
  {
    "exercise_id": "EX_SL_RDL",
    "name": "Single-leg RDL",
    "pattern": "Squat/Hinge",
    "subcategory": "strength, lower",
    "equipment": "Bodyweight",
    "environment": "Anywhere",
    "difficulty": "Intermediate",
    "tier": 2,
    "primary_muscles": "Posterior Chain, Glute, Balance",
    "primary_muscle_keys": [
      "hamstring",
      "glute"
    ],
    "coordination_demand": "Moderate",
    "confidence_demand": "Moderate",
    "energy_demand": "Moderate",
    "nervous_system_effect": "Neutral",
    "contraindications": [
      "acute ankle instability"
    ],
    "sub_1": "Kickstand RDL",
    "sub_2": "Loaded single-leg RDL",
    "sub_3": "",
    "progression": "Loaded single-leg RDL",
    "regression": "Kickstand RDL",
    "coach_cue": "Hinge and reach \u2014 back leg rises",
    "all_cues": [
      "Hinge and reach \u2014 back leg rises",
      "Square the hips",
      "Touch down lightly for balance"
    ],
    "common_errors": [
      "Hip rotation",
      "Standing knee buckling",
      "Too much range"
    ],
    "breath_cue": "Exhale on exertion",
    "video_url": "app://video/sl_rdl"
  },
  {
    "exercise_id": "EX_DEAD_HANG",
    "name": "Dead Hang",
    "pattern": "Mobility",
    "subcategory": "mobility, upper",
    "equipment": "Bodyweight",
    "environment": "Anywhere",
    "difficulty": "Intermediate",
    "tier": 2,
    "primary_muscles": "Grip, Lat, Shoulder Capsule",
    "primary_muscle_keys": [
      "lat",
      "shoulder"
    ],
    "coordination_demand": "Moderate",
    "confidence_demand": "Moderate",
    "energy_demand": "Low",
    "nervous_system_effect": "Regulating",
    "contraindications": [
      "acute shoulder dislocation"
    ],
    "sub_1": "Assisted hang",
    "sub_2": "Active hang scapular pulls",
    "sub_3": "",
    "progression": "Active hang scapular pulls",
    "regression": "Assisted hang",
    "coach_cue": "Full passive hang, then pull shoulders down",
    "all_cues": [
      "Full passive hang, then pull shoulders down",
      "Breathe \u2014 don't hold it",
      "Build to 60s over weeks"
    ],
    "common_errors": [
      "Shrugging up",
      "Swinging",
      "Jumping off"
    ],
    "breath_cue": "Exhale on exertion",
    "video_url": "app://video/dead_hang"
  },
  {
    "exercise_id": "EX_ROW_BODYWEIGHT",
    "name": "Bodyweight Row",
    "pattern": "Push/Pull",
    "subcategory": "strength, upper",
    "equipment": "Bodyweight",
    "environment": "Anywhere",
    "difficulty": "Intermediate",
    "tier": 2,
    "primary_muscles": "Lat, Bicep, Rear Delt",
    "primary_muscle_keys": [
      "lat",
      "bicep"
    ],
    "coordination_demand": "Moderate",
    "confidence_demand": "Moderate",
    "energy_demand": "Moderate",
    "nervous_system_effect": "Neutral",
    "contraindications": [
      "acute shoulder impingement"
    ],
    "sub_1": "Incline row",
    "sub_2": "Weighted row",
    "sub_3": "",
    "progression": "Weighted row",
    "regression": "Incline row",
    "coach_cue": "Body rigid \u2014 legs straight for harder",
    "all_cues": [
      "Body rigid \u2014 legs straight for harder",
      "Pull chest to bar",
      "Elbows draw back, not out"
    ],
    "common_errors": [
      "Hips dropping",
      "Only using arms",
      "Partial range"
    ],
    "breath_cue": "Exhale on exertion",
    "video_url": "app://video/row_bodyweight"
  },
  {
    "exercise_id": "EX_NORDIC_CURL",
    "name": "Nordic Curl",
    "pattern": "Squat/Hinge",
    "subcategory": "strength, lower",
    "equipment": "Bodyweight",
    "environment": "Anywhere",
    "difficulty": "Advanced",
    "tier": 3,
    "primary_muscles": "Hamstring (eccentric), Glute",
    "primary_muscle_keys": [
      "hamstring"
    ],
    "coordination_demand": "High",
    "confidence_demand": "Moderate",
    "energy_demand": "Moderate",
    "nervous_system_effect": "Neutral",
    "contraindications": [
      "acute hamstring tear"
    ],
    "sub_1": "Assisted Nordic with band",
    "sub_2": "Unassisted Nordic",
    "sub_3": "",
    "progression": "Unassisted Nordic",
    "regression": "Assisted Nordic with band",
    "coach_cue": "Lower as slowly as possible",
    "all_cues": [
      "Lower as slowly as possible",
      "Catch yourself at the bottom",
      "Drive hips into extension to return"
    ],
    "common_errors": [
      "Dropping too fast",
      "Hips breaking",
      "Skipping range"
    ],
    "breath_cue": "Exhale on exertion",
    "video_url": "app://video/nordic_curl"
  },
  {
    "exercise_id": "EX_SIDE_PLANK",
    "name": "Side Plank",
    "pattern": "Core",
    "subcategory": "strength, core",
    "equipment": "Bodyweight",
    "environment": "Anywhere",
    "difficulty": "Beginner",
    "tier": 1,
    "primary_muscles": "Oblique, Glute Medius, Shoulder",
    "primary_muscle_keys": [
      "oblique",
      "glute"
    ],
    "coordination_demand": "Low",
    "confidence_demand": "Low",
    "energy_demand": "Moderate",
    "nervous_system_effect": "Neutral",
    "contraindications": [
      "acute shoulder injury"
    ],
    "sub_1": "Knee-down side plank",
    "sub_2": "Side plank with leg lift",
    "sub_3": "",
    "progression": "Side plank with leg lift",
    "regression": "Knee-down side plank",
    "coach_cue": "Stack hips and shoulders",
    "all_cues": [
      "Stack hips and shoulders",
      "Lift hips high \u2014 straight line",
      "Top arm reaches to ceiling"
    ],
    "common_errors": [
      "Hips sagging",
      "Rolling forward",
      "Holding breath"
    ],
    "breath_cue": "Exhale on exertion",
    "video_url": "app://video/side_plank"
  },
  {
    "exercise_id": "EX_PIKE_PUSHUP",
    "name": "Pike Push-up",
    "pattern": "Push/Pull",
    "subcategory": "strength, upper",
    "equipment": "Bodyweight",
    "environment": "Anywhere",
    "difficulty": "Intermediate",
    "tier": 2,
    "primary_muscles": "Shoulder, Tricep, Upper Chest",
    "primary_muscle_keys": [
      "shoulder",
      "tricep"
    ],
    "coordination_demand": "Moderate",
    "confidence_demand": "Moderate",
    "energy_demand": "Moderate",
    "nervous_system_effect": "Neutral",
    "contraindications": [
      "shoulder impingement"
    ],
    "sub_1": "Elevated pike push-up",
    "sub_2": "Wall-assisted handstand push-up",
    "sub_3": "",
    "progression": "Wall-assisted handstand push-up",
    "regression": "Elevated pike push-up",
    "coach_cue": "Hips high \u2014 inverted V shape",
    "all_cues": [
      "Hips high \u2014 inverted V shape",
      "Crown of head toward floor",
      "Push through whole hand"
    ],
    "common_errors": [
      "Hips dropping too low",
      "Elbows flaring wide",
      "Short range"
    ],
    "breath_cue": "Exhale on exertion",
    "video_url": "app://video/pike_pushup"
  },
  {
    "exercise_id": "EX_STEP_UP",
    "name": "Step-up",
    "pattern": "Squat/Hinge",
    "subcategory": "strength, lower",
    "equipment": "Bodyweight",
    "environment": "Anywhere",
    "difficulty": "Beginner",
    "tier": 1,
    "primary_muscles": "Quad, Glute, Balance",
    "primary_muscle_keys": [
      "quad",
      "glute"
    ],
    "coordination_demand": "Low",
    "confidence_demand": "Low",
    "energy_demand": "Moderate",
    "nervous_system_effect": "Neutral",
    "contraindications": [
      "acute knee injury"
    ],
    "sub_1": "Lower step height",
    "sub_2": "Weighted step-up",
    "sub_3": "",
    "progression": "Weighted step-up",
    "regression": "Lower step height",
    "coach_cue": "Drive through the front heel",
    "all_cues": [
      "Drive through the front heel",
      "Stand tall at the top",
      "Control the descent"
    ],
    "common_errors": [
      "Pushing off back leg",
      "Leaning forward",
      "Banging the knee"
    ],
    "breath_cue": "Exhale on exertion",
    "video_url": "app://video/step_up"
  },
  {
    "exercise_id": "EX_FARMER_CARRY",
    "name": "Farmer's Carry",
    "pattern": "Full Body",
    "subcategory": "strength, full body",
    "equipment": "Bodyweight",
    "environment": "Anywhere",
    "difficulty": "Intermediate",
    "tier": 2,
    "primary_muscles": "Grip, Core, Trapezius",
    "primary_muscle_keys": [
      "core",
      "grip"
    ],
    "coordination_demand": "Moderate",
    "confidence_demand": "Moderate",
    "energy_demand": "Moderate",
    "nervous_system_effect": "Neutral",
    "contraindications": [
      "acute grip or wrist injury"
    ],
    "sub_1": "Shorter distance, lighter load",
    "sub_2": "Heavier load or single-arm carry",
    "sub_3": "",
    "progression": "Heavier load or single-arm carry",
    "regression": "Shorter distance, lighter load",
    "coach_cue": "Shoulders back and down",
    "all_cues": [
      "Shoulders back and down",
      "Walk with control, no swaying",
      "Brace core like a punch is coming"
    ],
    "common_errors": [
      "Shrugging shoulders up",
      "Leaning to one side",
      "Rushing the steps"
    ],
    "breath_cue": "Exhale on exertion",
    "video_url": "app://video/farmer_carry"
  },
  {
    "exercise_id": "EX_BIRD_DOG",
    "name": "Bird Dog",
    "pattern": "Core",
    "subcategory": "strength, core",
    "equipment": "Bodyweight",
    "environment": "Anywhere",
    "difficulty": "Beginner",
    "tier": 1,
    "primary_muscles": "Core, Glute, Erector Spinae",
    "primary_muscle_keys": [
      "core",
      "glute"
    ],
    "coordination_demand": "Low",
    "confidence_demand": "Low",
    "energy_demand": "Moderate",
    "nervous_system_effect": "Neutral",
    "contraindications": [
      "acute low back pain"
    ],
    "sub_1": "Arm-only or leg-only",
    "sub_2": "Bird dog with pause and pulse",
    "sub_3": "",
    "progression": "Bird dog with pause and pulse",
    "regression": "Arm-only or leg-only",
    "coach_cue": "Extend opposite arm and leg slowly",
    "all_cues": [
      "Extend opposite arm and leg slowly",
      "Keep hips level \u2014 don't rotate",
      "Pause at full extension"
    ],
    "common_errors": [
      "Hips rotating open",
      "Back arching",
      "Moving too fast"
    ],
    "breath_cue": "Exhale on exertion",
    "video_url": "app://video/bird_dog"
  },
  {
    "exercise_id": "EX_COSSACK_SQUAT",
    "name": "Cossack Squat",
    "pattern": "Mobility",
    "subcategory": "mobility, lower",
    "equipment": "Bodyweight",
    "environment": "Anywhere",
    "difficulty": "Intermediate",
    "tier": 2,
    "primary_muscles": "Adductor, Glute, Quad",
    "primary_muscle_keys": [
      "quad",
      "glute"
    ],
    "coordination_demand": "Moderate",
    "confidence_demand": "Moderate",
    "energy_demand": "Low",
    "nervous_system_effect": "Regulating",
    "contraindications": [
      "acute groin strain"
    ],
    "sub_1": "Assisted Cossack (hold support)",
    "sub_2": "Loaded Cossack squat",
    "sub_3": "",
    "progression": "Loaded Cossack squat",
    "regression": "Assisted Cossack (hold support)",
    "coach_cue": "Shift weight fully to one side",
    "all_cues": [
      "Shift weight fully to one side",
      "Keep the straight leg's foot flat",
      "Sit deep into the bent knee"
    ],
    "common_errors": [
      "Heel lifting on bent-knee side",
      "Rushing the shift",
      "Losing balance forward"
    ],
    "breath_cue": "Exhale on exertion",
    "video_url": "app://video/cossack_squat"
  },
  {
    "exercise_id": "EX_MOUNTAIN_CLIMBER",
    "name": "Mountain Climber",
    "pattern": "Power",
    "subcategory": "power, core, full body",
    "equipment": "Bodyweight",
    "environment": "Anywhere",
    "difficulty": "Intermediate",
    "tier": 2,
    "primary_muscles": "Core, Hip Flexor, Shoulder",
    "primary_muscle_keys": [
      "core",
      "hipflexor"
    ],
    "coordination_demand": "Moderate",
    "confidence_demand": "Moderate",
    "energy_demand": "High",
    "nervous_system_effect": "Activating",
    "contraindications": [
      "wrist injury"
    ],
    "sub_1": "Slow controlled tempo",
    "sub_2": "Mountain climber with sliders",
    "sub_3": "",
    "progression": "Mountain climber with sliders",
    "regression": "Slow controlled tempo",
    "coach_cue": "Hips stay low \u2014 plank position",
    "all_cues": [
      "Hips stay low \u2014 plank position",
      "Drive knees toward chest quickly",
      "Keep shoulders stacked over wrists"
    ],
    "common_errors": [
      "Hips bouncing up",
      "Half range of motion",
      "Hands creeping forward"
    ],
    "breath_cue": "Exhale on exertion",
    "video_url": "app://video/mountain_climber"
  },
  {
    "exercise_id": "EX_ARCHER_PUSHUP",
    "name": "Archer Push-up",
    "pattern": "Push/Pull",
    "subcategory": "strength, upper",
    "equipment": "Bodyweight",
    "environment": "Anywhere",
    "difficulty": "Advanced",
    "tier": 3,
    "primary_muscles": "Chest, Tricep, Shoulder",
    "primary_muscle_keys": [
      "chest",
      "tricep"
    ],
    "coordination_demand": "High",
    "confidence_demand": "Moderate",
    "energy_demand": "Moderate",
    "nervous_system_effect": "Neutral",
    "contraindications": [
      "shoulder impingement",
      "wrist injury"
    ],
    "sub_1": "Wide push-up",
    "sub_2": "Full one-arm push-up progression",
    "sub_3": "",
    "progression": "Full one-arm push-up progression",
    "regression": "Wide push-up",
    "coach_cue": "Shift weight fully to one arm",
    "all_cues": [
      "Shift weight fully to one arm",
      "Other arm stays straight and low",
      "Push back to centre with control"
    ],
    "common_errors": [
      "Bent support arm collapsing",
      "Hips sagging",
      "Incomplete shift"
    ],
    "breath_cue": "Exhale on exertion",
    "video_url": "app://video/archer_pushup"
  },
  {
    "exercise_id": "EX_PISTOL_SQUAT_PREP",
    "name": "Pistol Squat Prep",
    "pattern": "Squat/Hinge",
    "subcategory": "strength, lower",
    "equipment": "Bodyweight",
    "environment": "Anywhere",
    "difficulty": "Advanced",
    "tier": 3,
    "primary_muscles": "Quad, Glute, Balance",
    "primary_muscle_keys": [
      "quad",
      "glute"
    ],
    "coordination_demand": "High",
    "confidence_demand": "Moderate",
    "energy_demand": "Moderate",
    "nervous_system_effect": "Neutral",
    "contraindications": [
      "acute knee injury"
    ],
    "sub_1": "Box-assisted pistol squat",
    "sub_2": "Full unassisted pistol squat",
    "sub_3": "",
    "progression": "Full unassisted pistol squat",
    "regression": "Box-assisted pistol squat",
    "coach_cue": "Hold support lightly for balance",
    "all_cues": [
      "Hold support lightly for balance",
      "Sit back and down on one leg",
      "Extended leg stays off the floor"
    ],
    "common_errors": [
      "Knee caving inward",
      "Heel lifting",
      "Using too much hand support"
    ],
    "breath_cue": "Exhale on exertion",
    "video_url": "app://video/pistol_squat_prep"
  },
  {
    "exercise_id": "EX_SCAPULAR_PUSHUP",
    "name": "Scapular Push-up",
    "pattern": "Mobility",
    "subcategory": "mobility, upper",
    "equipment": "Bodyweight",
    "environment": "Anywhere",
    "difficulty": "Beginner",
    "tier": 1,
    "primary_muscles": "Serratus Anterior, Shoulder Stability",
    "primary_muscle_keys": [
      "shoulder"
    ],
    "coordination_demand": "Low",
    "confidence_demand": "Low",
    "energy_demand": "Low",
    "nervous_system_effect": "Regulating",
    "contraindications": [],
    "sub_1": "Knee version",
    "sub_2": "Scapular push-up at the top of a push-up",
    "sub_3": "",
    "progression": "Scapular push-up at the top of a push-up",
    "regression": "Knee version",
    "coach_cue": "Start in plank, arms straight",
    "all_cues": [
      "Start in plank, arms straight",
      "Let shoulder blades pinch together",
      "Push the floor away \u2014 blades spread"
    ],
    "common_errors": [
      "Bending the elbows",
      "Moving too fast",
      "Tiny range of motion"
    ],
    "breath_cue": "Exhale on exertion",
    "video_url": "app://video/scapular_pushup"
  },
  {
    "exercise_id": "EX_THREAD_NEEDLE",
    "name": "Thread the Needle",
    "pattern": "Mobility",
    "subcategory": "mobility, core",
    "equipment": "Bodyweight",
    "environment": "Anywhere",
    "difficulty": "Beginner",
    "tier": 1,
    "primary_muscles": "Thoracic Spine, Shoulder",
    "primary_muscle_keys": [
      "shoulder"
    ],
    "coordination_demand": "Low",
    "confidence_demand": "Low",
    "energy_demand": "Low",
    "nervous_system_effect": "Regulating",
    "contraindications": [],
    "sub_1": "Smaller range of rotation",
    "sub_2": "Add a reach and hold at end range",
    "sub_3": "",
    "progression": "Add a reach and hold at end range",
    "regression": "Smaller range of rotation",
    "coach_cue": "Start on hands and knees",
    "all_cues": [
      "Start on hands and knees",
      "Thread one arm under the body",
      "Rotate and reach up to open the chest"
    ],
    "common_errors": [
      "Hips shifting off centre",
      "Rushing the rotation",
      "Locking the supporting elbow"
    ],
    "breath_cue": "Exhale on exertion",
    "video_url": "app://video/thread_needle"
  },
  {
    "exercise_id": "EX_COPENHAGEN_PLANK",
    "name": "Copenhagen Plank",
    "pattern": "Core",
    "subcategory": "strength, core, lower",
    "equipment": "Bodyweight",
    "environment": "Anywhere",
    "difficulty": "Advanced",
    "tier": 3,
    "primary_muscles": "Adductor, Oblique, Hip",
    "primary_muscle_keys": [
      "oblique",
      "hipflexor"
    ],
    "coordination_demand": "High",
    "confidence_demand": "Moderate",
    "energy_demand": "Moderate",
    "nervous_system_effect": "Neutral",
    "contraindications": [
      "acute groin strain"
    ],
    "sub_1": "Bent bottom-knee version",
    "sub_2": "Full straight-leg Copenhagen plank",
    "sub_3": "",
    "progression": "Full straight-leg Copenhagen plank",
    "regression": "Bent bottom-knee version",
    "coach_cue": "Top foot rests on a bench or chair",
    "all_cues": [
      "Top foot rests on a bench or chair",
      "Hips lift into a straight line",
      "Bottom leg hovers, fully engaged"
    ],
    "common_errors": [
      "Hips sagging or rotating",
      "Top leg doing all the work",
      "Short hold time"
    ],
    "breath_cue": "Exhale on exertion",
    "video_url": "app://video/copenhagen_plank"
  },
  {
    "exercise_id": "EX_JUMP_ROPE",
    "name": "Jump Rope",
    "pattern": "Power",
    "subcategory": "power, lower, full body",
    "equipment": "Bodyweight",
    "environment": "Anywhere",
    "difficulty": "Intermediate",
    "tier": 2,
    "primary_muscles": "Calf, Coordination, Cardio",
    "primary_muscle_keys": [
      "calf"
    ],
    "coordination_demand": "Moderate",
    "confidence_demand": "Moderate",
    "energy_demand": "High",
    "nervous_system_effect": "Activating",
    "contraindications": [
      "acute ankle injury"
    ],
    "sub_1": "Imaginary rope, same rhythm",
    "sub_2": "Double-unders",
    "sub_3": "",
    "progression": "Double-unders",
    "regression": "Imaginary rope, same rhythm",
    "coach_cue": "Small jumps \u2014 an inch off the floor",
    "all_cues": [
      "Small jumps \u2014 an inch off the floor",
      "Wrists do the turning, not arms",
      "Land softly on the balls of your feet"
    ],
    "common_errors": [
      "Jumping too high",
      "Whole-arm turning",
      "Landing flat-footed"
    ],
    "breath_cue": "Exhale on exertion",
    "video_url": "app://video/jump_rope"
  },
  {
    "exercise_id": "EX_HIP_CIRCLE",
    "name": "Standing Hip Circle",
    "pattern": "Mobility",
    "subcategory": "mobility, lower",
    "equipment": "Bodyweight",
    "environment": "Anywhere",
    "difficulty": "Beginner",
    "tier": 1,
    "primary_muscles": "Hip Capsule, Glute",
    "primary_muscle_keys": [
      "hipflexor",
      "glute"
    ],
    "coordination_demand": "Low",
    "confidence_demand": "Low",
    "energy_demand": "Low",
    "nervous_system_effect": "Regulating",
    "contraindications": [],
    "sub_1": "Smaller circles, seated",
    "sub_2": "Standing on an unstable surface",
    "sub_3": "",
    "progression": "Standing on an unstable surface",
    "regression": "Smaller circles, seated",
    "coach_cue": "Hold support for balance if needed",
    "all_cues": [
      "Hold support for balance if needed",
      "Trace a slow, full circle with the knee",
      "Equal reps both directions"
    ],
    "common_errors": [
      "Rushing the circle",
      "Tiny range of motion",
      "Letting the torso sway"
    ],
    "breath_cue": "Exhale on exertion",
    "video_url": "app://video/hip_circle"
  },
  {
    "exercise_id": "EX_CAT_COW",
    "name": "Cat-Cow",
    "pattern": "Mobility",
    "subcategory": "mobility, recovery",
    "equipment": "Bodyweight",
    "environment": "Anywhere",
    "difficulty": "Beginner",
    "tier": 1,
    "primary_muscles": "Spine, Core",
    "primary_muscle_keys": [
      "core",
      "lowback"
    ],
    "coordination_demand": "Low",
    "confidence_demand": "Low",
    "energy_demand": "Low",
    "nervous_system_effect": "Regulating",
    "contraindications": [],
    "sub_1": "Smaller range",
    "sub_2": "Add a pause at end range",
    "sub_3": "",
    "progression": "Add a pause at end range",
    "regression": "Smaller range",
    "coach_cue": "Inhale \u2014 drop belly, lift chest (cow)",
    "all_cues": [
      "Inhale \u2014 drop belly, lift chest (cow)",
      "Exhale \u2014 round spine, tuck chin (cat)",
      "Move slowly through the full spine"
    ],
    "common_errors": [
      "Moving only the neck",
      "Holding the breath",
      "Rushing the transitions"
    ],
    "breath_cue": "Exhale on exertion",
    "video_url": "app://video/cat_cow"
  },
  {
    "exercise_id": "EX_BANDED_PULL_APART",
    "name": "Band Pull-Apart",
    "pattern": "Push/Pull",
    "subcategory": "strength, upper",
    "equipment": "Bodyweight",
    "environment": "Anywhere",
    "difficulty": "Beginner",
    "tier": 1,
    "primary_muscles": "Rear Delt, Upper Back",
    "primary_muscle_keys": [
      "shoulder"
    ],
    "coordination_demand": "Low",
    "confidence_demand": "Low",
    "energy_demand": "Moderate",
    "nervous_system_effect": "Neutral",
    "contraindications": [],
    "sub_1": "Lighter band",
    "sub_2": "Heavier band or slow tempo",
    "sub_3": "",
    "progression": "Heavier band or slow tempo",
    "regression": "Lighter band",
    "coach_cue": "Arms straight out in front, shoulder height",
    "all_cues": [
      "Arms straight out in front, shoulder height",
      "Pull the band apart, squeeze shoulder blades",
      "Control the return \u2014 don't snap back"
    ],
    "common_errors": [
      "Bending the elbows",
      "Shrugging the shoulders",
      "Using momentum"
    ],
    "breath_cue": "Exhale on exertion",
    "video_url": "app://video/banded_pull_apart"
  }
];

/**
 * User-configurable inputs, per the "User Inputs" sheet.
 * Mirrors what Pick It Up's onboarding already collects, plus two fields the
 * workbook specifies that aren't in the live app yet: sessionLength and a
 * more granular movementPreference. Worth adding to onboarding if this engine
 * gets wired in.
 */
export const USER_INPUT_SCHEMA = {
  primaryGoal: { type: "single", options: ["Strength", "Consistency", "Mood support", "Confidence", "Stress management"] },
  experienceLevel: { type: "single", options: ["Beginner", "Intermediate", "Advanced"] },
  equipmentAccess: { type: "multi", options: ["None", "Bands", "Dumbbells", "Home gym", "Commercial gym"] },
  trainingDays: { type: "number", range: [2, 6] },
  sessionLength: { type: "single", options: [15, 30, 45, 60] }, // NOT YET in live app — add to onboarding
  injuryFlags: { type: "multi", options: ["Shoulder", "Back", "Knee", "Hip", "Ankle", "Wrist", "Neck"] },
  movementPreference: { type: "multi", options: ["Gym", "Home", "Walking", "Machines", "Free weights"] },
  readiness: { type: "rating", range: [1, 5] },
  sleep: { type: "rating", range: [1, 5] },
  mood: { type: "rating", range: [1, 5] },
  stress: { type: "rating", range: [1, 5] },
  tonePreference: { type: "single", options: ["Stoic", "Balanced", "Empathic"] },
};

/**
 * Scoring Rules — exact point values from the source workbook's "Scoring
 * Rules" sheet. Kept as named constants (not magic numbers in functions) so
 * they're easy to tune from one place.
 */
export const SCORING_RULES = {
  EQUIPMENT_MATCH: 30,
  GOAL_MATCH: 25,
  DIFFICULTY_MATCH: 20,
  PREFERENCE_MATCH: 10,
  LOW_CONFIDENCE_DEMAND: 10,
  REGULATION_MATCH: 10,
  CONTRAINDICATION_HIT: -999,
  HIGH_COMPLEXITY_FOR_BEGINNER: -20,
  HIGH_ENERGY_LOW_READINESS: -15,
};

/**
 * Goal-tag mapping — connects a user's plain-language primary goal to the
 * exercise pattern(s) most relevant to it. The source workbook's exercise
 * schema doesn't define explicit "goal tags" per exercise (unlike the recipe
 * engine), so this derives goal-fit from movement pattern + nervous system
 * effect as a reasonable proxy. Revisit if/when exercises get explicit goal
 * tags added.
 */
const GOAL_PATTERN_AFFINITY = {
  "Strength": ["Squat/Hinge", "Push/Pull", "Power"],
  "Consistency": ["Squat/Hinge", "Push/Pull", "Core", "Full Body"],
  "Mood support": ["Mobility", "Recovery", "Full Body"],
  "Confidence": ["Squat/Hinge", "Push/Pull", "Core"],
  "Stress management": ["Mobility", "Recovery"],
};

/**
 * Step 3 of the Generator Logic: check an exercise against the user's logged
 * injuries. Returns { blocked: boolean, matches: string[] }.
 *
 * Per your direction this does NOT auto-exclude — the caller (UI layer) is
 * expected to show a one-tap warning interstitial when `blocked` is true,
 * and only proceed if the user explicitly acknowledges it. This function
 * just answers "does this conflict," it doesn't make the filtering decision.
 */
export function checkContraindications(exercise, injuryFlags) {
  if (!injuryFlags || injuryFlags.length === 0) return { blocked: false, matches: [] };
  const matches = exercise.contraindications.filter((c) =>
    injuryFlags.some((flag) => c.toLowerCase().includes(flag.toLowerCase()))
  );
  return { blocked: matches.length > 0, matches };
}

/**
 * Score a single exercise for a given user context.
 * Implements Scoring Rules sheet faithfully. Returns { score, breakdown,
 * contraindicationMatches } — breakdown is useful for debugging/coach review,
 * not meant to be shown to the end user (per "Hidden nutrition intelligence"
 * style principle — same philosophy as the recipe engine).
 */
export function scoreExercise(exercise, context) {
  const {
    equipmentAccess = [],
    primaryGoal,
    experienceLevel,
    movementPreference = [],
    readiness = 3,
    stress = 3,
    injuryFlags = [],
  } = context;

  const breakdown = {};
  let score = 0;

  // Equipment match
  const equipmentOk = exercise.equipment === "Bodyweight" || equipmentAccess.includes(exercise.equipment);
  if (equipmentOk) { score += SCORING_RULES.EQUIPMENT_MATCH; breakdown.equipmentMatch = SCORING_RULES.EQUIPMENT_MATCH; }

  // Goal match
  const goalPatterns = GOAL_PATTERN_AFFINITY[primaryGoal] || [];
  if (goalPatterns.includes(exercise.pattern)) { score += SCORING_RULES.GOAL_MATCH; breakdown.goalMatch = SCORING_RULES.GOAL_MATCH; }

  // Difficulty match
  if (exercise.difficulty === experienceLevel) { score += SCORING_RULES.DIFFICULTY_MATCH; breakdown.difficultyMatch = SCORING_RULES.DIFFICULTY_MATCH; }

  // Preference match (movement preference vs exercise environment/equipment)
  if (movementPreference.some((p) => exercise.environment.toLowerCase().includes(p.toLowerCase()) || exercise.equipment.toLowerCase().includes(p.toLowerCase()))) {
    score += SCORING_RULES.PREFERENCE_MATCH; breakdown.preferenceMatch = SCORING_RULES.PREFERENCE_MATCH;
  }

  // Low confidence demand bonus (beginners / low-confidence context)
  if (experienceLevel === "Beginner" && exercise.confidence_demand === "Low") {
    score += SCORING_RULES.LOW_CONFIDENCE_DEMAND; breakdown.lowConfidenceBonus = SCORING_RULES.LOW_CONFIDENCE_DEMAND;
  }

  // Regulation match (high stress + regulating/neutral movement)
  if (stress >= 4 && (exercise.nervous_system_effect === "Regulating" || exercise.nervous_system_effect === "Neutral")) {
    score += SCORING_RULES.REGULATION_MATCH; breakdown.regulationMatch = SCORING_RULES.REGULATION_MATCH;
  }

  // Contraindication check — flagged, not silently applied as -999 by default.
  // Caller decides whether to apply CONTRAINDICATION_HIT after user
  // acknowledgment. We surface the matches here so the UI can warn.
  const contra = checkContraindications(exercise, injuryFlags);
  if (contra.blocked) { breakdown.contraindicationMatches = contra.matches; }

  // High complexity for beginner
  if (experienceLevel === "Beginner" && exercise.coordination_demand === "High") {
    score += SCORING_RULES.HIGH_COMPLEXITY_FOR_BEGINNER; breakdown.complexityPenalty = SCORING_RULES.HIGH_COMPLEXITY_FOR_BEGINNER;
  }

  // High energy demand on a low readiness day
  if (readiness <= 2 && exercise.energy_demand === "High") {
    score += SCORING_RULES.HIGH_ENERGY_LOW_READINESS; breakdown.energyPenalty = SCORING_RULES.HIGH_ENERGY_LOW_READINESS;
  }

  return { score, breakdown, contraindicationFlag: contra };
}

/**
 * Detect a readiness trend from recent session history.
 * Ported and improved from the main app's getSession() trend logic, which
 * only compared the first vs. last of the last 3 readiness scores (fragile —
 * misses a true monotonic trend, e.g. 3,5,3 would read as "stable" when it's
 * actually volatile). This version checks the full short window for a
 * consistent direction.
 *
 * @param {Array<{readiness: number}>} sessionHistory - most recent last
 * @param {number} [window=3] - how many recent sessions to consider
 * @returns {"improving"|"declining"|"stable"|"volatile"|"unknown"}
 */
export function detectReadinessTrend(sessionHistory, window = 3) {
  const recent = (sessionHistory || []).slice(-window).map((s) => s.readiness);
  if (recent.length < 2) return "unknown";

  const diffs = [];
  for (let i = 1; i < recent.length; i++) diffs.push(recent[i] - recent[i - 1]);

  const allUp = diffs.every((d) => d > 0);
  const allDown = diffs.every((d) => d < 0);
  const allFlat = diffs.every((d) => d === 0);

  if (allFlat) return "stable";
  if (allUp) return "improving";
  if (allDown) return "declining";
  return "volatile"; // mixed signal — e.g. 3,5,3 — worth surfacing differently than a clean trend
}

/**
 * Full 10-step Generator Logic, as specified in the "Generator Logic" sheet.
 * Produces a structured session: warm-up / strength / optional cardio /
 * regulation finisher, sized by readiness AND short-term trend.
 *
 * @param {Object} context - see scoreExercise() for shared fields, plus:
 * @param {number} [context.exerciseCount] - override count; otherwise derived
 *   from readiness (1-2 -> 2, 3 -> 3, 4 -> 4, 5 -> 5), matching the existing
 *   live app's session-sizing rule for continuity.
 * @param {Array} [context.sessionHistory] - recent sessions, most recent
 *   last, each with at least { readiness }. Used for trend-aware volume
 *   adjustment — this is the piece the original engine was missing
 *   (single-session only, no history awareness), now ported from the main
 *   app's check-in flow so this engine isn't stateless.
 * @returns {Object} { warmup, main, regulation, flaggedExercises, trend }
 */
export function generateProgram(context) {
  const { readiness = 3, stress = 3, injuryFlags = [] } = context;
  const trend = detectReadinessTrend(context.sessionHistory);

  // Step 1-2: start with all active exercises, filter by equipment/environment
  let pool = EXERCISES.filter((ex) => {
    const equipmentOk = ex.equipment === "Bodyweight" || (context.equipmentAccess || []).includes(ex.equipment);
    return equipmentOk;
  });

  // Step 5: score every remaining exercise
  const scored = pool.map((ex) => ({ ex, ...scoreExercise(ex, context) }));

  // Collect contraindication flags for UI warning, but do NOT remove them
  // from the pool — per your direction, flag-and-confirm, not silent block.
  const flaggedExercises = scored.filter((s) => s.contraindicationFlag.blocked).map((s) => ({
    exercise: s.ex,
    matchedInjuries: s.contraindicationFlag.matches,
  }));

  // Step 6: build a balanced session from required patterns
  scored.sort((a, b) => b.score - a.score);
  const warmupPool = scored.filter((s) => s.ex.nervous_system_effect === "Regulating" || s.ex.pattern === "Mobility");
  const mainPool = scored.filter((s) => s.ex.pattern !== "Mobility" && s.ex.pattern !== "Recovery");
  const regulationPool = scored.filter((s) => s.ex.nervous_system_effect === "Regulating");

  // Step 7: adjust volume using readiness, nudged by trend.
  // A "declining" trend trims volume slightly even on a nominally-okay
  // readiness day (catching fatigue building up before the person logs a
  // genuinely low day) — a "volatile" trend favours stability over a push,
  // since inconsistent readiness usually means the rest of life is
  // inconsistent right now too.
  let exerciseCount = context.exerciseCount || (readiness <= 2 ? 2 : readiness === 3 ? 3 : readiness === 4 ? 4 : 5);
  let setsForReadiness = readiness <= 2 ? 2 : readiness >= 4 ? 4 : 3;
  if (trend === "declining" && exerciseCount > 2) exerciseCount -= 1;
  if (trend === "volatile" && setsForReadiness > 2) setsForReadiness -= 1;

  const warmup = warmupPool.slice(0, 1).map((s) => buildPrescription(s.ex, 1, "2 min", readiness));
  const main = mainPool.slice(0, exerciseCount).map((s) => buildPrescription(s.ex, setsForReadiness, readiness <= 2 ? "easy, 10-12" : "10", readiness));
  const regulation = stress >= 4 ? regulationPool.slice(0, 1).map((s) => buildPrescription(s.ex, 1, "3-5 min", readiness)) : [];

  return {
    warmup,
    main,
    regulation,
    flaggedExercises, // UI should show a one-tap warning if this is non-empty
    readiness,
    trend,
  };
}

/**
 * Step 8-9: attach substitutions, cues, and prescription details.
 * "make easier" -> sub_1/regression, "swap" -> sub_2/progression or sub_3.
 */
function buildPrescription(exercise, sets, reps, readiness) {
  return {
    exercise_id: exercise.exercise_id,
    name: exercise.name,
    sets,
    reps,
    coach_cue: exercise.coach_cue,
    breath_cue: exercise.breath_cue,
    video_url: exercise.video_url,
    makeEasier: exercise.regression || exercise.sub_1,
    swapOption: exercise.progression || exercise.sub_2,
    pattern: exercise.pattern,
  };
}

/**
 * Step 10: log session feedback — shape only (actual persistence is the
 * caller's responsibility / a real backend's job).
 */
export function buildSessionFeedbackPayload({ sessionId, completed, rpe, notes, painFlags }) {
  return { session_id: sessionId, completed, RPE: rpe, notes: notes || "", pain_flags: painFlags || [] };
}
