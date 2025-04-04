import { Type } from 'class-transformer';
import { UserDto } from './user.dto';

export class CreateUserResponseDto {
  @Type(() => UserDto)
  user: UserDto;
}
