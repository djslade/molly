import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';

@Catch(BadRequestException)
export class ScraperWsExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToWs();
    const client = ctx.getClient();

    const err: any = exception.getResponse();
    const body = {
      error: err.message[0] || 'Internal server error',
    };

    client.emit('error', body);
  }
}
