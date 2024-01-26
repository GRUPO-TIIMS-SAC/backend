import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Speciality } from 'src/entities/specialities.entity';
import { In, Repository } from 'typeorm';
import { CreateSpecialityDto } from './dto/create_speciality.dto';
import { UpdateSpecialtyDto } from './dto/update_speciality.dto';

@Injectable()
export class SpecialitiesService {
  constructor(
    @InjectRepository(Speciality)
    private readonly specialityRepository: Repository<Speciality>,
  ) {}

  async create(body: CreateSpecialityDto) {
    try {
      const specialityExists = await this.specialityRepository.findOne({
        where: {
          name: body.name,
        },
      });
  
      if (specialityExists) {
        return new HttpException('Speciality already exists', HttpStatus.CONFLICT);
      }

      const newProfile = this.specialityRepository.create(body);
      const respData = await this.specialityRepository.save(newProfile);
      return new HttpException(
        { data: respData, message: 'Speciality created' },
        HttpStatus.CREATED,
      );
    } catch (error) {
      console.log('Error: ', error);
      return new HttpException({message: 'Error creating profile'}, HttpStatus.CONFLICT);
    }
  }

  async getAll() {
    try {
      const specialities = await this.specialityRepository.find();
      if (!specialities || specialities.length === 0) {
        return new HttpException({message: 'No specialities found', data: []}, HttpStatus.NOT_FOUND);
      }

      const dataResp = specialities.map((speciality) => {
        return {
          id: speciality.id,
          name: speciality.name, 
          img: speciality.img}
      });

      return new HttpException(
        { data: dataResp, message: 'Specialities found' },
        HttpStatus.OK,
      );
    } catch (error) {
      return new HttpException(
        {message:'Error getting specialities'},
        HttpStatus.CONFLICT,
      );
    }
  }

  async getOne(id: number) {
    try {
      const speciality = await this.specialityRepository.findOne({
        where: {
          id: id,
        },
      });

      if (!speciality) {
        throw new HttpException('Speciality not found', HttpStatus.NOT_FOUND);
      }
      return new HttpException(
        { data: speciality, message: 'Speciality found' },
        HttpStatus.OK,
      );
    } catch (error) {
      throw new HttpException('Error getting speciality', HttpStatus.CONFLICT);
    }
  }

  async update(id: number, body: UpdateSpecialtyDto) {
    if (body.name == null && body.img == null) {
      throw new HttpException('No data to update', HttpStatus.BAD_REQUEST);
    }

    try {
      const speciality = await this.specialityRepository.findOne({
        where: {
          id: id,
        },
      });

      if (!speciality) {
        throw new HttpException('Speciality not found', HttpStatus.NOT_FOUND);
      }

      await this.specialityRepository.update(id, body);

      return new HttpException(
        { data: speciality, message: 'Speciality updated' },
        HttpStatus.OK,
      );
    } catch (error) {
      throw new HttpException('Error updating speciality', HttpStatus.CONFLICT);
    }
  }
}
