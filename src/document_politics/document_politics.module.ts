import { Module } from '@nestjs/common';
import { DocumentPoliticsController } from './document_politics.controller';
import { DocumentPoliticsService } from './document_politics.service';

@Module({
  controllers: [DocumentPoliticsController],
  providers: [DocumentPoliticsService]
})
export class DocumentPoliticsModule {}
