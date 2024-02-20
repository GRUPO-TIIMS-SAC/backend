import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from 'src/entities/services.entity';
import { Repository } from 'typeorm';
import { CreateServiceDto } from './dto/create-service.dto';
import { SubspecialitiesService } from 'src/subspecialities/subspecialities.service';
import { sub } from 'date-fns';
import { UsersService } from 'src/users/users.service';
import { ProfilesService } from 'src/profiles/profiles.service';
import { Utils } from 'src/utils/utils';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
    private readonly subspecialityService: SubspecialitiesService,
    private readonly userService: UsersService,
    private readonly profileService: ProfilesService
  ) { }

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

      const subspeciality = await this.subspecialityService.getOne(
        body.subspeciality_id,
      );

      if (subspeciality.getStatus() != 200) {
        return subspeciality;
      }

      //VALID DUPLICATED SERVICE
      const servicesFound = await this.serviceRepository.findOne({
        where: { user_id: tokenDecoded.id, subspeciality_id: body.subspeciality_id },
      });

      if (servicesFound) {
        const newService = Object.assign(servicesFound, body);
        const respData = await this.serviceRepository.save(newService);
        console.log(newService)
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

      if (!services || services.length === 0) {
        return new HttpException(
          { message: 'No services found' },
          HttpStatus.NOT_FOUND,
        );
      }

      return new HttpException(
        {
          data: services.map((element) => {
            return {
              subspeciality_id: element.subspeciality_id,
              amount: element.amount,
              unit_id: element.unit_id,
            }
          }), message: 'Services found'
        },
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

      if (subspecialities.getStatus() != 200) {
        return subspecialities;
      }

      const services = await this.serviceRepository.find({
        where: { subspeciality_id: subspecialities.getResponse()['id'] },
      });

      if (!services || services.length === 0) {
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

  async getBySubspecility(subspeciality_id: number) {
    try {

      const services = await this.serviceRepository.find({
        where: { subspeciality_id: subspeciality_id },
        relations: ['user', 'unit', 'subspeciality'],
      });


      if (!services || services.length === 0) {
        return new HttpException(
          { message: 'No services found' },
          HttpStatus.NOT_FOUND,
        );
      }

      const respData = await Promise.all(
        services.map(async (element) => {
          const awaitElement = await element;
          const profile = await this.profileService.getByuser(element.user.id);
          return {
            ...element,
            profile: {
              ...profile.getResponse()['data'],
              profile_photo: new Utils().route() + '/images_upload/' + profile.getResponse()['data']['profile_photo']
            }
          }
        })
      )


      return new HttpException(
        { data: respData, message: 'Services found' },
        HttpStatus.OK,
      );
    }
    catch (error) {
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
        where: { id: id },
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

  async subSpecialityLowestPrice(specility: number) {
    try {
      const subspecialities = await this.subspecialityService.getBySpeciality(specility);

      if (subspecialities.getStatus() != 200) {
        return subspecialities;
      }

      const respWithLowestPrice = await Promise.all(
        subspecialities.getResponse()['data'].map(async (element) => {
          console.log(await element);
          const asyncElement = await element;
          console.log(asyncElement.id);
          const services = await this.lowestPrice(asyncElement.id);

          if (services.getStatus() != 200) {
            return {
              name: asyncElement.name,
              id: asyncElement.id,
              lowest_price: 0
            }
          }

          const servicesData = services.getResponse()['data'];
          console.log(servicesData);

          return {
            name: asyncElement.name,
            id: asyncElement.id,
            lowest_price: servicesData['amount'],
          }
        })
      )

      return new HttpException(
        { data: respWithLowestPrice, message: 'Subspecilities with lowest price' },
        HttpStatus.OK,
      );
    } catch (error) {
      return new HttpException(
        { message: 'Error getting lowest price', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  async lowestPrice(subspeciality_id: number) {
    try {
      const services = await this.serviceRepository.findOne({
        where: { subspeciality_id: subspeciality_id },
        relations: ['user', 'unit', 'subspeciality'],
        order: { amount: 'ASC' },
      });

      if (!services) {
        return new HttpException(
          { message: 'No services found' },
          HttpStatus.NOT_FOUND,
        );
      }

      return new HttpException(
        {
          data: {
            specialist: services.user.fullname,
            unit: services.unit.unit,
            subspecility: services.subspeciality.name,
            amount: services.amount
          },
          message: 'Lowest price found'
        },
        HttpStatus.OK,
      );
    } catch (error) {
      return new HttpException(
        { message: 'Error getting lowest price', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }
}
