import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'RECIPE_GRPC_SERVICE',
        transport: Transport.GRPC,
        options: {
          url: 'localhost:8080',
          package: 'recipes',
          protoPath: join(__dirname, 'recipes.proto'),
          loader: {
            keepCase: true,
          },
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class RecipeGRPCModule {}
