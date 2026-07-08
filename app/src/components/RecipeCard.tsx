import { C } from "../theme";
import type { ScoredRecipe } from "../engines/recipe-engine";

export function BadgePill({ text }: { text: string }) {
  return (
    <span style={{ fontFamily: "Inter,sans-serif", fontSize: 10, color: C.go, background: "rgba(200,169,106,0.12)", border: "1px solid rgba(200,169,106,0.3)", borderRadius: 12, padding: "3px 9px", marginRight: 5, marginBottom: 5, display: "inline-block" }}>
      {text}
    </span>
  );
}

export function RecipeCard({ recipe, onOpen, saved, onToggleSave }: { recipe: ScoredRecipe; onOpen: (r: ScoredRecipe) => void; saved?: boolean; onToggleSave?: (r: ScoredRecipe) => void }) {
  return (
    <div onClick={() => onOpen(recipe)} style={{ background: C.wh, border: "1px solid " + C.sl, borderRadius: 14, padding: 16, marginBottom: 12, cursor: "pointer", position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div style={{ fontFamily: "'Georgia',serif", fontSize: 16, color: C.gd, maxWidth: 200 }}>{recipe.name}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu, whiteSpace: "nowrap" }}>{recipe.totalMin} min</div>
          {onToggleSave ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave(recipe);
              }}
              aria-label={saved ? "Remove from saved recipes" : "Save recipe"}
              style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontSize: 18, color: saved ? C.go : C.sl, lineHeight: 1 }}
            >
              {saved ? "★" : "☆"}
            </button>
          ) : null}
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", marginBottom: 8 }}>
        {recipe._badges.map((b) => (
          <BadgePill key={b} text={b} />
        ))}
      </div>
      <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.mu, display: "flex", gap: 14 }}>
        {/* "~" matches the estimated-nutrition disclosure on the detail view (nutritionSource: "estimated") — the card is the first place this data appears and shouldn't imply more precision than the detail view does. */}
        <span>~{recipe.calories} kcal</span>
        <span>~{recipe.protein}g protein</span>
        <span>${recipe.costPerServe.toFixed(2)}/serve</span>
      </div>
    </div>
  );
}
