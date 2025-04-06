import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { RpcToHttpExceptionFilter } from 'src/common/grpc/rpcToHttp.filter';
import { CreateUserRequestDto } from './dtos/createUserRequest.dto';
import { UsersService } from './users.service';
import { CreateRefreshTokenRequestDto } from './dtos/createRefreshTokenRequest.dto';

@UseFilters(new RpcToHttpExceptionFilter())
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  async createUser(@Body() request: CreateUserRequestDto) {
    return await this.usersService.createUser(request);
  }

  @Post('login')
  async login(@Body() request: CreateRefreshTokenRequestDto) {
    return await this.usersService.createRefreshToken(request);
  }
}
