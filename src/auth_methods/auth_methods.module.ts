import { Module } from '@nestjs/common';
import { AuthMethodsService } from './auth_methods.service';
import { AuthMethodsController } from './auth_methods.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthMethod } from 'src/entities/auth_methods.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AuthMethod])],
  providers: [AuthMethodsService],
  controllers: [AuthMethodsController]
})
export class AuthMethodsModule {}
