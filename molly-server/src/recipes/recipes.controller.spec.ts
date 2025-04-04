import { Test, TestingModule } from '@nestjs/testing';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';
import { GetRecipeWithIDRequestDto } from './dtos/getRecipeWithIDRequest';
import { SearchRecipesRequestDto } from './dtos/searchRecipesRequest';
import { RecipeResponseDto } from './dtos/recipeResponse';
import { RecipeDto } from './dtos/recipe';
import { SearchRecipesResponseDto } from './dtos/searchRecipesResponse';

const testRecipe: RecipeDto = {
  id: 'testid',
  title: 'Pasta',
  recipeURL: '',
  imageURL: '',
  description: '',
  cuisine: '',
  category: '',
  cookingMethod: '',
  yields: '',
  prepTimeMinutes: 0,
  cookTimeMinutes: 0,
  totalTimeMinutes: 0,
  ingredients: [],
  instructions: [],
  created: '',
};

describe('RecipesController', () => {
  let controller: RecipesController;
  let mockRecipesService: jest.Mocked<RecipesService>;

  beforeEach(async () => {
    mockRecipesService = {
      checkCache: jest.fn(),
      getRecipeWithID: jest.fn(),
      cacheRecipe: jest.fn(),
      searchRecipes: jest.fn(),
    } as unknown as jest.Mocked<RecipesService>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecipesController],
      providers: [
        {
          provide: RecipesService,
          useValue: mockRecipesService,
        },
      ],
    }).compile();

    controller = module.get<RecipesController>(RecipesController);
  });

  describe('findOne', () => {
    it('should return cached recipe if available', async () => {
      const mockRequest: GetRecipeWithIDRequestDto = { id: 'testid' };
      const mockCachedRecipe: RecipeResponseDto = { recipe: testRecipe };

      jest
        .spyOn(mockRecipesService, 'checkCache')
        .mockResolvedValue(mockCachedRecipe);
      jest.spyOn(mockRecipesService, 'getRecipeWithID');
      jest.spyOn(mockRecipesService, 'cacheRecipe');

      const result = await controller.findOne(mockRequest);

      expect(result).toEqual(mockCachedRecipe);
      expect(mockRecipesService.checkCache).toHaveBeenCalledWith('testid');
      expect(mockRecipesService.getRecipeWithID).not.toHaveBeenCalled();
      expect(mockRecipesService.cacheRecipe).not.toHaveBeenCalled();
    });

    it('should fetch, cache and return recipe if not cached', async () => {
      const mockRequest: GetRecipeWithIDRequestDto = { id: 'testid' };
      const mockRecipe: RecipeResponseDto = { recipe: testRecipe };

      jest.spyOn(mockRecipesService, 'checkCache').mockResolvedValue(null);
      jest
        .spyOn(mockRecipesService, 'getRecipeWithID')
        .mockResolvedValue(mockRecipe);
      jest.spyOn(mockRecipesService, 'cacheRecipe');

      const result = await controller.findOne(mockRequest);

      expect(result).toEqual(mockRecipe);
      expect(mockRecipesService.checkCache).toHaveBeenCalledWith('testid');
      expect(mockRecipesService.getRecipeWithID).toHaveBeenCalledWith(
        mockRequest,
      );
      expect(mockRecipesService.cacheRecipe).toHaveBeenCalledWith(
        mockRecipe,
        'testid',
      );
    });
  });

  describe('findAll', () => {
    it('should return search results', async () => {
      const mockQuery: SearchRecipesRequestDto = {
        query: 'pasta',
        page: 1,
        results_per_page: 6,
      };
      const mockResults: SearchRecipesResponseDto = { total: 0, recipes: [] };

      jest
        .spyOn(mockRecipesService, 'searchRecipes')
        .mockResolvedValue(mockResults);

      const result = await controller.findAll(mockQuery);

      expect(result).toEqual(mockResults);
      expect(mockRecipesService.searchRecipes).toHaveBeenCalledWith(mockQuery);
    });

    it('should handle empty query parameters', async () => {
      const mockQuery = {} as SearchRecipesRequestDto;
      const mockResults: SearchRecipesResponseDto = {
        total: 0,
        recipes: [],
      };

      jest
        .spyOn(mockRecipesService, 'searchRecipes')
        .mockResolvedValue(mockResults);

      const result = await controller.findAll(mockQuery);

      expect(result).toEqual(mockResults);
      expect(mockRecipesService.searchRecipes).toHaveBeenCalledWith(mockQuery);
    });
  });
});
