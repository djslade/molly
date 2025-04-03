import { Catch, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { status as GrpcStatus } from '@grpc/grpc-js';
import { GrpcNotFoundException } from './grpc-exceptions';
import { isErrorObject } from './is-error-object.util';

@Catch(Error)
export class GrpcMethodExceptionFilter implements ExceptionFilter {
  catch(exception: Error) {
    const err = {
      code: GrpcStatus.INTERNAL,
      details: 'Internal server error',
    };

    if (isErrorObject(exception)) {
      err.code = exception.code;
      err.details = exception.details || 'Internal server error';
    }

    if (err.code === GrpcStatus.NOT_FOUND) {
      throw new GrpcNotFoundException(err.details);
    }

    throw new RpcException(err);
  }
}
