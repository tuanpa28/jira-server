import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty()
  @IsString({ message: 'Content should be a string' })
  @IsNotEmpty({ message: 'Content should not be empty' })
  @MinLength(4)
  content: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'UserId should not be empty' })
  @IsInt({ message: 'UserId should be an integer' })
  userId: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'TaskId should not be empty' })
  @IsInt({ message: 'TaskId should be an integer' })
  taskId: number;
}
