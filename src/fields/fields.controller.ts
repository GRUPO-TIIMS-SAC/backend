import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { FieldsService } from './fields.service';
import { CreateFieldDto } from './dto/create-field.dto';

@Controller('fields')
export class FieldsController {
    constructor(private readonly fieldsService: FieldsService){}

    @Post()
    createField(@Body() newField: CreateFieldDto ) {
        return this.fieldsService.createField(newField);
    }

    @Get()
    getFields() {
        return this.fieldsService.getFields();
    }

    @Get(':id')
    getFieldById(@Param('id', ParseIntPipe) id: number) {
        return this.fieldsService.getFieldById(id);
    }

    @Delete(':id')
    deleteField(@Param('id', ParseIntPipe) id: number) {
        return this.fieldsService.deleteField(id);
    }

    @Patch(':id')
    updateField(
        @Param('id', ParseIntPipe) id: number,
        @Body() field: CreateFieldDto,
    ) {
        return this.fieldsService.updateField(id, field);
    }

}
