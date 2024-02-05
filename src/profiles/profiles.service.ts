import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from 'src/entities/profiles.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UsersService } from 'src/users/users.service';
import { ValidateUserProcessStatusDto } from './dto/validate-user-process-status.dto';
import { changeStatusUserDto } from './dto/change-status-user.dto';
import { FavoritesUsersService } from 'src/favorites_users/favorites_users.service';
import { ExtraDocumentsService } from 'src/extra_documents/extra_documents.service';
import { DataSpecilistDto } from './dto/data-specilist.dto';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    private readonly userService: UsersService,
    private readonly favoriteUsersService: FavoritesUsersService,
    private readonly extraDocumentsService: ExtraDocumentsService,
  ) {}

  async createProfile(token: any, profile: CreateProfileDto) {
    try {
      const tokenDecoded = this.userService.decodeToken(token);

      if (!tokenDecoded.id) {
        return new HttpException(
          { message: 'Token wrong' },
          HttpStatus.CONFLICT,
        );
      }

      const profileExists = await this.profileRepository.findOne({
        where: {
          user_id: tokenDecoded.id,
        },
      });

      if (profileExists) {
        return new HttpException(
          { message: 'profile already exists' },
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

      const newProfile = this.profileRepository.create({
        ...profile,
        user_id: tokenDecoded.id,
      });
      const respData = await this.profileRepository.save(newProfile);
      return new HttpException(
        { data: respData, message: 'Profile created' },
        HttpStatus.CREATED,
      );
    } catch (error) {
      console.log('Error: ', error);
      return new HttpException(
        { message: 'Error creating profile' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async validateStatusUser(token: any) {
    try {
      const tokenDecoded = this.userService.decodeToken(token);

      if (!tokenDecoded.id) {
        return new HttpException(
          { message: 'Token wrong' },
          HttpStatus.CONFLICT,
        );
      }

      const profiles = await this.profileRepository.findOne({
        where: {
          user_id: tokenDecoded.id,
        },
      });

      if (!profiles) {
        return new HttpException(
          {
            message: 'Profile not found',
            step: 'profile',
            first_time: true,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      //VALIDATE IF USER HAS SELECTED FAVORITE SPECIALITIES

      const favoriteSpecialities =
        await this.favoriteUsersService.getFavoritesByUser(token);

      if (favoriteSpecialities.getStatus() == 409) {
        return favoriteSpecialities;
      }

      if (favoriteSpecialities.getStatus() == 404) {
        return new HttpException(
          {
            message: 'User has not selected favorite specialities',
            step: 'favorites',
            first_time: true,
          },
          HttpStatus.NOT_FOUND,
        );
      }
      if (
        profiles.type === '1' &&
        favoriteSpecialities.getResponse()['dataSpecialist'].length === 0
      ) {
        return new HttpException(
          {
            message: 'User has not selected favorite specialities',
            step: 'favorites',
            first_time: true,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      if (
        profiles.type === '2' &&
        favoriteSpecialities.getResponse()['dataCustomer'].length === 0
      ) {
        return new HttpException(
          {
            message: 'User has not selected favorite specialities',
            step: 'favorites',
            first_time: true,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      //VALIDATE IF USER HAS SELECTED EXTRA DOCUMENTS
      if (profiles.type === '1' || profiles.type === '3') {
        const extraDocuments =
          await this.extraDocumentsService.getExtraDocumentsByUser(token);
        console.log(extraDocuments);
        if (extraDocuments.getStatus() == 409) {
          return extraDocuments;
        }

        if (extraDocuments.getStatus() == 404) {
          return new HttpException(
            {
              message: 'User has not selected extra documents',
              step: 'document',
              first_time: true,
            },
            HttpStatus.NOT_FOUND,
          );
        }
      }

      //VALIDATE IF USER HAS SELECTED SPECIALIST OR CUSTOMER

      return new HttpException(
        { message: 'All steps complete', step: 'done', first_time: false },
        HttpStatus.OK,
      );
    } catch (error) {
      return new HttpException(
        { message: 'Error validating user process status' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async changeStatusUser(token: any, body: changeStatusUserDto) {
    try {
      /*
      0 - uninitialized
      1 - specialist
      2 - customer
      3 - both
      */

      const tokenDecoded = this.userService.decodeToken(token);

      if (!tokenDecoded.id) {
        return new HttpException(
          { message: 'Token wrong' },
          HttpStatus.CONFLICT,
        );
      }

      const profile = await this.profileRepository.findOne({
        where: {
          user_id: tokenDecoded.id,
        },
      });

      if (!profile) {
        return new HttpException(
          { message: 'Profile not found' },
          HttpStatus.NOT_FOUND,
        );
      }

      body.type = body.type.toLowerCase();

      switch (body.type) {
        case 'specialist': {
          const updateProfile = Object.assign(profile, { type: '1' });
          const respData = await this.profileRepository.save(updateProfile);
          return new HttpException(
            {
              message: 'User selected specialist',
              data: respData,
              continue: true,
            },
            HttpStatus.OK,
          );
        }
        case 'customer':
          const updateProfile = Object.assign(profile, { type: '2' });
          const respData = await this.profileRepository.save(updateProfile);
          return new HttpException(
            {
              message: 'User selected customer',
              data: respData,
              continue: true,
            },
            HttpStatus.OK,
          );
        default:
          return new HttpException(
            { message: 'Type not valid' },
            HttpStatus.BAD_REQUEST,
          );
      }
    } catch (error) {
      return new HttpException(
        { message: 'Error changing user status' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  getProfiles() {
    return this.profileRepository.find();
  }

  async addDataSpecialist(token: any, body: DataSpecilistDto) {
    try {
      const tokenDecoded = this.userService.decodeToken(token);

      if (!tokenDecoded.id) {
        return new HttpException(
          { message: 'Token wrong' },
          HttpStatus.CONFLICT,
        );
      }

      const profile = await this.profileRepository.findOne({
        where: {
          user_id: tokenDecoded.id,
        },
      });

      if (!profile) {
        return new HttpException(
          { message: 'Profile not found' },
          HttpStatus.NOT_FOUND,
        );
      }

      const updateProfile = Object.assign(profile, body);
      const respData = await this.profileRepository.save(updateProfile);
      return new HttpException(
        {
          message: 'Data specialist added',
          data: respData,
        },
        HttpStatus.OK,
      );
    } catch (error) {
      return new HttpException(
        { message: 'Error adding data specialist' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
