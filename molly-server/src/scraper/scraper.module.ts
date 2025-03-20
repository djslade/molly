import { Module } from '@nestjs/common';
import { ScraperGateway } from './scraper.gateway';
import { PubsubModule } from 'src/pubsub/pubsub.module';

@Module({
  imports: [PubsubModule],
  providers: [ScraperGateway],
  exports: [ScraperGateway],
})
export class ScraperModule {}
