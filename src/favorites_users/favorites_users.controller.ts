import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { FavoritesUsersService } from './favorites_users.service';
import { ICreateFavoriteUser } from './dto/create-favorite_user.dto';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';

@ApiTags('favorites-users')
@Controller('favorites-users')
export class FavoritesUsersController {
  constructor(private readonly favoritesUsersService: FavoritesUsersService) {}

  @ApiBearerAuth()
  @ApiHeader({ name: 'Authorization', description: 'Authorization token' })
  @Post()
  async createFavoriteUser(
    @Headers('authorization') token: any,
    @Body() body: ICreateFavoriteUser,
  ) {
    return this.favoritesUsersService.createFavoriteUser(token, body);
  }

  @ApiBearerAuth()
  @ApiHeader({ name: 'Authorization', description: 'Authorization token' })
  @Get('get-favorites-users')
  async getFavoritesUsers(@Headers('authorization') token: any) {
    return this.favoritesUsersService.getFavoritesByUser(token);
  }
}
