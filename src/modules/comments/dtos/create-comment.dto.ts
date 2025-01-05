import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty()
  @IsString({ message: 'Content should be a string' })
  @IsNotEmpty({ message: 'Content should not be empty' })
  @MinLength(4)
  content: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'UserId should not be empty' })
  userId: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'TaskId should not be empty' })
  taskId: number;
}