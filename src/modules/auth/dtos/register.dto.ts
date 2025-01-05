import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, IsEmail } from 'class-validator';

export class RegisterDto {
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
}
