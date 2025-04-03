import {
  Catch,
  ArgumentsHost,
  HttpStatus,
  ExceptionFilter,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';
import { convertGRPCToHTTP } from './convert-grpc-to-http.util';
import { isErrorObject } from './is-error-object.util';

@Catch(RpcException)
export class RpcToHttpExceptionFilter implements ExceptionFilter<RpcException> {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    const err = exception.getError();
    const body = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    };

    if (isErrorObject(err)) {
      body.statusCode = convertGRPCToHTTP(err.code);
      body.message = err.message || body.message;
    }

    res.status(body.statusCode).json(body);
  }
}
