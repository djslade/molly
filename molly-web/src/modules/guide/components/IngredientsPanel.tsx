import { Recipe } from "../types/recipe";

interface IngredientsPanelProps {
  recipeData: Recipe | null;
}

export const IngredientsPanel = ({ recipeData }: IngredientsPanelProps) => {
  return (
    <section>
      <h1 className="font-bold text-3xl">Step 2: Gather the ingredients</h1>
      {recipeData && (
        <div>
          {recipeData.ingredients.map((ingredient) => (
            <div>
              <span key={ingredient.id}>{ingredient.full_text}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
