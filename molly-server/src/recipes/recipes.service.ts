import {
  HttpCode,
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable, lastValueFrom } from 'rxjs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

interface IRecipesGRPCService {
  GetRecipeWithURL(data: { recipe_url: string }): Observable<any>;
  CreateRecipe(data: {
    recipe_url: string;
    title: string;
    description: string;
    cuisine: string;
    cooking_method: string;
    category: string;
    image_url: string;
    yields: string;
    prep_time_minutes: number;
    cook_time_minutes: number;
    total_time_minutes: number;
    ingredients: {
      full_text: string;
      is_optional: boolean;
      name: string;
      quantity: number;
      quantity_string: string;
      unit: string;
      size: string;
      ingredient_group: string;
    }[];
    instructions: {
      index: number;
      full_text: string;
      has_timer: boolean;
      timers: {
        value: number;
        unit: string;
      }[];
    }[];
  }): Observable<any>;
  GetRecipeWithID(data: { id: string }): Observable<any>;
  SearchRecipes(data: {
    query: string;
    page: number;
    results_per_page: number;
  }): Observable<any>;
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

  getRecipeWithURL(url: string): Promise<any> {
    return lastValueFrom(
      this.recipesService.GetRecipeWithURL({ recipe_url: url }),
    );
  }

  getRecipeWithID(id: string): Promise<any> {
    return lastValueFrom(this.recipesService.GetRecipeWithID({ id }));
  }

  searchRecipes(query: string, page: number): Promise<any> {
    return lastValueFrom(
      this.recipesService.SearchRecipes({
        query,
        page,
        results_per_page: 6,
      }),
    );
  }

  async cacheRecipe(res: any, url: string) {
    try {
      const key = `recipe.${url}`;
      await this.cacheManager.set(key, res);
    } catch (err) {
      console.error(`Error caching recipe: ${err}`);
    }
  }

  async checkCache(id: string): Promise<any> {
    const key = `recipe.${id}`;
    return await this.cacheManager.get(key);
  }

  @HttpCode(200)
  recipeFound(recipe: any) {
    return { status: 'OK', recipe };
  }

  @HttpCode(404)
  recipeNotFound() {
    throw new NotFoundException({ status: 'Not found' });
  }

  @HttpCode(409)
  recipeInvalidID() {
    return { status: 'Invalid ID' };
  }

  @HttpCode(500)
  recipeInternalServerError() {
    return { status: 'Internal server error' };
  }
}
