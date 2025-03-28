import { Recipe } from "./recipe";

export type GetRecipeResponse = {
  status: string;
  recipe?: Recipe;
};
