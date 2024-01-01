import { Module } from '@nestjs/common';
import { GendersService } from './genders.service';
import { GendersController } from './genders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gender } from 'src/entities/genders.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Gender])],
  providers: [GendersService],
  controllers: [GendersController]
})
export class GendersModule {}
