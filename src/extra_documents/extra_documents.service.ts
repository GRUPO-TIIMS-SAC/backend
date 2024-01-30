import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtraDocument } from 'src/entities/extra_documents.entity';
import { Repository } from 'typeorm';
import { createExtraDocument } from './dto/create-extra-document.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ExtraDocumentsService {
  constructor(
    @InjectRepository(ExtraDocument)
    private readonly extraDocumentRepository: Repository<ExtraDocument>,
    private readonly userService: UsersService,
  ) {}

  async create(token: any, body: createExtraDocument) {
    try {
      const tokenDecoded = this.userService.decodeToken(token);

      if (!tokenDecoded.id) {
        return new HttpException(
          { message: 'Token wrong' },
          HttpStatus.CONFLICT,
        );
      }

      const user = await this.userService.findOne(tokenDecoded.id);
      if (user.getStatus() === 404) {
        return new HttpException(
          { message: 'User not found' },
          HttpStatus.NOT_FOUND,
        );
      }

      const existDocument = await this.extraDocumentRepository.findOne({
        where: {
          user_id: tokenDecoded.id,
          document_id: body.document_id,
        },
      });

      if (existDocument) {
        return new HttpException(
          { message: 'Document already exists' },
          HttpStatus.CONFLICT,
        );
      }

      const newExtraDocument = this.extraDocumentRepository.create({
        ...body,
        user_id: tokenDecoded.id,
      });
      const respData =
        await this.extraDocumentRepository.save(newExtraDocument);
      return new HttpException(
        { data: respData, message: 'Extra document created' },
        HttpStatus.CREATED,
      );
    } catch (error) {
      return new HttpException(
        { message: 'Error creating extra document' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getExtraDocumentsByUser(token: any) {
    try {
      const tokenDecoded = this.userService.decodeToken(token);

      if (!tokenDecoded.id) {
        return new HttpException(
          { message: 'Token wrong' },
          HttpStatus.CONFLICT,
        );
      }

      const user = await this.userService.findOne(tokenDecoded.id);
      if (user.getStatus() === 404) {
        return new HttpException(
          { message: 'User not found' },
          HttpStatus.CONFLICT,
        );
      }

      const extraDocuments = await this.extraDocumentRepository.find({
        where: {
          user_id: tokenDecoded.id,
        },
      });

      if(extraDocuments.length === 0){
        return new HttpException(
          { message: 'No extra documents found' },
          HttpStatus.NOT_FOUND,
        );
      }

      return new HttpException(
        { data: extraDocuments, message: 'Extra documents found' },
        HttpStatus.OK,
      );
    } catch (error) {
      return new HttpException(
        { message: 'Error getting extra documents' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
