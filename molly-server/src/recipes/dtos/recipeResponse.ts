import { Type } from 'class-transformer';
import { RecipeDto } from './recipe';

export class RecipeResponseDto {
  @Type(() => RecipeDto)
  recipe: RecipeDto;
}
