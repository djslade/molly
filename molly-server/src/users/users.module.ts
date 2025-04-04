import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserGRPCModule } from './grpc/usersGrpc.module';

@Module({
  imports: [UserGRPCModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
