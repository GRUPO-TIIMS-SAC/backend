import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { SpecialistsJobService } from './specialists_job.service';
import { CreateSpecialistJobDto } from './dto/create-specialist_job.dto';
import { UpdateSpecialistJobDto } from './dto/update-spacialist_job.dto';

@Controller('specialists-job')
export class SpecialistsJobController {
    constructor(private readonly specialistJobService: SpecialistsJobService){}

    @Post()
    createSpecialistJob(@Body() newSpecialistJob: CreateSpecialistJobDto){
        return this.specialistJobService.createSpecialistJob(newSpecialistJob);
    }

    @Get()
    getSpecialistsJob(){
        return this.specialistJobService.getSpecialistsJob();
    }

    @Get('specialist/:id')
    getSpecialistJobByIdSpecialist(@Param('id', ParseIntPipe) id_specialist: number){
        return this.specialistJobService.getSpecialistJobByIdSpecialist(id_specialist);
    }

    @Delete(':id')
    deleteSpecialistJob(@Param('id', ParseIntPipe) id: number){
        return this.specialistJobService.deleteSpecialistJob(id);
    }

    @Patch(':id')
    updateSpecialistJob(
        @Param('id', ParseIntPipe) id: number,
        @Body() specialistJob: UpdateSpecialistJobDto,
    ){
        return this.specialistJobService.updateSpecialistJob(id, specialistJob);
    }
}
