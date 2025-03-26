import { Recipe } from "../types/recipe";

interface InstructionssPanelProps {
  recipeData: Recipe | null;
}

export const InstructionsPanek = ({ recipeData }: InstructionssPanelProps) => {
  return (
    <section>
      <h1 className="font-bold text-3xl">Step 3: Gather the ingredients</h1>
      {recipeData && (
        <div>
          {recipeData.instructions.map((instruction) => (
            <div>
              <span key={instruction.id}>{instruction.full_text}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
