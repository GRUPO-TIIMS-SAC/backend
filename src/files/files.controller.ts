import { Controller, Get, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { FilesService } from './files.service';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(private fileService: FilesService) {}

  @Post()
  async uploadFile(@Req() req: Request) {
    return this.fileService.uploadFile(req, '2', 'CV');
  }
}
