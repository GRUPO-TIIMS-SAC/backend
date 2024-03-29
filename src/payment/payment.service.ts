import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository, } from '@nestjs/typeorm';
import { Payment } from 'src/entities/payments.entity';
import { Repository, In } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { CreateOrderDto } from './dto/create-order.dto';
import { UsersService } from 'src/users/users.service';
import { ProfilesService } from 'src/profiles/profiles.service';
import { SendOrderDto } from './dto/send-order.dto';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import { Utils } from 'src/utils/utils';
import { RequestsService } from 'src/requests/requests.service';

@Injectable()
export class PaymentService {

    constructor(
        @InjectRepository(Payment)
        private readonly paymentRepository: Repository<Payment>,
        private httpService: HttpService,
        private userService: UsersService,
        private profilesService: ProfilesService,
        private jwtService: JwtService,
        private requestService: RequestsService
    ) { }

    async sendPayment(token: any, body: SendOrderDto) {
        try {
            const tokenDecoded = this.userService.decodeToken(token);

            if (!tokenDecoded.id) {
                return new HttpException(
                    { message: 'Token wrong' },
                    HttpStatus.CONFLICT,
                );
            }

            const user = await this.userService.findOne(tokenDecoded.id);

            if (user.getStatus() != 200) {
                return user;
            }

            const userData = user.getResponse()['data'];
            console.log(userData);

            const profile = await this.profilesService.getByuser(userData.id);

            if (profile.getStatus() != 200) {
                return profile;
            }

            const profileData = profile.getResponse()['data'];
            console.log(profileData);

            const newBody = {
                id: userData.id,
                amount: body.amount,
                address: profileData.address,
                address_city: profileData.department,
                email: userData.email,
                first_name: userData.fullname.split(' ')[0],
                last_name: userData.fullname,
                phone_number: profileData.phone,
                documentNumber: profileData.number_document,
                request_id: body.request_id
            }

            const tokenBody = await this.jwtService.signAsync(newBody);
            console.log(tokenBody);

            return new HttpException(
                {
                    message: 'Payment sent',
                    url: new Utils().route() + '/payment/V4/' + tokenBody + '/' + body.amount
                },
                HttpStatus.OK,)

        } catch (error) {
            return new HttpException(
                {
                    message: 'Error al enviar el pago',
                    error: error.message
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async createOrder(body: CreateOrderDto) {
        try {
            let change_status = null;
            const headersRequest = {
                //Authorization: 'Bearer sk_test_11af72fddb37df11',
                Authorization: 'Bearer sk_live_a352620e7c754482',
                'content-type': 'application/json',
            };


            if (!body.tokenBody) {
                throw new Error('Token body is missing');
            }

            const decryptedBody = jwt.decode(body.tokenBody);

            if (!decryptedBody || typeof decryptedBody !== 'object') {
                throw new Error('Failed to decode token body');
            }

            console.log(decryptedBody);

            const requiredProperties = ['request_id', 'id', 'amount', 'address', 'email', 'address_city', 'first_name', 'last_name', 'phone_number', 'documentNumber'];
            for (const prop of requiredProperties) {
                if (!(prop in decryptedBody)) {
                    throw new Error(`Property ${prop} is missing in token body`);
                }
            }

            const bodyRequest = {
                amount: decryptedBody.amount,
                currency_code: "PEN",
                email: decryptedBody.email,
                source_id: body.token,
                capture: true,
                antifraud_details: {
                    address: decryptedBody.address,
                    address_city: decryptedBody.address_city,
                    country_code: "PE",
                    first_name: decryptedBody.first_name,
                    last_name: decryptedBody.last_name,
                    phone_number: decryptedBody.phone_number,
                },
                metadata: {
                    documentNumber: decryptedBody.documentNumber
                }
            }
            console.log(bodyRequest);

            const response = await this.httpService.post(
                'https://api.culqi.com/v2/charges',
                bodyRequest,
                { headers: headersRequest }).toPromise();
            console.log(response.data);

            const bodyPayment = {
                user_id: decryptedBody.id,
                amount: bodyRequest.amount / 100,
                token_payment: response.data.id,
                request_id: decryptedBody.request_id
            }

            const payment = this.paymentRepository.create(bodyPayment);
            const respData = await this.paymentRepository.save(payment);

            if (response.data.object === 'charge') {
                const respChange = await this.requestService.changeStatus(decryptedBody.request_id, 'disponible', 'borrador');

                if (respChange.getStatus() != 200) {
                    change_status = 'Error to change status'
                } else {
                    change_status = 'Status changed'
                }

            }

            return new HttpException(
                {
                    message: 'Order created',
                    change_status: change_status,
                    data: respData
                },
                HttpStatus.OK,
            );
        } catch (error) {
            console.error('Error al crear la orden:', error);
            return new HttpException(
                {
                    message: 'Error al crear la orden',
                    error: error.message
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }

    }

    async tmpWallet(token: any) {
        try {
            const tokenDecoded = this.userService.decodeToken(token);

            if (!tokenDecoded.id) {
                return new HttpException(
                    { message: 'Token wrong' },
                    HttpStatus.CONFLICT,
                );
            }

            const user = await this.userService.findOne(tokenDecoded.id);

            if (user.getStatus() != 200) {
                return user;
            }

            const request_ids = await this.requestService.getAllRequestByUser(tokenDecoded.id);

            console.log(request_ids.getResponse()['data']);

            if(request_ids.getResponse()['data'].length === 0){
                return new HttpException(
                    {
                        message: 'Wallet',
                        wallet: 0
                    },
                    HttpStatus.OK,
                );
            }

            const wallet = await this.paymentRepository.createQueryBuilder('payment')
                .where('payment.request_id IN (:...ids)', { ids: request_ids.getResponse()['data'] })
                .select('SUM(payment.amount)', 'sum')
                .getRawOne();

            return new HttpException(
                {
                    message: 'Wallet',
                    wallet: wallet.sum ?? 0
                },
                HttpStatus.OK,
            );
        } catch (error) {
            return new HttpException(
                {
                    message: 'Error to get wallet',
                    error: error.message
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async getHistoryWallet(token: any){
        try {
            const tokenDecoded = this.userService.decodeToken(token);

            if (!tokenDecoded.id) {
                return new HttpException(
                    { message: 'Token wrong' },
                    HttpStatus.CONFLICT,
                );
            }

            const user = await this.userService.findOne(tokenDecoded.id);

            if (user.getStatus() != 200) {
                return user;
            }

            const request_ids = await this.requestService.getAllRequestByUser(tokenDecoded.id);

            console.log(request_ids.getResponse()['data']);

            const wallet = await this.paymentRepository.find({
                where: { request_id: In(request_ids.getResponse()['data']) }
            })

            if(wallet.length === 0){
                return new HttpException(
                    {
                        message: 'history wallet not found',
                        data: []
                    },
                    HttpStatus.OK,
                );
            }

            return new HttpException(
                {
                    message: 'history wallet',
                    data: wallet
                },
                HttpStatus.OK,
            );
        } catch (error) {
            return new HttpException(
                {
                    message: 'Error to get wallet',
                    error: error.message
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }
}
