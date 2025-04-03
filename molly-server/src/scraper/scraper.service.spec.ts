import { Test, TestingModule } from '@nestjs/testing';
import { ScraperService } from './scraper.service';
import { Socket } from 'socket.io';
import { ScraperResult } from './types/ScraperResult';

describe('ScraperService', () => {
  let service: ScraperService;

  // Mock Socket objects
  const mockClient1 = {
    id: 'client1',
    emit: jest.fn(),
  } as unknown as Socket;

  const mockClient2 = {
    id: 'client2',
    emit: jest.fn(),
  } as unknown as Socket;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScraperService],
    }).compile();

    service = module.get<ScraperService>(ScraperService);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onClientConnection', () => {
    it('should add client to clients array', () => {
      service.onClientConnection(mockClient1);
      expect(service['clients']).toContain(mockClient1);
    });

    it('should not add duplicate clients', () => {
      service.onClientConnection(mockClient1);
      service.onClientConnection(mockClient1);
      expect(service['clients'].length).toBe(1);
    });
  });

  describe('onClientDisconnect', () => {
    it('should remove client from clients array', () => {
      service.onClientConnection(mockClient1);
      service.onClientConnection(mockClient2);

      expect(service['clients'].length).toBe(2);

      service.onClientDisconnect(mockClient1);
      expect(service['clients'].length).toBe(1);
      expect(service['clients']).not.toContain(mockClient1);
      expect(service['clients']).toContain(mockClient2);
    });

    it('should handle removing non-existent client', () => {
      service.onClientConnection(mockClient1);
      service.onClientDisconnect(mockClient2); // Not added

      expect(service['clients'].length).toBe(1);
      expect(service['clients']).toContain(mockClient1);
    });
  });

  describe('newScraperResult', () => {
    it('should create a valid ScraperResult object', () => {
      const id = 'test-id';
      const error = 'test-error';

      const result = service.newScraperResult(id, error);

      expect(result).toEqual({
        id,
        error,
      });
    });
  });

  describe('sendResult', () => {
    it('should emit event to all connected clients', () => {
      service.onClientConnection(mockClient1);
      service.onClientConnection(mockClient2);

      const key = 'test-key';
      const payload: ScraperResult = {
        id: 'test-id',
        error: 'test-error',
      };

      service.sendResult(key, payload);

      const expectedEvent = `scrape.${key}`;
      expect(mockClient1.emit).toHaveBeenCalledWith(expectedEvent, payload);
      expect(mockClient2.emit).toHaveBeenCalledWith(expectedEvent, payload);
    });

    it('should not fail when no clients are connected', () => {
      const key = 'test-key';
      const payload: ScraperResult = {
        id: 'test-id',
        error: 'test-error',
      };

      expect(() => service.sendResult(key, payload)).not.toThrow();
    });
  });

  describe('sendErrorMessage', () => {
    it('should emit error event to specific client', () => {
      const payload: ScraperResult = {
        id: 'test-id',
        error: 'test-error',
      };

      service.sendErrorMessage(mockClient1, payload);

      expect(mockClient1.emit).toHaveBeenCalledWith('error', payload);
      expect(mockClient2.emit).not.toHaveBeenCalled();
    });
  });
});
