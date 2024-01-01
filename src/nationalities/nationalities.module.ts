import { Module } from '@nestjs/common';
import { NationalitiesController } from './nationalities.controller';
import { NationalitiesService } from './nationalities.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nationality } from 'src/entities/nacionalities.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Nationality])],
  controllers: [NationalitiesController],
  providers: [NationalitiesService],
  exports: [NationalitiesService],
})
export class NationalitiesModule {}
