import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from 'src/entities/payments.entity';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class PaymentService {

    constructor(
        @InjectRepository(Payment)
        private readonly paymentRepository: Repository<Payment>,
        private httpService: HttpService
    ) { }

    async createOrder() {
        try {
            const headersRequest = {
                Authorization: 'Bearer sk_test_11af72fddb37df11',
                'content-type': 'application/json',
            };

            const bodyRequest = {

                amount: 10000,
                currency_code: "PEN",
                email: "richard@piedpiper.com",
                source_id: "tkn_test_qpSa1MrqYGaPXLBC",
                capture: true,
                antifraud_details: {
                    address: "Avenida Lima 1234",
                    address_city: "Lima",
                    country_code: "PE",
                    first_name: "culqi",
                    last_name: "core",
                    phone_number: "999777666"

                },
                metadata:
                {
                    documentNumber: "77723083"
                }

            }

            const response = await this.httpService.post(
                'https://api.culqi.com/v2/charges',
                bodyRequest,
                { headers: headersRequest }).toPromise();
            console.log(response.data);
        } catch (error) {
            console.error('Error al crear la orden:', error);
        }

    }
}
