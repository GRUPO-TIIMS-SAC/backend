import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FavoritesUsers } from 'src/entities/favorites_users.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { ICreateFavoriteUser } from './dto/create-favorite_user.dto';

@Injectable()
export class FavoritesUsersService {
  constructor(
    @InjectRepository(FavoritesUsers)
    private readonly favoritesUsersRepository: Repository<FavoritesUsers>,
    private readonly userService: UsersService,
  ) {}

  async createFavoriteUser(token: any, body: ICreateFavoriteUser) {
    try {
      const tokenDecoded = this.userService.decodeToken(token);

      if (!tokenDecoded.id) {
        return new HttpException(
          { message: 'Token wrong' },
          HttpStatus.CONFLICT,
        );
      }

      const user = await this.userService.findOne(tokenDecoded.id);

      if (user.getStatus() === 404) {
        return new HttpException(
          { message: 'User not found' },
          HttpStatus.NOT_FOUND,
        );
      }

      const existsFavoriteUser = await this.favoritesUsersRepository.findOne({
        where: {
          user_id: tokenDecoded.id,
          speciality_id: body.speciality_id,
        },
      });

      if (existsFavoriteUser) {
        return new HttpException(
          { message: 'Specialist already selected' },
          HttpStatus.CONFLICT,
        );
      }

        const newFavoriteUser = this.favoritesUsersRepository.create({
            ...body,
            user_id: tokenDecoded.id,
        });

        const respData = await this.favoritesUsersRepository.save(newFavoriteUser);
        return new HttpException(
            { data: respData, message: 'Favorite user created' },
            HttpStatus.CREATED,
        );
    } catch (error) {
      return new HttpException(
        { message: 'Error creating favorite user' },
        HttpStatus.CONFLICT,
      );
    }
  }

  async getFavoritesByUser(token: any) {
    try {
      const tokenDecoded = this.userService.decodeToken(token);

      if (!tokenDecoded.id) {
        return new HttpException(
          { message: 'Token wrong' },
          HttpStatus.CONFLICT,
        );
      }

      const user = await this.userService.findOne(tokenDecoded.id);

      if (user.getStatus() === 404) {
        return new HttpException(
          { message: 'User not found' },
          HttpStatus.NOT_FOUND,
        );
      }

      const favorites = await this.favoritesUsersRepository.find({
        where: {
          user_id: tokenDecoded.id,
        },
      });

      if(favorites.length === 0) {
        return new HttpException(
          { message: 'Favorites not found' },
          HttpStatus.NOT_FOUND,
        );
      }

      return new HttpException(
        { data: favorites, message: 'Favorites selected' },
        HttpStatus.OK,
      );

    } catch (error) {
      return new HttpException(
        { message: 'Error selecting favorites' },
        HttpStatus.CONFLICT,
      );
    }
  }    
}
