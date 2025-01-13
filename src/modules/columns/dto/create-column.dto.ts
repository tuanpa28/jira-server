import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateColumnDto {
  @ApiProperty()
  @IsString({ message: 'Name should be a string' })
  @IsNotEmpty({ message: 'Name should not be empty' })
  @MinLength(3)
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'ProjectId should not be empty' })
  @IsInt({ message: 'ProjectId should be an integer' })
  projectId: number;
}
