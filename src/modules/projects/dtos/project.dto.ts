import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

import { CategoryDto } from '~/modules/categories/dtos';
import { ColumnDto } from '~/modules/columns/dtos';
import { TaskDto } from '~/modules/tasks/dtos';
import { UserDto } from '~/modules/users/dtos';

export class ProjectDto {
  @ApiProperty({
    example: 1,
    description: 'Project ID',
    required: true,
  })
  @IsNotEmpty({ message: 'ID should not be empty' })
  id: number;

  @ApiProperty({
    example: 'MyProject',
    description: 'Project name',
    required: true,
  })
  @IsString({ message: 'Name should be a string' })
  @IsNotEmpty({ message: 'Name should not be empty' })
  @MinLength(3)
  name: string;

  @ApiProperty({
    example: 'http://my-project-url',
    description: 'Project url',
    required: false,
  })
  @IsString({ message: 'Url should be a string' })
  url?: string;

  @ApiProperty({
    example: 'MyDescription',
    description: 'Project description',
    required: false,
  })
  @IsString({ message: 'Description should be a string' })
  description?: string;

  @ApiProperty({
    type: () => CategoryDto,
    description: 'Category DTO object',
    required: true,
  })
  category: CategoryDto;

  @ApiProperty({
    isArray: true,
    type: () => UserDto,
    description: 'List members',
    required: false,
  })
  members?: UserDto[];

  @ApiProperty({
    isArray: true,
    type: () => TaskDto,
    description: 'List tasks',
    required: false,
  })
  tasks?: TaskDto[];

  @ApiProperty({
    isArray: true,
    type: () => ColumnDto,
    description: 'List columns',
    required: false,
  })
  columns?: ColumnDto[];
}
