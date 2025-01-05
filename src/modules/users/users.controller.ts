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
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ApiResponseDto, CommonQueryOptions, QueryDto } from '~/common/dto';
import { UpdateUserDto } from './dtos';
import { User } from './entities';
import { UserService } from './users.service';

@Controller('users')
@ApiTags('Users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get user list' })
  async findAll(@Query() query: QueryDto): Promise<ApiResponseDto<User[]>> {
    const {
      page = 1,
      limit = 10,
      _sort = 'id',
      _order = 'asc',
      ...params
    } = query;

    const options: CommonQueryOptions = {
      skip: (Number(page) - 1) * Number(limit),
      limit: Number(limit),
      sort: {
        [_sort]: _order === 'desc' ? 'DESC' : 'ASC',
      },
      ...params,
    };

    try {
      const [users, count] = await Promise.all([
        this.userService.findAll(options),
        this.userService.count(),
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
  @ApiOperation({ summary: 'Delete user by id' })
  async delete(@Param('id') id: number): Promise<ApiResponseDto<unknown>> {
    try {
      const user = await this.userService.remove(id);

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
}
