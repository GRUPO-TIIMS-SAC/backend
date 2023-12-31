import { Module } from '@nestjs/common';
import { TmpValidatedEmailController } from './tmp_validated_email.controller';
import { TmpValidatedEmailService } from './tmp_validated_email.service';
import { TmpValidatedEmail } from 'src/entities_tmp/tmp_validated_email.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SendEmailModule } from 'src/send_email/send_email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TmpValidatedEmail]),
    SendEmailModule,
  ],
  controllers: [TmpValidatedEmailController],
  providers: [TmpValidatedEmailService]
})
export class TmpValidatedEmailModule {}
