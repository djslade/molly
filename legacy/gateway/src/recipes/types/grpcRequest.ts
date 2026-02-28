import { GetRecipeWithIDRequestDto } from '../dtos/getRecipeWithIDRequest';
import { GetRecipeWithURLRequestDto } from '../dtos/getRecipeWithURLRequest';
import { SearchRecipesRequestDto } from '../dtos/searchRecipesRequest';

export type GrpcRequest =
  | GetRecipeWithURLRequestDto
  | GetRecipeWithIDRequestDto
  | SearchRecipesRequestDto;
