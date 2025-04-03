import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import { ScraperResult } from './types/ScraperResult';
import { isErrorObject } from 'src/common/grpc/is-error-object.util';
import { Socket } from 'socket.io';

@Catch(BadRequestException)
export class ScraperWsExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToWs();
    const client = ctx.getClient<Socket>();

    const err = exception.getResponse();
    const body: ScraperResult = {
      error: 'Internal server error',
    };

    if (isErrorObject(err)) {
      body.error = err.message || body.error;
    }

    client.emit('error', body);
  }
}
