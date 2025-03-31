import { Controller, Get, Param, Query } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { cachedDataVersionTag } from 'v8';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const cached = await this.recipesService.checkCache(id);
    if (cached !== null) {
      return this.recipesService.recipeFound(cached.recipe);
    }
    try {
      const res = await this.recipesService.getRecipeWithID(id);
      await this.recipesService.cacheRecipe(res, id);
      return this.recipesService.recipeFound(res.recipe);
    } catch (err) {
      return this.recipesService.recipeNotFound();
    }
  }

  @Get()
  async findAll(@Query('q') query: string, @Query('page') page: number) {
    if (!query) query = '';
    if (!page || page < 1) page = 1;
    const res = await this.recipesService.searchRecipes(query, page);
    return res;
  }
}
