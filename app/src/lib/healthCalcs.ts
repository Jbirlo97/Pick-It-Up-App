import type { Unit, Sex } from "../types";

// Extracted from Nourish.tsx so the BMI/WHtR/TDEE/macro formulas are unit
// testable (docs/launch-readiness-checklist.md Section 3.2 flags exactly
// these calculations as needing real test coverage). Behavior is
// byte-for-byte the same as the prototype's inline math — this is an
// extraction, not a rewrite.

export interface BmiResult {
  bmi: number;
  category: "Underweight" | "Healthy" | "Overweight" | "Obese";
}

// Returns null if weight or height is missing/zero — BMI can't be computed.
export function calculateBmi(weight: number, height: number, unit: Unit): BmiResult | null {
  if (!weight || !height) return null;
  const heightM = unit === "imperial" ? height * 0.0254 : height / 100;
  const weightKg = unit === "imperial" ? weight * 0.453592 : weight;
  const bmi = weightKg / (heightM * heightM);
  const category = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Healthy" : bmi < 30 ? "Overweight" : "Obese";
  return { bmi: Math.round(bmi * 10) / 10, category };
}

export interface WhtrResult {
  whtr: number;
  category: "Healthy range" | "Increased risk" | "High risk";
}

// Waist-to-height ratio — a muscle-aware supplement to BMI (see Nourish's
// BMI tab copy). Returns null if waist or height is missing/zero.
export function calculateWhtr(waist: number, height: number, unit: Unit): WhtrResult | null {
  if (!waist || !height) return null;
  const waistCm = unit === "imperial" ? waist * 2.54 : waist;
  const heightCm = unit === "imperial" ? height * 2.54 : height;
  const whtr = waistCm / heightCm;
  const category = whtr < 0.5 ? "Healthy range" : whtr < 0.6 ? "Increased risk" : "High risk";
  return { whtr: Math.round(whtr * 100) / 100, category };
}

// Mifflin-St Jeor TDEE at a fixed 1.55 "moderate activity" multiplier
// (see Nourish's "Estimated for moderate activity" disclosure — this is
// deliberately a rough estimate, not a precision instrument).
export function calculateTdee(weight: number, height: number, age: number, sex: Sex, unit: Unit): number | null {
  if (!weight || !height || !age) return null;
  const weightKg = unit === "imperial" ? weight * 0.453592 : weight;
  const heightCm = unit === "imperial" ? height * 2.54 : height;
  const sexOffset = sex === "male" ? 5 : sex === "female" ? -161 : -78;
  return Math.round((10 * weightKg + 6.25 * heightCm - 5 * age + sexOffset) * 1.55);
}

export interface MacroTargets {
  p: number;
  c: number;
  f: number;
}

// 30/40/30 protein/carb/fat split of the TDEE estimate.
export function calculateMacros(tdee: number): MacroTargets {
  return {
    p: Math.round((tdee * 0.3) / 4),
    c: Math.round((tdee * 0.4) / 4),
    f: Math.round((tdee * 0.3) / 9),
  };
}
