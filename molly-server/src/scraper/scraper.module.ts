import { Module } from '@nestjs/common';
import { ScraperGateway } from './scraper.gateway';
import { PubSubModule } from 'src/pubsub.module';

@Module({
  imports: [PubSubModule],
  providers: [ScraperGateway],
  exports: [ScraperGateway],
})
export class ScraperModule {}
