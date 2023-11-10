import { Module } from '@nestjs/common';
import { CategoriesTreeController } from './categories_tree.controller';
import { CategoriesTreeService } from './categories_tree.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryTree } from 'src/entities/categories_tree.entity';

@Module({
    imports: [TypeOrmModule.forFeature([CategoryTree])],
    controllers: [CategoriesTreeController],
  providers: [CategoriesTreeService]
})
export class CategoriesTreeModule {}
