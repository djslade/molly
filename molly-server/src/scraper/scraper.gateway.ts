import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { RecipesService } from 'src/recipes/recipes.service';
import { PubsubService } from 'src/pubsub/pubsub.service';
import { ScraperService } from './scraper.service';

@WebSocketGateway({ cors: true })
export class ScraperGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly recipesService: RecipesService,
    private readonly pubsubService: PubsubService,
    private readonly scraperService: ScraperService,
  ) {}

  handleConnection(client: Socket) {
    this.scraperService.onClientConnection(client);
  }

  handleDisconnect(client: Socket) {
    this.scraperService.onClientDisconnect(client);
  }

  @SubscribeMessage('scrape.request')
  async handleScrapeRequest(client: Socket, payload: { url: string }) {
    const { url } = payload;
    if (!url) {
      const res = this.scraperService.newScraperResult(
        '',
        'Please set a url field',
      );
      this.scraperService.sendErrorMessage(client, res);
      return;
    }
    try {
      const res = await this.recipesService.getRecipeWithURL(url);
      this.scraperService.sendResult(url, res);
    } catch (err) {
      this.pubsubService.sendScraperRequest({ url });
    }
  }
}
