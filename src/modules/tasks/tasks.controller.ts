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
import { CreateTaskDto, UpdateTaskDto } from './dtos';
import { Task } from './entities';
import { TasksService } from './tasks.service';

@Controller('tasks')
@ApiTags('Tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get()
  @ApiOperation({ summary: 'Get task list' })
  async findAll(@Query() query: QueryDto): Promise<ApiResponseDto<Task[]>> {
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
      const [tasks, count] = await Promise.all([
        this.taskService.findAll(options),
        this.taskService.count(),
      ]);

      return new ApiResponseDto(
        false,
        HttpStatus.OK,
        'Successful',
        tasks,
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
  @ApiOperation({ summary: 'Get task by id' })
  async findOne(@Param('id') id: number): Promise<ApiResponseDto<Task>> {
    try {
      const task = await this.taskService.findOne(id);

      return new ApiResponseDto(false, HttpStatus.OK, 'Successful', task);
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
  @ApiOperation({ summary: 'Create new task' })
  async create(
    @Body() createEmployeeDto: CreateTaskDto,
  ): Promise<ApiResponseDto<Task>> {
    try {
      const task = await this.taskService.create(createEmployeeDto);

      return new ApiResponseDto(false, HttpStatus.OK, 'Successful', task);
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
  @ApiOperation({ summary: 'Update task by id' })
  async update(
    @Param('id') id: number,
    @Body() updateDataDto: UpdateTaskDto,
  ): Promise<ApiResponseDto<Task>> {
    try {
      const task = await this.taskService.update(id, updateDataDto);

      return new ApiResponseDto(false, HttpStatus.OK, 'Successful', task);
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
  @ApiOperation({ summary: 'Delete task by id' })
  async delete(@Param('id') id: number): Promise<ApiResponseDto<unknown>> {
    try {
      const task = await this.taskService.remove(id);

      return new ApiResponseDto(false, HttpStatus.OK, 'Successful', task);
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
