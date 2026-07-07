import { C } from "../theme";
import type { ScoredRecipe } from "../engines/recipe-engine";

export function BadgePill({ text }: { text: string }) {
  return (
    <span style={{ fontFamily: "Inter,sans-serif", fontSize: 10, color: C.go, background: "rgba(200,169,106,0.12)", border: "1px solid rgba(200,169,106,0.3)", borderRadius: 12, padding: "3px 9px", marginRight: 5, marginBottom: 5, display: "inline-block" }}>
      {text}
    </span>
  );
}

export function RecipeCard({ recipe, onOpen }: { recipe: ScoredRecipe; onOpen: (r: ScoredRecipe) => void }) {
  return (
    <div onClick={() => onOpen(recipe)} style={{ background: C.wh, border: "1px solid " + C.sl, borderRadius: 14, padding: 16, marginBottom: 12, cursor: "pointer" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div style={{ fontFamily: "'Georgia',serif", fontSize: 16, color: C.gd, maxWidth: 240 }}>{recipe.name}</div>
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu, whiteSpace: "nowrap" }}>{recipe.totalMin} min</div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", marginBottom: 8 }}>
        {recipe._badges.map((b) => (
          <BadgePill key={b} text={b} />
        ))}
      </div>
      <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.mu, display: "flex", gap: 14 }}>
        <span>{recipe.calories} kcal</span>
        <span>{recipe.protein}g protein</span>
        <span>${recipe.costPerServe.toFixed(2)}/serve</span>
      </div>
    </div>
  );
}
