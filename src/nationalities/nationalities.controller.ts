import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CreateUpdateNationality } from './dto/create-update-nationality.dto';
import { NationalitiesService } from './nationalities.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Nationalities')
@Controller('nationalities')
export class NationalitiesController {
    constructor(
        private readonly nationalitiesService: NationalitiesService
    ){}

    @Post()
    async createNationality(@Body() body: CreateUpdateNationality){
        return this.nationalitiesService.create(body);
    }

    @Get()
    getNationalities(){
        return this.nationalitiesService.getAll();
    }

    @Get(':id')
    getOneNationality(@Param('id', ParseIntPipe) id: number){
        return this.nationalitiesService.getOne(id);
    }

    @Delete(':id')
    deleteNationality(@Param('id', ParseIntPipe) id: number){
        return this.nationalitiesService.remove(id);
    }

    @Patch(':id')
    updateNationality(@Param('id', ParseIntPipe) id: number, @Body() body: CreateUpdateNationality){
        return this.nationalitiesService.update(id, body);
    }
}
