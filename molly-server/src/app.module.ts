import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecipesModule } from './recipes/recipes.module';
import { PubSubModule } from './pubsub.module';

@Module({
  imports: [RecipesModule, PubSubModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
