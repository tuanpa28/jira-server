import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T> {
  constructor(
    isError: boolean,
    statusCode: number,
    message: string,
    data: T,
    currentPage?: number,
    totalPage?: number,
    totalCount?: number,
  ) {
    this.isError = isError;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.currentPage = currentPage;
    this.totalPage = totalPage;
    this.totalCount = totalCount;
  }

  @ApiProperty({ description: 'Error status', example: false })
  isError: boolean;

  @ApiProperty({ description: 'HTTP Status Codes', example: 200 })
  statusCode: number;

  @ApiProperty({
    description: 'Return message',
    example: 'Request successful',
  })
  message: string;

  @ApiProperty({ description: 'Return data' })
  data: T;

  @ApiProperty({
    description: 'Current page',
    example: 1,
  })
  currentPage?: number;

  @ApiProperty({
    description: 'Total pages',
    example: 10,
  })
  totalPage?: number;

  @ApiProperty({
    description: 'Total records',
    example: 100,
  })
  totalCount?: number;
}
