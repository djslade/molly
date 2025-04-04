import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { CreateUserRequest, CreateUserResponse } from './users';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';

@Controller()
export class UsersController {
  @GrpcMethod('UsersService', 'CreateUser')
  createUser(
    data: CreateUserRequest,
    metadata: Metadata,
    call: ServerUnaryCall<CreateUserRequest, CreateUserResponse>,
  ): CreateUserResponse {
    return { user: { id: '123', email: 'hello@email.com', created: 'today' } };
  }
}
