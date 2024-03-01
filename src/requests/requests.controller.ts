import { Controller, Post, Headers, Body, Get, Patch, Param, ParseIntPipe } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { ApiTags } from '@nestjs/swagger';
import { ValidateCodeDto } from './dto/validated-code.dto';

@ApiTags('Requests')
@Controller('requests')
export class RequestsController {
    constructor(
        private readonly requestsService: RequestsService,
    ) { }

    @Post('new')
    async create(
        @Body() body: CreateRequestDto,
        @Headers('authorization') token: any,
    ) {
        return this.requestsService.create(token, body);
    }

    @Patch('accept/:id')
    async acceptRequest(
        @Param('id', ParseIntPipe) id: number ,
    ) {
        return this.requestsService.changeStatus(id, 'aceptado', 'disponible');
    }

    @Patch('reject/:id')
    async rejectRequest(
        @Param('id', ParseIntPipe) id: number ,
    ) {
        return this.requestsService.changeStatus(id, 'rechazado', 'disponible');
    }

    @Patch('paid/:id')
    async paidRequest(
        @Param('id', ParseIntPipe) id: number ,
    ) {
        return this.requestsService.changeStatus(id, 'disponible', 'borrador');
    }

    @Get('is-paid/:id')
    async isPaid(
        @Param('id', ParseIntPipe) id: number ,
    ) {
        return this.requestsService.isPaid(id);
    }

    @Patch('execute/:id')
    async executeRequest(
        @Param('id', ParseIntPipe) id: number ,
    ) {
        return this.requestsService.changeStatus(id, 'ejecutando', 'aceptado');
    }

    @Patch('finish/:id')
    async finishRequest(
        @Param('id', ParseIntPipe) id: number ,
    ) {
        return this.requestsService.changeStatus(id, 'realizado', 'ejecutando');
    }

    @Post('validate-code')
    async validateCode(
        @Body() body: ValidateCodeDto,
    ) {
        return this.requestsService.validateCode(body);
    }

    @Get(':filter')
    async getAllBySpecialist(
        @Headers('authorization') token: any,
        @Param('filter') filter: string,
    ) {
        return this.requestsService.getAllBySpecialist(token, filter);
    }

    @Get('calendar/:month')
    async getCalendar(
        @Headers('authorization') token: any,
        @Param('month', ParseIntPipe) month: number,
    ) {
        return this.requestsService.getCalendarRequest(token, month);
    }
}
