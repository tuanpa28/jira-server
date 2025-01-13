import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { UserService } from '~/modules/users';
import { UserGoogleDto } from '~/modules/users/dto';
import { LogInDto, RegisterDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(logInDataDto: LogInDto) {
    try {
      const { emailOrUsername, password } = logInDataDto;

      const user = await this.userService.findOneOptions<{ [key: string]: string }[]>({
        field: 'where',
        payload: [{ email: emailOrUsername }, { username: emailOrUsername }],
      });

      if (!user) {
        throw new UnauthorizedException('Account does not exist!');
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        throw new UnauthorizedException('Invalid password!');
      }

      const payload = {
        id: user.id,
        username: user.username,
        email: user.email,
        password: user.password,
        role: user.role,
      };

      const accessToken = await this.jwtService.signAsync(payload, {
        expiresIn: '10m',
      });

      const refreshToken = await this.jwtService.signAsync({ id: user.id }, { expiresIn: '7d' });

      return {
        user,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw new HttpException(
        {
          isError: true,
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async register(registerDataDto: RegisterDto) {
    try {
      const { username, email, password } = registerDataDto;

      const existingUser = await this.userService.findOneOptions<{ [key: string]: string }[]>({
        field: 'where',
        payload: [{ username }, { email }],
      });

      if (existingUser) {
        throw new UnauthorizedException('Username or Email already exists!');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await this.userService.create({
        username,
        email,
        password: hashedPassword,
      });

      return { user };
    } catch (error) {
      throw new HttpException(
        {
          isError: true,
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async refreshToken(token: string) {
    try {
      const user = await this.jwtService.verifyAsync(token);

      const currentUser = await this.userService.findOne(user.id);

      if (!currentUser) {
        throw new UnauthorizedException('Account does not exist!');
      }

      const payload = {
        id: user.id,
        username: user.username,
        email: user.email,
        password: user.password,
        role: user.role,
      };

      const accessToken = await this.jwtService.signAsync(payload, {
        expiresIn: '10m',
      });

      const refreshToken = await this.jwtService.signAsync({ id: user.id }, { expiresIn: '7d' });

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw new HttpException(
        {
          isError: true,
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async googleAuthRedirect(user: UserGoogleDto) {
    try {
      const payload = {
        id: user.id,
        username: user.username,
        email: user.email,
        password: user.password,
        role: user.role,
      };

      const accessToken = await this.jwtService.signAsync(payload, {
        expiresIn: '10m',
      });

      const refreshToken = await this.jwtService.signAsync({ id: user.id }, { expiresIn: '7d' });

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw new HttpException(
        {
          isError: true,
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
