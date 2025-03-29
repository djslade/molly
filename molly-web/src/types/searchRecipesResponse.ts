import { Recipe } from "./recipe";

export type SearchRecipesResponse = {
  total: number;
  recipes: Recipe[];
};
