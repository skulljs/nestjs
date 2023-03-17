import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaService } from './prisma.service';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as rfs from 'rotating-file-stream';
import * as session from 'express-session';
import * as morgan from 'morgan';
import * as path from 'path';
import './utils/prototypes/array';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  // listener for Prisma beforeExit event
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

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
      resave: config.get('sessionResave'),
      saveUninitialized: config.get('sessionSaveUninitialized'),
      cookie: {
        maxAge: config.get('sessionCookieMaxAge'),
        httpOnly: config.get('sessionCookieHttpOnly'),
        secure: config.get('sessionCookieSecure'),
      },
    })
  );

  // Start server
  await app.listen(config.get('port'));
  Logger.log(`🚀 Application is running on: http://localhost:${config.get('port')}/${config.get('apiPrefix')}`);
  Logger.log(`📚 OpenAPI documentation is running on: http://localhost:${config.get('port')}/${config.get('openAPIPath')}`);
}
bootstrap();
