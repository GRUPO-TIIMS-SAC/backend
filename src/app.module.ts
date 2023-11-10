import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentsModule } from './documents/documents.module';
import { CategoriesController } from './categories/categories.controller';
import { CategoriesService } from './categories/categories.service';
import { CategoriesModule } from './categories/categories.module';
import { CategoriesTreeModule } from './categories_tree/categories_tree.module';
import { CompaniesModule } from './companies/companies.module';
import { FieldsModule } from './fields/fields.module';
import { SpecialistsJobModule } from './specialists_job/specialists_job.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'db_tiims',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UsersModule,
    DocumentsModule,
    CategoriesModule,
    CategoriesTreeModule,
    CompaniesModule,
    FieldsModule,
    SpecialistsJobModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
