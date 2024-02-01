import { Body, Controller, Get, Headers, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ExtraDocumentsService } from './extra_documents.service';
import { createExtraDocument } from './dto/create-extra-document.dto';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
@ApiTags('Extra Documents')
@Controller('extra-documents')
export class ExtraDocumentsController {
  constructor(private readonly extraDocumentsService: ExtraDocumentsService) {}

  @ApiBearerAuth()
  @ApiHeader({ name: 'Authorization', description: 'Authorization token' })
  @UseInterceptors(FileInterceptor('file'))
  @Post()
  async createExtraDocument(
    @Headers('authorization') token: any,
    @UploadedFile() file,
    @Body() body: createExtraDocument,
  ) {
    return this.extraDocumentsService.create(token, file, body);
  }

  @Get('documents-by-user')
  async getDocumentsByUser(@Headers('authorization') token: any) {
    return this.extraDocumentsService.getExtraDocumentsByUser(token);
  }

  
}
