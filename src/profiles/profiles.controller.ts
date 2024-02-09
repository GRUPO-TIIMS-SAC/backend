import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UsersGuard } from 'src/users/users.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ValidateUserProcessStatusDto } from './dto/validate-user-process-status.dto';
import { changeStatusUserDto } from './dto/change-status-user.dto';
import { DataSpecilistDto } from './dto/data-specilist.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Profiles')
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  // @UseGuards(UsersGuard)
  @ApiBearerAuth()
  @ApiHeader({ name: 'Authorization', description: 'Authorization token' })
  @Post()
  async createProfile(
    @Headers('authorization') token: any,
    @Body() profile: CreateProfileDto,
  ) {
    console.log('token: ', token);
    return this.profilesService.createProfile(token, profile);
  }

  @Get('validate-status-user')
  async validateStatusUser(@Headers('authorization') token: any) {
    return this.profilesService.validateStatusUser(token);
  }

  @Post('change-status-user')
  async changeStatusUser(
    @Headers('authorization') token: any,
    @Body() body: changeStatusUserDto,
  ) {
    return this.profilesService.changeStatusUser(token, body);
  }

  @Get()
  async getProfile() {
    return this.profilesService.getProfiles();
  }

  @Post('data-specialist')
  async dataSpecialist(
    @Headers('authorization') token: any,
    @Body() body: DataSpecilistDto,
  ) {
    return this.profilesService.addDataSpecialist(token, body);
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post('upload-profile-photo')
  async uploadProfilePhoto(
    @Headers('authorization') token: any,
    @UploadedFile() file,
  ) {
    return this.profilesService.uploadProfilePhoto(token, file);
  }
}
