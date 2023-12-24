import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
    /* constructor(private readonly usersService: UsersService){}

    @Post()
    async createUser(@Body() user: CreateUserDto){
        return this.usersService.createUser(user);
    }

    @Get()
    getUsers(){
        return this.usersService.getUsers();
    }

    @Post()
    getUserByDocument(@Body() user: {identity_document: number, number_document: string}){
        return this.usersService.getUserByDocument(user);
    }

    @Delete()
    deleteUser(@Param('id', ParseIntPipe) id: number){
        return this.usersService.deleteUser(id);
    }

    @Patch(':id')
    updateUser(@Param('id', ParseIntPipe) id: number, @Body() user: UpdateUserDto){
        return this.usersService.updateUser(id, user);
    } */
}
