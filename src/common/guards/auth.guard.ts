import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const accessToken = this.extractTokenFromCookie(request);

    if (!accessToken) {
      throw new UnauthorizedException("You're not authenticated!");
    }
    try {
      const payload = await this.jwtService.verifyAsync(accessToken);

      request['user'] = payload;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new TokenExpiredException();
      }
      throw new UnauthorizedException('Token is not valid!');
    }
    return true;
  }

  private extractTokenFromCookie(request: Request): string | undefined {
    return request.cookies['accessToken'];
  }
}

export class TokenExpiredException extends UnauthorizedException {
  constructor() {
    super('Token expired');
  }
}
