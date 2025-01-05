import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import helmet from 'helmet';

import { AppModule } from './app.module';

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
      saveUninitialized: false,
    }),
  );

  // Use swagger to generate documentations
  const swaggerDocument = new DocumentBuilder()
    .setTitle('Jira clone Restful API Documentations')
    .setDescription('This is the documentation for the Jira clone RESTful API.')
    .setVersion('1.0')
    .build();

  const documentFactory = SwaggerModule.createDocument(app, swaggerDocument);

  SwaggerModule.setup('/api/documentations', app, documentFactory);

  await app.listen(port, () => {
    logger.log(
      `⚡️ [http] ready on port: ${port}, url: http://localhost:${port}`,
    );
  });
}
bootstrap();
