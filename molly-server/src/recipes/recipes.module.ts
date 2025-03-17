import { Module } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';
import { PubSubModule } from 'src/pubsub.module';

@Module({
  imports: [PubSubModule],
  controllers: [RecipesController],
  providers: [RecipesService],
})
export class RecipesModule {}
