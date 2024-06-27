import { ProjectDto } from '@/projects/dtos';
import { TaskDto } from '@/tasks/dtos';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ColumnDto {
  @ApiProperty()
  @IsString({ message: 'Name should be a string' })
  @IsNotEmpty({ message: 'Name should not be empty' })
  @MinLength(3)
  name: string;

  @ApiProperty({
    type: ProjectDto,
    description: 'Project DTO object',
    required: false,
  })
  project: ProjectDto;

  @ApiProperty({
    isArray: true,
    type: TaskDto,
    description: 'List tasks',
    required: false,
  })
  tasks?: TaskDto;
}
