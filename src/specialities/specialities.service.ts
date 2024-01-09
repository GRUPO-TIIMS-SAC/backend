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
    const specialityExists = await this.specialityRepository.findOne({
      where: {
        name: body.name,
      },
    });

    if (specialityExists) {
      throw new HttpException('Speciality already exists', HttpStatus.CONFLICT);
    }

    try {
      const newProfile = this.specialityRepository.create(body);
      return new HttpException(
        { data: newProfile, message: 'Speciality created' },
        HttpStatus.CREATED,
      );
    } catch (error) {
      console.log('Error: ', error);
      throw new HttpException('Error creating profile', HttpStatus.CONFLICT);
    }
  }

  async getAll() {
    try {
      const specialities = await this.specialityRepository.find();
      if (specialities.length === 0) {
        throw new HttpException('No specialities found', HttpStatus.NOT_FOUND);
      }
      return new HttpException(
        { data: specialities, message: 'Specialities found' },
        HttpStatus.OK,
      );
    } catch (error) {
      throw new HttpException(
        'Error getting specialities',
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
