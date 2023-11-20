import { Module } from '@nestjs/common';
import { FieldsController } from './fields.controller';
import { FieldsService } from './fields.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Field } from 'src/entities/fields.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Field])],
  controllers: [FieldsController],
  providers: [FieldsService]
})
export class FieldsModule {}
