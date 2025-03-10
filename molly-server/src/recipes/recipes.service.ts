import { Injectable } from '@nestjs/common';

@Injectable()
export class RecipesService {
  findOne(id: string) {
    return `This action returns a ${id} recipe`;
  }
}
