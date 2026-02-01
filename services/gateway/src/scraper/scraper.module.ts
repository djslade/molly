import { Module } from '@nestjs/common';
import { ScraperGateway } from './scraper.gateway';
import { PubsubModule } from 'src/pubsub/pubsub.module';
import { RecipesModule } from 'src/recipes/recipes.module';
import { ScraperService } from './scraper.service';
import { ScraperController } from './scraper.controller';

@Module({
  imports: [PubsubModule, RecipesModule],
  controllers: [ScraperController],
  providers: [ScraperService, ScraperGateway],
  exports: [ScraperService],
})
export class ScraperModule {}
