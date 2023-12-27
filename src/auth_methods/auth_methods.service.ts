import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthMethod } from 'src/entities/auth_methods.entity';
import { CreateAuthMethodDto } from './dto/create-auth_method.dto';
import { Repository } from 'typeorm';
import { UpdateAuthMethodDto } from './dto/update-auth_method.dto';

@Injectable()
export class AuthMethodsService {
    constructor(
        @InjectRepository(AuthMethod)
        private readonly authMethodsRepository: Repository<AuthMethod>    
    ){}

    async createAuthMethod(authMethod: CreateAuthMethodDto){
        const authMehtodExists = await this.authMethodsRepository.findOne({
            where: {
                auth_method: authMethod.auth_method
            }
        });

        if(authMehtodExists){
            return new HttpException('Auth method already exists', HttpStatus.CONFLICT);
        }

        const newAuthMethod = this.authMethodsRepository.create(authMethod);
        return this.authMethodsRepository.save(newAuthMethod);
    }

    getAuthMethods(){
        return this.authMethodsRepository.find();
    }

    async deleteAuthMethod(id: number){
        const result = await this.authMethodsRepository.delete({id});

        if(result.affected === 0){
            return new HttpException('Auth method not found', HttpStatus.NOT_FOUND);
        }

        return new HttpException('Auth method deleted successfully', HttpStatus.OK);
    }

    async updateAuthMethod(id: number, authMethod: UpdateAuthMethodDto){
        const authMethodFound = await this.authMethodsRepository.findOne({
            where: {
                id: id
            }
        });

        if(!authMethodFound){
            return new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        const updateAuthMethod = Object.assign(authMethodFound, authMethod);
        return this.authMethodsRepository.save(updateAuthMethod);
    } 
}
