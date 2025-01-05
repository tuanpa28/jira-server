import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { CreateCategoryDto } from './create-category.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @ApiProperty({
    example: 1,
    description: 'Category ID',
    required: true,
  })
  @IsNotEmpty({ message: 'ID should not be empty' })
  id: number;
}
