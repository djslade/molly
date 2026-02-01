import { Type } from 'class-transformer';
import { RecipeDto } from './recipe';

export class SearchRecipesResponseDto {
  total: number;

  @Type(() => RecipeDto)
  recipes: RecipeDto[] = [];
}
