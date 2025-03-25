import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable, lastValueFrom } from 'rxjs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

type GRPCRecipe = {
  id: string;
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
  created: string;
  ingredients: {
    id: string;
    recipe_id: string;
    full_text: string;
    is_optional: boolean;
    name: string;
    quantity: number;
    quantity_string: string;
    unit: string;
    size: string;
    ingredient_group: string;
    created: string;
  }[];
  instructions: {
    id: string;
    recipe_id: string;
    index: number;
    full_text: string;
    has_timer: boolean;
    created: string;
    timers: {
      id: string;
      instruction_id: string;
      value: number;
      unit: string;
      created: string;
    }[];
  }[];
};

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

  findOne(id: string) {
    return `This action returns a ${id} recipe`;
  }

  getRecipeWithURL(url: string): Promise<any> {
    return lastValueFrom(
      this.recipesService.GetRecipeWithURL({ recipe_url: url }),
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

  async checkCache(url: string): Promise<any> {
    const key = `recipe.${url}`;
    return await this.cacheManager.get(key);
  }
}
