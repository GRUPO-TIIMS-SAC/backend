import { Body, Controller, Post, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Get()
    try(){
        return this.authService.try()
    }

    //Generar un post que sea auth/login
    @Post('login')
    login(@Body() body: {password: string}){
        return this.authService.login(body)
    }




    
}
