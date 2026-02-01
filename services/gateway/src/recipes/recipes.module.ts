import { Module } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';
import { RecipeGRPCModule } from './grpc/recipesGrpc.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [RecipeGRPCModule, CacheModule.register()],
  controllers: [RecipesController],
  providers: [RecipesService],
  exports: [RecipesService],
})
export class RecipesModule {}
