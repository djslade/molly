import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class ScraperGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  clients: Socket[];

  handleConnection(client: Socket) {
    this.clients.push(client);
  }

  handleDisconnect(client: Socket) {
    this.clients = this.clients.filter((c) => c.id != client.id);
  }

  @SubscribeMessage('scrape.request')
  handleScrapeResult(recipeURL: string, status: string) {
    const event = `scrape.${recipeURL}`;
    this.clients.forEach((c) => c.emit(event, status));
  }
}
