import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PriorityTask, StatusTask, TypeTask } from '~/shared/constants';

export class CreateTaskDto {
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

  @ApiProperty()
  @IsNotEmpty({ message: 'ProjectId should not be empty' })
  @IsInt({ message: 'ProjectId should be an integer' })
  projectId: number;

  @ApiProperty({
    isArray: true,
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true, message: 'User Assign Id should be an integer' })
  userAssignIds?: number[];

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

  @ApiProperty()
  @IsNotEmpty({ message: 'ColumnId should not be empty' })
  @IsInt({ message: 'ColumnId should be an integer' })
  columnId: number;
}
