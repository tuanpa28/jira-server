import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateProjectDto {
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
  @IsOptional()
  url?: string;

  @ApiProperty({
    example: 'MyDescription',
    description: 'Project description',
    required: false,
  })
  @IsString({ message: 'Description should be a string' })
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'CategoryId should not be empty' })
  @IsInt({ message: 'CategoryId should be an integer' })
  categoryId: number;

  @ApiProperty({
    isArray: true,
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true, message: 'Member Id should be an integer' })
  memberIds?: number[];
}
