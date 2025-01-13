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
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ApiResponseDto, IQueryOptions, QueryDto } from '~/common/dto';
import { AuthGuard } from '~/common/guards';
import { Category } from '~/entities';
import { ACCESS_TOKEN } from '~/shared/constants';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';

@ApiCookieAuth(ACCESS_TOKEN)
@Controller('categories')
@ApiTags('Categories')
@UseGuards(AuthGuard)
export class CategoriesController {
  constructor(private categoryService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Get category list' })
  async findAll(@Query() query: QueryDto): Promise<ApiResponseDto<Category[]>> {
    const { page = 1, limit = 10, sortBy = 'id', orderBy = 'asc', ...params } = query;

    const options: IQueryOptions = {
      skip: (Number(page) - 1) * Number(limit),
      limit: Number(limit),
      sort: sortBy,
      order: orderBy === 'asc' ? 'ASC' : 'DESC',
      ...params,
    };

    try {
      const [categories, count] = await Promise.all([
        this.categoryService.findAll(options),
        this.categoryService.count(params),
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
  async create(@Body() createEmployeeDto: CreateCategoryDto): Promise<ApiResponseDto<Category>> {
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
  async delete(@Param('id') id: number): Promise<ApiResponseDto<null>> {
    try {
      await this.categoryService.remove(id);

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
