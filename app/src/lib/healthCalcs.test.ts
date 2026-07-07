import { describe, expect, it } from "vitest";
import { calculateBmi, calculateMacros, calculateTdee, calculateWhtr } from "./healthCalcs";

describe("calculateBmi", () => {
  it("returns null when weight or height is missing", () => {
    expect(calculateBmi(0, 180, "metric")).toBeNull();
    expect(calculateBmi(80, 0, "metric")).toBeNull();
  });

  it("computes metric BMI and category correctly", () => {
    // 80kg / (1.80m)^2 = 24.69 -> Healthy
    const result = calculateBmi(80, 180, "metric");
    expect(result).not.toBeNull();
    expect(result!.bmi).toBeCloseTo(24.7, 1);
    expect(result!.category).toBe("Healthy");
  });

  it("computes imperial BMI using lbs/inches", () => {
    // 176 lbs, 71 inches ~ 79.8kg, 180.3cm -> similar to metric case above
    const result = calculateBmi(176, 71, "imperial");
    expect(result).not.toBeNull();
    expect(result!.category).toBe("Healthy");
  });

  it("categorizes boundary values correctly", () => {
    expect(calculateBmi(50, 180, "metric")!.category).toBe("Underweight"); // ~15.4
    expect(calculateBmi(95, 180, "metric")!.category).toBe("Overweight"); // ~29.3
    expect(calculateBmi(110, 170, "metric")!.category).toBe("Obese"); // ~38.1
  });
});

describe("calculateWhtr", () => {
  it("returns null when waist or height is missing", () => {
    expect(calculateWhtr(0, 180, "metric")).toBeNull();
    expect(calculateWhtr(80, 0, "metric")).toBeNull();
  });

  it("computes healthy range correctly (waist < half height)", () => {
    const result = calculateWhtr(80, 180, "metric"); // 0.44
    expect(result!.whtr).toBeCloseTo(0.44, 2);
    expect(result!.category).toBe("Healthy range");
  });

  it("computes increased and high risk categories", () => {
    expect(calculateWhtr(95, 180, "metric")!.category).toBe("Increased risk"); // 0.53
    expect(calculateWhtr(115, 180, "metric")!.category).toBe("High risk"); // 0.64
  });
});

describe("calculateTdee", () => {
  it("returns null when any required input is missing", () => {
    expect(calculateTdee(0, 180, 30, "male", "metric")).toBeNull();
    expect(calculateTdee(80, 0, 30, "male", "metric")).toBeNull();
    expect(calculateTdee(80, 180, 0, "male", "metric")).toBeNull();
  });

  it("applies the male offset", () => {
    // Mifflin-St Jeor: 10*80 + 6.25*180 - 5*30 + 5 = 800+1125-150+5=1780, *1.55=2759
    expect(calculateTdee(80, 180, 30, "male", "metric")).toBe(2759);
  });

  it("applies the female offset (lower than male, same stats)", () => {
    const male = calculateTdee(80, 180, 30, "male", "metric")!;
    const female = calculateTdee(80, 180, 30, "female", "metric")!;
    expect(female).toBeLessThan(male);
  });

  it("applies the unspecified offset between male and female", () => {
    const male = calculateTdee(80, 180, 30, "male", "metric")!;
    const female = calculateTdee(80, 180, 30, "female", "metric")!;
    const unspecified = calculateTdee(80, 180, 30, "unspecified", "metric")!;
    expect(unspecified).toBeLessThan(male);
    expect(unspecified).toBeGreaterThan(female);
  });
});

describe("calculateMacros", () => {
  it("splits TDEE into a 30/40/30 protein/carb/fat gram target", () => {
    const macros = calculateMacros(2000);
    expect(macros.p).toBe(150); // 2000*0.3/4
    expect(macros.c).toBe(200); // 2000*0.4/4
    expect(macros.f).toBe(67); // 2000*0.3/9 rounded
  });
});
