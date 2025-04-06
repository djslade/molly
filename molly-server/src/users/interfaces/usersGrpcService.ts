import { Observable } from 'rxjs';
import { CreateUserRequestDto } from '../dtos/createUserRequest.dto';
import { CreateRefreshTokenRequestDto } from '../dtos/createRefreshTokenRequest.dto';

export interface IUsersGrpcService {
  CreateUser(data: CreateUserRequestDto): Observable<any>;
  CreateRefreshToken(data: CreateRefreshTokenRequestDto): Observable<any>;
}
