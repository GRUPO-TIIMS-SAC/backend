import { Body, Controller, Get, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  @Get()
  getPaymentPage(@Res() res: Response) {
    res.render('culqi_checkout', {
      publicKey: 'pk_test_0d94058535f7fbea',
    });
  }

  @Get('V4')
  getPaymentPageV4(@Res() res: Response, @Body() body: { amount: number }) {
    res.render('culqi_v4', {
      publicKey: 'pk_test_0d94058535f7fbea',
      body: {
        amount: 10000,
      }
    });
  }

  @Get('new')
  getPaymentPageNew(@Res() res: Response) {
    res.render('culqi_checkout_new', {
      publicKey: 'pk_test_0d94058535f7fbea',
    });
  }
}