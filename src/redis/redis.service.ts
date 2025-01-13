import { Inject, Injectable } from '@nestjs/common';
import { REDIS_CLIENT } from '~/shared/constants';
import { RedisClient } from './redis.provider';

@Injectable()
export class RedisService {
  private readonly BLACKLISTED = 'blacklisted';

  constructor(@Inject(REDIS_CLIENT) private readonly redis: RedisClient) {}

  async addToBlacklist(token: string, ttl: number): Promise<void> {
    await this.redis.set(token, this.BLACKLISTED, 'EX', ttl);
  }

  async isBlacklisted(token: string): Promise<boolean> {
    const result = await this.redis.get(token);
    return result === this.BLACKLISTED;
  }

  async addRefreshToken(token: string, refreshToken: string, ttl: number): Promise<void> {
    await this.redis.set(token, refreshToken, 'EX', ttl);
  }

  async getRefreshToken(token: string): Promise<string | null> {
    return await this.redis.get(token);
  }

  async removeRefreshToken(token: string): Promise<void> {
    await this.redis.del(token);
  }
}
