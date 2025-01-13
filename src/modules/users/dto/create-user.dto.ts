import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
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

  @ApiProperty()
  @IsString({ message: 'Avatar should be a string' })
  @IsOptional()
  avatar?: string;
}
