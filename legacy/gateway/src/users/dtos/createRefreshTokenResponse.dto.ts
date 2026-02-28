import { IsUUID } from 'class-validator';

export class CreateRefreshTokenResponseDto {
  @IsUUID()
  refreshToken: string;
}
