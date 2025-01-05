import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { ApiResponseDto } from '~/common/dto';
import { UserDto } from '../users/dtos';
import { AuthService } from './auth.service';
import { LogInDto, RegisterDto } from './dtos';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Login' })
  async login(
    @Body() loginDataDto: LogInDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ApiResponseDto<{ accessToken: string }>> {
    try {
      const { accessToken, refreshToken } =
        await this.authService.login(loginDataDto);

      res.cookie('accessToken', accessToken, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge: 10 * 60 * 1000, // 10 minutes
      });

      res.cookie('refreshToken', refreshToken, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 day
      });

      return new ApiResponseDto(false, HttpStatus.OK, 'Successful', {
        accessToken,
      });
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

  @HttpCode(HttpStatus.OK)
  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  async register(
    @Body() registerDataDto: RegisterDto,
  ): Promise<ApiResponseDto<{ user: UserDto }>> {
    try {
      const { user } = await this.authService.register(registerDataDto);

      return new ApiResponseDto(false, HttpStatus.OK, 'Successful', {
        user,
      });
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

  @HttpCode(HttpStatus.OK)
  @Post('refreshToken')
  @ApiOperation({ summary: 'Create new token' })
  async refreshToken(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ): Promise<ApiResponseDto<{ accessToken: string }>> {
    try {
      const { refreshToken } = req.cookies;

      if (!refreshToken)
        throw new UnauthorizedException(
          'No refresh token provided. Please log in again.',
        );

      const { accessToken, refreshToken: newRefreshToken } =
        await this.authService.refreshToken(refreshToken);

      res.cookie('accessToken', accessToken, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge: 10 * 60 * 1000, // 10 minutes
      });

      res.cookie('refreshToken', newRefreshToken, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 day
      });

      return new ApiResponseDto(false, HttpStatus.OK, 'Successful', {
        accessToken,
      });
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

  @HttpCode(HttpStatus.OK)
  @Delete('logout')
  @ApiOperation({ summary: 'Logout' })
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('accessToken', { path: '/' });
    res.clearCookie('refreshToken', { path: '/' });

    return new ApiResponseDto(false, HttpStatus.OK, 'Successful', null);
  }
}
