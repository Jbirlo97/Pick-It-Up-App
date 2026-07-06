/**
 * Pick It Up — Recipe Recommendation UI
 * ============================================
 * Standalone reference UI for the Recipe Engine (see recipe-engine-data.js).
 * Built to match Pick It Up's existing visual language (same brand palette,
 * card patterns, typography) but kept as its own file rather than merged into
 * the main app artifact, per the size/stability constraints of that file.
 *
 * For Claude Code: this expects recipe-engine-data.js to be importable
 * as a module (see that file's exports: GOALS, recommendRecipes, etc).
 * In this browser-preview version the import is simulated via a global for
 * portability — swap the top import line for a real module import in the
 * real app.
 *
 * UX principles followed (from the source workbook's "UX Blueprint" sheet):
 * - Decision reduction: show 3-6 recommended meals, not the whole database
 * - Goal-first flow: user picks an outcome, not macros
 * - Situation-aware: "today I need quick/cheap/comfort/family/low-effort"
 * - Hidden scoring: badges only ("High Protein", "Budget", "20 min"), no
 *   raw numbers shown to the user
 * - Trust without clutter
 */

import { useState } from "react";
import { GOALS, recommendRecipes, badgesForRecipe, buildShoppingList } from "./recipe-engine-data.js";

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

const GOAL_DISPLAY = {
  "Fat Loss": { label: "Lose Weight", icon: "↓" },
  "Muscle Gain": { label: "Build Muscle", icon: "↑" },
  "General Health": { label: "Eat Healthier", icon: "◎" },
  "Budget Friendly": { label: "Save Money", icon: "$" },
  "Family Friendly": { label: "Feed Family", icon: "◈" },
  "Time Efficient": { label: "Meal Prep / Quick", icon: "∿" },
};

const SITUATIONS = [
  { id: "quick", label: "10-20 minutes only" },
  { id: "comfort", label: "Comfort food" },
  { id: "workLunches", label: "Work lunches" },
  { id: "lowEffort", label: "Low effort" },
];

const DIETS = ["Omnivore", "Vegetarian", "Vegan", "Pescatarian"];

function BadgePill({ text }) {
  return (
    <span style={{ fontFamily: "Inter,sans-serif", fontSize: 10, color: C.go, background: "rgba(200,169,106,0.12)", border: "1px solid rgba(200,169,106,0.3)", borderRadius: 12, padding: "3px 9px", marginRight: 5, marginBottom: 5, display: "inline-block" }}>
      {text}
    </span>
  );
}

function RecipeCard({ recipe, onOpen }) {
  return (
    <div onClick={() => onOpen(recipe)} style={{ background: C.wh, border: "1px solid " + C.sl, borderRadius: 14, padding: 16, marginBottom: 12, cursor: "pointer" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div style={{ fontFamily: "'Georgia',serif", fontSize: 16, color: C.gd, maxWidth: 240 }}>{recipe.name}</div>
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu, whiteSpace: "nowrap" }}>{recipe.totalMin} min</div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", marginBottom: 8 }}>
        {recipe._badges.map((b) => <BadgePill key={b} text={b} />)}
      </div>
      <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.mu, display: "flex", gap: 14 }}>
        <span>{recipe.calories} kcal</span>
        <span>{recipe.protein}g protein</span>
        <span>${recipe.costPerServe.toFixed(2)}/serve</span>
      </div>
    </div>
  );
}

