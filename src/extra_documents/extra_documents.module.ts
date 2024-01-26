import { Module } from '@nestjs/common';
import { ExtraDocumentsController } from './extra_documents.controller';
import { ExtraDocumentsService } from './extra_documents.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExtraDocument } from 'src/entities/extra_documents.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([ExtraDocument]), UsersModule],
  controllers: [ExtraDocumentsController],
  providers: [ExtraDocumentsService],
  exports: [ExtraDocumentsService],
})
export class ExtraDocumentsModule {}
