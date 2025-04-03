import { Controller, Get, Param, Query, UseFilters } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { SearchRecipesRequestDto } from './dtos/searchRecipesRequest';
import { GetRecipeWithIDRequestDto } from './dtos/getRecipeWithIDRequest';
import { RpcToHttpExceptionFilter } from '../common/grpc/rpcToHttp.filter';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Get(':id')
  @UseFilters(new RpcToHttpExceptionFilter())
  async findOne(@Param() request: GetRecipeWithIDRequestDto) {
    const cached = await this.recipesService.checkCache(request.id);
    if (cached !== null) {
      return cached;
    }
    const res = await this.recipesService.getRecipeWithID(request);
    await this.recipesService.cacheRecipe(res, request.id);
    return res;
  }

  @Get()
  @UseFilters(new RpcToHttpExceptionFilter())
  async findAll(@Query() queryParams: SearchRecipesRequestDto) {
    const res = await this.recipesService.searchRecipes(queryParams);
    return res;
  }
}
