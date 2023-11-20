import { Module } from '@nestjs/common';
import { SpecialistsController } from './specialists.controller';
import { SpecialistsService } from './specialists.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Specialist } from 'src/entities/specialists.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Specialist])],
  controllers: [SpecialistsController],
  providers: [SpecialistsService]
})
export class SpecialistsModule {}
