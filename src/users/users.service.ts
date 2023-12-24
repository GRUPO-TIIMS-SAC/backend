import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    /* constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>
    ){}

    async createUser(user: CreateUserDto){
        const userExists = await this.usersRepository.findOne({
            where: {
                identity_document: user.identity_document,
                number_document: user.number_document
            }
        });

        if(userExists){
            return new HttpException('User already exists', HttpStatus.CONFLICT);
        }

        const newUser = this.usersRepository.create(user);
        return this.usersRepository.save(newUser);
    }

    getUsers(){ 
        return this.usersRepository.find();
    }

    async getUserByDocument(data: {identity_document: number, number_document: string}){
        const user = await this.usersRepository.findOne({
            where: {
                identity_document: data.identity_document,
                number_document: data.number_document
            }
        });

        if(!user){
            return new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        return user;
    }

    async deleteUser(id: number){
        const result = await this.usersRepository.delete({id});

        if(result.affected === 0){
            return new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        return new HttpException('User deleted successfully', HttpStatus.OK);
    }

    async updateUser(id: number, user: UpdateUserDto){
        const userFound = await this.usersRepository.findOne({
            where: {
                id: id
            }
        });

        if(!userFound){
            return new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        const updateUser = Object.assign(userFound, user);
        return this.usersRepository.save(updateUser);
    } */
}
