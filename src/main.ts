import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.setGlobalPrefix(config.get('apiPrefix'));

  // Cors
  app.enableCors({
    origin: config.get('corsOrigins'),
    credentials: true,
  });

  // OpenAPI
  const openAPIConfig = new DocumentBuilder()
    .setTitle(config.get('openAPITitle'))
    .setDescription(config.get('openAPIDescription'))
    .setVersion(config.get('openAPIVersion'))
    .build();
  const document = SwaggerModule.createDocument(app, openAPIConfig);
  SwaggerModule.setup(config.get('openAPIPath'), app, document);

  // Session
  app.use(
    session({
      secret: config.get('sessionSecret'),
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: config.get('sessionCookieMaxAge'),
        httpOnly: false,
        secure: 'auto', // true only for https
      },
    })
  );

  // Start logger
  await app.listen(config.get('port'));
  Logger.log(`🚀 Application is running on: http://localhost:${config.get('port')}/${config.get('apiPrefix')}`);
  Logger.log(`📚 OpenAPI documentation is running on: http://localhost:${config.get('port')}/${config.get('openAPIPath')}`);
}
bootstrap();
