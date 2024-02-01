import { Module } from '@nestjs/common';
import { ExtraDocumentsListController } from './extra_documents_list.controller';
import { ExtraDocumentsListService } from './extra_documents_list.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExtraDocumentList } from 'src/entities/extra_documents_list.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExtraDocumentList])],
  controllers: [ExtraDocumentsListController],
  providers: [ExtraDocumentsListService],
  exports: [ExtraDocumentsListService],
})
export class ExtraDocumentsListModule {}
