import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import session from 'express-session';
import helmet from 'helmet';
import morgan from 'morgan';
import * as path from 'path';
import * as rfs from 'rotating-file-stream';
import { AppModule } from './app.module';
import './utils/prototypes/array';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.setGlobalPrefix(config.get('apiPrefix'));

  // Access Logger
  const accessLogStream = rfs.createStream('access.log', {
    size: config.get('accessLoggerFileSize'),
    interval: config.get('accessLoggerFileInterval'),
    compress: 'gzip',
    path: path.join(__dirname, '../../logs'),
  });
  app.use(morgan('combined', { stream: accessLogStream }));

  // Helmet
  app.use(
    helmet({
      contentSecurityPolicy: config.get('helmetContentSecurityPolicy'),
    })
  );

  // Cors
  app.enableCors({
    origin: config.get('corsOrigins'),
    credentials: true,
  });

  // OpenAPI
  if (!config.get('production')) {
    const openAPIConfig = new DocumentBuilder()
      .setTitle(config.get('openAPITitle'))
      .setDescription(config.get('openAPIDescription'))
      .setVersion(config.get('openAPIVersion'))
      .build();
    const document = SwaggerModule.createDocument(app, openAPIConfig);
    SwaggerModule.setup(config.get('openAPIPath'), app, document);
  }

  // Session
  app.use(
    session({
      secret: config.get('sessionSecret'),
      resave: config.get('sessionResave'),
      saveUninitialized: config.get('sessionSaveUninitialized'),
      cookie: {
        maxAge: config.get('sessionCookieMaxAge'),
        httpOnly: config.get('sessionCookieHttpOnly'),
        secure: config.get('sessionCookieSecure'),
      },
    })
  );

  app.enableShutdownHooks();

  // Start server
  await app.listen(config.get('port'));
  Logger.log(`🚀 Application is running on: http://localhost:${config.get('port')}/${config.get('apiPrefix')}`);
  if (!config.get('production')) Logger.log(`📚 OpenAPI documentation is running on: http://localhost:${config.get('port')}/${config.get('openAPIPath')}`);
}
bootstrap();
