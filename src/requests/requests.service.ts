import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from '../entities/requests.entity';
import { CreateRequestDto } from './dto/create-request.dto';


@Injectable()
export class RequestsService {
    constructor(
        @InjectRepository(Request)
        private requestsRepository: Repository<Request>,
    ) {}

    async create(body: CreateRequestDto){
        
    }
}
