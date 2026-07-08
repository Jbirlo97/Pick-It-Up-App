import { describe, expect, it } from "vitest";
import { MDB, MOVS } from "./exercises-legacy";
import { EXERCISES } from "./exercises-v2";
import { INJURY_KEYS, INJURY_LABELS, CONTRA_DISPLAY, isInjuryKey } from "./injuries";
import { INJURY_OPTIONS } from "./content";

// docs/trainer-review-findings.md §7.1 — "Vocabulary lint: every contra key
// in the library is in the canonical enum; every enum key is reachable
// from at least one picker flag. Phrasing drift becomes a failing test
// forever." This is what would have caught §1's bug immediately: "lower
// back" was never a member of any shared vocabulary with the contra data,
// it was just two independently-typed free-text strings that happened to
// look related.
describe("injury vocabulary lint", () => {
  it("every MDB movement's contra keys are members of the canonical enum", () => {
    MOVS.forEach((m) => {
      m.contra.forEach((c) => {
        expect(isInjuryKey(c), `"${m.name}" has an unrecognized contra key: "${c}"`).toBe(true);
      });
    });
  });

  it("every EXERCISES v2 entry's contraindication keys are members of the canonical enum", () => {
    EXERCISES.forEach((e) => {
      e.contraindications.forEach((c) => {
        expect(isInjuryKey(c), `"${e.name}" has an unrecognized contraindication key: "${c}"`).toBe(true);
      });
    });
  });

  it("every canonical key has a display label and a contraindication phrase", () => {
    INJURY_KEYS.forEach((key) => {
      expect(INJURY_LABELS[key], `missing INJURY_LABELS entry for "${key}"`).toBeTruthy();
      expect(CONTRA_DISPLAY[key], `missing CONTRA_DISPLAY entry for "${key}"`).toBeTruthy();
    });
  });

  // The picker (check-in / Profile) must offer every key a movement could
  // ever be contraindicated for — otherwise that key is unreachable by any
  // real user action, exactly the failure mode §2 fixed (elbow, groin,
  // hamstring, achilles existed in contra data with no flag able to fire them).
  it("every canonical key is reachable from the injury flag picker (INJURY_OPTIONS)", () => {
    INJURY_KEYS.forEach((key) => {
      expect(INJURY_OPTIONS, `"${key}" is not offered as a flag option`).toContain(key);
    });
    expect(INJURY_OPTIONS.length).toBe(INJURY_KEYS.length);
  });

  it("MDB and EXERCISES v2 assign identical contraindication keys per movement (datasets stay in sync)", () => {
    const nameToKey: Record<string, string> = {};
    Object.entries(MDB).forEach(([key, m]) => (nameToKey[m.name] = key));

    EXERCISES.forEach((ex) => {
      const key = nameToKey[ex.name];
      expect(key, `no MDB entry named "${ex.name}"`).toBeTruthy();
      const mdbContra = [...MDB[key].contra].sort();
      const v2Contra = [...ex.contraindications].sort();
      expect(v2Contra, `"${ex.name}" contraindications differ between MDB and EXERCISES v2`).toEqual(mdbContra);
    });
  });
});
