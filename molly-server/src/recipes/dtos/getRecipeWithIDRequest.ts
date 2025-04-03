import { IsUUID } from 'class-validator';

export class GetRecipeWithIDRequestDto {
  @IsUUID()
  id: string;
}
