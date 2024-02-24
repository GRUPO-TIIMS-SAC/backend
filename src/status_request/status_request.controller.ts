import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { StatusRequestService } from './status_request.service';
import { CreateStatusRequestDto } from './dto/create-status_request.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Status Request')
@Controller('status-request')
export class StatusRequestController {
    constructor(
        private statusRequestService: StatusRequestService
    ){}

    @Post()
    async create(@Body() body: CreateStatusRequestDto) {
        return this.statusRequestService.create(body);
    }

    @Get()
    async getAll() {
        return this.statusRequestService.getAll();
    }

    @Get('status/:status')
    async getByStatus(@Param() status: string) {
        return this.statusRequestService.getByStatus(status);
    }
}
