import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { ScraperGateway } from './scraper/scraper.gateway';
import { SubscribeMessage } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { PubsubService } from './pubsub/pubsub.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly scraperGateway: ScraperGateway,
    private readonly pubsubService: PubsubService,
  ) {}

  @MessagePattern('scrape')
  handleScraperRequests(client: Socket, payload: any) {
    this.scraperGateway.registerClient(client, payload);
    this.pubsubService.sendScraperRequest({ url: payload.url });
  }

  @MessagePattern('scraper.results')
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
