import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min, IsIn } from 'class-validator';

export class QueryDto {
  @ApiProperty({
    description: 'Current page',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @ApiProperty({
    description: 'Number of records per page',
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiProperty({
    description: 'Sort field',
    example: 'id',
    required: false,
  })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiProperty({
    description: 'Sort order',
    example: 'asc',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  orderBy?: 'asc' | 'desc';
}

export interface IQueryOptions {
  skip?: number;
  limit?: number;
  sort?: string;
  order?: 'ASC' | 'DESC';
}
