import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { ColumnDto } from '~/modules/columns/dtos';
import { CommentDto } from '~/modules/comments/dtos';
import { ProjectDto } from '~/modules/projects/dtos';
import { UserDto } from '~/modules/users/dtos';

export class TaskDto {
  @ApiProperty({
    example: 1,
    description: 'Task ID',
    required: true,
  })
  @IsNotEmpty({ message: 'ID should not be empty' })
  id: number;

  @ApiProperty({
    example: 'MyTitle',
    description: 'Task Title',
    required: true,
  })
  @IsString({ message: 'Title should be a string' })
  @IsNotEmpty({ message: 'Title should not be empty' })
  title: string;

  @ApiProperty({
    example: 'MyDescription',
    description: 'Task Description',
    required: false,
  })
  @IsString({ message: 'Description should be a string' })
  @IsNotEmpty({ message: 'Description should not be empty' })
  description?: string;

  @ApiProperty({
    type: () => ProjectDto,
    description: 'Project DTO object',
    required: true,
  })
  project: ProjectDto;

  @ApiProperty({
    isArray: true,
    type: () => UserDto,
    description: 'List users assign',
    required: false,
  })
  usersAssign?: UserDto[];

  @ApiProperty({
    example: 'TO DO',
    enum: ['TO DO', 'IN PROGRESS', 'DONE'],
    description: 'Task status',
    required: false,
  })
  status?: string;

  @ApiProperty({
    example: 5,
    description: 'Original Estimate',
    required: false,
  })
  originalEstimate?: number;

  @ApiProperty({
    example: 2,
    description: 'Time tracking',
    required: false,
  })
  timeTracking?: number;

  @ApiProperty({
    example: 10,
    description: 'Time tracking remaining',
    required: false,
  })
  timeRemaining?: number;

  @ApiProperty({
    example: 'Task',
    enum: ['Task', 'Bug', 'Story'],
    description: 'Task type',
    required: false,
  })
  type?: string;

  @ApiProperty({
    example: 'Medium',
    enum: ['Highest', 'Hight', 'Medium', 'Lowest', 'Low'],
    description: 'Priority',
    required: false,
  })
  priority?: string;

  @ApiProperty({
    isArray: true,
    type: () => CommentDto,
    description: 'List comment of task',
    required: false,
  })
  comments?: CommentDto;

  @ApiProperty({
    type: () => ColumnDto,
    description: 'Column DTO object',
    required: true,
  })
  column: ColumnDto;
}