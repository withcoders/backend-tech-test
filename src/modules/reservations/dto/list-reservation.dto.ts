import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsPositive } from 'class-validator';

export class ListReservationDto {
  @ApiProperty({
    description: 'Find reservation after this time string',
    example: '2021-08-01T10:00:00Z',
  })
  @IsDateString()
  @IsOptional()
  after?: string;
  
  @ApiProperty({
    description: 'Find reservation before this time string',
    example: '2021-08-01T10:00:00Z',
  })
  @IsDateString()
  @IsOptional()
  before?: string;
  
  @ApiProperty({
    description: 'The table number for the reservation',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  tableNumber: number;
  
  @ApiProperty({ description: 'Limit in 1 search', example: 10 })
  @IsPositive()
  @IsOptional()
  limit?: number;
  
  @ApiProperty({ description: 'Search page', example: 1 })
  @IsPositive()
  @IsOptional()
  page?: number;
}