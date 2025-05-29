import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UsersService } from '../users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.usersService.getBearerToken(request.headers);

    const user = await this.usersService.validateAccessToken(token);
    request.user = user;

    return true;
  }
}
