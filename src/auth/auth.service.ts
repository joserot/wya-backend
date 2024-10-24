import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { ChangePasswordAuthDto } from './dto/change-password-auth.dto';
import { Repository } from 'typeorm';
import { compareHash, generateHash } from './utils/handleBcrypt';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  public async login(userLoginBody: LoginAuthDto) {
    const { password, email } = await userLoginBody;

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

    const userFlat = userExist;
    delete userFlat.password;

    const payload = {
      id: userFlat.id,
      name: userFlat.name,
      lastName: userFlat.lastName,
    };

    const token = this.jwtService.sign(payload);

    const data = {
      token,
      user: userFlat,
    };

    return data;
  }

  public async register(userBody: RegisterAuthDto) {
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

    await this.usersRepository.create(userParse);

    return this.login(userBody);
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
