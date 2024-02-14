import { Controller, Post, Headers, Body} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Services')
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
    async create(
        @Headers('authorization') token: any,
        @Body() body: CreateServiceDto,
    ) {
        return this.servicesService.create(token, body);
    }

    
}
