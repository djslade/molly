import { GuideModule } from "@/modules/guide/GuideModule";
import { Header } from "@/modules/header/Header";
import { GetRecipeResponse } from "@/types/getRecipeResponse";
import { Recipe } from "@/types/recipe";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";

export const Guide = () => {
  const { id } = useParams();
  const { isPending, error, data } = useQuery({
    queryKey: [`recipe-${id}`],
    queryFn: async () => {
      const response = await fetch(`http://localhost:3000/recipes/${id}`);
      const data: GetRecipeResponse = await response.json();
      console.log(data);
      return data.recipe as Recipe;
    },
  });

  if (isPending) return "Loading...";

  if (error) return "Error!" + error.message;
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-80px)] p-6 bg-violet-50 flex flex-col items-center">
        <GuideModule recipeData={data} />
      </main>
    </>
  );
};
