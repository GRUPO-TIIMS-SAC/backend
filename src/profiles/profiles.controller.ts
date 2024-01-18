import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UsersGuard } from 'src/users/users.guard';
import { ApiTags } from '@nestjs/swagger';
import { ValidateUserProcessStatusDto } from './dto/validate-user-process-status.dto';
import { changeStatusUserDto } from './dto/change-status-user.dto';

@ApiTags('Profiles')
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

    @Post('validate-status-user')
    async validateStatusUser(@Body() body: ValidateUserProcessStatusDto) {
        return this.profilesService.validateStatusUser(body);
    }

    @Post('change-status-user')
    async changeStatusUser(@Body() body: changeStatusUserDto) {
        return this.profilesService.changeStatusUser(body);
    }

    @Get()
    async getProfile() {
       return this.profilesService.getProfiles(); 
    }
}
