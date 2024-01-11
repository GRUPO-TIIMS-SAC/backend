import { Module } from '@nestjs/common';
import { SpecialitiesController } from './specialities.controller';
import { SpecialitiesService } from './specialities.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Speciality } from 'src/entities/specialities.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Speciality])],
  controllers: [SpecialitiesController],
  providers: [SpecialitiesService],
  exports: [SpecialitiesService],
})
export class SpecialitiesModule {}
