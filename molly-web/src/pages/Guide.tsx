import { GuideModule } from "@/modules/guide/GuideModule";
import { GetRecipeResponse } from "@/types/getRecipeResponse";
import { RecipeData } from "@/types/recipeData";
import { getServerURL } from "@/utils/getServerUrl";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";

export const Guide = () => {
  const { id } = useParams();
  const { isPending, error, data } = useQuery({
    queryKey: [`recipe-${id}`],
    queryFn: async () => {
      const response = await fetch(`${getServerURL()}/recipes/${id}`);
      const data: GetRecipeResponse = await response.json();
      return data.recipe as RecipeData;
    },
  });

  if (isPending) return "Loading...";

  if (error) return "Error!" + error.message;
  return (
    <>
      <main className="min-h-[calc(100vh-80px)] bg-amber-50 flex flex-col items-center py-6 px-3">
        <GuideModule recipeData={data} />
      </main>
    </>
  );
};
