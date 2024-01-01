import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CreateUpdateDocument } from './dto/create-update-document.dto';

@Controller('documents')
export class DocumentsController {
    constructor(
        private readonly documentsService: DocumentsService
    ){}

    @Post()
    async createDocument(@Body() document: CreateUpdateDocument){
        return this.documentsService.createDocument(document);
    }

    @Get()
    getDocuments(){
        return this.documentsService.findAll();
    }

    @Get(':id')
    getOneDocument(@Param('id', ParseIntPipe) id: number){
        return this.documentsService.findOne(id);
    }

    @Delete(':id')
    deleteDocument(@Param('id', ParseIntPipe) id: number){
        return this.documentsService.remove(id);
    }

    @Patch()
    updateDocument(@Body() document: CreateUpdateDocument){
        return this.documentsService.update(document);
    }
}
