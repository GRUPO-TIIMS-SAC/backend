import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from 'src/entities/profiles.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    private readonly userService: UsersService,
  ) {}

  async createProfile(profile: CreateProfileDto) {
    const profileExists = await this.profileRepository.findOne({
      where: {
        user_id: profile.user_id,
      },
    });

    if (profileExists) {
      throw new HttpException('profile already exists', HttpStatus.CONFLICT);
    }

    const user = await this.userService.findOne(profile.user_id);
    if (user.getStatus() === 404) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    try {
      const newProfile = this.profileRepository.create(profile);
      const respData = await this.profileRepository.save(newProfile);
      throw new HttpException({data: respData, message: 'Profile created'}, HttpStatus.CREATED);
    } catch (error) {
      console.log('Error: ', error);
      throw new HttpException('Error creating profile', HttpStatus.CONFLICT);
    }
  }

  getProfiles() {
    return this.profileRepository.find();
  }
}
