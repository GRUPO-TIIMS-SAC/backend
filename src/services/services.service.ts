import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from 'src/entities/services.entity';
import { Repository } from 'typeorm';
import { CreateServiceDto } from './dto/create-service.dto';
import { SubspecialitiesService } from 'src/subspecialities/subspecialities.service';
import { sub } from 'date-fns';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
    private readonly subspecialityService: SubspecialitiesService,
    private readonly userService: UsersService,
  ) {}

  async create(token: any, body: CreateServiceDto) {
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

      console.log(user)
      console.log(user.getResponse()['data']['id'])

      const subspeciality = await this.subspecialityService.getOne(
        body.subspeciality_id,
      );

      if (subspeciality.getStatus() != 200) {
        return subspeciality;
      }

      //VALID DUPLICATED SERVICE
      const services = await this.serviceRepository.find({
        where: { user_id: user.getResponse()['data']['id'], subspeciality_id: body.subspeciality_id },
      });
      console.log(services)
      console.log(body)

      if(services || services.length > 0){
        const newService = Object.assign(services, body);
        const respData = await this.serviceRepository.save(newService);
        return new HttpException(
          { data: respData, message: 'Service updated' },
          HttpStatus.CREATED,
        );
      } 

      //VALID AMOUNT
      if (body.amount <= 0) {
        return new HttpException(
          { message: 'Amount must be greater than 0' },
          HttpStatus.CONFLICT,
        );
      }

      //TODO Validar que exista unidad
      const service = this.serviceRepository.create({
        ...body,
        user_id: user.getResponse()['data']['id'],
      });
      const respData = await this.serviceRepository.save(service);
      return new HttpException(
        { data: respData, message: 'Service created' },
        HttpStatus.CREATED,
      );
    } catch (error) {
      return new HttpException(
        { message: 'Error creating service', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getByUserSubspeciality(token: any, subspeciality_id: number) {
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

      const services = await this.serviceRepository.find({
        where: { user_id: user.getResponse()['data']['id'], subspeciality_id: subspeciality_id },
      });

      if(!services || services.length === 0){
        return new HttpException(
          { message: 'No services found' },
          HttpStatus.NOT_FOUND,
        );
      }

      return new HttpException(
        { data: services.map((element) => {
          return {
            subspeciality_id: element.subspeciality_id,
            amount: element.amount,
            unit_id: element.unit_id,
          }
        }), message: 'Services found' },
        HttpStatus.OK,
      );

    } catch (error) {
      return new HttpException(
        { message: 'Error getting services', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getBySpeciality(speciality_id: number) {
    try {
      const subspecialities = await this.subspecialityService.getBySpeciality(speciality_id);
      
      if(subspecialities.getStatus() != 200){
        return subspecialities;
      }

      const services = await this.serviceRepository.find({
        where: { subspeciality_id: subspecialities.getResponse()['id'] },
      });

      if(!services || services.length === 0){
        return new HttpException(
          { message: 'No services found' },
          HttpStatus.NOT_FOUND,
        );
      }

      return new HttpException(
        { data: services, message: 'Services found' },
        HttpStatus.OK,
      );

    } catch (error) {
      return new HttpException(
        { message: 'Error getting services', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async delete(token: any, id: number) {
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

      const service = await this.serviceRepository.findOne({
        where: { id: id},
      });

      if (!service) {
        return new HttpException(
          { message: 'Service not found' },
          HttpStatus.NOT_FOUND,
        );
      }

      if (service.user_id != user.getResponse()['data']['id']) {
        return new HttpException(
          { message: 'You are not the owner of this service' },
          HttpStatus.UNAUTHORIZED,
        );
      }

      const respData = await this.serviceRepository.delete(id);
      return new HttpException(
        { message: 'Service deleted' },
        HttpStatus.OK,
      );
    } catch (error) {
      return new HttpException(
        { message: 'Error deleting service', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
