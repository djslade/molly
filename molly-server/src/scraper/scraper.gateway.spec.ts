import { Test, TestingModule } from '@nestjs/testing';
import { Socket } from 'socket.io';
import { ScraperGateway } from './scraper.gateway';
import { RecipesService } from '../recipes/recipes.service';
import { PubsubService } from '../pubsub/pubsub.service';
import { ScraperService } from './scraper.service';
import { GrpcNotFoundException } from '../common/grpc/grpc-exceptions';
import { RecipeUrlDto } from '../common/dtos/recipeUrlDto';

describe('ScraperGateway', () => {
  let gateway: ScraperGateway;
  let mockRecipesService: jest.Mocked<RecipesService>;
  let mockPubsubService: jest.Mocked<PubsubService>;
  let mockScraperService: jest.Mocked<ScraperService>;
  let mockClient: jest.Mocked<Socket>;

  beforeEach(async () => {
    mockClient = {
      id: 'test-client-id',
      emit: jest.fn(),
    } as unknown as jest.Mocked<Socket>;

    mockRecipesService = {
      getRecipeWithURL: jest.fn(),
    } as unknown as jest.Mocked<RecipesService>;

    mockPubsubService = {
      sendScraperRequest: jest.fn(),
    } as unknown as jest.Mocked<PubsubService>;

    mockScraperService = {
      onClientConnection: jest.fn(),
      onClientDisconnect: jest.fn(),
      sendResult: jest.fn(),
    } as unknown as jest.Mocked<ScraperService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScraperGateway,
        { provide: RecipesService, useValue: mockRecipesService },
        { provide: PubsubService, useValue: mockPubsubService },
        { provide: ScraperService, useValue: mockScraperService },
      ],
    }).compile();

    gateway = module.get<ScraperGateway>(ScraperGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  it('should call onClientConnection on the scraper service', () => {
    gateway.handleConnection(mockClient);
    expect(mockScraperService.onClientConnection).toHaveBeenCalledWith(
      mockClient,
    );
  });

  it('should call onClientDisconnect on the scraper service', () => {
    gateway.handleDisconnect(mockClient);
    expect(mockScraperService.onClientDisconnect).toHaveBeenCalledWith(
      mockClient,
    );
  });

  describe('handleScrapeRequest', () => {
    const validPayload: RecipeUrlDto = {
      recipe_url: 'https://example.com/request',
    };
    const mockRecipeResult = { id: '1', title: 'Test Recipe' };

    it('should send result if recipe is found', async () => {
      mockRecipesService.getRecipeWithURL.mockResolvedValue(mockRecipeResult);

      await gateway.handleScrapeRequest(mockClient, validPayload);

      expect(mockRecipesService.getRecipeWithURL).toHaveBeenCalledWith(
        validPayload,
      );
      expect(mockScraperService.sendResult).toHaveBeenCalledWith(
        validPayload.recipe_url,
        mockRecipeResult,
      );
      expect(mockPubsubService.sendScraperRequest).not.toHaveBeenCalled();
    });

    it('should send to pubsub if recipe is not found', async () => {
      mockRecipesService.getRecipeWithURL.mockRejectedValue(
        new GrpcNotFoundException('Recipe not found'),
      );

      await gateway.handleScrapeRequest(mockClient, validPayload);

      expect(mockRecipesService.getRecipeWithURL).toHaveBeenCalledWith(
        validPayload,
      );
      expect(mockPubsubService.sendScraperRequest).toHaveBeenCalledWith(
        validPayload,
      );
      expect(mockScraperService.sendResult).not.toHaveBeenCalled();
    });

    it('should rethrow non-GrpcNotFound errors', async () => {
      const testError = new Error('Test error');
      mockRecipesService.getRecipeWithURL.mockRejectedValue(testError);

      await expect(
        gateway.handleScrapeRequest(mockClient, validPayload),
      ).rejects.toThrow(testError);
    });
  });
});
