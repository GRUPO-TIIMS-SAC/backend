import { Module } from '@nestjs/common';
import { FavoritesUsersController } from './favorites_users.controller';
import { FavoritesUsersService } from './favorites_users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoritesUsers } from 'src/entities/favorites_users.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([FavoritesUsers]), UsersModule],
  controllers: [FavoritesUsersController],
  providers: [FavoritesUsersService],
  exports: [FavoritesUsersService],
})
export class FavoritesUsersModule {}
