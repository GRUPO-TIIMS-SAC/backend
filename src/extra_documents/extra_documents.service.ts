import {
  HttpException,
  HttpStatus,
  Injectable,
  Req,
  Res,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtraDocument } from 'src/entities/extra_documents.entity';
import { Repository } from 'typeorm';
import { createExtraDocument } from './dto/create-extra-document.dto';
import { UsersService } from 'src/users/users.service';
import * as multer from 'multer';
import { Request } from 'express';
import { FilesService } from 'src/files/files.service';
import { ExtraDocumentsListService } from 'src/extra_documents_list/extra_documents_list.service';
import { DeleteFileDto } from 'src/files/dto/delete-file.dto';
import { Utils } from 'src/utils/utils';

@Injectable()
export class ExtraDocumentsService {
  constructor(
    @InjectRepository(ExtraDocument)
    private readonly extraDocumentRepository: Repository<ExtraDocument>,
    private readonly userService: UsersService,
    private readonly filesService: FilesService,
    private readonly extraDocumentListService: ExtraDocumentsListService,
  ) {}

  async create(token: any, req: multer.File, body: createExtraDocument) {
    console.log({
      token,
      req,
      body,
    });

    try {
      //VALID BODY
      if (body.document_id != 'cv' && body.document_id != 'certi-joven') {
        return new HttpException(
          { message: 'Document type invalid' },
          HttpStatus.NOT_FOUND,
        );
      }

      //TOKEN
      const tokenDecoded = this.userService.decodeToken(token);
      let fileName;
      let documentName;

      if (!tokenDecoded.id) {
        return new HttpException(
          { message: 'Token wrong' },
          HttpStatus.CONFLICT,
        );
      }
      //USER
      const user = await this.userService.findOne(tokenDecoded.id);
      if (user.getStatus() === 404) {
        return new HttpException(
          { message: 'User not found' },
          HttpStatus.NOT_FOUND,
        );
      }

      //LIST DOCUMENTS
      const listDocuments = await this.extraDocumentListService.getOne(
        body.document_id === 'cv' ? 1 : 2,
      );

      if (listDocuments.getStatus() != 200) {
        return listDocuments;
      }

      documentName = listDocuments.getResponse()['data'].document;
      //

      //VALIDATED DUPLICATE DOCUMENT
      const existDocument = await this.extraDocumentRepository.findOne({
        where: {
          user_id: tokenDecoded.id,
          document_id: body.document_id === 'cv' ? 1 : 2,
        },
      });

      // if (existDocument) {
      //   return new HttpException(
      //     { message: 'Document already exists' },
      //     HttpStatus.CONFLICT,
      //   );
      // }}

      
      //UPLOAD FILE
      const uploadFile = await this.filesService.uploadFileMulterPdf(
        req,
        tokenDecoded.id,
        documentName,
      );

      if (uploadFile.getStatus() !== 200) return uploadFile;

      const uploadFileResponse = uploadFile.getResponse();

      if (
        typeof uploadFileResponse === 'object' &&
        'file_name' in uploadFileResponse
      ) {
        fileName = uploadFileResponse.file_name;
      } else {
        return new HttpException(
          {
            message: 'Error creating extra document',
            error: uploadFileResponse,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      //UPDATE DOCUMENT
      if (existDocument) {
        const body: DeleteFileDto = {
          dir: 'documents_upload',
          file: existDocument.url,
        };

        await this.filesService.deleteStorageFile(body);

        const updateExtraDocument = Object.assign(existDocument, {
          url: fileName,
        });
        const respData = await this.extraDocumentRepository.save(updateExtraDocument);
        return new HttpException(
          { data: respData, message: 'Extra document updated' },
          HttpStatus.CREATED,
        );
      }


      //CREATE DOCUMENT
      const newExtraDocument = this.extraDocumentRepository.create({
        document_id: body.document_id === 'cv' ? 1 : 2,
        user_id: tokenDecoded.id,
        url: fileName,
      });

      const respData =
        await this.extraDocumentRepository.save(newExtraDocument);

      return new HttpException(
        { data: respData, message: 'Extra document created' },
        HttpStatus.CREATED,
      );
    } catch (error) {
      console.log(error);
      return new HttpException(
        { message: 'Error creating extra document', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async upload(token: any, req: multer.File, body: createExtraDocument) {
    try {
      //VALID BODY
      if (body.document_id != 'cv' && body.document_id != 'certi-joven') {
        return new HttpException(
          { message: 'Document type invalid' },
          HttpStatus.NOT_FOUND,
        );
      }

      //TOKEN
      const tokenDecoded = this.userService.decodeToken(token);
      let fileName;
      let documentName;

      if (!tokenDecoded.id) {
        return new HttpException(
          { message: 'Token wrong' },
          HttpStatus.CONFLICT,
        );
      }
      //USER
      const user = await this.userService.findOne(tokenDecoded.id);
      if (user.getStatus() === 404) {
        return new HttpException(
          { message: 'User not found' },
          HttpStatus.NOT_FOUND,
        );
      }
      //LIST DOCUMENTS
      const listDocuments = await this.extraDocumentListService.getOne(
        body.document_id === 'cv' ? 1 : 2,
      );

      if (listDocuments.getStatus() != 200) {
        return listDocuments;
      }

      documentName = listDocuments.getResponse()['data'].document;

      //VALIDATED DUPLICATE DOCUMENT
      const existDocument = await this.extraDocumentRepository.findOne({
        where: {
          user_id: tokenDecoded.id,
          document_id: body.document_id === 'cv' ? 1 : 2,
        },
      });

      if (existDocument) {
      }
    } catch (error) {
      return new HttpException(
        { message: 'Error updating extra document', error: error.message },
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

      if (extraDocuments.length === 0) {
        return new HttpException(
          { message: 'No extra documents found' },
          HttpStatus.NOT_FOUND,
        );
      }

      return new HttpException(
        {
          data: extraDocuments.map((extraDocument) => {
            extraDocument.url = new Utils().route() + '/documents_upload/' + extraDocument.url;
            return extraDocument;
          }),

          message: 'Extra documents found',
        },
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
