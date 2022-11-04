import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { CheckAuthenticatedMiddleware } from './middlewares/check-authenticated/check-authenticated.middleware';
import { configuration } from './configs/configuration';
import { CatsModule } from './routes/cats/cats.module';

@Module({
  imports: [
    CatsModule,
    ConfigModule.forRoot({ load: [configuration], ignoreEnvFile: true, isGlobal: true }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('mailerSmtpHost'),
          port: configService.get('mailerSmtpPort'),
          secure: false,
          tls: { rejectUnauthorized: false },
        },
        defaults: {
          from: configService.get('mailerDefaultFrom'),
        },
        template: {
          dir: __dirname + '/../../templates/mails',
          adapter: new EjsAdapter(),
          options: {
            strict: false,
          },
        },
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    // Uncomment to enable middleware
    // consumer.apply(CheckAuthenticatedMiddleware).forRoutes('*');
  }
}
