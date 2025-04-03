import { Test, TestingModule } from '@nestjs/testing';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';
import { RecipeGRPCModule } from './grpc/recipesGrpc.module';
import { CacheModule } from '@nestjs/cache-manager';

describe('RecipesController', () => {
  let controller: RecipesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RecipeGRPCModule, CacheModule.register()],
      controllers: [RecipesController],
      providers: [RecipesService],
      exports: [RecipesService],
    }).compile();

    controller = module.get<RecipesController>(RecipesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
