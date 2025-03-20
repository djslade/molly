import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { PubsubService } from 'src/pubsub/pubsub.service';

@WebSocketGateway()
export class ScraperGateway implements OnGatewayDisconnect {
  constructor(private readonly pubsubService: PubsubService) {}
  clients: Map<string, Set<Socket>> = new Map();

  @WebSocketServer() private server: Server;

  handleDisconnect(client: Socket) {
    this.clients.forEach((set) => set.delete(client));
  }

  registerClient(client: Socket, key: string) {
    if (!this.clients.get(key)) {
      this.clients.set(key, new Set<Socket>());
    }
    console.log('Clients:', this.clients);
    this.clients.get(key)?.add(client);
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
