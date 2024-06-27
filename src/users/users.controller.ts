import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ACCESS_TOKEN_NAME } from '@/libs/common/constants';
import { UpdateUserDto } from './dtos';
import { UserService } from './users.service';

@Controller('users')
@ApiTags('Users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get user list' })
  @ApiBearerAuth(ACCESS_TOKEN_NAME)
  async findAll(): Promise<any> {
    try {
      const users = await this.userService.findAll();

      return {
        isError: false,
        statusCode: HttpStatus.OK,
        message: 'Successful',
        data: users,
        // currentPage: Number(page),
        // totalPage: Math.ceil(count / Number(limit)),
        // totalDocs: count,
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

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiBearerAuth(ACCESS_TOKEN_NAME)
  async findOne(@Param('id') id: string): Promise<any> {
    try {
      const user = await this.userService.findOne(id);

      return {
        isError: false,
        statusCode: HttpStatus.OK,
        message: 'Successful',
        data: user,
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

  @Put(':id')
  @ApiOperation({ summary: 'Update user by id' })
  @ApiBearerAuth(ACCESS_TOKEN_NAME)
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<any> {
    try {
      const user = await this.userService.update(id, updateUserDto);
      return {
        isError: false,
        statusCode: HttpStatus.OK,
        message: 'Successful',
        data: user,
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

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by id' })
  @ApiBearerAuth(ACCESS_TOKEN_NAME)
  async delete(@Param('id') id: string): Promise<any> {
    try {
      await this.userService.remove(id);

      return {
        isError: false,
        statusCode: HttpStatus.OK,
        message: 'Successful',
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
