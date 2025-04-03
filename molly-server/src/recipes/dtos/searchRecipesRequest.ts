import { Type } from 'class-transformer';

export class SearchRecipesRequestDto {
  query: string = '';

  @Type(() => Number)
  page: number = 1;

  @Type(() => Number)
  results_per_page: number = 6;
}
