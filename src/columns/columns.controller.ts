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
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ACCESS_TOKEN_NAME } from '@/libs/common/constants';
import { ColumnsService } from './columns.service';
import { CreateColumnDto, UpdateColumnDto } from './dtos';

@Controller('columns')
@ApiTags('Columns')
export class ColumnsController {
  constructor(private columnService: ColumnsService) {}

  @Get()
  @ApiOperation({ summary: 'Get Column list' })
  @ApiBearerAuth(ACCESS_TOKEN_NAME)
  async findAll(): Promise<any> {
    try {
      const columns = await this.columnService.findAll();

      return {
        isError: false,
        statusCode: HttpStatus.OK,
        message: 'Successful',
        data: columns,
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
  @ApiOperation({ summary: 'Get column by id' })
  @ApiBearerAuth(ACCESS_TOKEN_NAME)
  async findOne(@Param('id') id: string): Promise<any> {
    try {
      const column = await this.columnService.findOne(id);

      return {
        isError: false,
        statusCode: HttpStatus.OK,
        message: 'Successful',
        data: column,
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

  @Post()
  @ApiOperation({ summary: 'Create new column' })
  @ApiBearerAuth(ACCESS_TOKEN_NAME)
  async create(@Body() createEmployeeDto: CreateColumnDto) {
    try {
      const column = await this.columnService.create(createEmployeeDto);

      return {
        isError: false,
        statusCode: HttpStatus.OK,
        message: 'Successful',
        data: column,
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
  @ApiOperation({ summary: 'Update column by id' })
  @ApiBearerAuth(ACCESS_TOKEN_NAME)
  async update(
    @Param('id') id: string,
    @Body() updateDataDto: UpdateColumnDto,
  ): Promise<any> {
    try {
      const column = await this.columnService.update(id, updateDataDto);
      return {
        isError: false,
        statusCode: HttpStatus.OK,
        message: 'Successful',
        data: column,
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
  @ApiOperation({ summary: 'Delete column by id' })
  @ApiBearerAuth(ACCESS_TOKEN_NAME)
  async delete(@Param('id') id: string): Promise<any> {
    try {
      await this.columnService.remove(id);

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
