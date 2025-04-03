import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ScraperRequestDto } from './dtos/scraperRequest';

@Injectable()
export class PubsubService {
  constructor(
    @Inject('SCRAPER_REQUESTS') private readonly scraperRequests: ClientProxy,
  ) {}

  sendScraperRequest(request: ScraperRequestDto) {
    try {
      return this.scraperRequests.emit('scraper.requests', request);
    } catch (err) {
      console.error(err);
    }
  }

  async onApplicationBootstrap() {
    try {
      await this.scraperRequests.connect();
    } catch (err) {
      console.error(err);
    }
  }
}
