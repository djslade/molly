import { IsNotEmpty } from 'class-validator';

export class CreateRefreshTokenRequestDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
