import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty()
  @IsString({ message: 'Name should be a string' })
  @IsNotEmpty({ message: 'Name should not be empty' })
  @MinLength(3)
  name: string;

  @ApiProperty()
  @IsString({ message: 'Url should be a string' })
  url?: string;

  @ApiProperty()
  @IsString({ message: 'Description should be a string' })
  description?: string;
}
