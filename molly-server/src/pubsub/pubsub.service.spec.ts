import { Test, TestingModule } from '@nestjs/testing';
import { ClientProxy } from '@nestjs/microservices';
import { PubsubService } from './pubsub.service';
import { ScraperRequestDto } from './dtos/scraperRequest';

describe('PubsubService', () => {
  let service: PubsubService;
  let mockClientProxy: jest.Mocked<ClientProxy>;

  beforeEach(async () => {
    mockClientProxy = {
      emit: jest.fn().mockReturnValue({ toPromise: jest.fn() }),
      connect: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<ClientProxy>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PubsubService,
        {
          provide: 'SCRAPER_REQUESTS',
          useValue: mockClientProxy,
        },
      ],
    }).compile();

    service = module.get<PubsubService>(PubsubService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('onApplicationBootstrap', () => {
    it('should connect to the client proxy', async () => {
      await service.onApplicationBootstrap();
      expect(mockClientProxy.connect).toHaveBeenCalled();
    });

    it('should handle connection errors', async () => {
      const error = new Error('Connection failed');
      mockClientProxy.connect.mockRejectedValueOnce(error);

      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      await service.onApplicationBootstrap();

      expect(mockClientProxy.connect).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(error);

      consoleErrorSpy.mockRestore();
    });
  });

  describe('sendScraperRequest', () => {
    it('should emit a scraper request', () => {
      const testRequest: ScraperRequestDto = {
        recipe_url: 'https://example.com',
      };

      const result = service.sendScraperRequest(testRequest);

      expect(mockClientProxy.emit).toHaveBeenCalledWith(
        'scraper.requests',
        testRequest,
      );
      expect(result).toBeDefined();
    });

    it('should handle emit errors', () => {
      const testRequest: ScraperRequestDto = {
        recipe_url: 'https://example.com',
      };
      const error = new Error('Emit failed');
      mockClientProxy.emit.mockImplementationOnce(() => {
        throw error;
      });

      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const result = service.sendScraperRequest(testRequest);

      expect(mockClientProxy.emit).toHaveBeenCalledWith(
        'scraper.requests',
        testRequest,
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(error);
      expect(result).toBeUndefined();

      consoleErrorSpy.mockRestore();
    });
  });
});
