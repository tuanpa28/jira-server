import { ColumnDto } from '@/columns/dtos';
import { CommentDto } from '@/comments/dtos';
import { ProjectDto } from '@/projects/dtos';
import { UserDto } from '@/users/dtos';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';

export class TaskDto {
  @PrimaryGeneratedColumn()
  id: string;

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
    type: ProjectDto,
    description: 'Project DTO object',
    required: true,
  })
  project: ProjectDto;

  @ApiProperty({
    isArray: true,
    type: UserDto,
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
  timeRemaining?: string;

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
    type: CommentDto,
    description: 'List comment of task',
    required: false,
  })
  comments?: CommentDto;

  @ApiProperty({
    type: ColumnDto,
    description: 'Column DTO object',
    required: true,
  })
  column: ColumnDto;
}
