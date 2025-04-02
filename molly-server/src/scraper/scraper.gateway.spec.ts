import { Test, TestingModule } from '@nestjs/testing';
import { ScraperGateway } from './scraper.gateway';
import { PubsubModule } from 'src/pubsub/pubsub.module';
import { RecipesModule } from 'src/recipes/recipes.module';
import { ScraperController } from './scraper.controller';
import { ScraperService } from './scraper.service';

describe('ScraperGateway', () => {
  let gateway: ScraperGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PubsubModule, RecipesModule],
      controllers: [ScraperController],
      providers: [ScraperService, ScraperGateway],
      exports: [ScraperService],
    }).compile();

    gateway = module.get<ScraperGateway>(ScraperGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
