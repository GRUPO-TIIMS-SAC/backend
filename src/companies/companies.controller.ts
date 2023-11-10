import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';

@Controller('companies')
export class CompaniesController {
    constructor(private readonly companiesService: CompaniesService) {}

    @Post()
    createCompany(@Body() newCompany: CreateCompanyDto) {
        return this.companiesService.createCompany(newCompany);
    }

    @Get()
    getCompanies() {
        return this.companiesService.getCompanies();
    }

    @Get(':id')
    getCompanyById(@Param('id', ParseIntPipe) id: number) {
        return this.companiesService.getCompanyById(id);
    }

    @Delete(':id')
    deleteCompany(@Param('id', ParseIntPipe) id: number) {
        return this.companiesService.deleteCompany(id);
    }

    @Patch(':id')
    updateCompany(
        @Param('id', ParseIntPipe) id: number,
        @Body() company: CreateCompanyDto,
    ) {
        return this.companiesService.updateCompany(id, company);
    }
}
