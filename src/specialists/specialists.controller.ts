import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { SpecialistsService } from './specialists.service';
import { CreateSpecialistDto } from './dto/create-specialist.dto';
import { UpdateSpecialistDto } from './dto/update-specialist.dto';

@Controller('specialists')
export class SpecialistsController {
    constructor(private readonly specialistService: SpecialistsService) {}
    
    @Post()
    createSpecialist(@Body() specialist: CreateSpecialistDto) {
        return this.specialistService.createSpecialist(specialist);
    }

    @Get()
    getSpecialists() {
        return this.specialistService.getSpecialists();
    }

    @Get(':id')
    getSpecialistById(@Param('id', ParseIntPipe) id: number) {
        return this.specialistService.getSpecialistById(id);
    }

    @Delete(':id')
    deleteSpecialist(@Param('id', ParseIntPipe) id: number) {
        return this.specialistService.deleteSpecialist(id);
    }

    @Patch(':id')
    updateSpecialist(
        @Param('id', ParseIntPipe) id: number,
        @Body() specialist: UpdateSpecialistDto,
    ) {
        return this.specialistService.updateSpecialist(id, specialist);
    }
}
