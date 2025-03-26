import { useState } from "react";
import { Recipe } from "./types/recipe";
import { GetRecipe } from "./components/GetRecipe";
import { Steps } from "./types/steps";
import { IngredientsPanel } from "./components/IngredientsPanel";

export const Guide = () => {
  const [recipeData, setRecipeData] = useState<Recipe | null>(null);

  const [guideStep, setGuideStep] = useState<Steps>(Steps.Start);

  const getRecipeNext = () => {
    setGuideStep(Steps.Ingredients);
  };

  return (
    <>
      {guideStep === Steps.Start && (
        <GetRecipe setRecipeData={setRecipeData} next={getRecipeNext} />
      )}
      {guideStep === Steps.Ingredients && (
        <IngredientsPanel recipeData={recipeData} />
      )}
    </>
  );
};
