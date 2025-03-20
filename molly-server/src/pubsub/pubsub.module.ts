import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PubsubService } from './pubsub.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'SCRAPER_REQUESTS',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'scraper.requests',
          queueOptions: { durable: false },
        },
      },
      {
        name: 'SCRAPER_RESULTS',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'scraper.results',
          queueOptions: { durable: false },
        },
      },
    ]),
  ],
  providers: [PubsubService],
  exports: [ClientsModule, PubsubService],
})
export class PubsubModule {}
