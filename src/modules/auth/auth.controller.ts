import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { ApiResponseDto } from '~/common/dto';
import { googleGuard } from '~/common/guards';
import { User } from '~/entities';
import { UserGoogleDto } from '~/modules/users/dto';
import { RedisService } from '~/redis';
import { AuthService } from './auth.service';
import { LogInDto, RegisterDto } from './dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Login' })
  async login(
    @Body() loginDataDto: LogInDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ApiResponseDto<User>> {
    try {
      const { user, accessToken, refreshToken } = await this.authService.login(loginDataDto);

      res.cookie('logged', 1, {
        path: '/',
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
      });

      res.cookie('accessToken', accessToken, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days (in milliseconds)
      });

      await this.redisService.addRefreshToken(accessToken, refreshToken, 7 * 24 * 60 * 60); // TTL 7 days (in seconds)

      return new ApiResponseDto(false, HttpStatus.OK, 'Successful', user);
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
  async register(@Body() registerDataDto: RegisterDto): Promise<ApiResponseDto<User>> {
    try {
      const { user } = await this.authService.register(registerDataDto);

      return new ApiResponseDto<User>(false, HttpStatus.OK, 'Successful', user);
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
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ApiResponseDto<null>> {
    try {
      const { accessToken } = req.cookies;

      if (!accessToken)
        throw new UnauthorizedException('No accessToken provided. Please log in again.');

      const refreshToken = await this.redisService.getRefreshToken(accessToken);

      const isBlacklisted = await this.redisService.isBlacklisted(refreshToken);

      if (isBlacklisted)
        throw new UnauthorizedException('Refresh token is blacklisted. Please log in again.');

      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        await this.authService.refreshToken(refreshToken);

      res.cookie('logged', 1, {
        path: '/',
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
      });

      res.cookie('accessToken', newAccessToken, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days (in milliseconds)
      });

      await this.redisService.addRefreshToken(accessToken, newRefreshToken, 7 * 24 * 60 * 60); // TTL 7 days (in seconds)

      return new ApiResponseDto(false, HttpStatus.OK, 'Successful', null);
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
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const { accessToken } = req.cookies;
    const currentTime = Math.floor(Date.now() / 1000);

    res.clearCookie('logged');
    res.clearCookie('accessToken');

    // Decode the access token to get its expiration time
    const decodedAccess = this.jwtService.decode(accessToken);
    const expirationTimeAccess = decodedAccess?.exp; // Extract expiration time from access token

    const remainingTimeAccess = expirationTimeAccess - currentTime;

    // If there is remaining time, add the access token to the Redis blacklist with TTL
    if (remainingTimeAccess > 0) {
      await this.redisService.addToBlacklist(accessToken, remainingTimeAccess);
    }

    // Retrieve the refresh token associated with the access token
    const refreshToken = await this.redisService.getRefreshToken(accessToken);

    if (refreshToken) {
      // Decode the refresh token to get its expiration time
      const decodedRefresh = this.jwtService.decode(refreshToken);
      const expirationTimeRefresh = decodedRefresh?.exp; // Extract expiration time from refresh token

      const remainingTimeRefresh = expirationTimeRefresh - currentTime;

      // If there is remaining time, add the refresh token to the Redis blacklist with TTL
      if (remainingTimeRefresh > 0) {
        await this.redisService.addToBlacklist(refreshToken, remainingTimeRefresh);
      }
    }

    return new ApiResponseDto(false, HttpStatus.OK, 'Successful', null);
  }

  @Get('google')
  @UseGuards(googleGuard)
  @ApiOperation({ summary: 'Login google' })
  async googleAuth(): Promise<HttpStatus> {
    return HttpStatus.OK;
  }

  @Get('google/redirect')
  @UseGuards(googleGuard)
  @ApiOperation({ summary: 'Redirect google' })
  async googleAuthRedirect(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    try {
      const { accessToken, refreshToken } = await this.authService.googleAuthRedirect(
        req.user as UserGoogleDto,
      );

      res.cookie('logged', 1, {
        path: '/',
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
      });

      res.cookie('accessToken', accessToken, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days (in milliseconds)
      });

      await this.redisService.addRefreshToken(accessToken, refreshToken, 7 * 24 * 60 * 60); // TTL 7 days (in seconds)

      const redirectUrl = new URL(`${process.env.URL_CLIENT}/sign-in`);
      res.redirect(redirectUrl.toString());
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
