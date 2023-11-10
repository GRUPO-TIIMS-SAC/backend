import { Module } from '@nestjs/common';
import { SpecialistsJobController } from './specialists_job.controller';
import { SpecialistsJobService } from './specialists_job.service';

@Module({
  controllers: [SpecialistsJobController],
  providers: [SpecialistsJobService]
})
export class SpecialistsJobModule {}
