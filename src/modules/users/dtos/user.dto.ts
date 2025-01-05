import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

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
  @MinLength(3)
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
  avatar?: string;

  @ApiProperty({
    enum: ['user', 'admin'],
    description: 'Permissions',
    required: false,
  })
  @IsString({ message: 'Role should be a string' })
  role?: string;
}
