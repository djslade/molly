import { Test, TestingModule } from '@nestjs/testing';
import { ScraperController } from './scraper.controller';
import { PubsubModule } from 'src/pubsub/pubsub.module';
import { RecipesModule } from 'src/recipes/recipes.module';
import { ScraperService } from './scraper.service';
import { ScraperGateway } from './scraper.gateway';

describe('ScraperController', () => {
  let controller: ScraperController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PubsubModule, RecipesModule],
      controllers: [ScraperController],
      providers: [ScraperService, ScraperGateway],
      exports: [ScraperService],
    }).compile();

    controller = module.get<ScraperController>(ScraperController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
