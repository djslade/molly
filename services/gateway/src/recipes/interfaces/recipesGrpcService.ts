import { Observable } from 'rxjs';
import { GetRecipeWithURLRequestDto } from '../dtos/getRecipeWithURLRequest';
import { GetRecipeWithIDRequestDto } from '../dtos/getRecipeWithIDRequest';
import { SearchRecipesRequestDto } from '../dtos/searchRecipesRequest';

export interface IRecipesGRPCService {
  GetRecipeWithURL(data: GetRecipeWithURLRequestDto): Observable<any>;
  GetRecipeWithID(data: GetRecipeWithIDRequestDto): Observable<any>;
  SearchRecipes(data: SearchRecipesRequestDto): Observable<any>;
}
