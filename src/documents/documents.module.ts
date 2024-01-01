import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from 'src/entities/documents.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Document])],
  providers: [DocumentsService],
  controllers: [DocumentsController]
})
export class DocumentsModule {}
