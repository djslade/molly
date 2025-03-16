import { Test, TestingModule } from '@nestjs/testing';
import { RecipesGateway } from './recipes.gateway';

describe('RecipesGateway', () => {
  let gateway: RecipesGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecipesGateway],
    }).compile();

    gateway = module.get<RecipesGateway>(RecipesGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
