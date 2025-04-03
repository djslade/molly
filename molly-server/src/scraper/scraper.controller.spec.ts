import { Test, TestingModule } from '@nestjs/testing';
import { ScraperController } from './scraper.controller';
import { ScraperService } from './scraper.service';
import { GetRecipeWithURLRequestDto } from 'src/recipes/dtos/getRecipeWithURLRequest';
import { RecipesService } from 'src/recipes/recipes.service';
import { ScraperResult } from './types/ScraperResult';

describe('ScraperController', () => {
  let controller: ScraperController;
  let mockRecipesService: jest.Mocked<RecipesService>;
  let mockScraperService: jest.Mocked<ScraperService>;

  beforeEach(async () => {
    mockRecipesService = {
      getRecipeWithURL: jest.fn(),
    } as any;

    mockScraperService = {
      newScraperResult: jest.fn(),
      sendResult: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScraperController],
      providers: [
        {
          provide: RecipesService,
          useValue: mockRecipesService,
        },
        {
          provide: ScraperService,
          useValue: mockScraperService,
        },
      ],
    }).compile();

    controller = module.get<ScraperController>(ScraperController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should process ok', async () => {
    const testData: GetRecipeWithURLRequestDto = {
      recipe_url: 'https://example.com/ok',
    };

    const testPayload: ScraperResult = { id: 'recipe123', error: '' };

    const mockRecipe = { id: 'recipe123' };

    mockRecipesService.getRecipeWithURL.mockResolvedValue(mockRecipe as any);
    mockScraperService.newScraperResult.mockReturnValue(testPayload);

    await controller.handleScraperOK(testData);

    expect(mockRecipesService.getRecipeWithURL).toHaveBeenCalledWith(testData);
    expect(mockScraperService.newScraperResult).toHaveBeenCalledWith(
      'recipe123',
      '',
    );
    expect(mockScraperService.sendResult).toHaveBeenCalledWith(
      testData.recipe_url,
      testPayload,
    );
  });

  it('should process invalid', () => {
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    controller.handleScraperInvalid();

    expect(consoleSpy).toHaveBeenCalledWith(
      'Scraper service indicated that a request was invalid.',
    );
    consoleSpy.mockRestore();
  });

  it('should handle fail', () => {
    const testData = { url: 'https://example.com/fail' };
    const testPayload: ScraperResult = {
      id: '',
      error: "We couldn't import a recipe from this URL",
    };
    mockScraperService.newScraperResult.mockReturnValue(testPayload);

    controller.handleScraperFail(testData);

    expect(mockScraperService.newScraperResult).toHaveBeenCalledWith(
      '',
      "We couldn't import a recipe from this URL",
    );
    expect(mockScraperService.sendResult).toHaveBeenCalledWith(
      testData.url,
      testPayload,
    );
  });

  it('should handle unknown', () => {
    const testData = { url: 'https://example.com/unknown' };
    const testPayload: ScraperResult = {
      id: '',
      error: 'Oops! Something went wrong with our server',
    };
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    mockScraperService.newScraperResult.mockReturnValue(testPayload);

    controller.handleScraperUnknown(testData);

    expect(consoleSpy).toHaveBeenCalledWith(
      'An unknown error occurred in the scraper or recipe service.',
    );
    expect(mockScraperService.newScraperResult).toHaveBeenCalledWith(
      '',
      'Oops! Something went wrong with our server',
    );
    expect(mockScraperService.sendResult).toHaveBeenCalledWith(
      testData.url,
      testPayload,
    );

    consoleSpy.mockRestore();
  });

  it('should handle internal', () => {
    const testData = { url: 'https://example.com/internal' };
    const testPayload: ScraperResult = {
      id: '',
      error: "Oops! Looks like this service isn't available right now",
    };
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    mockScraperService.newScraperResult.mockReturnValue(testPayload);
    controller.handleScraperInternalError(testData);

    expect(consoleSpy).toHaveBeenCalledWith(
      'An internal error occurred in the scraper or recipe service.',
    );
    expect(mockScraperService.newScraperResult).toHaveBeenCalledWith(
      '',
      'Oops! Something went wrong with our server',
    );
    expect(mockScraperService.sendResult).toHaveBeenCalledWith(
      testData.url,
      testPayload,
    );

    consoleSpy.mockRestore();
  });

  it('should handle unavailable', () => {
    const testData = { url: 'https://example.com/unavailable' };
    const testPayload: ScraperResult = {
      id: '',
      error: "Oops! Looks like this service isn't available right now",
    };
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    mockScraperService.newScraperResult.mockReturnValue(testPayload);

    controller.handleScraperUnavailable(testData);

    expect(consoleSpy).toHaveBeenCalledWith(
      'The recipe service appears to be unavailable.',
    );
    expect(mockScraperService.newScraperResult).toHaveBeenCalledWith(
      '',
      "Oops! Looks like this service isn't available right now",
    );
    expect(mockScraperService.sendResult).toHaveBeenCalledWith(
      testData.url,
      testPayload,
    );

    consoleSpy.mockRestore();
  });
});
