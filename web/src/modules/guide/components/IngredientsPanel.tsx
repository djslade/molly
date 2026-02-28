import { Button } from "@/components/ui/button";
import { PrevPanel } from "../../../types/prevPanel";
import { NextPanel } from "../../../types/nextPanel";
import { GuidePanel } from "@/types/guidePanel";
import { Card, CardTitle } from "@/components/ui/card";

interface IngredientsPanelProps extends GuidePanel, PrevPanel, NextPanel {}

export const IngredientsPanel = ({
  recipeData,
  next,
  prev,
}: IngredientsPanelProps) => {
  return (
    <Card>
      <CardTitle>Step 2: Gather the ingredients</CardTitle>
      {recipeData && (
        <div>
          {recipeData.ingredients.map((ingredient) => (
            <div key={ingredient.id}>
              <span>{ingredient.full_text}</span>
            </div>
          ))}
        </div>
      )}
      <Button onClick={next}>Back</Button>
      <Button onClick={prev}>Next</Button>
    </Card>
  );
};
