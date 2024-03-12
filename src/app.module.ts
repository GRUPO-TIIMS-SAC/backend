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
import { FavoritesUsersModule } from './favorites_users/favorites_users.module';
import { ExtraDocumentsModule } from './extra_documents/extra_documents.module';
import { FilesModule } from './files/files.module';
import { ExtraDocumentsListModule } from './extra_documents_list/extra_documents_list.module';
import { ImgsFilesModule } from './imgs_files/imgs_files.module';
import { ServicesModule } from './services/services.module';
import { PaymentModule } from './payment/payment.module';
import { LiveNotificationsModule } from './live_notifications/live_notifications.module';
import { DocumentPoliticsModule } from './document_politics/document_politics.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'tiims.com.pe',
      port: 3306,
      username: 'tiimscom_cxg',
      password: '(.,gR1G0RK)2308',
      // database: 'tiimscom_db_test',
      database: 'tiimscom_db_prod',
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
    FavoritesUsersModule,
    ExtraDocumentsModule,
    FilesModule,
    ExtraDocumentsListModule,
    ImgsFilesModule,
    ServicesModule,
    PaymentModule,
    LiveNotificationsModule,
    DocumentPoliticsModule,
  ],
  controllers: [AppController],
  providers: [AppService, ],
})
export class AppModule {}
