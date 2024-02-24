import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Request } from '../entities/requests.entity';
import { CreateRequestDto } from './dto/create-request.dto';
import { UsersService } from 'src/users/users.service';
import { StatusRequestService } from 'src/status_request/status_request.service';
import { ServicesService } from 'src/services/services.service';


@Injectable()
export class RequestsService {
    constructor(
        @InjectRepository(Request)
        private requestsRepository: Repository<Request>,
        private userService: UsersService,
        private statusRequestService: StatusRequestService,
        private servicesService: ServicesService
    ) { }

    private generateRandomCode(): string {
        const codeLength = 8;
        let code = '';

        for (let i = 0; i < codeLength; i++) {
            code += Math.floor(Math.random() * 10).toString();
        }

        return code;
    }

    async create(token: any, body: CreateRequestDto) {
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

            const statusRequest = await this.statusRequestService.getByStatus('borrador');

            if (statusRequest.getStatus() != 200) {
                return statusRequest;
            }

            const newBody = {
                ...body,
                user_id: user.getResponse()['data']['id'],
                status_request_id: statusRequest.getResponse()['data']['id'],
                code_service: this.generateRandomCode()
            }

            const request = this.requestsRepository.create(newBody);
            const response = await this.requestsRepository.save(request);
            return new HttpException({ message: 'Request created', data: response }, HttpStatus.CREATED);
        } catch (error) {
            return new HttpException({ message: 'Error creating request', error: error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async changeStatus(id: number, status: string, previusStatus: string) {
        try {
            const existRequest = await this.requestsRepository.findOne({
                where: {
                    id: id
                }
            });

            if (!existRequest) {
                return new HttpException(
                    { message: 'Request not found' },
                    HttpStatus.NOT_FOUND
                );
            }

            const statusRequest = this.statusRequestService.getById(existRequest.status_request_id);

            if (statusRequest.getStatus() != 200) {
                return statusRequest;
            }

            if (statusRequest.getResponse()['data']['status'] != previusStatus) {
                return new HttpException({
                    message: 'Request status not available',
                    status: HttpStatus.CONFLICT
                }, HttpStatus.CONFLICT);
            }

            const newStatusRequest = this.statusRequestService.getByStatus(status.toLowerCase());

            const updatedBody = Object.assign(existRequest, { status_request_id: newStatusRequest.getResponse()['data']['id'] });
            const response = await this.requestsRepository.save(updatedBody);

            return new HttpException({
                message: 'Request change to ' + status,
                data: response
            }, HttpStatus.OK);

        } catch (error) {
            return new HttpException(
                {
                    message: 'Error accepting request',
                    error: error
                },
                HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getAllBySpecialist(token: any) {
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

            const services = await this.servicesService.getBySpecialist(user.getResponse()['data']['id']);

            if(services.getStatus() != 200) {
                return services;
            }

            const statusRequest = await this.statusRequestService.getByStatus('disponible');

            const requests = await this.requestsRepository.find({
                where: {
                    service_id: In(services.getResponse()['ids']),
                    status_request_id: statusRequest.getResponse()['data']['id']
                }
            });

            if (!requests || requests.length == 0) {
                return new HttpException(
                    { message: 'Requests not found' },
                    HttpStatus.NOT_FOUND
                );
            }
            
            return new HttpException({
                message: 'Requests found',
                data: requests
            }, HttpStatus.OK);
            
        } catch (error) {
            return new HttpException(
                {
                    message: 'Error getting requests',
                    error: error
                },
                HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
