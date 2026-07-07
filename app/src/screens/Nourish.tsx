import { useState } from "react";
import { C } from "../theme";
import { FOODS } from "../data/foods-quicklog";
import { GOALS, SITUATION_FILTERS } from "../data/recipe-meta";
import { RECIPES } from "../data/recipes";
import { recommendRecipes, buildShoppingList, badgesForRecipe, type ScoredRecipe, type ShoppingListGroup } from "../engines/recipe-engine";
import { RotatingQuote } from "../components/RotatingQuote";
import { RecipeCard } from "../components/RecipeCard";
import { RecipeDetail } from "../components/RecipeDetail";
import { insertMeal, saveRecipe, unsaveRecipe } from "../lib/db";
import { useUserId } from "../state/UserContext";
import { calculateBmi, calculateMacros, calculateTdee, calculateWhtr } from "../lib/healthCalcs";
import type { AppState, Meal, ScreenId, SetState } from "../types";

const GOAL_DISPLAY: Record<string, { label: string; icon: string }> = {
  "Fat Loss": { label: "Lose Weight", icon: "↓" },
  "Muscle Gain": { label: "Build Muscle", icon: "↑" },
  "General Health": { label: "Eat Healthier", icon: "◎" },
  "Budget Friendly": { label: "Save Money", icon: "$" },
  "Time Efficient": { label: "Meal Prep / Quick", icon: "∿" },
  "Family Friendly": { label: "Feed Family", icon: "◈" },
  "Vegetarian / Plant-Based": { label: "Plant-Based", icon: "❖" },
  "Endurance / Active": { label: "Fuel Training", icon: "▲" },
};

const DIETS = ["Omnivore", "Vegetarian", "Vegan", "Pescatarian"];

type Tab = "log" | "discover" | "macros" | "bmi";

