export interface ExerciseV2 {
  exercise_id: string;
  name: string;
  pattern: string;
  subcategory: string;
  equipment: string;
  environment: string;
  difficulty: string;
  tier: 1 | 2 | 3;
  primary_muscles: string;
  primary_muscle_keys: string[];
  coordination_demand: string;
  confidence_demand: string;
  energy_demand: string;
  nervous_system_effect: string;
  contraindications: string[];
  sub_1: string;
  sub_2: string;
  sub_3: string;
  progression: string;
  regression: string;
  coach_cue: string;
  all_cues: string[];
  common_errors: string[];
  breath_cue: string;
  video_url: string;
}

/**
 * EXERCISES — richer schema derived from the live app's MDB (see
 * exercises-legacy.ts), used only by the new program engine (Detailed
 * Session). Per program-engine-data.js's own header comment: pattern,
 * difficulty, and the three demand fields were heuristically derived from
 * MDB's tier/tags, NOT reviewed by a trainer. A few entries (e.g.
 * 'Superman' -> 'Full Body' pattern) are known mislabels pending trainer
 * review (docs/launch-readiness-checklist.md Section 2.1). Kept separate
 * from MDB until that review lets EXERCISES become the single source of
 * truth (integration-spec.md Section 2b).
 */
export const EXERCISES: ExerciseV2[] = [
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
      "Heels rising — widen stance",
      "Knees caving — push out",
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
    "coach_cue": "Body rigid — glutes on",
    "all_cues": [
      "Body rigid — glutes on",
      "Lower to an inch from floor",
      "Elbows at 45°"
    ],
    "common_errors": [
      "Hips sagging — elevate hands",
      "Head jutting — pack neck",
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
      "Soft knee — not a squat",
      "Feel hamstring tension"
    ],
    "common_errors": [
      "Rounding lower back",
      "Squatting it — hips back",
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
      "Squeeze at top — 2s hold",
      "Neutral spine"
    ],
    "common_errors": [
      "Pushing through toes",
      "Over-arching — ribs down",
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
      "Eyes down — neck neutral"
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
    "coach_cue": "Low back into floor — always",
    "all_cues": [
      "Low back into floor — always",
      "Opposite arm and leg slowly",
      "Exhale as you extend"
    ],
    "common_errors": [
      "Back arching — reduce range",
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
    "coach_cue": "Both hips heavy — sit tall",
    "all_cues": [
      "Both hips heavy — sit tall",
      "Lean into front shin",
      "Rotate to back leg for glute"
    ],
    "common_errors": [
      "Lifting hip — keep grounded",
      "Collapsing spine",
      "Rushing — go slow"
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
    "coach_cue": "Inhale 4s — belly first",
    "all_cues": [
      "Inhale 4s — belly first",
      "Hold 4s — stay relaxed",
      "Exhale 4s — let go",
      "Hold 4s — empty"
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
    "coach_cue": "Hinge at hips — hands to floor",
    "all_cues": [
      "Hinge at hips — hands to floor",
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
    "coach_cue": "Step back — front foot stays",
    "all_cues": [
      "Step back — front foot stays",
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
    "coach_cue": "Land soft — toes then heels",
    "all_cues": [
      "Land soft — toes then heels",
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
      "Jerking — slow down",
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
    "coach_cue": "90° at hip and knee",
    "all_cues": [
      "90° at hip and knee",
      "Back flat against wall",
      "Breathe — this is endurance"
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
      "Hips level — no swaying"
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
      "Back lifting — raise legs higher",
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
    "coach_cue": "Hinge and reach — back leg rises",
    "all_cues": [
      "Hinge and reach — back leg rises",
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
      "Breathe — don't hold it",
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
    "coach_cue": "Body rigid — legs straight for harder",
    "all_cues": [
      "Body rigid — legs straight for harder",
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
      "Lift hips high — straight line",
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
    "coach_cue": "Hips high — inverted V shape",
    "all_cues": [
      "Hips high — inverted V shape",
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
      "Keep hips level — don't rotate",
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
    "coach_cue": "Hips stay low — plank position",
    "all_cues": [
      "Hips stay low — plank position",
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
      "Push the floor away — blades spread"
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
    "coach_cue": "Small jumps — an inch off the floor",
    "all_cues": [
      "Small jumps — an inch off the floor",
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
    "coach_cue": "Inhale — drop belly, lift chest (cow)",
    "all_cues": [
      "Inhale — drop belly, lift chest (cow)",
      "Exhale — round spine, tuck chin (cat)",
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
      "Control the return — don't snap back"
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
