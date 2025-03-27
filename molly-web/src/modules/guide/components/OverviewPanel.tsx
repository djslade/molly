import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { GuidePanel } from "@/types/guidePanel";
import { NextPanel } from "@/types/nextPanel";

interface OverviewPanelProps extends GuidePanel, NextPanel {}

export const OverviewPanel = ({ recipeData, next }: OverviewPanelProps) => {
  return (
    <Card>
      <CardTitle>{recipeData?.title}</CardTitle>
      <CardDescription>{recipeData?.description}</CardDescription>
      <CardFooter>
        <Button onClick={next}>Next</Button>
      </CardFooter>
    </Card>
  );
};
