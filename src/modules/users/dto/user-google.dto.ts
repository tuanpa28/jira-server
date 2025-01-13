import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class UserGoogleDto {
  @IsInt({ message: 'Id should be an integer' })
  @IsOptional()
  id?: number;

  @IsString({ message: 'Google Id Email should be a string' })
  @IsOptional()
  googleId?: string;

  @IsString({ message: 'UserName should be a string' })
  @IsNotEmpty({ message: 'UserName should not be empty' })
  @MinLength(4)
  username: string;

  @IsString({ message: 'Email should be a string' })
  @IsNotEmpty({ message: 'Email should not be empty' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString({ message: 'Password should be a string' })
  @IsNotEmpty({ message: 'Password should not be empty' })
  @MinLength(6)
  password: string;

  @IsString({ message: 'Avatar should be a string' })
  @IsOptional()
  avatar?: string;

  @IsString({ message: 'Role should be a string' })
  @IsOptional()
  role?: string;
}
