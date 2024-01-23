import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Unit } from 'src/entities/units.entity';
import { Repository } from 'typeorm';
import { CreateUnitDto } from './dto/create-unit.dto';

@Injectable()
export class UnitsService {
  constructor(
    @InjectRepository(Unit)
    private unitsRepository: Repository<Unit>,
  ) {}

  async create(body: CreateUnitDto) {
    try {
      const unit = await this.unitsRepository.findOne({
        where: {
          unit: body.unit,
        },
      });

      if (unit) {
        return new HttpException(
          { message: 'Unit already exists' },
          HttpStatus.CONFLICT,
        );
      }

      const newUnit = await this.unitsRepository.create(body);
      const respData = await this.unitsRepository.save(newUnit);

      return new HttpException(
        { message: 'Unit created', data: respData },
        HttpStatus.CREATED,
      );
    } catch (error) {
      return new HttpException(
        { message: 'Error creating Unit' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAll() {
    try {
      const units = await this.unitsRepository.find();
      if (!units) {
        return new HttpException(
          { message: 'No Units found' },
          HttpStatus.NOT_FOUND,
        );
      }
      return new HttpException(
        { message: 'Units found', data: units },
        HttpStatus.OK,
      );
    } catch (error) {
      return new HttpException(
        { message: 'Error getting all Units' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
