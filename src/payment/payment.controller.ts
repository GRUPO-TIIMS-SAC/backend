import { Body, Controller, Get, Post, Res, Headers, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { PaymentService } from './payment.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { SendOrderDto } from './dto/send-order.dto';
import { ConfigService } from '@nestjs/config';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService, private configService: ConfigService) { }

  @Get()
  getPaymentPage(@Res() res: Response) {
    res.render('culqi_checkout', {
      publicKey:  this.configService.get<string>('CULQI_PUBLIC_KEY'),
    });
  }

  @Get('V4')
  getPaymentPageV4(@Res() res: Response, @Body() body: { amount: number }) {
    res.render('culqi_v4', {
      publicKey:  this.configService.get<string>('CULQI_PUBLIC_KEY'),
      amount: 50000,
      body: body,
    });
  }

  @Get('V4/:token/:amount')
  getPaymentPageV4Final(@Res() res: Response,
  @Param('token') token: string,
  @Param('amount') amount: number){
    res.render('culqi_v4', {
      publicKey:  this.configService.get<string>('CULQI_PUBLIC_KEY'),
      amount: amount,
      body: token,
    });
  }

  @Get('new')
  getPaymentPageNew(@Res() res: Response) {
    res.render('culqi_checkout_new', {
      publicKey:  this.configService.get<string>('CULQI_PUBLIC_KEY'),
    });
  }

  @Get('prueba-env')
  getValueEnv() {
    console.log(process.env.CULQI_PUBLIC_KEY);
    return this.configService.get<string>('CULQI_PUBLIC_KEY') !== undefined;
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

  @Get('weebhook-response')
  weebhookResponse() {
    console.log('weebhook-response');
  }

  @Get('tmp-wallet')
  getTmpWallet(
    @Headers('authorization') token: any,
  ) {
    return this.paymentService.tmpWallet(token);
  }

  @Get('history-wallet')
  getHistoryWallet(
    @Headers('authorization') token: any,
  ) {
    return this.paymentService.getHistoryWallet(token);
  }
}