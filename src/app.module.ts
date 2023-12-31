import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthMethodsModule } from './auth_methods/auth_methods.module';
import { ProfilesModule } from './profiles/profiles.module';
import { TmpValidatedEmailModule } from './tmp_validated_email/tmp_validated_email.module';
import { SendEmailModule } from './send_email/send_email.module';

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
    ProfilesModule,
    TmpValidatedEmailModule,
    SendEmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
