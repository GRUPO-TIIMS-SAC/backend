import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from 'src/entities/profiles.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UsersService } from 'src/users/users.service';
import { ValidateUserProcessStatusDto } from './dto/validate-user-process-status.dto';
import { changeStatusUserDto } from './dto/change-status-user.dto';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    private readonly userService: UsersService,
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

      const newProfile = this.profileRepository.create({...profile, user_id: tokenDecoded.id});
      const respData = await this.profileRepository.save(newProfile);
      return new HttpException(
        { data: respData, message: 'Profile created' },
        HttpStatus.CREATED,
      );
    } catch (error) {
      console.log('Error: ', error);
      return new HttpException(
        { message: 'Error creating profile' },
        HttpStatus.CONFLICT,
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

      const profiles = await this.profileRepository.find({
        where: {
          user_id: tokenDecoded.id,
        },
      });

      if (!profiles) {
        return new HttpException(
          { message: 'Profile not found', first_time: true },
          HttpStatus.NOT_FOUND,
        );
      }

      return new HttpException(
        { message: 'Profile exists', first_time: false },
        HttpStatus.OK,
      );
    } catch (error) {
      return new HttpException(
        { message: 'Error validating user process status' },
        HttpStatus.CONFLICT,
      );
    }
  }

  async changeStatusUser(token: any, body: changeStatusUserDto) {
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
      
      body.type = body.type.toLowerCase();

      switch (body.type) {
        case 'specialist':
          if (profile.type === '0') {
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
          if (profile.type === '1') {
            return new HttpException(
              { message: 'User already selected specialist', continue: true },
              HttpStatus.OK,
            );
          }
          if (profile.type === '2') {
            const updateProfile = Object.assign(profile, { type: '3' });
            const respData = await this.profileRepository.save(updateProfile);
            return new HttpException(
              {
                message: 'User selected both platforms',
                data: respData,
                continue: true,
              },
              HttpStatus.OK,
            );
          }
          return new HttpException(
            { message: 'User selected both platforms', continue: true },
            HttpStatus.OK,
          );
        case 'customer':
          if (profile.type === '0') {
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
          }
          if (profile.type === '2') {
            return new HttpException(
              { message: 'User already selected customer', continue: true },
              HttpStatus.OK,
            );
          }
          if (profile.type === '1') {
            const updateProfile = Object.assign(profile, { type: '3' });
            const respData = await this.profileRepository.save(updateProfile);
            return new HttpException(
              {
                message: 'User selected both platforms',
                data: respData,
                continue: true,
              },
              HttpStatus.OK,
            );
          }
          return new HttpException(
            { message: 'User selected both platforms', continue: true },
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
        HttpStatus.CONFLICT,
      );
    }
  }

  getProfiles() {
    return this.profileRepository.find();
  }
}
