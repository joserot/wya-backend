import {
  Body,
  Controller,
  Post,
  Get,
  Request,
  UseGuards,
  Res,
} from '@nestjs/common';

import { JwtAuthGuard } from './guards/jwt-auth.guard';

import { AuthService } from './auth.service';

import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { ChangePasswordAuthDto } from './dto/change-password-auth.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  handleLogin(@Body() loginBody: LoginAuthDto, @Res() response: Response) {
    return this.authService.login(loginBody, response);
  }

  @Post('register')
  handleRegister(
    @Body() registerBody: RegisterAuthDto,
    @Res() response: Response,
  ) {
    return this.authService.register(registerBody, response);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  handleChangePassword(
    @Body() changePasswordBody: ChangePasswordAuthDto,
    @Request() req,
  ) {
    const userId = req.user._id;

    return this.authService.changePassword(userId, changePasswordBody);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Request() req) {
    delete req.user.password;
    return req.user;
  }
}
