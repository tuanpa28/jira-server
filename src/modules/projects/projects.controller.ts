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
import { CreateProjectDto, UpdateProjectDto } from './dtos';
import { Project } from './entities';
import { ProjectsService } from './projects.service';

@Controller('projects')
@ApiTags('Projects')
export class ProjectsController {
  constructor(private projectService: ProjectsService) {}

  @Get()
  @ApiOperation({ summary: 'Get project list' })
  async findAll(@Query() query: QueryDto): Promise<ApiResponseDto<Project[]>> {
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
      const [projects, count] = await Promise.all([
        this.projectService.findAll(options),
        this.projectService.count(),
      ]);

      return new ApiResponseDto(
        false,
        HttpStatus.OK,
        'Successful',
        projects,
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
  @ApiOperation({ summary: 'Get project by id' })
  async findOne(@Param('id') id: number): Promise<ApiResponseDto<Project>> {
    try {
      const project = await this.projectService.findOne(id);

      return new ApiResponseDto(false, HttpStatus.OK, 'Successful', project);
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
  @ApiOperation({ summary: 'Create new project' })
  async create(
    @Body() createEmployeeDto: CreateProjectDto,
  ): Promise<ApiResponseDto<Project>> {
    try {
      const project = await this.projectService.create(createEmployeeDto);

      return new ApiResponseDto(false, HttpStatus.OK, 'Successful', project);
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
  @ApiOperation({ summary: 'Update project by id' })
  async update(
    @Param('id') id: number,
    @Body() updateDataDto: UpdateProjectDto,
  ): Promise<ApiResponseDto<Project>> {
    try {
      const project = await this.projectService.update(id, updateDataDto);

      return new ApiResponseDto(false, HttpStatus.OK, 'Successful', project);
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
  @ApiOperation({ summary: 'Delete project by id' })
  async delete(@Param('id') id: number): Promise<ApiResponseDto<unknown>> {
    try {
      const project = await this.projectService.remove(id);

      return new ApiResponseDto(false, HttpStatus.OK, 'Successful', project);
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
