import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { MollyValidationPipe } from './common/validation/molly-validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RMQ_CONN || 'amqp://localhost:5672'],
      queue: 'scraper.results',
      queueOptions: { durable: false },
    },
  });

  app.enableCors();

  app.useGlobalPipes(new MollyValidationPipe());

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
