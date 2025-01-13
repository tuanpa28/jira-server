import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

import { ProjectDto } from '~/modules/projects/dto';

export class CategoryDto {
  @ApiProperty({
    example: 1,
    description: 'Category ID',
    required: true,
  })
  @IsNotEmpty({ message: 'ID should not be empty' })
  id: number;

  @ApiProperty({
    example: 'MyCategory',
    description: 'Category name',
    required: false,
  })
  @IsString({ message: 'Name should be a string' })
  @IsNotEmpty({ message: 'Name should not be empty' })
  @MinLength(3)
  name: string;

  @ApiProperty({
    isArray: true,
    description: 'Array of projects',
    required: false,
  })
  projects?: ProjectDto[];
}
