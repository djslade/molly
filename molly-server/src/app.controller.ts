import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

interface response {
  status: string;
}

interface resGetRecipe extends response {
  status: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
