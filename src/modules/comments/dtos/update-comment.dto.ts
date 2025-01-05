import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentDto } from './create-comment.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {
  @ApiProperty({
    example: 1,
    description: 'Comment ID',
    required: true,
  })
  @IsNotEmpty({ message: 'ID should not be empty' })
  id: number;
}
