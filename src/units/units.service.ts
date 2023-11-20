import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Unit } from 'src/entities/units.entity';
import { Repository } from 'typeorm';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';

@Injectable()
export class UnitsService {
    constructor(
        @InjectRepository(Unit)
        private readonly unitsRepository: Repository<Unit>
    ){}

    async createUnit(unit: CreateUnitDto){
        const unitExists = await this.unitsRepository.findOne({
            where: {
                id_category: unit.id_category,
                unit: unit.unit,
            }
        });

        if(unitExists){
            return new HttpException('Unit already exists', HttpStatus.CONFLICT);
        }

        const newUnit = this.unitsRepository.create(unit);
        return this.unitsRepository.save(newUnit);
    }

    async getUnitsByCategory(id_category: number){
        const units = await this.unitsRepository.find({
            where: {
                id_category: id_category,
            }
        });

        if(!units){
            return new HttpException('Units not found', HttpStatus.NOT_FOUND);
        }

        return units;
    }

    async getUnitById(id: number){
        const unit = await this.unitsRepository.findOne({
            where: {
                id: id,
            }
        });

        if(!unit){
            return new HttpException('Unit not found', HttpStatus.NOT_FOUND);
        }

        return unit;
    }

    async deleteUnit(id: number){
        const result = await this.unitsRepository.delete({id});

        if(result.affected === 0){
            return new HttpException('Unit not found', HttpStatus.NOT_FOUND);
        }

        return result;
    }

    async updateUnit(id: number, unit: UpdateUnitDto){
        const unitFound = await this.unitsRepository.findOne({
            where: {
                id: id,
            }
        });

        if(!unitFound){
            return new HttpException('Unit not found', HttpStatus.NOT_FOUND);
        }

        const updateUnit = Object.assign(unitFound, unit);
        return this.unitsRepository.save(updateUnit);
    }
}
