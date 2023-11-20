import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Specialist } from 'src/entities/specialists.entity';
import { Repository } from 'typeorm';
import { CreateSpecialistDto } from './dto/create-specialist.dto';
import { UpdateSpecialistJobDto } from 'src/specialists_job/dto/update-spacialist_job.dto';
import { UpdateSpecialistDto } from './dto/update-specialist.dto';

@Injectable()
export class SpecialistsService {
    constructor(
        @InjectRepository(Specialist)
        private readonly specialistsRepository: Repository<Specialist>
    ){}

    async createSpecialist(specialist: CreateSpecialistDto){
        const specialistExists = await this.specialistsRepository.findOne({
            where: {
                identity_document: specialist.identity_document,
                number_document: specialist.number_document,
            }
        });

        if(specialistExists){
            return new HttpException('Specialist already exists', HttpStatus.CONFLICT);
        }

        const newSpecialist = this.specialistsRepository.create(specialist);
        return this.specialistsRepository.save(newSpecialist);
    }

    getSpecialists(){
        return this.specialistsRepository.find({
            order: {
                id: 'ASC',
            },
        });
    }

    async getSpecialistById(id: number){
        const specialistFound = await this.specialistsRepository.findOne({
            where: {
                id: id,
            },
        });

        if(!specialistFound){
            return new HttpException('Specialist not found', HttpStatus.NOT_FOUND);
        }

        return specialistFound;
    }

    async deleteSpecialist(id: number){
        const result = await this.specialistsRepository.delete({ id });

        if(result.affected === 0){
            return new HttpException('Specialist not found', HttpStatus.NOT_FOUND);
        }

        return result;
    }

    async updateSpecialist(id: number, specialist: UpdateSpecialistDto){
        const specialistFound = await this.specialistsRepository.findOne({
            where: {
                id: id,
            },
        });

        if(!specialistFound){
            return new HttpException('Specialist not found', HttpStatus.NOT_FOUND);
        }

        const updatedSpecialist = Object.assign(specialistFound, specialist);
        return this.specialistsRepository.save(updatedSpecialist);
    }
}
