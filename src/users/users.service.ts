import { AuthMethodsService } from 'src/auth_methods/auth_methods.service';
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { SignInDto } from './dto/signin-user.dto';
import { SingUpDto } from './dto/singup-user.dto';
import { TmpValidatedEmailService } from 'src/tmp_validated_email/tmp_validated_email.service';
import { User } from 'src/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ValidatedCodeDto } from 'src/tmp_validated_email/dto/validated-code.dto';
import { UpdatedPasswordDto } from './dto/update-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly authMethodsService: AuthMethodsService,
    private readonly tmpValidatedEmailService: TmpValidatedEmailService,
    private jwtService: JwtService,
  ) {}

  correctDate(date: string) {
    const dateUtc = new Date(date);
    return new Date(dateUtc.getTime() + dateUtc.getTimezoneOffset() * 60000);
  }

  async signUp(user: SingUpDto) {
    const userExists = await this.usersRepository.findOne({
      where: {
        email: user.email.toLowerCase(),
      },
    });

    if (userExists) {
      return new HttpException({message: 'User already exists'}, HttpStatus.CONFLICT);
    }

    user.email = user.email.toLowerCase();
    const auth_method = await this.authMethodsService.getOneAuthMethod(
      user.auth_method_id,
    );

    console.log(auth_method.auth_method);
    if (auth_method.auth_method === 'Email') {
      return this.signUpJWT(user);
    } else {
      return this.signUpOAuth(user);
    }
  }

  private async signUpJWT(user: SingUpDto) {
    if (!user.password) {
      return new HttpException({message: 'Password is required'}, HttpStatus.BAD_REQUEST);
    }

    const validatedEmail =
      await this.tmpValidatedEmailService.getOneTmpValidatedEmail(user.email);

    if (!validatedEmail) {
      return new HttpException({message: 'Email not found'}, HttpStatus.NOT_FOUND);
    }

    if (validatedEmail.attempts >= 5) {
      return new HttpException({message: 'Too many attempts'}, HttpStatus.BAD_REQUEST);
    }

    try {
      const bodyValidated: ValidatedCodeDto = {
        email: user.email,
        code: user.validated_code,
      };
      const isValidCode =
        await this.tmpValidatedEmailService.validateCode(bodyValidated);

      if (isValidCode instanceof HttpException) {
        return isValidCode;
      }

      const hashedPassword = await bcrypt.hash(user.password, 10);

      const newUserBody = {
        email: user.email,
        password: hashedPassword,
        fullname: user.fullname,
        auth_method_id: user.auth_method_id,
        refer_code: user.refer_code,
      };

      const newUser = this.usersRepository.create(newUserBody);
      const bodyUserCreated = await this.usersRepository.save(newUser);
      return new HttpException(
        { message: 'User created successfully', data: bodyUserCreated },
        HttpStatus.CREATED,
      );
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {message:'Error creating user'},
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async signUpOAuth(user: SingUpDto) {
    const newUserBody = {
      email: user.email,
      fullname: user.fullname,
      refer_code: user.refer_code,
      auth_method_id: user.auth_method_id,
    };

    const newUser = this.usersRepository.create(newUserBody);
    const respData = await this.usersRepository.save(newUser);
    return new HttpException(
      { message: 'User created successfully', data: respData },
      HttpStatus.CREATED,
    );
  }

  async sigin(user: SignInDto) {
    const auth_method = await this.authMethodsService.getOneAuthMethod(
      user.auth_method_id,
    );

    if (auth_method.auth_method === 'Email') {
      return this.signInJwt(user);
    }else{
      return this.signInOAuth(user);
    }
  }

  private async signInOAuth(user: SignInDto) {

    try {
      const userFound = await this.usersRepository.findOne({
        where: {
          email: user.email,
          auth_method_id: user.auth_method_id,
        },
      });
  
      if (!userFound) {
        return new HttpException({message: 'User not found'}, HttpStatus.NOT_FOUND);
      }
  
      return new HttpException(
        {message: 'User logged in successfully', data: userFound},
        HttpStatus.OK,
      );
    } catch (error) {
      return new HttpException(
        {message: 'Error logging in user', error: error},
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    
  }

  async updatedPassword(body: UpdatedPasswordDto){
    const userFound = await this.usersRepository.findOne({
      where: {
        email: body.email,
      },
    });
    
    if (!userFound) {
      return new HttpException({message: 'User not found'}, HttpStatus.NOT_FOUND);
    }

    if(userFound.auth_method_id !== 4){
      return new HttpException({message: 'This user not use password'}, HttpStatus.CONFLICT);
    }

    const isValidCode = await this.tmpValidatedEmailService.validateCodeUpdate({email: body.email, code: body.validated_code});

    if(isValidCode.getStatus() !== HttpStatus.OK){
      return isValidCode;
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);
    const updateUser = Object.assign(userFound, {
      password: hashedPassword,
    });

    const respData = await this.usersRepository.save(updateUser);
    return new HttpException(
      { message: 'Password updated'},
      HttpStatus.OK,
    );
  }

  private async signInJwt(user: SignInDto) {
    const userFound = await this.usersRepository.findOne({
      where: {
        email: user.email,
      },
    });

    if (!userFound) {
      return new HttpException({message: 'User not found'}, HttpStatus.NOT_FOUND);
    }

    const resp = await bcrypt.compare(user.password, userFound.password);

    if (!resp) {
      return new UnauthorizedException();
    }

    const payload = {
      email: userFound.email,
      id: userFound.id,
      auth_method_id: userFound.auth_method_id,
    };
    const access_token = await this.jwtService.signAsync(payload);
    console.log(access_token);
    return new HttpException(
      {
        access_token: access_token,
        name: userFound.fullname,
      },
      HttpStatus.OK,
    );
  }

  async deleteUser(id: number) {
    const result = await this.usersRepository.delete({ id });

    if (result.affected === 0) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    throw new HttpException('User deleted successfully', HttpStatus.OK);
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!user) {
      return new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return new HttpException({ message: 'User found', data: user }, HttpStatus.OK);
  }
}
