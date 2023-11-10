import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Document } from 'src/entities/document.entity';
import { Repository } from 'typeorm';
import { CreateDocumentDto } from './dto/create-document.dto';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
  ) {}

  async createDocument(document: CreateDocumentDto) {
    const documentExists = await this.documentRepository.findOne({
      where: {
        document: document.document,
      },
    });

    if (documentExists) {
      return new HttpException('Document already exists', HttpStatus.CONFLICT);
    }

    const newDocument = this.documentRepository.create(document);
    return this.documentRepository.save(newDocument);
  }

  getDocuments() {
    return this.documentRepository.find({
      order: {
        id: 'ASC',}
    });
  }

  async getDocumentById(id: number) {
    const documentFound = await this.documentRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!documentFound) {
      return new HttpException('Document not found', HttpStatus.NOT_FOUND);
    }

    return documentFound;
  }

  async deleteDocument(id: number) {
    const result = await this.documentRepository.delete({id});

    if (result.affected === 0) {
      return new HttpException('Document not found', HttpStatus.NOT_FOUND);
    }

    return result;
  }

  async updateDocument(id: number, document: CreateDocumentDto) {
    const documentFound = await this.documentRepository.findOne({
      where: {
        id,
      },
    });

    if (!documentFound) {
      return new HttpException('Document not found', HttpStatus.NOT_FOUND);
    }

    const updateDocument = Object.assign(documentFound, document);
    return this.documentRepository.save(updateDocument);
  }
}
