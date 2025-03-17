import { Controller, Get, Query } from '@nestjs/common';
import { RecipesService } from './recipes.service';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Get(':id')
  findOne(@Query('id') id: string) {
    return this.recipesService.findOne(id);
  }
}
