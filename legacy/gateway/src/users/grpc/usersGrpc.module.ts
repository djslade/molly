import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_GRPC_SERVICE',
        transport: Transport.GRPC,
        options: {
          url: process.env.USERS_CONN || 'localhost:5000',
          package: 'users',
          protoPath: join(__dirname, 'users.proto'),
          loader: {
            keepCase: true,
          },
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class UserGRPCModule {}
