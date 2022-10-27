import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration } from './configs/configuration';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { CatsModule } from './routes/cats/cats.module';

@Module({
  imports: [ConfigModule.forRoot({ load: [configuration], ignoreEnvFile: true, isGlobal: true }), CatsModule],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
