import { Module } from '@nestjs/common';
import { RequestsController } from './requests.controller';
import { RequestsService } from './requests.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Request } from '../entities/requests.entity';
import { UsersModule } from 'src/users/users.module';
import { StatusRequestModule } from 'src/status_request/status_request.module';
import { ServicesModule } from 'src/services/services.module';

@Module({
  imports: [
  TypeOrmModule.forFeature([Request]), 
  UsersModule, 
  StatusRequestModule,
  ServicesModule
  ],
  controllers: [RequestsController],
  providers: [RequestsService]
})
export class RequestsModule { }
