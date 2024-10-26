import { Injectable, HttpException, HttpStatus, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { ChangePasswordAuthDto } from './dto/change-password-auth.dto';
import { Repository } from 'typeorm';
import { compareHash, generateHash } from './utils/handleBcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import ms from 'ms';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  public async login(userLoginBody: LoginAuthDto, @Res() response: Response) {
    const { password, email } = await userLoginBody;

    const expiresInMs = ms(process.env.JWT_EXPIRATION);

    if (!expiresInMs) {
      throw new Error('Invalid JWT_EXPIRATION format');
    }

    const expires = new Date(Date.now() + expiresInMs);

    const userExist = await this.usersRepository.findOne({
      where: {
        email,
      },
    });

    if (!userExist)
      throw new HttpException(
        'El email o la contraseña es incorrecto',
        HttpStatus.NOT_FOUND,
      );

    const isCheck = await compareHash(password, userExist.password);
    if (!isCheck)
      throw new HttpException(
        'El email o la contraseña es incorrecto',
        HttpStatus.CONFLICT,
      );

    const userData = userExist;
    delete userData.password;

    const payload = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      lastName: userData.lastName,
    };

    const token = this.jwtService.sign(payload);

    response.cookie('Authentication', token, {
      httpOnly: true,
      secure: true,
      expires,
    });

    response.send(userData);
  }

  public async register(userBody: RegisterAuthDto, @Res() response: Response) {
    const { password, email, name, lastName } = userBody;

    const userExist = await this.usersRepository.findOne({
      where: {
        email,
      },
    });

    if (userExist) {
      throw new HttpException('El email ya existe', HttpStatus.BAD_REQUEST);
    }

    const userParse = {
      name,
      email,
      lastName,
      password: await generateHash(password),
    };

    await this.usersRepository.save(userParse);

    return this.login(userBody, response);
  }

  public async changePassword(
    userId: string,
    changePasswordBody: ChangePasswordAuthDto,
  ) {
    const { currentPassword, newPassword } = changePasswordBody;

    const userExist = await this.usersRepository.findOne({
      where: {
        id: Number(userId),
      },
    });

    if (!userExist) {
      throw new HttpException('El usuario no existe', HttpStatus.NOT_FOUND);
    }

    if (currentPassword === newPassword) {
      throw new HttpException(
        'La contraseña actual es igual a la nueva',
        HttpStatus.CONFLICT,
      );
    }
    const isCheck = await compareHash(currentPassword, userExist.password);

    if (!isCheck) {
      throw new HttpException(
        'La contraseña es incorrecta',
        HttpStatus.CONFLICT,
      );
    } else {
      userExist.password = await generateHash(newPassword);

      await this.usersRepository.save(userExist);

      return userExist;
    }
  }

  public async me(token: string) {
    const decoded = await this.jwtService.decode(token);

    return decoded;
  }
}
