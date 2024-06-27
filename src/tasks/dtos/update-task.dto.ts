import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';
// import { UserDto } from '@/users/dtos';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiProperty({
    example: 'MyDescription',
    description: 'Task Description',
    required: false,
  })
  description?: string;

  // @ApiProperty({
  //   isArray: true,
  //   type: UserDto,
  //   description: 'List users assign',
  //   required: false,
  // })
  // usersAssign: UserDto[];

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
}
