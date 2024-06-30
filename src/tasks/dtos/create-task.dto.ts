import { ColumnDto } from '@/columns/dtos';
import { ProjectDto } from '@/projects/dtos';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({
    example: 'MyTitle',
    description: 'Task Title',
    required: true,
  })
  @IsString({ message: 'Title should be a string' })
  @IsNotEmpty({ message: 'Title should not be empty' })
  title: string;

  @ApiProperty({
    type: ProjectDto,
    description: 'Project DTO object',
    required: true,
  })
  project?: ProjectDto;

  @ApiProperty({
    type: ColumnDto,
    description: 'Column DTO object',
    required: true,
  })
  column?: ColumnDto;
}
