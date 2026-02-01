import { status as GrpcStatus } from '@grpc/grpc-js';
import { HttpStatus } from '@nestjs/common';

export const convertGRPCToHTTP = (grpcStatus: number): HttpStatus => {
  const mapping: Record<number, HttpStatus> = {
    [GrpcStatus.OK]: HttpStatus.OK,
    [GrpcStatus.CANCELLED]: HttpStatus.REQUEST_TIMEOUT,
    [GrpcStatus.INVALID_ARGUMENT]: HttpStatus.BAD_REQUEST,
    [GrpcStatus.NOT_FOUND]: HttpStatus.NOT_FOUND,
    [GrpcStatus.ALREADY_EXISTS]: HttpStatus.CONFLICT,
    [GrpcStatus.PERMISSION_DENIED]: HttpStatus.FORBIDDEN,
    [GrpcStatus.UNAUTHENTICATED]: HttpStatus.UNAUTHORIZED,
    [GrpcStatus.RESOURCE_EXHAUSTED]: HttpStatus.TOO_MANY_REQUESTS,
    [GrpcStatus.FAILED_PRECONDITION]: HttpStatus.PRECONDITION_FAILED,
    [GrpcStatus.ABORTED]: HttpStatus.CONFLICT,
    [GrpcStatus.OUT_OF_RANGE]: HttpStatus.BAD_REQUEST,
    [GrpcStatus.UNIMPLEMENTED]: HttpStatus.NOT_IMPLEMENTED,
    [GrpcStatus.INTERNAL]: HttpStatus.INTERNAL_SERVER_ERROR,
    [GrpcStatus.UNAVAILABLE]: HttpStatus.SERVICE_UNAVAILABLE,
    [GrpcStatus.DATA_LOSS]: HttpStatus.INTERNAL_SERVER_ERROR,
  };

  return mapping[grpcStatus] || HttpStatus.INTERNAL_SERVER_ERROR;
};
