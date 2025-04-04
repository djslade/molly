import { Body, Controller, Get, Post, UseFilters } from '@nestjs/common';
import { RpcToHttpExceptionFilter } from 'src/common/grpc/rpcToHttp.filter';
import { CreateUserRequestDto } from './dtos/createUserRequest.dto';
import { UsersService } from './users.service';

@UseFilters(new RpcToHttpExceptionFilter())
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  ok(): string {
    return 'ok';
  }

  @Post()
  async createUser(@Body() request: CreateUserRequestDto) {
    return await this.usersService.createUser(request);
  }
}
