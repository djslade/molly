import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecipesModule } from './recipes/recipes.module';
import { PubsubModule } from './pubsub/pubsub.module';
import { ScraperModule } from './scraper/scraper.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [RecipesModule, PubsubModule, ScraperModule, CacheModule.register()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
