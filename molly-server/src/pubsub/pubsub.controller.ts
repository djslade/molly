import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class PubsubController {
  @EventPattern('scraper.results.error')
  handleScraperError() {
    console.log('scrape failed');
  }

  @EventPattern('scraper.results.success')
  handleScraperResults() {
    console.log('beep boop');
  }
}
