import { Observable } from 'rxjs';
import { CreateUserRequestDto } from '../dtos/createUserRequest.dto';

export interface IUsersGrpcService {
  CreateUser(data: CreateUserRequestDto): Observable<any>;
}
