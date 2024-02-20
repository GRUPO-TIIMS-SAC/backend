import { changeStatusUserDto } from './dto/change-status-user.dto';
import { CreateProfileDto } from './dto/create-profile.dto';
import { DataSpecilistDto } from './dto/data-specilist.dto';
import { ExtraDocumentsService } from 'src/extra_documents/extra_documents.service';
import { FavoritesUsersService } from 'src/favorites_users/favorites_users.service';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from 'src/entities/profiles.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { ValidateUserProcessStatusDto } from './dto/validate-user-process-status.dto';
import * as multer from 'multer';
import { FilesService } from 'src/files/files.service';
import { DeleteFileDto } from 'src/files/dto/delete-file.dto';
import { Utils } from 'src/utils/utils';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    private readonly userService: UsersService,
    private readonly favoriteUsersService: FavoritesUsersService,
    private readonly extraDocumentsService: ExtraDocumentsService,
    private readonly fileService: FilesService,
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

  async uploadProfilePhoto(token: any, req: multer.File) {
    try {
      const tokenDecoded = this.userService.decodeToken(token);
      let route;

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

      //UPDALOAD IMAGE
      const file = await this.fileService.uploadFileMulterImage(req);

      if (file.getStatus() !== 200) {
        return file;
      }

      const fileResp = file.getResponse();
      if (typeof fileResp === 'object' && 'file_name' in fileResp) {
        route = fileResp.file_name;
      } else {
        return new HttpException(
          {
            message: 'Error creating image',
            error: fileResp,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      //DELETE OLD PROFILE PHOTO
      if (profile.profile_photo !== null) {
        const body: DeleteFileDto = {
          dir: 'images_upload',
          file: profile.profile_photo,
        };

        await this.fileService.deleteStorageFile(body);
      }

      //UPDATE PROFILE
      const updateProfile = Object.assign(profile, {
        profile_photo: route,
      });
      const respData = await this.profileRepository.save(updateProfile);

      return new HttpException(
        {
          message: 'Profile photo added',
          data: respData,
        },
        HttpStatus.OK,
      );
    } catch (error) {
      console.log(error);
      return new HttpException(
        { message: 'Error adding profile photo', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getProfile(token: any) {
    try {
      const tokenDecoded = this.userService.decodeToken(token);

      if (!tokenDecoded.id) {
        return new HttpException(
          { message: 'Token wrong' },
          HttpStatus.CONFLICT,
        );
      }

      const userData = await this.userService.findOne(tokenDecoded.id);

      if(userData.getStatus() !== 200){
        return userData;
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

      return new HttpException(
        {
          message: 'Profile found',
          data: {
            ...profile,
            profile_photo: new Utils().route() + '/images_upload/' + profile.profile_photo,
            name: userData.getResponse()['data'].fullname,
            email: userData.getResponse()['data'].email,
          },
        },
        HttpStatus.OK,
      );
    } catch (error) {
      return new HttpException(
        { message: 'Error getting profile' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getByuser(id: number) {
    try {

      const userData = await this.userService.findOne(id);

      if(userData.getStatus() !== 200){
        return userData;
      }

      const profile = await this.profileRepository.findOne({
        where: {
          user_id: id,
        },
      });

      if (!profile) {
        return new HttpException(
          { message: 'Profile not found' },
          HttpStatus.NOT_FOUND,
        );
      }

      return new HttpException(
        {
          message: 'Profile found',
          data: profile,
        },
        HttpStatus.OK,
      );
    } catch (error) {
      return new HttpException(
        { message: 'Error getting profile' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getProfilePhoto(token: any) {
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

      if (profile.profile_photo === null) {
        return new HttpException(
          { message: 'Profile photo not found' },
          HttpStatus.NOT_FOUND,
        );
      }

      return new HttpException(
        {
          message: 'Profile photo found',
          data: new Utils().route() + '/images_upload/' + profile.profile_photo,
        },
        HttpStatus.OK,
      );
    } catch (error) {
      return new HttpException(
        { message: 'Error getting profile photo' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateProfile(token: any, body: UpdateProfileDto) {
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
          message: 'Profile updated',
          data: respData,
        },
        HttpStatus.OK,
      );
    } catch (error) {
      return new HttpException(
        { message: 'Error updating profile' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
