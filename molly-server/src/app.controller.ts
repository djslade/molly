import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy, EventPattern, Payload } from '@nestjs/microservices';
import { ScraperGateway } from './scraper/scraper.gateway';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly scraperGateway: ScraperGateway,
    @Inject('CACHE_SERVICE') private readonly cacheService: ClientProxy,
  ) {}

  @EventPattern(undefined)
  handleScraperResults(
    @Payload() data: { recipe_url: string; status: string },
  ) {
    try {
      this.scraperGateway.handleScrapeResult(data.recipe_url, data.status);
    } catch (error) {
      console.log(data);
      console.error(error);
    }
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
