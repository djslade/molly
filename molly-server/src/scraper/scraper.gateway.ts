import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class ScraperGateway implements OnGatewayDisconnect {
  constructor(
    @Inject('SCRAPER_REQUESTS') private readonly scraperRequests: ClientProxy,
  ) {}
  clients: Map<string, Set<Socket>> = new Map();

  handleDisconnect(client: Socket) {
    this.clients.forEach((set) => set.delete(client));
  }

  private registerClient(client: Socket, key: string) {
    if (!this.clients.get(key)) {
      this.clients.set(key, new Set<Socket>());
    }
    console.log('Clients:', this.clients);
    this.clients.get(key)?.add(client);
  }

  @SubscribeMessage('scrape')
  handleScrapeRequest(client: Socket, payload: any) {
    try {
      this.registerClient(client, payload.url);
    } catch (error) {
      client.disconnect(true);
    }
    this.scraperRequests.emit('scraper_requests', { url: payload.url });
  }

  handleScrapeResult(url: string, status: string) {
    console.log(url);
    console.log(status);
    this.clients.get(url)?.forEach((c) => {
      c.emit('scrape', { status });
      c.disconnect(true);
    });
  }
}
