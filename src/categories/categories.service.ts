import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entities/categories.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category) 
    private categoryService: Repository<Category>,
  ) {}

    async createCategory(category: CreateCategoryDto) {
        const categoryExists = await this.categoryService.findOne({
        where: {
            name: category.name,
        },
        });
    
        if (categoryExists) {
        return new HttpException('Category already exists', HttpStatus.CONFLICT);
        }
    
        const newCategory = this.categoryService.create(category);
        return this.categoryService.save(newCategory);
    }

    getCategories() {
        return this.categoryService.find({
        order: {
            id: 'ASC',}
        });
    }

    async getCategoryById(id: number) {
        const categoryFound = await this.categoryService.findOne({
        where: {
            id: id,
        },
        });

        if (!categoryFound) {
        return new HttpException('Category not found', HttpStatus.NOT_FOUND);
        }

        return categoryFound;
    }

    async deleteCategory(id: number) {
        const result = await this.categoryService.delete({id});

        if (result.affected === 0) {
        return new HttpException('Category not found', HttpStatus.NOT_FOUND);
        }

        return result;
    }

    async updateCategory(id: number, category: UpdateCategoryDto) {
        const categoryFound = await this.categoryService.findOne({
        where: {
            id: id,
        },
        });

        if (!categoryFound) {
        return new HttpException('Category not found', HttpStatus.NOT_FOUND);
        }

        const updateCategory = Object.assign(categoryFound, category);
        return this.categoryService.save(updateCategory);
    }
}
