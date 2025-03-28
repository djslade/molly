import { Controller, Get, Param, Query } from '@nestjs/common';
import { RecipesService } from './recipes.service';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const recipe = await this.recipesService.checkCache(id);
    if (recipe !== null) {
      return recipe;
    }
    try {
      const res = await this.recipesService.GetRecipeWithID(id);
      await this.recipesService.cacheRecipe(res, id);
      return this.recipesService.recipeFound(res);
    } catch (err) {
      return this.recipesService.recipeNotFound();
    }
  }
}
