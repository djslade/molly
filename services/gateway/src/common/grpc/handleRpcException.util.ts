import { status as GrpcStatus } from '@grpc/grpc-js';
import { GrpcNotFoundException } from './grpc-exceptions';
import { RpcException } from '@nestjs/microservices';
import { isErrorObject } from './isErrorObject.util';

export const handleGrpcException = (exception: Error) => {
  const err = {
    code: GrpcStatus.INTERNAL,
    details: 'Internal server error',
  };

  if (isErrorObject(exception)) {
    err.code = exception.code;
    err.details = exception.details || err.details;
  }

  if (err.code === GrpcStatus.NOT_FOUND) {
    return new GrpcNotFoundException(err.details);
  }

  return new RpcException(err);
};
