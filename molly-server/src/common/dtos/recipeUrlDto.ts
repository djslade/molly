import { Expose } from 'class-transformer';
import { IsUrl } from 'class-validator';

export class RecipeUrlDto {
  @Expose({ name: 'recipeURL' })
  @IsUrl()
  recipe_url: string;
}
