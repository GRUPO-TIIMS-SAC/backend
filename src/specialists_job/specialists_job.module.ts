import { Module } from '@nestjs/common';
import { SpecialistsJobController } from './specialists_job.controller';
import { SpecialistsJobService } from './specialists_job.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpecialistJob } from 'src/entities/specialists_jobs.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SpecialistJob])],
  controllers: [SpecialistsJobController],
  providers: [SpecialistsJobService]
})
export class SpecialistsJobModule {}
