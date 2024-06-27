import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';
import { ACCESS_TOKEN_NAME } from '@/libs/common/constants';

async function bootstrap() {
  const port = process.env.API_PORT || 8080;
  const logger = new Logger('api-gateway');

  const app: NestExpressApplication = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: ['*'],
    credentials: true,
  });
  app.use(helmet());
  app.use(cookieParser());
  app.use(
    session({
      secret: process.env.SECRET_KEY_SESSION,
      resave: false,
      saveUninitialized: true,
    }),
  );

  // Use swagger to generate documentations
  const swaggerDocument = new DocumentBuilder()
    .setTitle('Jira clone Restful API Documentations')
    .setVersion('1.0')
    .addServer('http://localhost:8080')
    .addBearerAuth(
      {
        description: `[just text field] Please enter your access token`,
        name: 'Authorization',
        bearerFormat: 'Bearer',
        scheme: 'Bearer',
        type: 'http',
        in: 'Header',
      },
      ACCESS_TOKEN_NAME, // This name here is important for matching up with @ApiBearerAuth() in controller!
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerDocument);

  SwaggerModule.setup('/', app, document);

  await app.listen(port, () => {
    logger.log(
      `⚡️ [http] ready on port: ${port}, url: http://localhost:${port}`,
    );
  });
}
bootstrap();
