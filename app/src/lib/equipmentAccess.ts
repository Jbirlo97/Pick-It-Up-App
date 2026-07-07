import type { AppState } from "../types";

// All equipment tags the movement library actually uses (see
// exercises-legacy.ts / exercises-v2.ts equipment fields).
const ALL_ENGINE_EQUIPMENT = ["Dumbbells", "Barbell", "Bench", "Pull-up bar", "Bands", "Kettlebell", "Cable machine", "Squat rack"];

const HOME_EQUIPMENT_MAP: Record<string, string> = {
  dumbbells: "Dumbbells",
  barbell: "Barbell",
  bench: "Bench",
  "pull-up bar": "Pull-up bar",
  "resistance bands": "Bands",
  kettlebell: "Kettlebell",
  "cable machine": "Cable machine",
  "squat rack": "Squat rack",
};

// Equipment mapping per docs/integration-spec.md Section 4: the live app's
// granular equipment list -> the equipment tags used on Movement/ExerciseV2
// records. Shared by both the Quick Session engine (session-engine.ts) and
// the Detailed Session / program engine (program-engine.ts via Movement.tsx)
// so a bodyweight-only user never gets served a barbell squat in either
// path, and a commercial-gym user (assumed full equipment access, per the
// onboarding copy "Full equipment access") actually gets everything rather
// than nothing.
export function mapEquipmentToEngineAccess(trainingLocation: AppState["trainingLocation"], equipment: string[]): string[] {
  if (trainingLocation === "bodyweight") return ["None"];
  if (trainingLocation === "commercial") return ["Commercial gym", ...ALL_ENGINE_EQUIPMENT];
  const access = ["Home gym"];
  equipment.forEach((e) => {
    if (HOME_EQUIPMENT_MAP[e]) access.push(HOME_EQUIPMENT_MAP[e]);
  });
  return access;
}
