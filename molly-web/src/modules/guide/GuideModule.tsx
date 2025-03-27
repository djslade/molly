import { useState } from "react";
import { Recipe } from "../../types/recipe";
import { Steps } from "../../types/steps";
import { IngredientsPanel } from "./components/IngredientsPanel";
import { InstructionsPanek } from "./components/InstructionsPanek";
import { OverviewPanel } from "./components/OverviewPanel";

export const GuideModule = () => {
  const [recipeData] = useState<Recipe | undefined>();

  const [guideStep, setGuideStep] = useState<Steps>(Steps.Start);

  const changeStep = (step: Steps) => {
    return () => {
      setGuideStep(step);
    };
  };

  return (
    <>
      {guideStep === Steps.Start && (
        <OverviewPanel
          recipeData={recipeData}
          next={changeStep(Steps.Instructions)}
        />
      )}
      {guideStep === Steps.Ingredients && (
        <IngredientsPanel
          recipeData={recipeData}
          prev={changeStep(Steps.Start)}
          next={changeStep(Steps.Instructions)}
        />
      )}
      {guideStep === Steps.Instructions && (
        <InstructionsPanek
          recipeData={recipeData}
          prev={changeStep(Steps.Ingredients)}
          next={changeStep(Steps.Finished)}
        />
      )}
    </>
  );
};
