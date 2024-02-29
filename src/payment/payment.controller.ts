import { Body, Controller, Get, Post, Res, Headers, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { PaymentService } from './payment.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { SendOrderDto } from './dto/send-order.dto';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) { }

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
      amount: 50000,
      body: body,
    });
  }

  @Get('V4/:token/:amount')
  getPaymentPageV4Final(@Res() res: Response,
  @Param('token') token: string,
  @Param('amount') amount: number){
    res.render('culqi_v4', {
      publicKey: 'pk_test_0d94058535f7fbea',
      amount: amount,
      body: token,
    });
  }

  @Get('new')
  getPaymentPageNew(@Res() res: Response) {
    res.render('culqi_checkout_new', {
      publicKey: 'pk_test_0d94058535f7fbea',
    });
  }

  @Post('create-order')
  createOrder(@Body() body: CreateOrderDto) {
    return this.paymentService.createOrder(body);
  }

  @Post('send-payment')
  sendPayment(
    @Headers('authorization') token: any,
    @Body() body: SendOrderDto) {
    return this.paymentService.sendPayment(token, body);
  }
}