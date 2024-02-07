import { Body, Controller, Delete, Get, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { DeleteFileDto } from './dto/delete-file.dto';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(private fileService: FilesService) {}


  @UseInterceptors(FileInterceptor('file'))
  @Post('upload-img')
  async uploadImg(@UploadedFile() file,) {
    return this.fileService.uploadFileMulterImage(file);
  }  

  @UseInterceptors(FileInterceptor('file'))
  @Post('upload-pdf')
  async uploadPdf(@UploadedFile() file,) {
    return this.fileService.uploadFileMulterPdf(file, '2', 'CV');
  }  

  @Delete()
  async deleteFile(@Body () body: DeleteFileDto) {
    return this.fileService.deleteStorageFile(body);
  }
}
