import { C } from "../theme";
import { BadgePill } from "./RecipeCard";
import type { ScoredRecipe } from "../engines/recipe-engine";

export function RecipeDetail({
  recipe,
  onClose,
  onAddToList,
  saved,
  onToggleSave,
}: {
  recipe: ScoredRecipe;
  onClose: () => void;
  onAddToList: (r: ScoredRecipe) => void;
  saved?: boolean;
  onToggleSave?: (r: ScoredRecipe) => void;
}) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(26,74,46,0.5)", display: "flex", alignItems: "flex-end", zIndex: 200 }} onClick={onClose}>
      <div style={{ background: C.cr, width: "100%", maxWidth: 420, margin: "0 auto", maxHeight: "85vh", overflowY: "auto", borderRadius: "20px 20px 0 0", padding: 24 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 18, color: C.mu, cursor: "pointer" }}>
            ✕
          </button>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 6 }}>
          <div style={{ fontFamily: "'Georgia',serif", fontSize: 24, color: C.gd }}>{recipe.name}</div>
          {onToggleSave ? (
            <button onClick={() => onToggleSave(recipe)} aria-label={saved ? "Remove from saved recipes" : "Save recipe"} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontSize: 24, color: saved ? C.go : C.sl, lineHeight: 1, flexShrink: 0 }}>
              {saved ? "★" : "☆"}
            </button>
          ) : null}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", marginBottom: 14 }}>
          {recipe._badges.map((b) => (
            <BadgePill key={b} text={b} />
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 16, background: C.ow, borderRadius: 10, padding: 12 }}>
          {(
            [
              ["Calories", recipe.calories],
              ["Protein", recipe.protein + "g"],
              ["Carbs", recipe.carbs + "g"],
              ["Fat", recipe.fat + "g"],
            ] as [string, string | number][]
          ).map(([l, v]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Georgia',serif", fontSize: 16, color: C.gd }}>{v}</div>
              <div style={{ fontFamily: "Inter,sans-serif", fontSize: 9, color: C.mu, textTransform: "uppercase" }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu, marginBottom: 4 }}>~ estimated nutrition, not yet verified against AUSNUT/FSANZ</div>
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 700, color: C.ch, marginTop: 14, marginBottom: 6 }}>What goes in it</div>
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: C.ch, lineHeight: 1.6, marginBottom: 16 }}>{recipe.ingredientPattern}</div>
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 700, color: C.ch, marginBottom: 6 }}>Method</div>
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: C.ch, lineHeight: 1.6, marginBottom: 16 }}>{recipe.method}</div>
        {recipe.notes ? <div style={{ fontFamily: "'Georgia',serif", fontSize: 13, fontStyle: "italic", color: C.sg, marginBottom: 20 }}>{recipe.notes}</div> : null}
        <button onClick={() => onAddToList(recipe)} style={{ width: "100%", padding: 14, borderRadius: 10, background: C.gd, color: C.cr, border: "none", fontFamily: "Inter,sans-serif", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
          Add to Shopping List
        </button>
      </div>
    </div>
  );
}
