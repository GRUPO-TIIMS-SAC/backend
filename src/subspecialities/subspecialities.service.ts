import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubSpeciality } from 'src/entities/subspecialities.entity';
import { SpecialitiesService } from 'src/specialities/specialities.service';
import { Repository } from 'typeorm';
import { CreateSubSpecialityDto } from './dto/create_subspecialities.dto';
import { UpdateSubSpecialtyDto } from './dto/update_subspecialities.dto';

@Injectable()
export class SubspecialitiesService {
  constructor(
    @InjectRepository(SubSpeciality)
    private readonly subSpecialityRepository: Repository<SubSpeciality>,
    private readonly specialityService: SpecialitiesService,
  ) {}

  async create(body: CreateSubSpecialityDto) {
    const validSpeciality = await this.specialityService.getOne(body.speciality_id);

    if (!validSpeciality) {
      throw new HttpException('Speciality not found', HttpStatus.NOT_FOUND);
    }

    const subSpecialityExists = await this.subSpecialityRepository.findOne({
      where: {
        speciality_id: body.speciality_id,
        name: body.name,
      },
    });

    if (subSpecialityExists) {
      throw new HttpException('Speciality already exists', HttpStatus.CONFLICT);
    }

    try {
      const newProfile = this.subSpecialityRepository.create(body);
      return new HttpException(
        { data: newProfile, message: 'Speciality created' },
        HttpStatus.CREATED,
      );
    } catch (error) {
      console.log('Error: ', error);
      throw new HttpException('Error creating profile', HttpStatus.CONFLICT);
    }
  }

  async getAll(){
    try {
      const profiles = await this.subSpecialityRepository.find();
    
      if(profiles.length === 0){
        throw new HttpException('No profiles found', HttpStatus.NOT_FOUND);
      }

      return new HttpException(
        { data: profiles, message: 'Specialities found' },
        HttpStatus.OK,
      );
    } catch (error) {
      console.log('Error: ', error);
      throw new HttpException('Error finding profiles', HttpStatus.CONFLICT);
    }
  }

  async getOne(id: number) {
    try {
      const profile = await this.subSpecialityRepository.findOne({
        where: {
          id: id,
        },
      });
    
      if(!profile){
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
    
      if(!profile){
        throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
      }

      const updatedProfile = await this.subSpecialityRepository.update(id, body);

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
