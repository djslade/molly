import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class PubsubService {
  constructor(
    @Inject('SCRAPER_REQUESTS') private readonly scraperRequests: ClientProxy,
  ) {}

  async sendScraperRequest(data: any) {
    try {
      return this.scraperRequests.emit('scraper.requests', data);
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
