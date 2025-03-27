import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { RecipesService } from 'src/recipes/recipes.service';
import { ScraperService } from './scraper.service';

@Controller()
export class ScraperController {
  constructor(
    private readonly recipeService: RecipesService,
    private readonly scraperService: ScraperService,
  ) {}
  @EventPattern('scraper.results.ok')
  async handleScraperOK(@Payload() data: { url: string }): Promise<void> {
    const { url } = data;
    const res = await this.recipeService.getRecipeWithURL(url);
    await this.recipeService.cacheRecipe(res, url);
    return this.scraperService.sendResult(url, res);
  }

  @EventPattern('scraper.results.invalid')
  handleScraperInvalid() {
    // This pattern indicates that the URL is not defined properly in the request body.
    console.error('Scraper service indicated that a request was invalid.');
  }

  @EventPattern('scraper.results.fail')
  handleScraperFail(@Payload() url: string) {
    const res = this.scraperService.newScraperResult('Could not scrape recipe');
    return this.scraperService.sendResult(url, res);
  }

  @EventPattern('scraper.results.unknown')
  handleScraperUnknown(@Payload() url: string) {
    console.log('An unknown error occurred in the scraper or recipe service.');
    const res = this.scraperService.newScraperResult('Internal service error');
    return this.scraperService.sendResult(url, res);
  }

  @EventPattern('scraper.results.internal')
  handleScraperInternalError(@Payload() url: string) {
    console.error(
      'An internal error occurred in the scraper or recipe service.',
    );
    const res = this.scraperService.newScraperResult('Internal service error');
    return this.scraperService.sendResult(url, res);
  }

  @EventPattern('scraper.results.unavailable')
  handleScraperUnavailable(@Payload() url: string) {
    console.error('The recipe service appears to be unavailable.');
    const res = this.scraperService.newScraperResult(
      'The recipe service is unavailable',
    );
    return this.scraperService.sendResult(url, res);
  }
}
