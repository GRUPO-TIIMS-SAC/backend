import { Body, Controller, Get, Post } from '@nestjs/common';
import { TmpValidatedEmailService } from './tmp_validated_email.service';
import { SendEmailDto } from './dto/sendEmail.dto';
import { ApiTags } from '@nestjs/swagger';
import { ValidatedCodeDto } from './dto/validated-code.dto';

@ApiTags('Tmp Validated Email')
@Controller('tmp-validated-email')
export class TmpValidatedEmailController {
    constructor(
        private readonly tmpValidatedEmailService: TmpValidatedEmailService,
    ) {}

    @Post()
    async sendValidatedEmail(@Body() emails: SendEmailDto){
        return this.tmpValidatedEmailService.sendValidatedEmail(emails);
    }

    /* @Post('validate')
    async validateEmail(@Body() validatedCodeDto: ValidatedCodeDto){
        return this.tmpValidatedEmailService.validateCode(validatedCodeDto);
    } */

    @Post('validate-updated')
    async validateUpdate(@Body() emails: ValidatedCodeDto){
        return this.tmpValidatedEmailService.validateCodeUpdate(emails);
    }

    @Get('test-resp')
    async testResp(){
        return this.tmpValidatedEmailService.testResp();
    }
}
