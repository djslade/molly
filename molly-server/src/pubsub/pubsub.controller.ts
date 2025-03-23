import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class PubsubController {
  @EventPattern('scraper.results')
  handleScraperResults() {
    console.log('beep boop');
  }
}
