import { Module } from '@nestjs/common';
import { ScraperGateway } from './scraper.gateway';
import { PubsubModule } from 'src/pubsub/pubsub.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [PubsubModule, CacheModule.register()],
  providers: [ScraperGateway],
  exports: [ScraperGateway],
})
export class ScraperModule {}
