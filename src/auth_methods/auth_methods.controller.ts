import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { AuthMethodsService } from './auth_methods.service';
import { CreateAuthMethodDto } from './dto/create-auth_method.dto';
import { UpdateAuthMethodDto } from './dto/update-auth_method.dto';

@Controller('auth-methods')
export class AuthMethodsController {
    constructor(
        private readonly authMethodsService: AuthMethodsService
    ){}

    @Post()
    async createUser(@Body() authMethod: CreateAuthMethodDto){
        return this.authMethodsService.createAuthMethod(authMethod);
    }

    @Get()
    getAuthMethods(){
        return this.authMethodsService.getAuthMethods();
    }

    @Get(':id')
    getOneAuthMethod(@Param('id', ParseIntPipe) id: number){
        return this.authMethodsService.getOneAuthMethod(id);
    }

    @Delete()
    deleteAuthMethod(@Param('id', ParseIntPipe) id: number){
        return this.authMethodsService.deleteAuthMethod(id);
    }

    @Patch(':id')
    updateAuthMethod(@Param('id', ParseIntPipe) id: number, @Body() authMethod: UpdateAuthMethodDto){
        return this.authMethodsService.updateAuthMethod(id, authMethod);
    }
}
