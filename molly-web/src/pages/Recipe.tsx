import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Header } from "@/modules/header/Header";
import { GetRecipeResponse } from "@/types/getRecipeResponse";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";

export const Recipe = () => {
  const { id } = useParams();
  const { isPending, error, data } = useQuery({
    queryKey: [`recipe-${id}`],
    queryFn: async () => {
      const response = await fetch(`http://localhost:3000/recipes/${id}`);
      const data: GetRecipeResponse = await response.json();
      console.log(data);
      console.log(data.recipe);
      return data;
    },
  });

  if (isPending) return "Loading...";

  if (error) return "Error!" + error.message;

  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-80px)] p-6 bg-amber-50 flex flex-col items-center">
        <Card className="max-w-4xl w-full">
          <CardHeader>
            <CardTitle className="text-2xl">{data.recipe?.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-6">
              <img
                src={data.recipe?.image_url}
                className="max-w-xs rounded-lg shadow-lg"
              />
              <div className="">
                <CardDescription>
                  {data.recipe?.description || "No description available"}
                </CardDescription>
                <CardDescription>Yields: {data.recipe?.yields}</CardDescription>
                <CardDescription>
                  Cuisine: {data.recipe?.cuisine}
                </CardDescription>
                <CardDescription>
                  Time to prep: {data.recipe?.prep_time_minutes} minutes
                </CardDescription>
                <CardDescription>
                  Time to cook: {data.recipe?.cook_time_minutes} minutes
                </CardDescription>
                <CardDescription>
                  Time total: {data.recipe?.total_time_minutes} minutes
                </CardDescription>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
};
