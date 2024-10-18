import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPositive } from 'class-validator';

export class ListUserDto {
  @ApiProperty({ description: 'Limit in 1 search', example: 10 })
  @IsPositive()
  @IsOptional()
  limit?: number;
  
  @ApiProperty({ description: 'Search page', example: 1 })
  @IsPositive()
  @IsOptional()
  page?: number;
}