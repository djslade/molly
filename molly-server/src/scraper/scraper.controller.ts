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
    const recipe = await this.recipeService.getRecipeWithURL(url);
    const res = this.scraperService.newScraperResult(recipe.id, '');
    return this.scraperService.sendResult(url, res);
  }

  @EventPattern('scraper.results.invalid')
  handleScraperInvalid() {
    // This pattern indicates that the URL is not defined properly in the request body.
    console.error('Scraper service indicated that a request was invalid.');
  }

  @EventPattern('scraper.results.fail')
  handleScraperFail(@Payload() data: { url: string }) {
    const { url } = data;

    const res = this.scraperService.newScraperResult(
      '',
      "We couldn't import a recipe from this URL",
    );
    return this.scraperService.sendResult(url, res);
  }

  @EventPattern('scraper.results.unknown')
  handleScraperUnknown(@Payload() data: { url: string }) {
    const { url } = data;

    console.error(
      'An unknown error occurred in the scraper or recipe service.',
    );
    const res = this.scraperService.newScraperResult(
      '',
      'Oops! Something went wrong with our server',
    );
    return this.scraperService.sendResult(url, res);
  }

  @EventPattern('scraper.results.internal')
  handleScraperInternalError(@Payload() data: { url: string }) {
    const { url } = data;

    console.error(
      'An internal error occurred in the scraper or recipe service.',
    );
    const res = this.scraperService.newScraperResult(
      '',
      'Oops! Something went wrong with our server',
    );
    return this.scraperService.sendResult(url, res);
  }

  @EventPattern('scraper.results.unavailable')
  handleScraperUnavailable(@Payload() data: { url: string }) {
    const { url } = data;

    console.error('The recipe service appears to be unavailable.');
    const res = this.scraperService.newScraperResult(
      '',
      "Oops! Looks like this service isn't available right now",
    );
    return this.scraperService.sendResult(url, res);
  }
}
