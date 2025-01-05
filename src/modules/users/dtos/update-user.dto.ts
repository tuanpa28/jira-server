import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    example: 1,
    description: 'User ID',
    required: true,
  })
  @IsNotEmpty({ message: 'ID should not be empty' })
  id: number;

  @ApiProperty()
  @IsString({ message: 'Avatar should be a string' })
  avatar?: string;

  @ApiProperty({
    enum: ['user', 'admin'],
    description: 'Permissions',
    required: false,
  })
  @IsString({ message: 'Role should be a string' })
  role?: string;
}
