import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { SpecialitiesService } from './specialities.service';
import { CreateSpecialityDto } from './dto/create_speciality.dto';
import { UpdateSpecialtyDto } from './dto/update_speciality.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('specialities')
@Controller('specialities')
export class SpecialitiesController {
    constructor(
        private readonly specialitiesService: SpecialitiesService
    ) {}

    @Post()
    async create(@Body() body: CreateSpecialityDto) {
        return this.specialitiesService.create(body);
    }

    @Get()
    async getAll() {
        return this.specialitiesService.getAll();
    }

    @Get(':id')
    async getOne(@Param('id', ParseIntPipe) id: number) {
        return this.specialitiesService.getOne(id);
    }

    @Patch(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateSpecialtyDto) {
        return this.specialitiesService.update(id, body);
    }
}
