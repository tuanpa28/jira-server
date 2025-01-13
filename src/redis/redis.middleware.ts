import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { RedisService } from './redis.service';

@Injectable()
export class RedisMiddleware implements NestMiddleware {
  constructor(private readonly redisService: RedisService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { accessToken } = req.cookies;
    if (!accessToken) {
      throw new UnauthorizedException('Token missing in cookies');
    }

    const isBlacklisted = await this.redisService.isBlacklisted(accessToken);
    if (isBlacklisted) {
      throw new UnauthorizedException('Token is blacklisted');
    }

    next();
  }
}
