import { ACCESS_TOKEN_NAME } from '@/libs/common/constants';
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

import { CategoriesService } from './categories.service';
import { UpdateCategoryDto } from './dtos';

@Controller('categories')
@ApiTags('Categories')
export class CategoriesController {
  constructor(private categoryService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Get category list' })
  @ApiBearerAuth(ACCESS_TOKEN_NAME)
  async findAll(): Promise<any> {
    try {
      const categories = await this.categoryService.findAll();

      return {
        isError: false,
        statusCode: HttpStatus.OK,
        message: 'Successful',
        data: categories,
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
  @ApiOperation({ summary: 'Get category by id' })
  @ApiBearerAuth(ACCESS_TOKEN_NAME)
  async findOne(@Param('id') id: string): Promise<any> {
    try {
      const category = await this.categoryService.findOne(id);

      return {
        isError: false,
        statusCode: HttpStatus.OK,
        message: 'Successful',
        data: category,
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
  @ApiOperation({ summary: 'Update category by id' })
  @ApiBearerAuth(ACCESS_TOKEN_NAME)
  async update(
    @Param('id') id: string,
    @Body() updateDataDto: UpdateCategoryDto,
  ): Promise<any> {
    try {
      const category = await this.categoryService.update(id, updateDataDto);
      return {
        isError: false,
        statusCode: HttpStatus.OK,
        message: 'Successful',
        data: category,
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
  @ApiOperation({ summary: 'Delete category by id' })
  @ApiBearerAuth(ACCESS_TOKEN_NAME)
  async delete(@Param('id') id: string): Promise<any> {
    try {
      await this.categoryService.remove(id);

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
