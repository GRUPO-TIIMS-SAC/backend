import { Module } from '@nestjs/common';
import { RequestsController } from './requests.controller';
import { RequestsService } from './requests.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Request } from '../entities/requests.entity';
import { UsersModule } from 'src/users/users.module';
import { StatusRequestModule } from 'src/status_request/status_request.module';
import { ServicesModule } from 'src/services/services.module';
import { SubspecialitiesModule } from 'src/subspecialities/subspecialities.module';
import { SpecialitiesModule } from 'src/specialities/specialities.module';
import { ProfilesModule } from 'src/profiles/profiles.module';

@Module({
  imports: [
  TypeOrmModule.forFeature([Request]), 
  UsersModule, 
  StatusRequestModule,
  ServicesModule,
  SubspecialitiesModule,
  SpecialitiesModule,
  ProfilesModule
  ],
  controllers: [RequestsController],
  providers: [RequestsService]
})
export class RequestsModule { }
