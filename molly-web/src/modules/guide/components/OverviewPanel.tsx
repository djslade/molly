import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GuidePanel } from "@/types/guidePanel";
import { NextPanel } from "@/types/nextPanel";

interface OverviewPanelProps extends GuidePanel, NextPanel {}

export const OverviewPanel = ({ recipeData, next }: OverviewPanelProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{recipeData?.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex w-full justify-between">
          {" "}
          <img
            src={recipeData?.image_url}
            className="h-80 aspect-square w-80"
          />
          <CardDescription className="max-w-prose">
            {recipeData?.description}
          </CardDescription>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={next}>Next</Button>
      </CardFooter>
    </Card>
  );
};
