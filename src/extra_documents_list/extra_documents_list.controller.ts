import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ExtraDocumentsListService } from './extra_documents_list.service';
import { CreateExtraDocumentsListDto } from './dto/create-extra-documents-list.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Extra Documents List')
@Controller('extra-documents-list')
export class ExtraDocumentsListController {
  constructor(
    private readonly extraDocumentsListService: ExtraDocumentsListService,
  ) {}

  @Post()
  async createExtraDocumentList(@Body() body: CreateExtraDocumentsListDto) {
    return this.extraDocumentsListService.create(body);
  }

  @Get()
  async getExtraDocumentsList() {
    return this.extraDocumentsListService.getAll();
  }

  @Get(':id')
  async getExtraDocumentList(@Param('id', ParseIntPipe) id: number) {
    return this.extraDocumentsListService.getOne(id);
  }
}
