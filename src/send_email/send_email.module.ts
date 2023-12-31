import { Module } from '@nestjs/common';
import { SendEmailService } from './send_email.service';

@Module({
  providers: [SendEmailService],
  exports: [SendEmailService],
})
export class SendEmailModule {}
