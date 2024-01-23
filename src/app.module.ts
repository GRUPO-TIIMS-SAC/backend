import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthMethodsModule } from './auth_methods/auth_methods.module';
import { DocumentsModule } from './documents/documents.module';
import { GendersModule } from './genders/genders.module';
import { NationalitiesModule } from './nationalities/nationalities.module';
import { ProfilesModule } from './profiles/profiles.module';
import { SendEmailModule } from './send_email/send_email.module';
import { TmpValidatedEmailModule } from './tmp_validated_email/tmp_validated_email.module';
import { UsersModule } from './users/users.module';
import { SpecialitiesModule } from './specialities/specialities.module';
import { SubspecialitiesModule } from './subspecialities/subspecialities.module';
import { RequestsModule } from './requests/requests.module';
import { UnitsModule } from './units/units.module';
import { StatusRequestModule } from './status_request/status_request.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'tiims.com.pe',
      port: 3306,
      username: 'tiimscom_cxg',
      password: '(.,gR1G0RK)2308',
      database: 'tiimscom_db_test',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    ConfigModule.forRoot(),
    UsersModule,
    AuthMethodsModule,
    TmpValidatedEmailModule,
    SendEmailModule,
    ProfilesModule,
    GendersModule,
    NationalitiesModule,
    DocumentsModule,
    SpecialitiesModule,
    SubspecialitiesModule,
    RequestsModule,
    UnitsModule,
    StatusRequestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
