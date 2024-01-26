import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { ExtraDocumentsService } from './extra_documents.service';
import { createExtraDocument } from './dto/create-extra-document.dto';
import { ApiBearerAuth, ApiHeader } from '@nestjs/swagger';

@Controller('extra-documents')
export class ExtraDocumentsController {
  constructor(private readonly extraDocumentsService: ExtraDocumentsService) {}

  @ApiBearerAuth()
  @ApiHeader({ name: 'Authorization', description: 'Authorization token' })
  @Post()
  async createExtraDocument(
    @Headers('authorization') token: any,
    @Body() body: createExtraDocument,
  ) {
    return this.extraDocumentsService.create(token, body);
  }

  @Get('documents-by-user')
  async getDocumentsByUser(@Headers('authorization') token: any) {
    return this.extraDocumentsService.getExtraDocumentsByUser(token);
  }
}
