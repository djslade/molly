import { RecipeData } from "./recipeData";

export type SearchRecipesResponse = {
  total: number;
  recipes: RecipeData[];
};
