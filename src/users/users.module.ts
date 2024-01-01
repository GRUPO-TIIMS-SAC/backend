import { AuthMethodsModule } from 'src/auth_methods/auth_methods.module';
import { jwtConstants } from './constants';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { TmpValidatedEmailModule } from 'src/tmp_validated_email/tmp_validated_email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forFeature([User]), 
    AuthMethodsModule,
    TmpValidatedEmailModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
