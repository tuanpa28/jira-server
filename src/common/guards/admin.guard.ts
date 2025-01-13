import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role, SKIP_AUTH_ADMIN_GUARD } from '~/shared/constants';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.get<string>(SKIP_AUTH_ADMIN_GUARD, context.getHandler());
    if (requiredRole) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (user && user.role === Role.Admin) {
      return true;
    }

    throw new UnauthorizedException("You're not authorization!");
  }
}
