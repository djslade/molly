import { GuidePanel } from "@/types/guidePanel";
import { PrevPanel } from "@/types/prevPanel";
import { NextPanel } from "@/types/nextPanel";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface InstructionssPanelProps extends GuidePanel, PrevPanel, NextPanel {}

export const InstructionsPanel = ({
  recipeData,
  prev,
  next,
}: InstructionssPanelProps) => {
  return (
    <Card>
      <CardTitle>Step 2: Gather the ingredients</CardTitle>
      {recipeData && (
        <div>
          {recipeData.instructions.map((instruction) => (
            <div key={instruction.id}>
              <span>{instruction.full_text}</span>
            </div>
          ))}
        </div>
      )}
      <Button onClick={next}>Back</Button>
      <Button onClick={prev}>Next</Button>
    </Card>
  );
};
