import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ScraperResult } from './types/ScraperResult';

@Injectable()
export class ScraperService {
  private clients: Socket[] = [];

  onClientConnection(client: Socket) {
    if (this.clients.filter((c) => c.id === client.id).length === 0) {
      this.clients.push(client);
    }
  }

  onClientDisconnect(client: Socket) {
    this.clients = this.clients.filter((c) => c.id !== client.id);
  }

  newScraperResult(id: string, error: string): ScraperResult {
    const res: ScraperResult = {
      id,
      error,
    };
    return res;
  }

  sendResult(key: string, payload: ScraperResult) {
    const event = `scrape.${key}`;
    this.clients.forEach((client) => client.emit(event, payload));
  }

  sendErrorMessage(client: Socket, payload: ScraperResult) {
    client.emit('error', payload);
  }
}
