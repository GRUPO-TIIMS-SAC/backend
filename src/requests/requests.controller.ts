import { Controller, Post, Headers, Body, Get, Patch, Param, ParseIntPipe } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { ApiTags } from '@nestjs/swagger';

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
}
