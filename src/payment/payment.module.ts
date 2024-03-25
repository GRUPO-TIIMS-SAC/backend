import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from 'src/entities/payments.entity';
import { HttpModule } from '@nestjs/axios';
import { UsersModule } from 'src/users/users.module';
import { ProfilesModule } from 'src/profiles/profiles.module';
import { RequestsModule } from 'src/requests/requests.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]),
    HttpModule,
    UsersModule,
    RequestsModule,
    ConfigModule,
    ProfilesModule],
  controllers: [PaymentController],
  providers: [PaymentService]
})
export class PaymentModule { }
