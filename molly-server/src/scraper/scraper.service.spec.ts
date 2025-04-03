import { Test, TestingModule } from '@nestjs/testing';
import { ScraperService } from './scraper.service';
import { PubsubModule } from 'src/pubsub/pubsub.module';
import { ScraperController } from './scraper.controller';
import { RecipesModule } from 'src/recipes/recipes.module';
import { ScraperGateway } from './scraper.gateway';

describe('ScraperService', () => {
  let service: ScraperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PubsubModule, RecipesModule],
      controllers: [ScraperController],
      providers: [ScraperService, ScraperGateway],
      exports: [ScraperService],
    }).compile();

    service = module.get<ScraperService>(ScraperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
