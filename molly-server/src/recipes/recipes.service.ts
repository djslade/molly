import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { GetRecipeWithURLRequestDto } from './dtos/getRecipeWithURLRequest';
import { GetRecipeWithIDRequestDto } from './dtos/getRecipeWithIDRequest';
import { SearchRecipesRequestDto } from './dtos/searchRecipesRequest';
import { SearchRecipesResponseDto } from './dtos/searchRecipesResponse';
import { RecipeResponseDto } from './dtos/recipeResponse';
import { plainToInstance } from 'class-transformer';
import { handleGrpcException } from 'src/common/grpc/handleRpcException.util';
import { RecipeIdResponseDto } from './dtos/recipeIdResponseDto';
import { IRecipesGRPCService } from './interfaces/recipesGrpcService';

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

  async getRecipeWithURL(
    request: GetRecipeWithURLRequestDto,
  ): Promise<RecipeIdResponseDto> {
    try {
      return plainToInstance(
        RecipeIdResponseDto,
        await lastValueFrom(this.recipesService.GetRecipeWithURL(request)),
      );
    } catch (err) {
      throw handleGrpcException(err as Error);
    }
  }

  async getRecipeWithID(request: GetRecipeWithIDRequestDto) {
    try {
      return plainToInstance(
        RecipeResponseDto,
        await lastValueFrom(this.recipesService.GetRecipeWithID(request)),
      );
    } catch (err) {
      throw handleGrpcException(err as Error);
    }
  }

  async searchRecipes(request: SearchRecipesRequestDto) {
    try {
      return plainToInstance(
        SearchRecipesResponseDto,
        await lastValueFrom(this.recipesService.SearchRecipes(request)),
      );
    } catch (err) {
      throw handleGrpcException(err as Error);
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

  async checkCache(id: string): Promise<RecipeResponseDto | null> {
    const key = `recipe.${id}`;
    return await this.cacheManager.get(key);
  }
}
