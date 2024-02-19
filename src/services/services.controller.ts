import { Controller, Post, Headers, Body, Get, Param, ParseIntPipe, Delete } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Services')
@Controller('services')
export class ServicesController {
    constructor(private readonly servicesService: ServicesService) { }

    @Post()
    async create(
        @Headers('authorization') token: any,
        @Body() body: CreateServiceDto,
    ) {
        return this.servicesService.create(token, body);
    }

    @Get('speciality/:id')
    async getServicesBySpeciality(@Param('id', ParseIntPipe) id: number) {
        return this.servicesService.getBySpeciality(id);
    }

    @Get('user-subspeciality/:id')
    async getServicesByUserSubspeciality(
        @Headers('authorization') token: any, 
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.servicesService.getByUserSubspeciality(token, id);
    }

    @Delete(':id')
    async deleteService(@Headers('authorization') token: any, @Param('id', ParseIntPipe) id: number) {
        return this.servicesService.delete(token, id);
    }

    @Get('lowest-price/subspecility/:id')
    async getLowestPrice(@Param('id', ParseIntPipe) id: number) {
        return this.servicesService.lowestPrice(id);
    }

    @Get('subspecilities-price/:id')
    async getSubspecialitiesPrice(@Param('id', ParseIntPipe) id: number) {
        return this.servicesService.subSpecialityLowestPrice(id);
    }

}
