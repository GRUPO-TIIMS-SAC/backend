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
      let id_save = [];
      let respData_array = [];
      let id_wrong = [];
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

      if (
        body.type_platform !== 'customer' &&
        body.type_platform !== 'specialist'
      ) {
        return new HttpException(
          { message: 'Type platform wrong' },
          HttpStatus.CONFLICT,
        );
      }

      if (body.specialities_id.length === 0) {
        return new HttpException(
          { message: 'Speciality wrong' },
          HttpStatus.CONFLICT,
        );
      }
      console.log(body.specialities_id);
      for (let i = 0; i < body.specialities_id.length; i++) {
        console.log(body.specialities_id[i])
        const existsFavoriteUser = await this.favoritesUsersRepository.findOne({
          where: {
            user_id: tokenDecoded.id,
            speciality_id: body.specialities_id[i],
            type_platform: body.type_platform === 'customer' ? '1' : '0',
          },
        });

        if (existsFavoriteUser) {
          id_wrong.push(body.specialities_id[i]);
        } else {
          const newFavoriteUser = this.favoritesUsersRepository.create({
            ...body,
            user_id: tokenDecoded.id,
            speciality_id: body.specialities_id[i],
            type_platform: body.type_platform === 'customer' ? '1' : '0',
          });
          console.log(newFavoriteUser);
          const respData =
            await this.favoritesUsersRepository.save(newFavoriteUser);
          id_save.push(respData.id);
          respData_array.push(respData);
        }
      }
      console.log(respData_array);
      return new HttpException(
        {
          save_ids: id_save,
          wrong_ids: id_wrong,
          message: 'Favorite user created',
        },
        HttpStatus.CREATED,
      );
    } catch (error) {
      console.log(error)
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

      if (favorites.length === 0) {
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
