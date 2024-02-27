import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubSpeciality } from 'src/entities/subspecialities.entity';
import { SpecialitiesService } from 'src/specialities/specialities.service';
import { Repository } from 'typeorm';
import { CreateSubSpecialityDto } from './dto/create_subspecialities.dto';
import { UpdateSubSpecialtyDto } from './dto/update_subspecialities.dto';
import { ServicesService } from 'src/services/services.service';

@Injectable()
export class SubspecialitiesService {
  constructor(
    @InjectRepository(SubSpeciality)
    private readonly subSpecialityRepository: Repository<SubSpeciality>,
    private readonly specialityService: SpecialitiesService,
  ) { }

  async create(body: CreateSubSpecialityDto) {
    try {
      const validSpeciality = await this.specialityService.getOne(
        body.speciality_id,
      );

      if (!validSpeciality) {
        return new HttpException('Speciality not found', HttpStatus.NOT_FOUND);
      }

      const subSpecialityExists = await this.subSpecialityRepository.findOne({
        where: {
          speciality_id: body.speciality_id,
          name: body.name,
        },
      });

      if (subSpecialityExists) {
        return new HttpException(
          'Speciality already exists',
          HttpStatus.CONFLICT,
        );
      }

      const newProfile = this.subSpecialityRepository.create(body);
      const respData = await this.subSpecialityRepository.save(newProfile);
      return new HttpException(
        { data: respData, message: 'Speciality created' },
        HttpStatus.CREATED,
      );
    } catch (error) {
      console.log('Error: ', error);
      return new HttpException(
        { message: 'Error creating profile' },
        HttpStatus.CONFLICT,
      );
    }
  }

  async getAll() {
    try {
      const subspecialities = await this.subSpecialityRepository.find();
      if (subspecialities.length === 0) {
        return new HttpException(
          { message: 'No subspecialities found' },
          HttpStatus.NOT_FOUND,
        );
      }

      return new HttpException(
        { data: subspecialities, message: 'Subspeciality found' },
        HttpStatus.OK,
      );
    } catch (error) {
      console.log('Error: ', error);
      return new HttpException(
        { message: 'Error finding profiles' },
        HttpStatus.CONFLICT,
      );
    }
  }

  async getBySpeciality(speciality_id: number) {
    try {
      const speciality = await this.specialityService.getOne(speciality_id);

      if (speciality.getStatus() !== 200) {
        return speciality;
      }

      const specialityName = speciality.getResponse()['data']['name'];

      const subspecialities = await this.subSpecialityRepository.find({
        where: {
          speciality_id: speciality_id,
        },
      });

      if (subspecialities.length === 0) {
        return new HttpException(
          { message: 'No subspecialities found', data: [] },
          HttpStatus.NOT_FOUND,
        );
      }

      return new HttpException(
        {
          data: subspecialities.map((element) => {
            return { id: element.id, name: element.name };
          }),
          message: `Subspeciality of ${specialityName} found`,
        },
        HttpStatus.OK,
      );
    } catch (error) {
      console.log('Error: ', error);
      return new HttpException(
        { message: 'Error finding profiles' },
        HttpStatus.CONFLICT,
      );
    }
  }

  async getOne(id: number) {
    try {
      const profile = await this.subSpecialityRepository.findOne({
        where: {
          id: id,
        },
        relations: ['speciality'],
      });
      console.log({ profile })

      if (!profile) {
        throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
      }

      return new HttpException(
        { data: profile, message: 'Profile found' },
        HttpStatus.OK,
      );
    } catch (error) {
      console.log('Error: ', error);
      throw new HttpException('Error finding profile', HttpStatus.CONFLICT);
    }
  }

  async update(id: number, body: UpdateSubSpecialtyDto) {
    try {
      const profile = await this.subSpecialityRepository.findOne({
        where: {
          id: id,
        },
      });

      if (!profile) {
        throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
      }

      const updatedProfile = await this.subSpecialityRepository.update(
        id,
        body,
      );

      return new HttpException(
        { data: updatedProfile, message: 'Profile updated' },
        HttpStatus.OK,
      );
    } catch (error) {
      console.log('Error: ', error);
      throw new HttpException('Error updating profile', HttpStatus.CONFLICT);
    }
  }
}
