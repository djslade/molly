import { Test, TestingModule } from '@nestjs/testing';
import { ScraperGateway } from './scraper.gateway';

describe('ScraperGateway', () => {
  let gateway: ScraperGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScraperGateway],
    }).compile();

    gateway = module.get<ScraperGateway>(ScraperGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
