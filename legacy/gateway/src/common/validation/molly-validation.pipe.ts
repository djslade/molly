import {
  BadRequestException,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';

export class MollyValidationPipe extends ValidationPipe {
  constructor() {
    super({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors: ValidationError[]) => {
        const errorMessage = this.getFirstErrorMessage(errors);
        return new BadRequestException({
          code: HttpStatus.BAD_REQUEST,
          message: errorMessage,
        });
      },
    });
  }

  private getFirstErrorMessage(errors: ValidationError[]): string {
    const firstError = errors[0];
    if (firstError.children?.length) {
      return this.getFirstErrorMessage(firstError.children);
    }
    if (firstError.constraints) {
      return Object.values(firstError.constraints)[0];
    }
    return 'Validation failed';
  }
}
