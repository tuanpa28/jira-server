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
import { Comment } from '~/entities';
import { ACCESS_TOKEN } from '~/shared/constants';
import { CommentsService } from './comments.service';
import { CreateCommentDto, UpdateCommentDto } from './dto';

@ApiCookieAuth(ACCESS_TOKEN)
@Controller('comments')
@ApiTags('Comments')
@UseGuards(AuthGuard)
export class CommentsController {
  constructor(private commentService: CommentsService) {}

  @Get()
  @ApiOperation({ summary: 'Get comment list' })
  async findAll(@Query() query: QueryDto): Promise<ApiResponseDto<Comment[]>> {
    const { page = 1, limit = 10, sortBy = 'id', orderBy = 'asc', ...params } = query;

    const options: IQueryOptions = {
      skip: (Number(page) - 1) * Number(limit),
      limit: Number(limit),
      sort: sortBy,
      order: orderBy === 'asc' ? 'ASC' : 'DESC',
      ...params,
    };

    try {
      const [comments, count] = await Promise.all([
        this.commentService.findAll(options),
        this.commentService.count(params),
      ]);

      return new ApiResponseDto(
        false,
        HttpStatus.OK,
        'Successful',
        comments,
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
  @ApiOperation({ summary: 'Get comment by id' })
  async findOne(@Param('id') id: number): Promise<ApiResponseDto<Comment>> {
    try {
      const comment = await this.commentService.findOne(id);

      return new ApiResponseDto(false, HttpStatus.OK, 'Successful', comment);
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
  @ApiOperation({ summary: 'Create new comment' })
  async create(@Body() createEmployeeDto: CreateCommentDto): Promise<ApiResponseDto<Comment>> {
    try {
      const comment = await this.commentService.create(createEmployeeDto);

      return new ApiResponseDto(false, HttpStatus.OK, 'Successful', comment);
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
  @ApiOperation({ summary: 'Update comment by id' })
  async update(
    @Param('id') id: number,
    @Body() updateDataDto: UpdateCommentDto,
  ): Promise<ApiResponseDto<Comment>> {
    try {
      const comment = await this.commentService.update(id, updateDataDto);

      return new ApiResponseDto(false, HttpStatus.OK, 'Successful', comment);
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
  @ApiOperation({ summary: 'Delete comment by id' })
  async delete(@Param('id') id: number): Promise<ApiResponseDto<null>> {
    try {
      await this.commentService.remove(id);

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
