import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UnitsService } from './units.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('units')
@Controller('units')
export class UnitsController {
    constructor(
        private unitsService: UnitsService
    ){}

    @Post()
    async create(@Body() body: CreateUnitDto) {
        return await this.unitsService.create(body);
    }

    @Get()
    async getAll() {
        return await this.unitsService.getAll();
    }
}
