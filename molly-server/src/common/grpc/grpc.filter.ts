import { Catch, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { status as GrpcStatus } from '@grpc/grpc-js';
import { GrpcNotFoundException } from './grpc-exceptions';

//
@Catch()
export class GrpcMethodExceptionFilter implements ExceptionFilter {
  catch(exception: any) {
    console.log('purple');
    if (exception.code === GrpcStatus.NOT_FOUND) {
      throw new GrpcNotFoundException(exception.details);
    }
    throw new RpcException({
      code: exception.code,
      message: exception.details,
    });
  }
}
