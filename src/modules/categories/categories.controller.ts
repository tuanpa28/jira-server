import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ApiResponseDto, CommonQueryOptions, QueryDto } from '~/common/dto';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dtos';
import { Category } from './entities';

@Controller('categories')
@ApiTags('Categories')
export class CategoriesController {
  constructor(private categoryService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Get category list' })
  async findAll(@Query() query: QueryDto): Promise<ApiResponseDto<Category[]>> {
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
      const [categories, count] = await Promise.all([
        this.categoryService.findAll(options),
        this.categoryService.count(),
      ]);

      return new ApiResponseDto(
        false,
        HttpStatus.OK,
        'Successful',
        categories,
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
  @ApiOperation({ summary: 'Get category by id' })
  async findOne(@Param('id') id: number): Promise<ApiResponseDto<Category>> {
    try {
      const category = await this.categoryService.findOne(id);

      return new ApiResponseDto(false, HttpStatus.OK, 'Successful', category);
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

  @Post()
  @ApiOperation({ summary: 'Create new category' })
  async create(
    @Body() createEmployeeDto: CreateCategoryDto,
  ): Promise<ApiResponseDto<Category>> {
    try {
      const category = await this.categoryService.create(createEmployeeDto);

      return new ApiResponseDto(false, HttpStatus.OK, 'Successful', category);
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
  async update(
    @Param('id') id: number,
    @Body() updateDataDto: UpdateCategoryDto,
  ): Promise<ApiResponseDto<Category>> {
    try {
      const category = await this.categoryService.update(id, updateDataDto);

      return new ApiResponseDto(false, HttpStatus.OK, 'Successful', category);
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
  async delete(@Param('id') id: number): Promise<ApiResponseDto<unknown>> {
    try {
      const category = await this.categoryService.remove(id);

      return new ApiResponseDto(false, HttpStatus.OK, 'Successful', category);
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
