import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { ClientProxy } from '@nestjs/microservices';

@Controller('recipes')
export class RecipesController {
  constructor(
    private readonly recipesService: RecipesService,
    @Inject('SCRAPER_SERVICE') private readonly scraperService: ClientProxy,
  ) {}

  @Get('')
  findOne(@Query('url') url: string) {
    this.scraperService.send('scrape_recipe', { url }).subscribe({
      next: (response) => console.log(response),
      error: (err) => console.error(err),
    });

    return 'Scraper started';
  }
}
