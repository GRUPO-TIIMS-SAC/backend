import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UsersGuard } from 'src/users/users.guard';

@Controller('profiles')
export class ProfilesController {
    constructor(
        private readonly profilesService: ProfilesService,
    ) {}

    // @UseGuards(UsersGuard)
    @Post()
    async createProfile(@Body() profile: CreateProfileDto) {
        return this.profilesService.createProfile(profile);
    }

    @Get()
    async getProfile() {
       return this.profilesService.getProfiles(); 
    }
}
