import { Controller, UseFilters } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { CreateUserRequest, CreateUserResponse } from './users';
import { plainToInstance } from 'class-transformer';
import { CreateUserRequestDto } from './dtos/createUserRequest.dt';
import { UsersService } from './users.service';
import { QueryExceptionFilter } from './queryException.filter';

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
}
