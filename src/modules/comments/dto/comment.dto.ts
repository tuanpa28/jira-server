import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

import { TaskDto } from '~/modules/tasks/dto';
import { UserDto } from '~/modules/users/dto';

export class CommentDto {
  @ApiProperty({
    example: 1,
    description: 'Comment ID',
    required: true,
  })
  @IsNotEmpty({ message: 'ID should not be empty' })
  id: number;

  @ApiProperty({
    example: 'MyComment',
    description: 'Comment content',
    required: true,
  })
  @IsString({ message: 'Content should be a string' })
  @IsNotEmpty({ message: 'Content should not be empty' })
  @MinLength(4)
  content: string;

  @ApiProperty({
    type: () => UserDto,
    description: 'User DTO object',
    required: false,
  })
  user: UserDto;

  @ApiProperty({
    type: () => TaskDto,
    description: 'Task DTO object',
    required: false,
  })
  task: TaskDto;
}
