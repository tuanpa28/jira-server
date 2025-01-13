import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { Role } from '~/shared/constants';

export class UserDto {
  @ApiProperty({
    example: 1,
    description: 'User ID',
    required: true,
  })
  @IsNotEmpty({ message: 'ID should not be empty' })
  id: number;

  @ApiProperty()
  @IsString({ message: 'UserName should be a string' })
  @IsNotEmpty({ message: 'UserName should not be empty' })
  @MinLength(4)
  username: string;

  @ApiProperty()
  @IsString({ message: 'Email should be a string' })
  @IsNotEmpty({ message: 'Email should not be empty' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @ApiProperty()
  @IsString({ message: 'Password should be a string' })
  @IsNotEmpty({ message: 'Password should not be empty' })
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: 'http://my-avatar-url',
    description: 'Avatar url',
    required: false,
  })
  @IsString({ message: 'Avatar should be a string' })
  @IsOptional()
  avatar?: string;

  @ApiProperty({
    enum: [Role.User, Role.Admin],
    description: 'Permissions',
    required: false,
  })
  @IsString({ message: 'Role should be a string' })
  @IsOptional()
  role?: string;
}
