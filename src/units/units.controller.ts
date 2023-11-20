import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { UnitsService } from './units.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateSpecialistDto } from 'src/specialists/dto/update-specialist.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';

@Controller('units')
export class UnitsController {
    constructor(private readonly unitService: UnitsService){}

    @Post()
    async createUnit(@Body() unit: CreateUnitDto){
        return this.unitService.createUnit(unit);
    }

    @Get('category/:id_category')
    async getUnitsByCategory(@Param('id_category', ParseIntPipe) id_category: number){
        return this.unitService.getUnitsByCategory(id_category);
    }

    @Get('specialist/:id_specialist')
    async getUnitById(@Param('id_specialist', ParseIntPipe) id: number){
        return this.unitService.getUnitById(id);
    }

    @Delete(':id')
    async deleteUnit(@Param('id', ParseIntPipe) id: number){
        return this.unitService.deleteUnit(id);
    }

    @Patch(':id')
    async updateUnit(@Param('id', ParseIntPipe) id: number, @Body() unit: UpdateUnitDto){
        return this.unitService.updateUnit(id, unit);
    }
}
