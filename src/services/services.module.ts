import { Module } from '@nestjs/common';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from 'src/entities/services.entity';
import { SubSpeciality } from 'src/entities/subspecialities.entity';
import { SubspecialitiesModule } from 'src/subspecialities/subspecialities.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Service]),
    SubspecialitiesModule,
    UsersModule,
  ],
  controllers: [ServicesController],
  providers: [ServicesService],
})
export class ServicesModule {}
