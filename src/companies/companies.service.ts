import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'src/entities/companies.entity';
import { In, Repository } from 'typeorm';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async createCompany(company: CreateCompanyDto) {
    const companyExists = await this.companyRepository.findOne({
      where: {
        ruc: company.ruc,
      },
    });

    if (companyExists) {
      return new HttpException('Company already exists', HttpStatus.CONFLICT);
    }

    const newCompany = this.companyRepository.create(company);
    return this.companyRepository.save(newCompany);
  }

  getCompanies() {
    return this.companyRepository.find({
      order: {
        id: 'ASC',
      },
    });
  }

  async getCompanyById(id: number) {
    const companyFound = await this.companyRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!companyFound) {
      return new HttpException('Company not found', HttpStatus.NOT_FOUND);
    }

    return companyFound;
  }

  async deleteCompany(id: number) {
    const result = await this.companyRepository.delete({ id });

    if (result.affected === 0) {
      return new HttpException('Company not found', HttpStatus.NOT_FOUND);
    }

    return result;
  }

  async updateCompany(id: number, company: UpdateCompanyDto) {
    const companyFound = await this.companyRepository.findOne({
      where: {
        id,
      },
    });

    if (!companyFound) {
      return new HttpException('Company not found', HttpStatus.NOT_FOUND);
    }

    const updateCompany = Object.assign(companyFound, company);
    return this.companyRepository.save(updateCompany);
  }
}
