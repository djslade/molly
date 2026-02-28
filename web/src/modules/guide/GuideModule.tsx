import { useState } from "react";
import { Steps } from "../../types/steps";
import { IngredientsPanel } from "./components/IngredientsPanel";
import { InstructionsPanel } from "./components/InstructionsPanel";
import { OverviewPanel } from "./components/OverviewPanel";
import { RecipeData } from "@/types/recipeData";

interface GuideModuleProps {
  recipeData: RecipeData;
}

export const GuideModule = ({ recipeData }: GuideModuleProps) => {
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
          next={changeStep(Steps.Ingredients)}
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
        <InstructionsPanel
          recipeData={recipeData}
          prev={changeStep(Steps.Ingredients)}
          next={changeStep(Steps.Finished)}
        />
      )}
    </>
  );
};
