import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '~/shared/constants';

export type RedisClient = Redis;

export const redisProvider: Provider = {
  inject: [ConfigService],
  useFactory: (configService: ConfigService): RedisClient => {
    const host = configService.get<string>('REDIS_HOST');
    const port = configService.get<number>('REDIS_PORT');

    return new Redis({ host, port });
  },
  provide: REDIS_CLIENT,
};
