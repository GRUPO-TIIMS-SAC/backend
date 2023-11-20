import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SpecialistJob } from 'src/entities/specialists_jobs.entity';
import { Repository } from 'typeorm';
import { CreateSpecialistJobDto } from './dto/create-specialist_job.dto';
import { UpdateSpecialistJobDto } from './dto/update-spacialist_job.dto';
import { UpdateUnitDto } from 'src/units/dto/update-unit.dto';

@Injectable()
export class SpecialistsJobService {
    constructor(
        @InjectRepository(SpecialistJob)
        private readonly specialistsJobRepository: Repository<SpecialistJob>
    ){}

    async createSpecialistJob(specialistJob: CreateSpecialistJobDto){
        const specialistJobExists = await this.specialistsJobRepository.findOne({
            where: {
                id_specialist: specialistJob.id_specialist,
                id_category: specialistJob.id_category,
            }
        });

        if(specialistJobExists){
            return new HttpException('Specialist job already exists', HttpStatus.CONFLICT);
        }

        const newSpecialistJob = this.specialistsJobRepository.create(specialistJob);
        return this.specialistsJobRepository.save(newSpecialistJob);
    }

    getSpecialistsJob(){
        return this.specialistsJobRepository.find({
            order: {
                id: 'ASC',
            },
        });
    }

    async getSpecialistJobByIdSpecialist(id_specialist: number){
        const specialistJobFound = await this.specialistsJobRepository.findOne({
            where: {
                id_specialist: id_specialist,
            },
        });

        if(!specialistJobFound){
            return new HttpException('Specialist job not found', HttpStatus.NOT_FOUND);
        }

        return specialistJobFound;
    }

    async deleteSpecialistJob(id: number){
        const result = await this.specialistsJobRepository.delete({id});

        if(result.affected === 0){
            return new HttpException('Specialist job not found', HttpStatus.NOT_FOUND);
        }

        return result;
    }

    async updateSpecialistJob(id: number, specialistJob: UpdateSpecialistJobDto){
        const specialistJobFound = await this.specialistsJobRepository.findOne({
            where: {
                id: id,
            },
        });

        if(!specialistJobFound){
            return new HttpException('Specialist job not found', HttpStatus.NOT_FOUND);
        }

        const combinationExists = await this.specialistsJobRepository.findOne({
            where: {
                id_specialist: specialistJobFound.id_specialist,
                id_category: specialistJob.id_category,
            },
        });

        if(combinationExists){
            return new HttpException('Combination already exists', HttpStatus.CONFLICT);
        }

        const updateSpecialistJob = Object.assign(specialistJobFound, specialistJob);
        return this.specialistsJobRepository.save(updateSpecialistJob);
    }
}
