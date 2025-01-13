import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ApiResponseDto, IQueryOptions, QueryDto } from '~/common/dto';
import { AdminGuard, AuthGuard } from '~/common/guards';
import { User } from '~/entities';
import { ACCESS_TOKEN } from '~/shared/constants';
import { UpdateUserDto } from './dto';
import { UserService } from './users.service';

@ApiCookieAuth(ACCESS_TOKEN)
@Controller('users')
@ApiTags('Users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Get user list' })
  async findAll(@Query() query: QueryDto): Promise<ApiResponseDto<User[]>> {
    const { page = 1, limit = 10, sortBy = 'id', orderBy = 'asc', ...params } = query;

    const options: IQueryOptions = {
      skip: (Number(page) - 1) * Number(limit),
      limit: Number(limit),
      sort: sortBy,
      order: orderBy === 'asc' ? 'ASC' : 'DESC',
      ...params,
    };

    try {
      const [users, count] = await Promise.all([
        this.userService.findAll(options),
        this.userService.count(params),
      ]);

      return new ApiResponseDto(
        false,
        HttpStatus.OK,
        'Successful',
        users,
        Number(page),
        Math.ceil(count / Number(limit)),
        count,
      );
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

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get user by id' })
  async findOne(@Param('id') id: number): Promise<ApiResponseDto<User>> {
    try {
      const user = await this.userService.findOne(id);

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

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update user by id' })
  async update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ApiResponseDto<User>> {
    try {
      const user = await this.userService.update(id, updateUserDto);

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

  @Delete(':id')
  @UseGuards(AuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Delete user by id' })
  async delete(@Param('id') id: number): Promise<ApiResponseDto<null>> {
    try {
      await this.userService.remove(id);

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
}
