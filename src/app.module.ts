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
import { SpecialistsModule } from './specialists/specialists.module';
import { UnitsModule } from './units/units.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'tiims.com.pe',
      port: 3306,
      username: 'tiimscom_cxg',
      password: '(.,gR1G0RK)2308',
      database: 'tiimscom_new_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    ConfigModule.forRoot(),
    UsersModule,
    DocumentsModule,
    CategoriesModule,
    CategoriesTreeModule,
    CompaniesModule,
    FieldsModule,
    SpecialistsJobModule,
    SpecialistsModule,
    UnitsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
