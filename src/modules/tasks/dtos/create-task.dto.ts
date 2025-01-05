import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

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
  projectId?: number;

  @ApiProperty()
  userId?: number;

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

  @ApiProperty()
  columnId?: number;
}
