import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtraDocumentList } from 'src/entities/extra_documents_list.entity';
import { Repository } from 'typeorm';
import { CreateExtraDocumentsListDto } from './dto/create-extra-documents-list.dto';

@Injectable()
export class ExtraDocumentsListService {
  constructor(
    @InjectRepository(ExtraDocumentList)
    private readonly extraDocumentListRepository: Repository<ExtraDocumentList>,
  ) {}

  async create(body: CreateExtraDocumentsListDto) {
    try {
      const existDocument = await this.extraDocumentListRepository.findOne({
        where: {
          document: body.document,
        },
      });

      if (existDocument) {
        return new HttpException(
          { message: 'Document already exists' },
          HttpStatus.CONFLICT,
        );
      }

      const newDocument = this.extraDocumentListRepository.create(body);
      const respSave = this.extraDocumentListRepository.save(newDocument);

      return new HttpException(
        { message: 'Document created', data: respSave },
        HttpStatus.CREATED,
      );
    } catch (error) {
      return new HttpException(
        { message: 'Error creating extra document' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAll() {
    try {
      const resp = await this.extraDocumentListRepository.find();

      if (resp.length === 0) {
        return new HttpException('No documents found', HttpStatus.NOT_FOUND);
      }

      return new HttpException(
        { message: 'Extra documents found', data: resp },
        HttpStatus.OK,
      );
    } catch (error) {
      return new HttpException(
        { message: 'Error getting extra documents' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getOne(id: number) {
    try {
      const resp = await this.extraDocumentListRepository.findOne({
        where: {
          id: id,
        },
      });

      if (!resp) {
        return new HttpException('Document not found', HttpStatus.NOT_FOUND);
      }

      return new HttpException(
        { message: 'Extra document found', data: resp },
        HttpStatus.OK,
      );
    } catch (error) {
      return new HttpException(
        { message: 'Error getting extra document' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
