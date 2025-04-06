import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  BaseRpcExceptionFilter,
  MicroserviceOptions,
  Transport,
} from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'users',
        protoPath: join(__dirname, 'users/users.proto'),
        loader: {
          keepCase: true,
        },
      },
    },
  );

  app.useGlobalFilters(new BaseRpcExceptionFilter());
  // Listens on port 5000
  await app.listen();
}
void bootstrap();
