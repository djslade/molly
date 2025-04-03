import { Inject, Injectable, OnModuleInit, UseFilters } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable, lastValueFrom } from 'rxjs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { GetRecipeWithURLRequestDto } from './dtos/getRecipeWithURLRequest';
import { GetRecipeWithIDRequestDto } from './dtos/getRecipeWithIDRequest';
import { SearchRecipesRequestDto } from './dtos/searchRecipesRequest';
import { SearchRecipesResponseDto } from './dtos/searchRecipesResponse';
import { RecipeResponseDto } from './dtos/recipeResponse';
import { plainToInstance } from 'class-transformer';
import { GrpcMethodExceptionFilter } from 'src/common/grpc/grpc.filter';
import { handleGrpcException } from 'src/common/grpc/handle-rpc-exception.util';

interface IRecipesGRPCService {
  GetRecipeWithURL(data: GetRecipeWithURLRequestDto): Observable<any>;
  GetRecipeWithID(data: GetRecipeWithIDRequestDto): Observable<any>;
  SearchRecipes(data: SearchRecipesRequestDto): Observable<any>;
}

@Injectable()
export class RecipesService implements OnModuleInit {
  constructor(
    @Inject('RECIPE_GRPC_SERVICE')
    private readonly client: ClientGrpc,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  recipesService: IRecipesGRPCService;

  onModuleInit() {
    this.recipesService =
      this.client.getService<IRecipesGRPCService>('RecipesService');
  }

  @UseFilters(new GrpcMethodExceptionFilter())
  async getRecipeWithURL(request: GetRecipeWithURLRequestDto) {
    try {
      const res = await lastValueFrom(
        this.recipesService.GetRecipeWithURL(request),
      );
      return res;
    } catch (err) {
      throw handleGrpcException(err);
    }
  }

  @UseFilters(new GrpcMethodExceptionFilter())
  async getRecipeWithID(request: GetRecipeWithIDRequestDto) {
    try {
      const res = await lastValueFrom(
        this.recipesService.GetRecipeWithID(request),
      );
      return plainToInstance(RecipeResponseDto, res);
    } catch (err) {
      throw handleGrpcException(err);
    }
  }

  async searchRecipes(request: SearchRecipesRequestDto) {
    try {
      const res = await lastValueFrom(
        this.recipesService.SearchRecipes(request),
      );
      return plainToInstance(SearchRecipesResponseDto, res);
    } catch (err) {
      throw handleGrpcException(err);
    }
  }

  async cacheRecipe(res: RecipeResponseDto, url: string) {
    try {
      const key = `recipe.${url}`;
      await this.cacheManager.set(key, res, 18400);
    } catch (err) {
      console.error(`Error caching recipe: ${err}`);
    }
  }

  async checkCache(id: string): Promise<any> {
    const key = `recipe.${id}`;
    return await this.cacheManager.get(key);
  }
}