export function Nourish({ state, setState, setScreen }: { state: AppState; setState: SetState; setScreen: (s: ScreenId) => void }) {
  const [tab, setTab] = useState<Tab>("log");
  const [adding, setAdding] = useState(false);
  const [d, setD] = useState({ name: "", kcal: "", protein: "", carbs: "", fat: "", notes: "" });
  const [showSuggest, setShowSuggest] = useState(false);
  const [showMacroEdu, setShowMacroEdu] = useState(false);

  const [discoverGoal, setDiscoverGoal] = useState<string | null>(null);
  const [situation, setSituation] = useState<string | null>(null);
  const [diet, setDiet] = useState<string | null>(null);
  const [pantryText, setPantryText] = useState("");
  const [openRecipe, setOpenRecipe] = useState<ScoredRecipe | null>(null);
  const [shoppingList, setShoppingList] = useState<ScoredRecipe[]>([]);
  const [showList, setShowList] = useState(false);
  const [viewingSaved, setViewingSaved] = useState(false);

  const meals = state.meals;
  const userId = useUserId();
  const bodyStats = state.bodyStats;
  const savedRecipeIds = state.savedRecipeIds || [];

  const pantryItems = pantryText
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const discoverResults = discoverGoal ? recommendRecipes({ goal: discoverGoal, situation, diet, pantryItems, count: 6 }) : [];
  const savedRecipes: ScoredRecipe[] = savedRecipeIds
    .map((id) => RECIPES.find((r) => r.id === id))
    .filter((r): r is (typeof RECIPES)[number] => !!r)
    .map((r) => ({ ...r, _score: 0, _badges: badgesForRecipe(r), _pantryHits: 0 }));
  const groupedList: ShoppingListGroup[] = shoppingList.length ? buildShoppingList(shoppingList) : [];

  const toggleSaveRecipe = (recipe: ScoredRecipe) => {
    const isSaved = savedRecipeIds.includes(recipe.id);
    setState((s) => ({
      ...s,
      savedRecipeIds: isSaved ? s.savedRecipeIds.filter((id) => id !== recipe.id) : s.savedRecipeIds.concat([recipe.id]),
    }));
    if (userId) {
      if (isSaved) unsaveRecipe(userId, recipe.id);
      else saveRecipe(userId, recipe.id);
    }
  };

  const addToList = (recipe: ScoredRecipe) => {
    if (!shoppingList.find((r) => r.id === recipe.id)) setShoppingList([...shoppingList, recipe]);
    setOpenRecipe(null);
  };

  const foodMatches = d.name.trim().length > 1 ? FOODS.filter((f) => f.name.toLowerCase().includes(d.name.toLowerCase())).slice(0, 5) : [];

  const pickFood = (f: (typeof FOODS)[number]) => {
    setD((x) => ({ ...x, name: f.name, kcal: String(f.kcal), protein: String(f.protein), carbs: String(f.carbs), fat: String(f.fat) }));
    setShowSuggest(false);
  };

  const totK = meals.reduce((a, m) => a + (Number(m.kcal) || 0), 0);
  const totP = meals.reduce((a, m) => a + (Number(m.protein) || 0), 0);
  const totC = meals.reduce((a, m) => a + (Number(m.carbs) || 0), 0);
  const totF = meals.reduce((a, m) => a + (Number(m.fat) || 0), 0);

  const w = Number(bodyStats?.weight || 0);
  const h = Number(bodyStats?.height || 0);
  const age = Number(bodyStats?.age || 0);
  const unit = bodyStats?.unit || "metric";
  const sex = bodyStats?.sex || "";
  const waist = Number(bodyStats?.waist || 0);

  const bmiResult = calculateBmi(w, h, unit);
  const bmi = bmiResult ? bmiResult.bmi.toFixed(1) : null;
  const bmiCat = bmiResult?.category ?? null;
  const whtrResult = calculateWhtr(waist, h, unit);
  const whtr = whtrResult ? whtrResult.whtr.toFixed(2) : null;
  const whtrCat = whtrResult?.category ?? null;
  const tdee = calculateTdee(w, h, age, sex, unit);
  const macros = tdee ? calculateMacros(tdee) : null;

  const addMeal = () => {
    if (!d.name.trim()) return;
    const entry: Meal = { ...d, id: Date.now(), time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
    setState((s) => ({ ...s, meals: s.meals.concat([entry]) }));
    if (userId) insertMeal(userId, entry);
    setD({ name: "", kcal: "", protein: "", carbs: "", fat: "", notes: "" });
    setAdding(false);
  };

  const mealFields: [string, keyof typeof d, string, string][] = [
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
      ) : (
        <RotatingQuote cycle={state.quoteCycle} offset={2} margin="16px 24px 0" />
      )}
      <div style={{ padding: "0 24px" }}>
        <div style={{ display: "flex", borderBottom: "1px solid " + C.sl, marginBottom: 16, marginTop: meals.length === 0 ? 16 : 0 }}>
          {(
            [
              ["log", "Log"],
              ["discover", "Discover"],
              ["macros", "Macros"],
              ["bmi", "BMI"],
            ] as [Tab, string][]
          ).map(([id, label]) => {
            const active = tab === id;
            return (
              <button key={id} onClick={() => setTab(id)} style={{ flex: 1, padding: "12px 0", background: "transparent", border: "none", borderBottom: "2px solid " + (active ? C.gd : "transparent"), fontFamily: "Inter,sans-serif", fontSize: 12, fontWeight: active ? 700 : 400, color: active ? C.gd : C.mu, cursor: "pointer" }}>
                {label}
              </button>
            );
          })}
        </div>

        {tab === "log" ? (
          <div>
            {totK > 0 ? (
              <div style={{ background: C.ow, borderRadius: 10, padding: "12px", marginBottom: 14, border: "1px solid " + C.sl, display: "flex", justifyContent: "space-around", textAlign: "center" }}>
                {(
                  [
                    ["Meals", meals.length],
                    ["kcal", totK || "—"],
                    ["P", totP ? totP + "g" : "—"],
                    ["C", totC ? totC + "g" : "—"],
                    ["F", totF ? totF + "g" : "—"],
                  ] as [string, string | number][]
                ).map(([label, v]) => (
                  <div key={label}>
                    <div style={{ fontFamily: "'Georgia',serif", fontSize: 20, color: C.gd }}>{v}</div>
                    <div style={{ fontFamily: "Inter,sans-serif", fontSize: 9, color: C.mu, textTransform: "uppercase" }}>{label}</div>
                  </div>
                ))}
              </div>
            ) : null}

            {adding ? (
              <div style={{ background: C.cr, borderRadius: 12, padding: "16px", marginBottom: 14, border: "1px solid " + C.sl }}>
                <div style={{ marginBottom: 10, position: "relative" }}>
                  <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu, marginBottom: 3 }}>What did you eat?</div>
                  <input
                    type="text"
                    value={d.name}
                    onChange={(e) => {
                      setD((x) => ({ ...x, name: e.target.value }));
                      setShowSuggest(true);
                    }}
                    onFocus={() => setShowSuggest(true)}
                    placeholder="e.g. Eggs on toast — start typing for suggestions"
                    style={{ width: "100%", padding: "8px", borderRadius: 7, border: "1px solid " + C.sl, fontFamily: "Inter,sans-serif", fontSize: 13, boxSizing: "border-box", outline: "none" }}
                  />
                  {showSuggest && foodMatches.length > 0 ? (
                    <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: C.wh, border: "1px solid " + C.sl, borderRadius: 8, marginTop: 4, zIndex: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                      {foodMatches.map((f) => (
                        <div key={f.name} onClick={() => pickFood(f)} style={{ padding: "9px 12px", borderBottom: "1px solid " + C.sl, cursor: "pointer" }}>
                          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, fontWeight: 600, color: C.ch }}>{f.name}</div>
                          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 10, color: C.mu }}>
                            {f.kcal} kcal · P{f.protein} C{f.carbs} F{f.fat}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                  {d.kcal ? <div style={{ fontFamily: "Inter,sans-serif", fontSize: 10, color: C.sg, marginTop: 4 }}>Macros autofilled — edit any value below if needed.</div> : null}
                </div>
                {mealFields.slice(1).map(([label, key, type, ph]) => (
                  <div key={key} style={{ marginBottom: 10 }}>
                    <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu, marginBottom: 3 }}>{label}</div>
                    {type === "textarea" ? (
                      <textarea value={d[key]} onChange={(e) => setD((x) => ({ ...x, [key]: e.target.value }))} placeholder={ph} rows={2} style={{ width: "100%", padding: "8px", borderRadius: 7, border: "1px solid " + C.sl, fontFamily: "Inter,sans-serif", fontSize: 13, resize: "none", boxSizing: "border-box", outline: "none" }} />
                    ) : (
                      <input type={type} value={d[key]} onChange={(e) => setD((x) => ({ ...x, [key]: e.target.value }))} placeholder={ph} style={{ width: "100%", padding: "8px", borderRadius: 7, border: "1px solid " + C.sl, fontFamily: "Inter,sans-serif", fontSize: 13, boxSizing: "border-box", outline: "none" }} />
                    )}
                  </div>
                ))}
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={addMeal} style={{ flex: 2, padding: "10px", borderRadius: 8, background: C.gd, color: C.cr, border: "none", fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                    Log meal
                  </button>
                  <button onClick={() => setAdding(false)} style={{ flex: 1, padding: "10px", borderRadius: 8, background: "transparent", color: C.mu, border: "1px solid " + C.sl, fontFamily: "Inter,sans-serif", fontSize: 12, cursor: "pointer" }}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => setAdding(true)} style={{ width: "100%", padding: "13px", borderRadius: 12, background: C.gd, color: C.cr, border: "none", fontFamily: "Inter,sans-serif", fontSize: 14, fontWeight: 700, cursor: "pointer", marginBottom: 14 }}>
                + Log a meal
              </button>
            )}

            {meals.map((m) => (
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
            ))}
          </div>
        ) : null}

        {tab === "discover" ? (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 14 }}>
              <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.mu, lineHeight: 1.5 }}>{viewingSaved ? "Recipes you've saved." : "Tell us the goal and we'll find meals that fit — not the whole library, just what makes sense today."}</div>
              <button onClick={() => setViewingSaved(!viewingSaved)} style={{ flexShrink: 0, padding: "6px 12px", borderRadius: 16, border: "1px solid " + (viewingSaved ? C.go : C.sl), background: viewingSaved ? "rgba(200,169,106,0.15)" : "transparent", color: viewingSaved ? C.go : C.mu, fontFamily: "Inter,sans-serif", fontSize: 11, cursor: "pointer", whiteSpace: "nowrap" }}>
                {viewingSaved ? "← Discover" : `★ Saved (${savedRecipeIds.length})`}
              </button>
            </div>
            {viewingSaved ? (
              savedRecipes.length > 0 ? (
                savedRecipes.map((r) => <RecipeCard key={r.id} recipe={r} onOpen={setOpenRecipe} saved onToggleSave={toggleSaveRecipe} />)
              ) : (
                <div style={{ textAlign: "center", padding: "32px 0" }}>
                  <div style={{ fontFamily: "'Georgia',serif", fontSize: 15, color: C.gd, marginBottom: 6 }}>Nothing saved yet.</div>
                  <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.mu }}>Tap the star on any recipe to keep it here.</div>
                </div>
              )
            ) : (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
                  {GOALS.map((g) => {
                    const display = GOAL_DISPLAY[g.name] || { label: g.name, icon: "◎" };
                    const active = discoverGoal === g.name;
                    return (
                      <button key={g.name} onClick={() => setDiscoverGoal(g.name)} style={{ background: active ? "rgba(200,169,106,0.15)" : C.wh, border: "1px solid " + (active ? C.go : C.sl), borderRadius: 14, padding: 14, textAlign: "left", cursor: "pointer" }}>
                        <div style={{ fontSize: 18, color: C.go, marginBottom: 4 }}>{display.icon}</div>
                        <div style={{ fontFamily: "'Georgia',serif", fontSize: 13, color: active ? C.go : C.gd }}>{display.label}</div>
                      </button>
                    );
                  })}
                </div>
                {discoverGoal ? (
                  <>
                    <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu, marginBottom: 6 }}>What's today look like? (optional)</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                      {Object.entries(SITUATION_FILTERS).map(([id, f]) => (
                        <button key={id} onClick={() => setSituation(id === situation ? null : id)} style={{ padding: "6px 12px", borderRadius: 16, border: "1px solid " + (situation === id ? C.go : C.sl), background: situation === id ? "rgba(200,169,106,0.1)" : "transparent", color: situation === id ? C.go : C.mu, fontFamily: "Inter,sans-serif", fontSize: 11, cursor: "pointer" }}>
                          {f.label}
                        </button>
                      ))}
                    </div>
                    <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu, marginBottom: 6 }}>Dietary preference (optional)</div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                      {DIETS.map((dt) => (
                        <button key={dt} onClick={() => setDiet(dt === diet ? null : dt)} style={{ padding: "6px 14px", borderRadius: 16, border: "1px solid " + (diet === dt ? C.gd : C.sl), background: diet === dt ? C.gd : "transparent", color: diet === dt ? C.cr : C.mu, fontFamily: "Inter,sans-serif", fontSize: 12, cursor: "pointer" }}>
                          {dt}
                        </button>
                      ))}
                    </div>
                    <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu, marginBottom: 6 }}>What's already in your kitchen? (optional)</div>
                    <input value={pantryText} onChange={(e) => setPantryText(e.target.value)} placeholder="e.g. chicken, rice, eggs" style={{ width: "100%", padding: "9px", borderRadius: 7, border: "1px solid " + C.sl, fontFamily: "Inter,sans-serif", fontSize: 13, boxSizing: "border-box", outline: "none", marginBottom: 16 }} />
                    <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.mu, marginBottom: 12 }}>
                      {discoverResults.length} meals that fit{pantryItems.length ? " — prioritising what you have" : ""}
                    </div>
                    {discoverResults.map((r) => (
                      <RecipeCard key={r.id} recipe={r} onOpen={setOpenRecipe} saved={savedRecipeIds.includes(r.id)} onToggleSave={toggleSaveRecipe} />
                    ))}
                  </>
                ) : null}
              </>
            )}
            {shoppingList.length > 0 ? (
              <div onClick={() => setShowList(!showList)} style={{ position: "fixed", bottom: 230, left: "50%", transform: "translateX(-50%)", background: C.gd, color: C.cr, padding: "12px 20px", borderRadius: 30, fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 600, boxShadow: "0 4px 16px rgba(0,0,0,0.2)", cursor: "pointer", zIndex: 90 }}>
                {shoppingList.length} item{shoppingList.length > 1 ? "s" : ""} on your list — tap to view
              </div>
            ) : null}
            {showList ? (
              <div style={{ position: "fixed", inset: 0, background: "rgba(26,74,46,0.5)", display: "flex", alignItems: "flex-end", zIndex: 250 }} onClick={() => setShowList(false)}>
                <div style={{ background: C.cr, width: "100%", maxWidth: 420, margin: "0 auto", maxHeight: "75vh", overflowY: "auto", borderRadius: "20px 20px 0 0", padding: 24 }} onClick={(e) => e.stopPropagation()}>
                  <div style={{ fontFamily: "'Georgia',serif", fontSize: 20, color: C.gd, marginBottom: 4 }}>Shopping List</div>
                  <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu, marginBottom: 16 }}>Quantities are estimated, not exact — check before you shop.</div>
                  {groupedList.map((group) => (
                    <div key={group.aisle} style={{ marginBottom: 16 }}>
                      <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, letterSpacing: 1, color: C.go, textTransform: "uppercase", marginBottom: 8 }}>{group.aisle}</div>
                      {group.items.map((item) => (
                        <div key={item.label} style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: C.ch, padding: "6px 0", borderBottom: "1px solid " + C.sl }}>
                          {item.label}
                          {item.unit ? <span style={{ color: C.mu }}> · ~{item.unit}</span> : null}
                        </div>
                      ))}
                    </div>
                  ))}
                  <button onClick={() => setShowList(false)} style={{ width: "100%", padding: 13, borderRadius: 10, background: C.gd, color: C.cr, border: "none", fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 700, cursor: "pointer", marginTop: 8 }}>
                    Close
                  </button>
                </div>
              </div>
            ) : null}
            {openRecipe ? <RecipeDetail recipe={openRecipe} onClose={() => setOpenRecipe(null)} onAddToList={addToList} saved={savedRecipeIds.includes(openRecipe.id)} onToggleSave={toggleSaveRecipe} /> : null}
          </div>
        ) : null}

        {tab === "macros" ? (
          macros ? (
            <div>
              <div style={{ background: C.cr, borderRadius: 12, padding: "16px", marginBottom: 14, border: "1px solid " + C.sl }}>
                <div style={{ fontSize: 10, letterSpacing: 1.5, color: C.mu, fontFamily: "Inter,sans-serif", fontWeight: 600, textTransform: "uppercase", marginBottom: 10 }}>Daily Targets (estimated)</div>
                <div style={{ display: "flex", justifyContent: "space-around", textAlign: "center", marginBottom: 10 }}>
                  {(
                    [
                      ["Calories", tdee, "kcal"],
                      ["Protein", macros.p, "g"],
                      ["Carbs", macros.c, "g"],
                      ["Fat", macros.f, "g"],
                    ] as [string, number, string][]
                  ).map(([label, v, u]) => (
                    <div key={label}>
                      <div style={{ fontFamily: "'Georgia',serif", fontSize: 22, color: C.gd }}>{v}</div>
                      <div style={{ fontFamily: "Inter,sans-serif", fontSize: 9, color: C.mu, textTransform: "uppercase" }}>{label}</div>
                      <div style={{ fontFamily: "Inter,sans-serif", fontSize: 10, color: C.sg }}>{u}</div>
                    </div>
                  ))}
                </div>
                <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu }}>Estimated for moderate activity. Consult a dietitian for precision.</div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <div onClick={() => setShowMacroEdu(!showMacroEdu)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", padding: "11px 14px", background: C.wh, border: "1px solid " + C.sl, borderRadius: 10 }}>
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
                  {(
                    [
                      ["Calories", totK, tdee, "kcal"],
                      ["Protein", totP, macros.p, "g"],
                      ["Carbs", totC, macros.c, "g"],
                      ["Fat", totF, macros.f, "g"],
                    ] as [string, number, number, string][]
                  ).map(([label, v, t, u]) => {
                    const pct = Math.min((v / t) * 100, 100);
                    return (
                      <div key={label} style={{ marginBottom: 10 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                          <span style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.ch }}>{label}</span>
                          <span style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.mu }}>
                            {v}/{t}
                            {u}
                          </span>
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
          ) : (
            (() => {
              const missing: string[] = [];
              if (!bodyStats?.weight) missing.push("weight");
              if (!bodyStats?.height) missing.push("height");
              if (!bodyStats?.age) missing.push("age");
              return (
                <div style={{ textAlign: "center", padding: "32px 0" }}>
                  <div style={{ fontFamily: "'Georgia',serif", fontSize: 16, color: C.gd, marginBottom: 8 }}>Add a few details for personalized targets.</div>
                  <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.mu, marginBottom: 4 }}>Still missing: {missing.join(", ")}.</div>
                  <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu, marginBottom: 18 }}>Used only for the calorie/macro formula — nothing else.</div>
                  <button onClick={() => setScreen("profile")} style={{ padding: "11px 22px", borderRadius: 10, background: C.gd, color: C.cr, border: "none", fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                    Add in Profile →
                  </button>
                </div>
              );
            })()
          )
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
