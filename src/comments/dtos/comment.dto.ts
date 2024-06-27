import { TaskDto } from '@/tasks/dtos';
import { UserDto } from '@/users/dtos';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CommentDto {
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
    type: UserDto,
    description: 'User DTO object',
    required: false,
  })
  user: UserDto;

  @ApiProperty({
    type: TaskDto,
    description: 'Task DTO object',
    required: false,
  })
  task: TaskDto;
}
