import { RpcException } from '@nestjs/microservices';
import { status as GrpcStatus } from '@grpc/grpc-js';

export class GrpcNotFoundException extends RpcException {
  constructor(message?: string) {
    super({ code: GrpcStatus.NOT_FOUND, message: message || 'Not found' });
  }
}
