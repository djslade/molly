import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { RecipesService } from 'src/recipes/recipes.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';
import { PubsubService } from 'src/pubsub/pubsub.service';

@WebSocketGateway()
export class ScraperGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly recipesService: RecipesService,
    private readonly pubsubService: PubsubService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  clients: Socket[] = [];

  handleConnection(client: Socket) {
    this.clients.push(client);
  }

  handleDisconnect(client: Socket) {
    this.clients = this.clients.filter((c) => c.id != client.id);
  }

  @SubscribeMessage('scrape.request')
  async handleScrapeRequest(client: Socket, payload: { url: string }) {
    const recipe = await this.cacheManager.get(`recipe-${payload.url}`);
    if (recipe !== null) {
      client.emit('scrape', recipe);
    }
    try {
      const res = await this.recipesService.getRecipeWithURL(payload.url);
      client.emit('scrape', res);
    } catch (err) {
      client.emit('scrape', { status: 'bad' });
    }
    this.pubsubService.sendScraperRequest({ url: payload.url });
  }
}
