import { Module } from '@nestjs/common';
import { SendEmailService } from './send_email.service';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'tiims.com.pe',
        port: 465,
        secure: true, // upgrade later with STARTTLS
        auth: {
          user: 'noreply@tiims.com.pe',
          pass: 't11MS3em@1l',
        },
      },
      defaults:{
        from: '"Tiims Code" <noreply@tiims.com.pe>',
      }
    })
  ],
  providers: [SendEmailService],
  exports: [SendEmailService],
})
export class SendEmailModule {}
