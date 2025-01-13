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
import { Column } from '~/entities';
import { ACCESS_TOKEN } from '~/shared/constants';
import { ColumnsService } from './columns.service';
import { CreateColumnDto, UpdateColumnDto } from './dto';

@ApiCookieAuth(ACCESS_TOKEN)
@Controller('columns')
@ApiTags('Columns')
@UseGuards(AuthGuard)
export class ColumnsController {
  constructor(private columnService: ColumnsService) {}

  @Get()
  @ApiOperation({ summary: 'Get Column list' })
  async findAll(@Query() query: QueryDto): Promise<ApiResponseDto<Column[]>> {
    const { page = 1, limit = 10, sortBy = 'id', orderBy = 'asc', ...params } = query;

    const options: IQueryOptions = {
      skip: (Number(page) - 1) * Number(limit),
      limit: Number(limit),
      sort: sortBy,
      order: orderBy === 'asc' ? 'ASC' : 'DESC',
      ...params,
    };

    try {
      const [columns, count] = await Promise.all([
        this.columnService.findAll(options),
        this.columnService.count(params),
      ]);

      return new ApiResponseDto(
        false,
        HttpStatus.OK,
        'Successful',
        columns,
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
  @ApiOperation({ summary: 'Get column by id' })
  async findOne(@Param('id') id: number): Promise<ApiResponseDto<Column>> {
    try {
      const column = await this.columnService.findOne(id);

      return new ApiResponseDto(false, HttpStatus.OK, 'Successful', column);
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
  @ApiOperation({ summary: 'Create new column' })
  async create(@Body() createEmployeeDto: CreateColumnDto): Promise<ApiResponseDto<Column>> {
    try {
      const column = await this.columnService.create(createEmployeeDto);

      return new ApiResponseDto(false, HttpStatus.OK, 'Successful', column);
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
  @ApiOperation({ summary: 'Update column by id' })
  async update(
    @Param('id') id: number,
    @Body() updateDataDto: UpdateColumnDto,
  ): Promise<ApiResponseDto<Column>> {
    try {
      const column = await this.columnService.update(id, updateDataDto);

      return new ApiResponseDto(false, HttpStatus.OK, 'Successful', column);
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
  @ApiOperation({ summary: 'Delete column by id' })
  async delete(@Param('id') id: number): Promise<ApiResponseDto<null>> {
    try {
      await this.columnService.remove(id);

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
