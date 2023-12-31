import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { AuthMethodsModule } from 'src/auth_methods/auth_methods.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule,
    TypeOrmModule.forFeature([User]), 
    AuthMethodsModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
