import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import * as passport from 'passport';

import { AuthInterceptor } from '~/common/interceptors';
import { ACCESS_TOKEN } from '~/shared/constants';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = process.env.API_PORT || 8080;
  const logger = new Logger('api-gateway');

  const app: NestExpressApplication = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new AuthInterceptor());

  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
    exposedHeaders: ['X-Refresh-Token-Required'],
  });
  app.use(helmet());
  app.use(cookieParser());
  app.use(passport.initialize());

  // Use swagger to generate documentations
  const swaggerDocument = new DocumentBuilder()
    .setTitle('Jira clone Restful API Documentations')
    .setDescription('This is the documentation for the Jira clone RESTful API.')
    .setVersion('1.0')
    .addCookieAuth(ACCESS_TOKEN, {
      type: 'apiKey',
      in: 'cookie',
      name: 'accessToken',
    })
    .build();

  const documentFactory = SwaggerModule.createDocument(app, swaggerDocument);

  SwaggerModule.setup('/api/documentations', app, documentFactory);

  await app.listen(port, () => {
    logger.log(`⚡️ [http] ready on port: ${port}, url: http://localhost:${port}`);
  });
}
bootstrap();
