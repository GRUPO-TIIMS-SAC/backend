import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from 'src/entities/auth.entity';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken'

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Auth)
        private readonly authRepository: Repository<Auth>
    ){}

    try(){
        return 'Hola mundo'
    }

    sigin(){
        
    }

    login(body: {password: string}){
        const token: string = jwt.sign(body, process.env.SECRET_KEY || 'tokentest')
        console.log(jwt.decode(token))
        return token
    }
}
