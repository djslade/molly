import { Expose } from 'class-transformer';
import { IsUrl } from 'class-validator';

export class RecipeUrlDto {
  @Expose({ name: 'url' })
  @IsUrl({}, { message: 'Please provide a valid URL' })
  recipe_url: string;
}
