import { Module } from '@nestjs/common';
import { ImgsFilesController } from './imgs_files.controller';
import { ImgsFilesService } from './imgs_files.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImgsFiles } from 'src/entities/img_files.entity';
import { FilesModule } from 'src/files/files.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ImgsFiles]), 
    FilesModule
  ],
  controllers: [ImgsFilesController],
  providers: [ImgsFilesService],
  exports: [ImgsFilesService],
})
export class ImgsFilesModule {}
