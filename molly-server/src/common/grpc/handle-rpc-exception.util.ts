import { status as GrpcStatus } from '@grpc/grpc-js';
import { GrpcNotFoundException } from './grpc-exceptions';
import { RpcException } from '@nestjs/microservices';

export const handleGrpcException = (exception: any) => {
  if (exception.code === GrpcStatus.NOT_FOUND) {
    return new GrpcNotFoundException(exception.details);
  }
  return new RpcException({
    code: exception.code,
    message: exception.details,
  });
};
