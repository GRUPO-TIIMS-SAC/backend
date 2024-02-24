import { Module } from '@nestjs/common';
import { StatusRequestController } from './status_request.controller';
import { StatusRequestService } from './status_request.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatusRequest } from 'src/entities/status_request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StatusRequest])],
  controllers: [StatusRequestController],
  providers: [StatusRequestService],
  exports: [StatusRequestService],
})
export class StatusRequestModule {}
