import { Controller, UseFilters } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  CreateRefreshTokenRequest,
  CreateRefreshTokenResponse,
  CreateUserRequest,
  CreateUserResponse,
} from './users';
import { plainToInstance } from 'class-transformer';
import { CreateUserRequestDto } from './dtos/createUserRequest.dto';
import { UsersService } from './users.service';
import { QueryExceptionFilter } from './queryException.filter';
import { CreateRefreshTokenRequestDto } from './dtos/createRefreshTokenRequest.dto';

@UseFilters(new QueryExceptionFilter())
@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @GrpcMethod('UsersService', 'CreateUser')
  async createUser(data: CreateUserRequest): Promise<CreateUserResponse> {
    const request = plainToInstance(CreateUserRequestDto, data);

    const { id, email, created } = await this.usersService.createUser(request);

    return { user: { id, email, created: created.toDateString() } };
  }

  @GrpcMethod('UsersService', 'CreateRefreshToken')
  async createRefreshToken(
    data: CreateRefreshTokenRequest,
  ): Promise<CreateRefreshTokenResponse> {
    const request = plainToInstance(CreateRefreshTokenRequestDto, data);

    const { id } = await this.usersService.createRefreshToken(request);

    return { refresh_token: id };
  }
}
