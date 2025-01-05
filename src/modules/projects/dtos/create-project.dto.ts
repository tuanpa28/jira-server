import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

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
  url?: string;

  @ApiProperty({
    example: 'MyDescription',
    description: 'Project description',
    required: false,
  })
  @IsString({ message: 'Description should be a string' })
  description?: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'CategoryId should not be empty' })
  categoryId: number;
}
