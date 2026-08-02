import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get('SMTP_HOST') as number,
          port: Number(config.get('SMTP_PORT')),
          secure: false,
          auth: {
            user: config.get('SMTP_USER') as string,
            pass: config.get('SMTP_PASS') as string,
          },
        },
        defaults: {
          from: `"Drive" <${config.get('SMTP_FROM')}>`,
        },
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
