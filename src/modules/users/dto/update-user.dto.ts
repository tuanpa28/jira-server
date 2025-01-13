import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Role } from '~/shared/constants';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    enum: [Role.User, Role.Admin],
    description: 'Permissions',
    required: false,
  })
  @IsString({ message: 'Role should be a string' })
  @IsOptional()
  role?: string;
}
