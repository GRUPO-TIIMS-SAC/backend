import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryTree } from 'src/entities/categories_tree.entity';
import { Repository } from 'typeorm';
import { CreateCategoryTreeDto } from './dto/create-categories_tree.dto';
import { UpdateCategoryTreeDto } from './dto/update-categories_tree.dto';

@Injectable()
export class CategoriesTreeService {
  constructor(
    @InjectRepository(CategoryTree)
    private categoryTreeService: Repository<CategoryTree>,
  ) {}

  async createCategoryTree(categoryTree: CreateCategoryTreeDto) {
    const categoryTreeExists = await this.categoryTreeService.findOne({
      where: {
        id_category: categoryTree.id_category as number,
      },
    });

    if (categoryTreeExists) {
      return new HttpException(
        'Category Tree already exists',
        HttpStatus.CONFLICT,
      );
    }

    const newCategoryTree = this.categoryTreeService.create(categoryTree);
    return this.categoryTreeService.save(newCategoryTree);
  }

  getCategoryTree() {
    return this.categoryTreeService.find({
      order: {
        id: 'ASC',
      },
    });
  }

  async getCategoryTreeByFather(id: number) {
    const categoryTreeFound = await this.categoryTreeService.find({
      where: {
        father: id,
      },
    });

    if (!categoryTreeFound) {
      return new HttpException('Category Tree not found', HttpStatus.NOT_FOUND);
    }

    return categoryTreeFound;
  }

  async deleteCategoryTree(id: number) {
    const result = await this.categoryTreeService.delete({ id });

    if (result.affected === 0) {
      return new HttpException('Category Tree not found', HttpStatus.NOT_FOUND);
    }

    return result;
  }

  async updateCategoryTree(id: number, categoryTree: UpdateCategoryTreeDto) {
    const categoryTreeFound = await this.categoryTreeService.findOne({
      where: {
        id,
      },
    });

    if (!categoryTreeFound) {
      return new HttpException('Category Tree not found', HttpStatus.NOT_FOUND);
    }

    const updateCategoryTree = Object.assign(categoryTreeFound, categoryTree);
    return this.categoryTreeService.save(updateCategoryTree);
  }
}
