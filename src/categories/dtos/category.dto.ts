import { ProjectDto } from '@/projects/dtos';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CategoryDto {
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
    enum: [],
    description: 'Array of projects',
    required: false,
  })
  projects?: ProjectDto[];
}
