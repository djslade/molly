import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { GetRecipeResponse } from "@/types/getRecipeResponse";
import { toTitleCase } from "@/utils/toTitleCase";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { Loading } from "./Loading";
import { NotFound } from "./NotFound";

export const Recipe = () => {
  const { id } = useParams();
  const { isPending, error, data } = useQuery({
    queryKey: [`recipe-${id}`],
    retry: false,
    queryFn: async () => {
      const response = await fetch(`http://localhost:3000/recipes/${id}`);
      if (!response.ok) {
        throw new Error("Could not get recipe");
      }
      const data = await response.json();
      const res: GetRecipeResponse = {
        status: data.status || "",
        recipe: {
          id: data.recipe.id || "",
          recipe_url: data.recipe.recipe_url || "",
          title: data.recipe.title || "",
          description: data.recipe.description || "",
          cooking_method: data.recipe.cooking_method || "",
          cuisine: data.recipe.cuisine || "",
          category: data.recipe.category || "",
          image_url: data.recipe.image_url || "",
          yields: data.recipe.yields || "",
          prep_time_minutes: data.recipe.prep_time_minutes || 0,
          cook_time_minutes: data.recipe.cook_time_minutes || 0,
          total_time_minutes: data.recipe.total_time_minutes || 0,
          ingredients: data.recipe.ingredients || [],
          instructions: data.recipe.instructions || [],
          created: data.recipe.created || "",
        },
      };
      return res;
    },
  });

  if (isPending) return <Loading />;

  if (error) return <NotFound />;

  return (
    <>
      <main className="min-h-[calc(100vh-80px)] p-6 bg-amber-50 flex flex-col items-center">
        <Card className="max-w-4xl w-full">
          <CardHeader className="w-full grid-cols-6 grid gap-6">
            <img
              src={data.recipe?.image_url}
              alt={data.recipe?.title}
              className="max-w-30 w-full aspect-square object-cover shadow-lg rounded-lg col-span-1"
            />
            <div className="flex flex-col gap-3 col-span-3">
              <CardTitle className="text-2xl">
                {toTitleCase(data.recipe?.title || "")}
              </CardTitle>
              <CardDescription>
                {data.recipe?.description || "No description available"}
              </CardDescription>
            </div>
            <div className="flex flex-col col-span-2 gap-3">
              <div className="flex h-10 items-center space-x-4 text-sm justify-self-end">
                <div className="flex flex-col gap-2">
                  <CardTitle>Prep time</CardTitle>
                  <CardDescription>
                    {data.recipe?.prep_time_minutes} min
                  </CardDescription>
                </div>
                <Separator orientation="vertical" />
                <div className="flex flex-col gap-2">
                  <CardTitle>Cook time</CardTitle>
                  <CardDescription>
                    {data.recipe?.cook_time_minutes} min
                  </CardDescription>
                </div>
                <Separator orientation="vertical" />
                <div className="flex flex-col gap-2">
                  <CardTitle>Total time</CardTitle>
                  <CardDescription>
                    {data.recipe?.total_time_minutes} min
                  </CardDescription>
                </div>
              </div>
              {data.recipe?.yields && (
                <CardDescription>
                  <span className="font-medium">Yields: </span>{" "}
                  {data.recipe?.yields}
                </CardDescription>
              )}
              {data.recipe?.cuisine && (
                <CardDescription>
                  <span className="font-medium">Cuisine: </span>
                  {data.recipe?.cuisine}
                </CardDescription>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-6 w-full">
              <div className="flex-1">
                <CardTitle className="text-2xl">Ingredients</CardTitle>
                <div className="flex flex-col gap-1 py-3">
                  {data.recipe?.ingredients.map((ingredient) => (
                    <div
                      key={ingredient.id}
                      className="flex flex-col gap-2 py-1"
                    >
                      <p className="text-md text-neutral-500">
                        {ingredient.full_text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-2">
                <CardTitle className="text-2xl">Instructions</CardTitle>
                <div className="flex flex-col gap-3 w-full py-3">
                  {data.recipe?.instructions.map((instruction) => (
                    <div key={instruction.id} className="flex gap-3">
                      <span>{instruction.index}</span>
                      <div className="">
                        <CardDescription className="text-md">
                          {instruction.full_text}
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
