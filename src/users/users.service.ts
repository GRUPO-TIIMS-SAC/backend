import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { SingUpDto } from './dto/singup-user.dto';
import { SignInDto } from './dto/signin-user.dto';
import { AuthMethodsService } from 'src/auth_methods/auth_methods.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private authMethodsService: AuthMethodsService,
  ) {}

  correctDate(date: string) {
    const dateUtc = new Date(date);
    return new Date(dateUtc.getTime() + dateUtc.getTimezoneOffset() * 60000);
  }

  async signUp(user: SingUpDto) {
    try {
      const userExists = await this.usersRepository.findOne({
        where: {
          email: user.email.toLowerCase(),
        },
      });

      if (userExists) {
        return new HttpException('User already exists', HttpStatus.CONFLICT);
      }

      user.email = user.email.toLowerCase();

      const newUser = this.usersRepository.create(user);
      return this.usersRepository.save(newUser);
    } catch (error) {
      throw new HttpException(
        'Error creating user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async sigin(user: SignInDto) {
    const auth_method = await this.authMethodsService.getOneAuthMethod(
      user.auth_method_id,
    );

    if (auth_method.auth_method === 'Email') {
      const userFound = await this.usersRepository.findOne({
        where: {
          email: user.email,
          password: user.password,
        },
      });

      if (!userFound) {
        return new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      return userFound;
    }
  }

  async deleteUser(id: number) {
    const result = await this.usersRepository.delete({ id });

    if (result.affected === 0) {
      return new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return new HttpException('User deleted successfully', HttpStatus.OK);
  }
}
