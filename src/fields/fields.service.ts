import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Field } from 'src/entities/fields.entity';
import { Repository } from 'typeorm';
import { CreateFieldDto } from './dto/create-field.dto';

@Injectable()
export class FieldsService {
    constructor(
        @InjectRepository(Field)
        private readonly fieldRepository: Repository<Field>,
    ) {}

    async createField(field: CreateFieldDto) {
        const fieldExists = this.fieldRepository.findOne({
            where: {
                field: field.field,
            },
        });

        if(fieldExists) {
            return new HttpException('Field already exists', HttpStatus.CONFLICT);
        }

        const newField = this.fieldRepository.create(field);
        return this.fieldRepository.save(newField);
    }

    getFields() {
        return this.fieldRepository.find({
            order: {
                id: 'ASC',
            },
        });
    }

    async getFieldById(id: number) {
        const fieldFound = await this.fieldRepository.findOne({
            where: {
                id: id,
            },
        });

        if(!fieldFound) {
            return new HttpException('Field not found', HttpStatus.NOT_FOUND);
        }

        return fieldFound;
    }    

    async deleteField(id: number) {
        const result = await this.fieldRepository.delete({ id });

        if(result.affected === 0) {
            return new HttpException('Field not found', HttpStatus.NOT_FOUND);
        }

        return result;
    }

    async updateField(id: number, field: CreateFieldDto) {
        const fieldFound = await this.fieldRepository.findOne({
            where: {
                id: id,
            },
        });

        if(!fieldFound) {
            return new HttpException('Field not found', HttpStatus.NOT_FOUND);
        }

        const updatedField = Object.assign(fieldFound, field);
        return this.fieldRepository.save(updatedField);    
    }
}
