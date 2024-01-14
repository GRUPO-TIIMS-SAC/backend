import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { SubspecialitiesService } from './subspecialities.service';
import { CreateSubSpecialityDto } from './dto/create_subspecialities.dto';
import { UpdateSubSpecialtyDto } from './dto/update_subspecialities.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Subspecialities')
@Controller('subspecialities')
export class SubspecialitiesController {
    constructor(
        private readonly subSpecialitiesService: SubspecialitiesService
    ) {}

    @Post()
    async create(@Body() body: CreateSubSpecialityDto) {
        return this.subSpecialitiesService.create(body);
    }

    @Get()
    async getAll() {
        return this.subSpecialitiesService.getAll();
    }

    @Get(':id')
    async getOne(@Param('id', ParseIntPipe) id: number) {
        return this.subSpecialitiesService.getOne(id);
    }    

    @Patch(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateSubSpecialtyDto) {
        return this.subSpecialitiesService.update(id, body);
    }
}
