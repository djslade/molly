import { Module } from '@nestjs/common';
import { ScraperGateway } from './scraper.gateway';
import { PubsubModule } from 'src/pubsub/pubsub.module';
import { CacheModule } from '@nestjs/cache-manager';
import { RecipesModule } from 'src/recipes/recipes.module';

@Module({
  imports: [PubsubModule, CacheModule.register(), RecipesModule],
  providers: [ScraperGateway],
  exports: [ScraperGateway],
})
export class ScraperModule {}
