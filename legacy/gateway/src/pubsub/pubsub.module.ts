import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PubsubService } from './pubsub.service';
import { RecipesModule } from 'src/recipes/recipes.module';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'SCRAPER_REQUESTS',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RMQ_CONN || 'amqp://localhost:5672'],
          queue: 'scraper.requests',
          queueOptions: { durable: false },
        },
      },
    ]),
    RecipesModule,
  ],
  providers: [PubsubService],
  exports: [ClientsModule, PubsubService],
})
export class PubsubModule {}
