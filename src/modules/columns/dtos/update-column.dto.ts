import { PartialType } from '@nestjs/mapped-types';
import { CreateColumnDto } from './create-column.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateColumnDto extends PartialType(CreateColumnDto) {
  @ApiProperty({
    example: 1,
    description: 'Column ID',
    required: true,
  })
  @IsNotEmpty({ message: 'ID should not be empty' })
  id: number;
}