function RecipeDetail({ recipe, onClose, onAddToList }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(26,74,46,0.5)", display: "flex", alignItems: "flex-end", zIndex: 200 }}>
      <div style={{ background: C.cr, width: "100%", maxHeight: "85vh", overflowY: "auto", borderRadius: "20px 20px 0 0", padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 18, color: C.mu, cursor: "pointer" }}>✕</button>
        </div>
        <div style={{ fontFamily: "'Georgia',serif", fontSize: 24, color: C.gd, marginBottom: 6 }}>{recipe.name}</div>
        <div style={{ display: "flex", flexWrap: "wrap", marginBottom: 14 }}>
          {recipe._badges.map((b) => <BadgePill key={b} text={b} />)}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 16, background: C.ow, borderRadius: 10, padding: 12 }}>
          {[["Calories", recipe.calories], ["Protein", recipe.protein + "g"], ["Carbs", recipe.carbs + "g"], ["Fat", recipe.fat + "g"]].map(([l, v]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Georgia',serif", fontSize: 16, color: C.gd }}>{v}</div>
              <div style={{ fontFamily: "Inter,sans-serif", fontSize: 9, color: C.mu, textTransform: "uppercase" }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 700, color: C.ch, marginBottom: 6 }}>What goes in it</div>
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: C.ch, lineHeight: 1.6, marginBottom: 16 }}>{recipe.ingredientPattern}</div>
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 700, color: C.ch, marginBottom: 6 }}>Method</div>
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: C.ch, lineHeight: 1.6, marginBottom: 16 }}>{recipe.method}</div>
        {recipe.notes ? (
          <div style={{ fontFamily: "'Georgia',serif", fontSize: 13, fontStyle: "italic", color: C.sg, marginBottom: 20 }}>{recipe.notes}</div>
        ) : null}
        <button onClick={() => onAddToList(recipe)} style={{ width: "100%", padding: 14, borderRadius: 10, background: C.gd, color: C.cr, border: "none", fontFamily: "Inter,sans-serif", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
          Add to Shopping List
        </button>
      </div>
    </div>
  );
}

