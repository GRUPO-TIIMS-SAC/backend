import { Controller, Get, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Policies')
@Controller('document-politics')
export class DocumentPoliticsController {
    @Get()
  getPaymentPage(@Res() res: Response) {
    res.render('policies', {
      //publicKey: 'pk_test_0d94058535f7fbea',
      publicKey: 'pk_live_6b494ad367217f9c',
    });
  }
}
