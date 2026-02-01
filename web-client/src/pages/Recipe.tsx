import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { Loading } from "./Loading";
import { NotFound } from "./NotFound";
import { getServerURL } from "@/utils/getServerUrl";
import { GetRecipeResponse } from "@/types/getRecipeResponse";

export const Recipe = () => {
  const { id } = useParams();
  const { isPending, error, data } = useQuery({
    queryKey: [`recipe-${id}`],
    retry: false,
    queryFn: async () => {
      const response = await fetch(`${getServerURL()}/recipes/${id}`);
      if (!response.ok) {
        throw new Error("Could not get recipe");
      }
      const res: GetRecipeResponse = await response.json();
      return res;
    },
  });

  if (isPending) return <Loading />;

  if (error) return <NotFound />;

  return (
    <>
      <main className="min-h-[calc(100vh-80px)] bg-amber-50 flex flex-col items-center py-6 px-3">
        <Card className="max-w-4xl w-full">
          <CardHeader className="flex flex-col w-full lg:grid-cols-6 lg:grid gap-6">
            <div className="col-span-4 flex flex-col sm:grid sm:grid-cols-4 gap-6">
              <img
                src={data.recipe.imageURL}
                alt={data.recipe.title}
                className="w-full h-60 sm:h-auto sm:aspect-square object-cover shadow-lg rounded-lg col-span-1 shrink-0"
              />
              <div className="flex flex-col gap-3 col-span-3">
                <CardTitle className="text-2xl">{data.recipe.title}</CardTitle>
                <CardDescription className="">
                  {data.recipe.description}
                </CardDescription>
              </div>
            </div>
            <div className="lg:flex lg:flex-col col-span-2 w-full items-center gap-6 lg:items-start justify-center lg:justify-start hidden">
              <div className="flex h-10 items-center space-x-4 text-sm justify-self-end">
                <div className="flex flex-col gap-2">
                  <CardTitle>Prep time</CardTitle>
                  <CardDescription>
                    {data.recipe.prepTimeMinutes} min
                  </CardDescription>
                </div>
                <Separator orientation="vertical" />
                <div className="flex flex-col gap-2">
                  <CardTitle>Cook time</CardTitle>
                  <CardDescription>
                    {data.recipe.cookTimeMinutes} min
                  </CardDescription>
                </div>
                <Separator orientation="vertical" />
                <div className="flex flex-col gap-2">
                  <CardTitle>Total time</CardTitle>
                  <CardDescription>
                    {data.recipe.totalTimeMinutes} min
                  </CardDescription>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                {data.recipe.yields && (
                  <CardDescription>
                    <span className="font-medium">Yields: </span>{" "}
                    {data.recipe.yields}
                  </CardDescription>
                )}
                {data.recipe.cuisine && (
                  <CardDescription>
                    <span className="font-medium">Cuisine: </span>
                    {data.recipe.cuisine}
                  </CardDescription>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-6 w-full">
              <div className="flex-1">
                <CardTitle className="text-2xl">Ingredients</CardTitle>
                <div className="flex flex-col gap-1 py-3">
                  {data.recipe.ingredients.map((ingredient) => (
                    <div
                      key={ingredient.id}
                      className="flex flex-col gap-2 py-1"
                    >
                      <p className="text-md text-neutral-500">
                        {ingredient.fullText}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-2">
                <CardTitle className="text-2xl">Instructions</CardTitle>
                <div className="flex flex-col gap-3 w-full py-3">
                  {data.recipe.instructions.map((instruction) => (
                    <div key={instruction.id} className="flex gap-3">
                      <span>{instruction.index}</span>
                      <div className="">
                        <CardDescription className="text-md">
                          {instruction.fullText}
                        </CardDescription>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
};
