import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { IUsersGrpcService } from './interfaces/usersGrpcService';
import { CreateUserRequestDto } from './dtos/createUserRequest.dto';
import { CreateUserResponseDto } from './dtos/createUserResponse.dto';
import { plainToInstance } from 'class-transformer';
import { lastValueFrom } from 'rxjs';
import { handleGrpcException } from 'src/common/grpc/handleRpcException.util';
import { CreateRefreshTokenRequestDto } from './dtos/createRefreshTokenRequest.dto';
import { CreateRefreshTokenResponseDto } from './dtos/createRefreshTokenResponse.dto';
import { IncomingHttpHeaders } from 'http';

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

  getBearerToken(headers: IncomingHttpHeaders): string {
    const { authorization } = headers;
    const token = authorization?.split(' ')[1];
    if (!token) throw new UnauthorizedException('Could not find bearer token');
    return token;
  }

  async validateAccessToken(token: string) {}

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

  async createRefreshToken(
    request: CreateRefreshTokenRequestDto,
  ): Promise<CreateRefreshTokenResponseDto> {
    try {
      return plainToInstance(
        CreateRefreshTokenResponseDto,
        await lastValueFrom(this.usersService.CreateRefreshToken(request)),
      );
    } catch (err) {
      throw handleGrpcException(err as Error);
    }
  }
}
