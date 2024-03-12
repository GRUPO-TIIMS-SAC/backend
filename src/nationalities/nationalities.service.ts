import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Nationality } from 'src/entities/nacionalities.entity';
import { Repository } from 'typeorm';
import { CreateUpdateNationality } from './dto/create-update-nationality.dto';

@Injectable()
export class NationalitiesService {
    constructor(
        @InjectRepository(Nationality)
        private readonly nationalityRepository: Repository<Nationality>
    ) { }

    async create(body: CreateUpdateNationality): Promise<Nationality> {
        const nationalityExist = await this.nationalityRepository.findOne({
            where: {
                nationality: body.nationality
            }
        });

        if (nationalityExist) {
            throw new HttpException('Nationality already exists', HttpStatus.CONFLICT);
        }

        const newNationality = this.nationalityRepository.create(body);
        return this.nationalityRepository.save(newNationality);
    }

    async getAll(): Promise<Nationality[]> {
        return this.nationalityRepository.find({ order: { nationality: 'ASC' } });
    }

    async getOne(id: number): Promise<Nationality> {
        const exists = await this.nationalityRepository.findOne({
            where: {
                id: id
            }
        });

        if (!exists) {
            throw new HttpException('Nationality not found', HttpStatus.NOT_FOUND);
        }

        return exists
    }

    async update(id: number, gender: CreateUpdateNationality): Promise<Nationality> {
        const nationalityFound = await this.nationalityRepository.findOne({
            where: {
                id: id
            }
        });

        if (!nationalityFound) {
            throw new HttpException('Nationality not found', HttpStatus.NOT_FOUND);
        }

        const updateNationality = Object.assign(nationalityFound, gender);
        return this.nationalityRepository.save(updateNationality);
    }

    async remove(id: number): Promise<void> {
        const result = await this.nationalityRepository.delete({ id });

        if (result.affected === 0) {
            throw new HttpException('Nationality not found', HttpStatus.NOT_FOUND);
        }

        throw new HttpException('Nationality deleted successfully', HttpStatus.OK);
    }
}
