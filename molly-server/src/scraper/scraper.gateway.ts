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
import { GrpcNotFoundException } from 'src/common/grpc/grpc-exceptions';
import { RecipeUrlDto } from 'src/common/dtos/recipeUrlDto';

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
  async handleScrapeRequest(client: Socket, payload: RecipeUrlDto) {
    try {
      const res = await this.recipesService.getRecipeWithURL(payload);
      this.scraperService.sendResult(payload.recipe_url, res);
    } catch (err) {
      console.log('yellow');
      if (err instanceof GrpcNotFoundException) {
        this.pubsubService.sendScraperRequest(payload);
        return;
      }
      client.emit('error', { error: err.details });
    }
  }
}
