import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
  Delete,
  Patch,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { Document } from 'src/entities/document.entity';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentService: DocumentsService) {}

  @Post()
  createDocument(@Body() newDocument: CreateDocumentDto) {
    return this.documentService.createDocument(newDocument);
  }

  @Get()
  getDocuments(): Promise<Document[]> {
    return this.documentService.getDocuments();
  }

  @Get(':id')
  getDocumentById(@Param('id', ParseIntPipe) id: number) {
    return this.documentService.getDocumentById(id);
  }

  @Delete(':id')
  deleteDocument(@Param('id', ParseIntPipe) id: number) {
    return this.documentService.deleteDocument(id);
  }

  @Patch(':id')
  updateDocument(
    @Param('id', ParseIntPipe) id: number,
    @Body() document: CreateDocumentDto,
  ) {
    return this.documentService.updateDocument(id, document);
  }
}
