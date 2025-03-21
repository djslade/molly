import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc, GrpcMethod } from '@nestjs/microservices';
import { Observable, lastValueFrom } from 'rxjs';

interface IRecipesGRPCService {
  GetRecipeWithURL(data: { recipe_url: string }): Observable<any>;
  CreateRecipe(data: {
    recipe_url: string;
    title: string;
    description: string;
    cooking_method: string;
    category: string;
    image_url: string;
    prep_time_minutes: number;
    prep_time: string;
    cook_time_minutes: number;
    cook_time: string;
    total_time_minutes: number;
    total_time: string;
    ingredients: {
      full_text: string;
      is_optional: boolean;
      name: string;
      quantity: string;
      unit: string;
      size: string;
    }[];
    instructions: {
      index: number;
      full_text: string;
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
}
