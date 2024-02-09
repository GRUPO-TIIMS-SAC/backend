import { Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ImgsFilesService } from './imgs_files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Images Files')
@Controller('imgs-files')
export class ImgsFilesController {
    constructor(
        private readonly imgsFilesService: ImgsFilesService
    ) {}

    @UseInterceptors(FileInterceptor('file'))
    @Post()
    async create(@UploadedFile() file){
        return await this.imgsFilesService.create(file);
    }

    @Get()
    async getFiles(){
        return await this.imgsFilesService.getAll();
    }
}
