import { Module } from '@nestjs/common';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from 'src/entities/services.entity';
import { SubSpeciality } from 'src/entities/subspecialities.entity';
import { SubspecialitiesModule } from 'src/subspecialities/subspecialities.module';
import { UsersModule } from 'src/users/users.module';
import { ProfilesModule } from 'src/profiles/profiles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Service]),
    SubspecialitiesModule,
    UsersModule,
    ProfilesModule
  ],
  controllers: [ServicesController],
  providers: [ServicesService],
  exports: [ServicesService]
})
export class ServicesModule {}
