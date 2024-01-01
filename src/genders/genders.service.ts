import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Gender } from 'src/entities/genders.entity';
import { Repository } from 'typeorm';
import { CreateUpdateGender } from './dto/create--update-gender.dto';

@Injectable()
export class GendersService {
    constructor(
        @InjectRepository(Gender)
        private readonly gendersRepository: Repository<Gender>
    ){}

    async createGender(body: CreateUpdateGender): Promise<Gender> {
        const genderExists = await this.gendersRepository.findOne({
            where: {
                gender: body.gender
            }
        });

        if(genderExists){
            throw new HttpException('Auth method already exists', HttpStatus.CONFLICT);
        }

        const newAuthMethod = this.gendersRepository.create(body);
        return this.gendersRepository.save(newAuthMethod);
    }

    async getAll(): Promise<Gender[]> {
        return this.gendersRepository.find();
    }

    async getOne(id:number): Promise<Gender> {
        const exists = await this.gendersRepository.findOne({
            where: {
                id: id
            }
        });

        if(!exists){
            throw new HttpException('Gender not found', HttpStatus.NOT_FOUND);
        }

        return exists
    }

    async update(id: number ,gender: CreateUpdateGender): Promise<Gender> {
        const genderFound = await this.gendersRepository.findOne({
            where: {
                id: id
            }
        });

        if(!genderFound){
            throw new HttpException('Gender not found', HttpStatus.NOT_FOUND);
        }

        const updateGender = Object.assign(genderFound, gender);
        return this.gendersRepository.save(updateGender);
    }

    async remove(id: number): Promise<void> {
        const result = await this.gendersRepository.delete({id});

        if(result.affected === 0){
            throw new HttpException('Gender not found', HttpStatus.NOT_FOUND);
        }

        throw new HttpException('Gender deleted successfully', HttpStatus.OK);
    }
}
