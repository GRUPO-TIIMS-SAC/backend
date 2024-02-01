import { Module } from '@nestjs/common';
import { ExtraDocumentsController } from './extra_documents.controller';
import { ExtraDocumentsService } from './extra_documents.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExtraDocument } from 'src/entities/extra_documents.entity';
import { UsersModule } from 'src/users/users.module';
import { FilesModule } from 'src/files/files.module';
import { ExtraDocumentsListModule } from 'src/extra_documents_list/extra_documents_list.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExtraDocument]),
    UsersModule,
    FilesModule,
    ExtraDocumentsListModule
  ],
  controllers: [ExtraDocumentsController],
  providers: [ExtraDocumentsService],
  exports: [ExtraDocumentsService],
})
export class ExtraDocumentsModule {}
