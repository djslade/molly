import { Test, TestingModule } from '@nestjs/testing';
import { RecipesService } from './recipes.service';
import { CacheModule } from '@nestjs/cache-manager';
import { RecipeGRPCModule } from './grpc/recipes-grpc.module';
import { RecipesController } from './recipes.controller';

describe('RecipesService', () => {
  let service: RecipesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RecipeGRPCModule, CacheModule.register()],
      controllers: [RecipesController],
      providers: [RecipesService],
      exports: [RecipesService],
    }).compile();

    service = module.get<RecipesService>(RecipesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
