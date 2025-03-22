import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PubsubService } from './pubsub.service';
import { PubsubController } from './pubsub.controller';

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
    ]),
  ],
  providers: [PubsubService],
  controllers: [PubsubController],
  exports: [ClientsModule, PubsubService],
})
export class PubsubModule {}
