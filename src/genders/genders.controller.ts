import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { GendersService } from './genders.service';
import { CreateUpdateGender } from './dto/create--update-gender.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Genders')
@Controller('genders')
export class GendersController {
    constructor(
        private readonly gendersService: GendersService
    ){}

    @Post()
    async createDocument(@Body() body: CreateUpdateGender){
        return this.gendersService.createGender(body);
    }

    @Get()
    getDocuments(){
        return this.gendersService.getAll();
    }

    @Get(':id')
    getOneDocument(@Param('id', ParseIntPipe) id: number){
        return this.gendersService.getOne(id);
    }

    @Delete(':id')
    deleteDocument(@Param('id', ParseIntPipe) id: number){
        return this.gendersService.remove(id);
    }

    @Patch(':id')
    updateDocument(@Param('id', ParseIntPipe) id: number, @Body() body: CreateUpdateGender){
        return this.gendersService.update(id, body);
    }

}