export default function RecipeRecommender() {
  const [step, setStep] = useState("goal"); // goal -> situation -> results
  const [goal, setGoal] = useState(null);
  const [situation, setSituation] = useState(null);
  const [diet, setDiet] = useState(null);
  const [pantryText, setPantryText] = useState("");
  const [openRecipe, setOpenRecipe] = useState(null);
  const [shoppingList, setShoppingList] = useState([]);
  const [showList, setShowList] = useState(false);

  const pantryItems = pantryText.split(",").map((s) => s.trim()).filter(Boolean);
  const results = goal ? recommendRecipes({ goal, situation, diet, pantryItems, count: 6 }) : [];
  const groupedList = shoppingList.length ? buildShoppingList(shoppingList) : [];

  const addToList = (recipe) => {
    if (!shoppingList.find((r) => r.id === recipe.id)) {
      setShoppingList([...shoppingList, recipe]);
    }
    setOpenRecipe(null);
  };

  if (step === "goal") {
    return (
      <div style={{ minHeight: "100vh", background: C.ow, padding: "40px 24px" }}>
        <div style={{ fontFamily: "'Georgia',serif", fontSize: 26, color: C.gd, marginBottom: 8 }}>What's the goal today?</div>
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: C.mu, marginBottom: 24 }}>We'll find meals that actually fit it.</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {Object.keys(GOAL_DISPLAY).map((g) => (
            <button key={g} onClick={() => { setGoal(g); setStep("situation"); }} style={{ background: C.wh, border: "1px solid " + C.sl, borderRadius: 14, padding: 18, textAlign: "left", cursor: "pointer" }}>
              <div style={{ fontSize: 20, color: C.go, marginBottom: 6 }}>{GOAL_DISPLAY[g].icon}</div>
              <div style={{ fontFamily: "'Georgia',serif", fontSize: 14, color: C.gd }}>{GOAL_DISPLAY[g].label}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (step === "situation") {
    return (
      <div style={{ minHeight: "100vh", background: C.ow, padding: "40px 24px" }}>
        <button onClick={() => setStep("goal")} style={{ background: "none", border: "none", color: C.mu, fontFamily: "Inter,sans-serif", fontSize: 12, cursor: "pointer", marginBottom: 16 }}>← Back</button>
        <div style={{ fontFamily: "'Georgia',serif", fontSize: 22, color: C.gd, marginBottom: 6 }}>What's today look like?</div>
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: C.mu, marginBottom: 20 }}>Optional — skip if it doesn't matter today.</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
          {SITUATIONS.map((s) => (
            <button key={s.id} onClick={() => setSituation(s.id === situation ? null : s.id)} style={{ padding: "12px 16px", borderRadius: 10, border: "1px solid " + (situation === s.id ? C.go : C.sl), background: situation === s.id ? "rgba(200,169,106,0.1)" : C.wh, color: situation === s.id ? C.go : C.ch, fontFamily: "Inter,sans-serif", fontSize: 13, textAlign: "left", cursor: "pointer" }}>{s.label}</button>
          ))}
        </div>
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.mu, marginBottom: 8 }}>Dietary preference (optional)</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 24 }}>
          {DIETS.map((d) => (
            <button key={d} onClick={() => setDiet(d === diet ? null : d)} style={{ padding: "6px 14px", borderRadius: 16, border: "1px solid " + (diet === d ? C.gd : C.sl), background: diet === d ? C.gd : "transparent", color: diet === d ? C.cr : C.mu, fontFamily: "Inter,sans-serif", fontSize: 12, cursor: "pointer" }}>{d}</button>
          ))}
        </div>
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.mu, marginBottom: 6 }}>What's already in your kitchen? (optional)</div>
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu, marginBottom: 8 }}>Recipes that use it will be prioritised. Separate with commas.</div>
        <input
          value={pantryText}
          onChange={(e) => setPantryText(e.target.value)}
          placeholder="e.g. chicken, rice, eggs, spinach"
          style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1px solid " + C.sl, fontFamily: "Inter,sans-serif", fontSize: 13, boxSizing: "border-box", outline: "none", marginBottom: 28, background: C.wh }}
        />
        <button onClick={() => setStep("results")} style={{ width: "100%", padding: 15, borderRadius: 12, background: C.go, color: C.gd, border: "none", fontFamily: "Inter,sans-serif", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Show me meals →</button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: C.ow, padding: "40px 24px 100px" }}>
      <button onClick={() => setStep("situation")} style={{ background: "none", border: "none", color: C.mu, fontFamily: "Inter,sans-serif", fontSize: 12, cursor: "pointer", marginBottom: 16 }}>← Adjust</button>
      <div style={{ fontFamily: "'Georgia',serif", fontSize: 22, color: C.gd, marginBottom: 4 }}>{GOAL_DISPLAY[goal].label}</div>
      <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.mu, marginBottom: 20 }}>{results.length} meals that fit{pantryItems.length ? " — prioritising what you have" : ""}</div>
      {results.map((r) => <RecipeCard key={r.id} recipe={r} onOpen={setOpenRecipe} />)}
      {shoppingList.length > 0 ? (
        <div onClick={() => setShowList(!showList)} style={{ position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)", background: C.gd, color: C.cr, padding: "12px 20px", borderRadius: 30, fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 600, boxShadow: "0 4px 16px rgba(0,0,0,0.2)", cursor: "pointer" }}>
          {shoppingList.length} item{shoppingList.length > 1 ? "s" : ""} on your list — tap to view
        </div>
      ) : null}
      {showList ? (
        <div style={{ position: "fixed", inset: 0, background: "rgba(26,74,46,0.5)", display: "flex", alignItems: "flex-end", zIndex: 250 }} onClick={() => setShowList(false)}>
          <div style={{ background: C.cr, width: "100%", maxHeight: "75vh", overflowY: "auto", borderRadius: "20px 20px 0 0", padding: 24 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontFamily: "'Georgia',serif", fontSize: 20, color: C.gd, marginBottom: 4 }}>Shopping List</div>
            <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu, marginBottom: 16 }}>Quantities are estimated, not exact — check before you shop.</div>
            {groupedList.map((group) => (
              <div key={group.aisle} style={{ marginBottom: 16 }}>
                <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, letterSpacing: 1, color: C.go, textTransform: "uppercase", marginBottom: 8 }}>{group.aisle}</div>
                {group.items.map((item) => (
                  <div key={item.label} style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: C.ch, padding: "6px 0", borderBottom: "1px solid " + C.sl }}>
                    {item.label}{item.unit ? <span style={{ color: C.mu }}> · ~{item.unit}</span> : null}
                  </div>
                ))}
              </div>
            ))}
            <button onClick={() => setShowList(false)} style={{ width: "100%", padding: 13, borderRadius: 10, background: C.gd, color: C.cr, border: "none", fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 700, cursor: "pointer", marginTop: 8 }}>Close</button>
          </div>
        </div>
      ) : null}
      {openRecipe ? <RecipeDetail recipe={openRecipe} onClose={() => setOpenRecipe(null)} onAddToList={addToList} /> : null}
    </div>
  );
}
