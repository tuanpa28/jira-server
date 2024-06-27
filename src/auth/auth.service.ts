import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UserService } from '@/users/users.service';
import { LogInDto, RegisterDto } from './dtos';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(logInDataDto: LogInDto) {
    try {
      const { emailOrUsername, password } = logInDataDto;

      const user = await this.userService.findOneOptions({
        field: 'where',
        payload: [{ username: emailOrUsername }, { email: emailOrUsername }],
      });

      if (!user) {
        throw new UnauthorizedException('Tài khoản không tồn tại!');
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new UnauthorizedException('Mật khẩu không hợp lệ!');
      }

      const payload = {
        id: user.id,
        username: user.username,
        email: user.email,
        password: user.password,
        avatar: user.avatar,
      };

      const accessToken = await this.jwtService.signAsync(payload, {
        expiresIn: '10m',
        secret: process.env.SECRET_KEY_JWT,
      });

      const refreshToken = await this.jwtService.signAsync(
        { id: user.id },
        { expiresIn: '1d', secret: process.env.SECRET_KEY_JWT },
      );

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

  async register(registerDataDto: RegisterDto) {
    try {
      const { username, email, password } = registerDataDto;

      const existingUser = await this.userService.findOneOptions({
        field: 'username',
        payload: username,
      });

      if (existingUser) {
        throw new UnauthorizedException('Tên người dùng đã tồn tại!');
      }

      const existingEmail = await this.userService.findOneOptions({
        field: 'email',
        payload: email,
      });

      if (existingEmail) {
        throw new UnauthorizedException('Địa chỉ email đã tồn tại!');
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
      const user = await this.jwtService.verifyAsync(token, {
        secret: process.env.SECRET_KEY_JWT,
      });

      const currentUser = await this.userService.findOne(user.id);

      if (!currentUser) {
        throw new UnauthorizedException('Tài khoản không tồn tại!');
      }

      const payload = {
        id: user.id,
        username: user.username,
        email: user.email,
        password: user.password,
        avatar: user.avatar,
      };

      const accessToken = await this.jwtService.signAsync(payload, {
        expiresIn: '10m',
        secret: process.env.SECRET_KEY_JWT,
      });

      const refreshToken = await this.jwtService.signAsync(
        { id: user.id },
        { expiresIn: '1d', secret: process.env.SECRET_KEY_JWT },
      );

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
