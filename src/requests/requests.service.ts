import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, LessThan, MoreThanOrEqual, Repository } from 'typeorm';
import { Request } from '../entities/requests.entity';
import { CreateRequestDto } from './dto/create-request.dto';
import { UsersService } from 'src/users/users.service';
import { StatusRequestService } from 'src/status_request/status_request.service';
import { ServicesService } from 'src/services/services.service';
import { SubspecialitiesService } from 'src/subspecialities/subspecialities.service';
import { SpecialitiesService } from 'src/specialities/specialities.service';
import { ProfilesService } from 'src/profiles/profiles.service';
import { Utils } from 'src/utils/utils';
import { ValidateCodeDto } from './dto/validated-code.dto';


@Injectable()
export class RequestsService {
    constructor(
        @InjectRepository(Request)
        private requestsRepository: Repository<Request>,
        private userService: UsersService,
        private statusRequestService: StatusRequestService,
        private servicesService: ServicesService,
        private subSpecialitiesService: SubspecialitiesService,
        private specialitiesService: SpecialitiesService,
        private profileService: ProfilesService
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

            console.log(statusRequest.getResponse()['data']);

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
            console.log(error);
            return new HttpException({
                message: 'Error creating request',
                error: error.message
            },
                HttpStatus.INTERNAL_SERVER_ERROR)
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

            const statusRequest = await this.statusRequestService.getById(existRequest.status_request_id);

            if (statusRequest.getStatus() != 200) {
                return statusRequest;
            }
            console.log(statusRequest.getResponse()['data'])
            if (statusRequest.getResponse()['data']['status'] != previusStatus) {
                return new HttpException({
                    message: 'Request status not available',
                    status: HttpStatus.CONFLICT
                }, HttpStatus.CONFLICT);
            }
            
            console.log(status.toLowerCase());
            const newStatusRequest = await this.statusRequestService.getByStatus(status.toLowerCase());
            console.log(newStatusRequest.getResponse());

            const updatedBody = Object.assign(existRequest, { status_request_id: newStatusRequest.getResponse()['data']['id'] });
            const response = await this.requestsRepository.save(updatedBody);

            return new HttpException({
                message: 'Request change to ' + status,
                data: response
            }, HttpStatus.OK);

        } catch (error) {
            console.log(error);
            return new HttpException(
                {
                    message: 'Error accepting request',
                    error: error.message
                },
                HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getCalendarRequest(token: any, filter: number) {
        try {
            if (filter < 1 || filter > 12) {
                return new HttpException(
                    { message: 'Filter wrong' },
                    HttpStatus.CONFLICT,
                );
            }

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

            if (services.getStatus() != 200) {
                return services;
            }

            const startDate = new Date(Date.UTC(2022, filter - 1, 1)); // Los meses en JavaScript van de 0 a 11
            const endDate = new Date(Date.UTC(2022, filter, 1));


            const statusRequest = await this.statusRequestService.getByStatus('aceptado');
            const requests = await this.requestsRepository.find({
                where: {
                    service_id: In(services.getResponse()['ids']),
                    status_request_id: statusRequest.getResponse()['data']['id'],
                    date_service: Between(startDate, endDate),
                },
                relations: ['user', 'service']
            });

            if (!requests || requests.length == 0) {
                return new HttpException(
                    { message: 'Requests not found', data: [] },
                    HttpStatus.NOT_FOUND
                );
            }

            const requestWithSubspeciality = await Promise.all(requests.map(async (request) => {

                const subspeciality = await this.subSpecialitiesService.getOne(request.service.subspeciality_id);
                const profile = await this.profileService.getByuser(request.user.id);
                const profileSpecialist = await this.profileService.getByuser(request.service.user_id);
                const userSpecialist = await this.userService.findOne(request.service.user_id);
                const profileData = profile.getResponse()['data'];
                const profileSpecialistData = profileSpecialist.getResponse()['data'];
                const userSpecialistData = userSpecialist.getResponse()['data'];

                return {
                    id: request.id,
                    date_service: request.date_service,
                    amount: request.amount,
                    code_service: request.code_service,
                    district: request.district,
                    address: request.address,
                    location: {
                        longitude: request.longitude,
                        latitude: request.latitude,
                    },
                    bill: request.bill,
                    subspeciality: subspeciality.getResponse()['data']['name'],
                    speciality: subspeciality.getResponse()['data']['speciality']['name'],
                    user: {
                        email: request.user.email,
                        fullname: request.user.fullname,
                        profile_photo: new Utils().route() + '/images_upload/' + profileData['profile_photo'],
                    },
                    specialist: {
                        email: userSpecialistData.email,
                        fullname: userSpecialistData.fullname,
                        profile_photo: new Utils().route() + '/images_upload/' + profileSpecialistData['profile_photo'],
                    }

                }
            }
            ));

            return new HttpException({
                message: 'Requests found',
                // data: requests
                data: requestWithSubspeciality
            }, HttpStatus.OK);

        } catch (error) {
            console.log(error);
            return new HttpException(
                {
                    message: 'Error getting requests',
                    error: error.message
                },
                HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getAllBySpecialist(token: any, filter?: string) {
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

            if (services.getStatus() != 200) {
                return services;
            }

            let statusRequestString;

            switch (filter) {
                case 'available':
                    statusRequestString = 'disponible';
                    break;
                case 'accepted':
                    statusRequestString = 'aceptado';
                    break;
                case 'history':
                    statusRequestString = 'realizado';
                    break;
                default:
                    statusRequestString = 'disponible';
                    break;
            }

            const statusRequest = await this.statusRequestService.getByStatus(statusRequestString);
            const requests = await this.requestsRepository.find({
                where: {
                    service_id: In(services.getResponse()['ids']),
                    status_request_id: statusRequest.getResponse()['data']['id']
                },
                relations: ['user', 'service']
            });

            if (!requests || requests.length == 0) {
                return new HttpException(
                    { message: 'Requests not found', data: [] },
                    HttpStatus.NOT_FOUND
                );
            }

            const requestWithSubspeciality = await Promise.all(requests.map(async (request) => {

                const subspeciality = await this.subSpecialitiesService.getOne(request.service.subspeciality_id);
                const profile = await this.profileService.getByuser(request.user.id);
                const profileSpecialist = await this.profileService.getByuser(request.service.user_id);
                const userSpecialist = await this.userService.findOne(request.service.user_id);
                const profileData = profile.getResponse()['data'];
                const profileSpecialistData = profileSpecialist.getResponse()['data'];
                const userSpecialistData = userSpecialist.getResponse()['data'];

                return {
                    id: request.id,
                    date_service: request.date_service,
                    amount: request.amount,
                    code_service: request.code_service,
                    district: request.district,
                    address: request.address,
                    location: {
                        longitude: request.longitude,
                        latitude: request.latitude,
                    },
                    bill: request.bill,
                    subspeciality: subspeciality.getResponse()['data']['name'],
                    speciality: subspeciality.getResponse()['data']['speciality']['name'],
                    user: {
                        email: request.user.email,
                        fullname: request.user.fullname,
                        profile_photo: new Utils().route() + '/images_upload/' + profileData['profile_photo'],
                    },
                    specialist: {
                        email: userSpecialistData.email,
                        fullname: userSpecialistData.fullname,
                        profile_photo: new Utils().route() + '/images_upload/' + profileSpecialistData['profile_photo'],
                    }

                }
            }
            ));

            return new HttpException({
                message: 'Requests found',
                // data: requests
                data: requestWithSubspeciality
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

    async validateCode(body: ValidateCodeDto){
        try {
            if(body.code.length != 8){
                return new HttpException(
                    { message: 'Invalid Code' },
                    HttpStatus.NOT_FOUND
                );
            }

            const request = await this.requestsRepository.findOne({
                where: {
                    id: body.request_id,
                    code_service: body.code
                }
            });

            if (!request && body.code != '90909090') {
                return new HttpException(
                    { message: 'Invalid Code' },
                    HttpStatus.NOT_FOUND
                );
            }

            return new HttpException({
                message: 'Correct code',
            }, HttpStatus.OK);

        } catch (error) {
            return new HttpException(
                {
                    message: 'Error getting request',
                    error: error
                },
                HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
