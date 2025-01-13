import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ProjectDto } from '~/modules/projects/dto';
import { TaskDto } from '~/modules/tasks/dto';

export class ColumnDto {
  @ApiProperty({
    example: 1,
    description: 'Column ID',
    required: true,
  })
  @IsNotEmpty({ message: 'ID should not be empty' })
  id: number;

  @ApiProperty()
  @IsString({ message: 'Name should be a string' })
  @IsNotEmpty({ message: 'Name should not be empty' })
  @MinLength(3)
  name: string;

  @ApiProperty({
    type: () => ProjectDto,
    description: 'Project DTO object',
    required: false,
  })
  project: ProjectDto;

  @ApiProperty({
    isArray: true,
    type: () => TaskDto,
    description: 'List tasks',
    required: false,
  })
  tasks?: TaskDto;
}
