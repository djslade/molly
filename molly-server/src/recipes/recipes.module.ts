import { Module } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';
import { PubSubModule } from 'src/pubsub.module';
import { RecipesGateway } from './recipes.gateway';

@Module({
  imports: [PubSubModule],
  controllers: [RecipesController],
  providers: [RecipesService, RecipesGateway, RecipesGateway],
})
export class RecipesModule {}
