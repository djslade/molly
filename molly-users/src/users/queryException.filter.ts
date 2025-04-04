import { Catch, RpcExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';
import { QueryFailedError } from 'typeorm';
import { status as grpcStatus } from '@grpc/grpc-js';

interface ErrorBody {
  code: number;
  message: string;
}

@Catch(QueryFailedError)
export class QueryExceptionFilter
  implements RpcExceptionFilter<QueryFailedError>
{
  catch(exception: QueryFailedError): Observable<any> {
    const body = this.newErrorBody(exception);
    return throwError(() => new RpcException(body).getError());
  }

  private newErrorBody(exception: QueryFailedError): ErrorBody {
    const errorBody: ErrorBody = {
      code: grpcStatus.INTERNAL,
      message: 'Database error',
    };
    if (
      exception.driverError['code'] &&
      typeof exception.driverError['code'] === 'string'
    ) {
      const { code, message } = this.mapOrmToRpc(exception.driverError['code']);
      errorBody.code = code;
      errorBody.message = message;
    }
    return errorBody;
  }

  private mapOrmToRpc(code: string): ErrorBody {
    switch (code) {
      case '23502':
        return {
          code: grpcStatus.INVALID_ARGUMENT,
          message: 'Missing required field',
        };
      case '23503':
        return {
          code: grpcStatus.FAILED_PRECONDITION,
          message: 'Reference to non-existent entity',
        };
      case '23505':
        return {
          code: grpcStatus.ALREADY_EXISTS,
          message: 'Duplicate key violation',
        };
      case '23514':
        return {
          code: grpcStatus.INVALID_ARGUMENT,
          message: 'Field validation failed',
        };

      case '40001':
      case '40P01':
        return {
          code: grpcStatus.ABORTED,
          message: 'Transaction conflict',
        };

      case '42501':
        return {
          code: grpcStatus.PERMISSION_DENIED,
          message: 'Insufficient database privileges',
        };

      case '53300':
      case '57P01':
      case '57P02':
      case '57P03':
        return {
          code: grpcStatus.UNAVAILABLE,
          message: 'Database unavailable',
        };

      case '42601':
      case '42703':
        return {
          code: grpcStatus.INVALID_ARGUMENT,
          message: 'Invalid query',
        };
      case '42P01':
        return {
          code: grpcStatus.NOT_FOUND,
          message: 'Database resource not found',
        };

      default:
        return {
          code: grpcStatus.INTERNAL,
          message: 'Database error',
        };
    }
  }
}
