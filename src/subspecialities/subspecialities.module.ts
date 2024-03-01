import { Module } from '@nestjs/common';
import { SubspecialitiesController } from './subspecialities.controller';
import { SubspecialitiesService } from './subspecialities.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubSpeciality } from 'src/entities/subspecialities.entity';
import { SpecialitiesModule } from 'src/specialities/specialities.module';
import { ServicesModule } from 'src/services/services.module';

@Module({
  imports: [TypeOrmModule.forFeature([SubSpeciality]),
    SpecialitiesModule],
  controllers: [SubspecialitiesController],
  providers: [SubspecialitiesService],
  exports: [SubspecialitiesService]
})
export class SubspecialitiesModule { }
