import { IsNotEmpty } from 'class-validator';

export class CreateUserRequestDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
