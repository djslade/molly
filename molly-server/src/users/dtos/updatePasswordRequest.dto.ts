import { IsNotEmpty } from 'class-validator';

export class UpdatePasswordRequestDto {
  @IsNotEmpty()
  password: string;
}
