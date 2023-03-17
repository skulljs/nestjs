import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
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
          dir: __dirname + '/../templates/mails',
          adapter: new HandlebarsAdapter(),
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
export class AppModule {}
