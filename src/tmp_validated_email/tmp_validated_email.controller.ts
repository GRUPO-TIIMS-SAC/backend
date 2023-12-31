import { Body, Controller, Get, Post } from '@nestjs/common';
import { TmpValidatedEmailService } from './tmp_validated_email.service';
import { SendEmailDto } from './dto/sendEmail.dto';

@Controller('tmp-validated-email')
export class TmpValidatedEmailController {
    constructor(
        private readonly tmpValidatedEmailService: TmpValidatedEmailService,
    ) {}

    @Post()
    async sendValidatedEmail(@Body() emails: SendEmailDto){
        return this.tmpValidatedEmailService.sendValidatedEmail(emails);
    }
}
