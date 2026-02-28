import { Module } from '@nestjs/common';
import { RecipesModule } from './recipes/recipes.module';
import { PubsubModule } from './pubsub/pubsub.module';
import { ScraperModule } from './scraper/scraper.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [RecipesModule, PubsubModule, ScraperModule, UsersModule],
})
export class AppModule {}
