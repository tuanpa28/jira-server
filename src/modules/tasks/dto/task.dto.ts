import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { ColumnDto } from '~/modules/columns/dto';
import { CommentDto } from '~/modules/comments/dto';
import { ProjectDto } from '~/modules/projects/dto';
import { UserDto } from '~/modules/users/dto';
import { PriorityTask, StatusTask, TypeTask } from '~/shared/constants';

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
  @IsString({ message: 'Status should be a string' })
  @IsOptional()
  @IsEnum(StatusTask, { message: `Status must be one of: ${Object.values(StatusTask).join(', ')}` })
  status?: string;

  @ApiProperty({
    description: 'Original Estimate',
    required: false,
  })
  @IsInt({ message: 'Original Estimate should be an integer' })
  @IsOptional()
  originalEstimate?: number;

  @ApiProperty({
    description: 'Time tracking',
    required: false,
  })
  @IsInt({ message: 'Time Tracking should be an integer' })
  @IsOptional()
  timeTracking?: number;

  @ApiProperty({
    description: 'Time tracking remaining',
    required: false,
  })
  @IsInt({ message: 'Time Remaining should be an integer' })
  @IsOptional()
  timeRemaining?: number;

  @ApiProperty({
    example: 'Task',
    enum: ['Task', 'Bug', 'Story'],
    description: 'Task type',
    required: false,
  })
  @IsString({ message: 'Type should be a string' })
  @IsOptional()
  @IsEnum(TypeTask, { message: `Type must be one of: ${Object.values(TypeTask).join(', ')}` })
  type?: string;

  @ApiProperty({
    example: 'Medium',
    enum: ['Highest', 'Hight', 'Medium', 'Lowest', 'Low'],
    description: 'Priority',
    required: false,
  })
  @IsString({ message: 'Priority should be a string' })
  @IsOptional()
  @IsEnum(PriorityTask, {
    message: `Priority must be one of: ${Object.values(PriorityTask).join(', ')}`,
  })
  priority?: string;

  @ApiProperty({
    isArray: true,
    type: () => CommentDto,
    description: 'List comment of task',
    required: false,
  })
  @IsOptional()
  comments?: CommentDto[];

  @ApiProperty({
    type: () => ColumnDto,
    description: 'Column DTO object',
    required: true,
  })
  column: ColumnDto;
}
