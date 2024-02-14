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

      const subspeciality = await this.subspecialityService.getOne(
        body.subspeciality_id,
      );

      if (subspeciality.getStatus() != 200) {
        return subspeciality;
      }

      //TODO Validar que exista unidad
      const service = this.serviceRepository.create({
        ...body,
        user_id: user.getResponse()['id'],
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
}
