import { RecipeData } from "./recipeData";

export type GetRecipeResponse = {
  status: string;
  recipe?: RecipeData;
};
