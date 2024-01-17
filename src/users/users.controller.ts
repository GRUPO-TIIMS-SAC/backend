import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { SingUpDto } from './dto/singup-user.dto';
import { SignInDto } from './dto/signin-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { UpdatedPasswordDto } from './dto/update-password.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  async signUp(@Body() user: SingUpDto) {
    return this.usersService.signUp(user);
  }

  @Post('signin')
  async login(@Body() user: SignInDto) {
    return this.usersService.sigin(user);
  }

  @Post('change-password')
  async changePassword(@Body() user: UpdatedPasswordDto) {
    return this.usersService.updatedPassword(user);
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUser(id);
  }
}
