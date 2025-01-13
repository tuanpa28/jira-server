import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { GoogleSerializer } from '~/common/serializers';
import { GoogleStrategy } from '~/common/strategies';
import { UserModule } from '~/modules/users';
import { RedisMiddleware, RedisModule, RedisService } from '~/redis';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UserModule,
    RedisModule,
    PassportModule.register({
      defaultStrategy: 'google',
    }),
    JwtModule.register({
      global: true,
      secret: process.env.SECRET_KEY_JWT,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, GoogleSerializer, RedisService],
  exports: [RedisService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RedisMiddleware)
      .forRoutes(
        { path: 'categories/*', method: RequestMethod.ALL },
        { path: 'columns/*', method: RequestMethod.ALL },
        { path: 'comments/*', method: RequestMethod.ALL },
        { path: 'projects/*', method: RequestMethod.ALL },
        { path: 'tasks/*', method: RequestMethod.ALL },
        { path: 'users/*', method: RequestMethod.ALL },
      );
  }
}
