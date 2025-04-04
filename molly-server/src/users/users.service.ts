import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { IUsersGrpcService } from './interfaces/usersGrpcService';
import { CreateUserRequestDto } from './dtos/createUserRequest.dto';
import { CreateUserResponseDto } from './dtos/createUserResponse.dto';
import { plainToInstance } from 'class-transformer';
import { lastValueFrom } from 'rxjs';
import { handleGrpcException } from 'src/common/grpc/handleRpcException.util';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_GRPC_SERVICE')
    private readonly client: ClientGrpc,
  ) {}

  usersService: IUsersGrpcService;

  onModuleInit() {
    this.usersService =
      this.client.getService<IUsersGrpcService>('UsersService');
  }

  async createUser(
    request: CreateUserRequestDto,
  ): Promise<CreateUserResponseDto> {
    try {
      return plainToInstance(
        CreateUserResponseDto,
        await lastValueFrom(this.usersService.CreateUser(request)),
      );
    } catch (err) {
      throw handleGrpcException(err as Error);
    }
  }
}
