import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CategoriesTreeService } from './categories_tree.service';
import { CreateCategoryTreeDto } from './dto/create-categories_tree.dto';
import { UpdateCategoryTreeDto } from './dto/update-categories_tree.dto';

@Controller('categories-tree')
export class CategoriesTreeController {
  constructor(private readonly categoriesTreeService: CategoriesTreeService) {}

  @Post()
  createCategoryTree(@Body() newCategoryTree: CreateCategoryTreeDto) {
    return this.categoriesTreeService.createCategoryTree(newCategoryTree);
  }

  @Get()
    getCategoryTree() {
        return this.categoriesTreeService.getCategoryTree();
    }

    @Get('/father/:id')
    getCategoryTreeByFather(@Param('id', ParseIntPipe) id: number) {
        return this.categoriesTreeService.getCategoryTreeByFather(id);
    }

    @Delete(':id')
    deleteCategoryTree(@Param('id', ParseIntPipe) id: number) {
        return this.categoriesTreeService.deleteCategoryTree(id);
    }

    @Patch(':id')
    updateCategoryTree(
        @Param('id', ParseIntPipe) id: number,
        @Body() categoryTree: UpdateCategoryTreeDto,
    ) {
        return this.categoriesTreeService.updateCategoryTree(id, categoryTree);
    }
}
