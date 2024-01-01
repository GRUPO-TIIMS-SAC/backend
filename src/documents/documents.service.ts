import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from 'src/entities/documents.entity';
import { CreateUpdateDocument } from './dto/create-update-document.dto';

@Injectable()
export class DocumentsService {
    constructor(
        @InjectRepository(Document)
        private readonly documentsRepository: Repository<Document>,
    ) {}

    async createDocument(document: CreateUpdateDocument): Promise<Document> {
        const documentExists = await this.documentsRepository.findOne({
            where: {
                document: document.document
            }
        });

        if(documentExists){
            throw new HttpException('Auth method already exists', HttpStatus.CONFLICT);
        }

        const newAuthMethod = this.documentsRepository.create(document);
        return this.documentsRepository.save(newAuthMethod);
    }

    async findAll(): Promise<Document[]> {
        return this.documentsRepository.find();
    }

    async findOne(id: number): Promise<Document> {
       
        const exists = await this.documentsRepository.findOne({
            where: {
                id: id
            }
        });

        if(!exists){
            throw new HttpException('Document not found', HttpStatus.NOT_FOUND);
        }

        return exists
    }

    async update(document: CreateUpdateDocument): Promise<Document> {
        if(!document.id){
            throw new HttpException('Document id is necessary', HttpStatus.BAD_REQUEST);
        }

        const documentFound = await this.documentsRepository.findOne({
            where: {
                id: document.id
            }
        });

        if(!documentFound){
            throw new HttpException('Documnent not found', HttpStatus.NOT_FOUND);
        }

        const updateDocument = Object.assign(documentFound, document);
        return this.documentsRepository.save(updateDocument);
    }

    async remove(id: number): Promise<void> {
        const result = await this.documentsRepository.delete({id});

        if(result.affected === 0){
            throw new HttpException('Auth method not found', HttpStatus.NOT_FOUND);
        }

        throw new HttpException('Auth method deleted successfully', HttpStatus.OK);
    }
}

