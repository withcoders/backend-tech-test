import { Type } from '@nestjs/common';
import { ApiProperty, ApiResponse } from '@nestjs/swagger';
import { Type as TypeTrans } from 'class-transformer';
import { IsBoolean, IsInt, ValidateNested } from 'class-validator';

export class PageInfo {
  @ApiProperty({
    description: 'Current page number',
    example: 1
  })
  @IsInt()
  currentPage: number;
  
  @ApiProperty({
    description: 'Has next page',
    example: true
  })
  @IsBoolean()
  hasNextPage: boolean;
  
  @ApiProperty({
    description: 'Has previous page',
    example: false
  })
  @IsBoolean()
  hasPreviousPage: boolean;
  
  @ApiProperty({
    description: 'Total items in page',
    example: 10
  })
  @IsInt()
  count: number;
}

export interface IPagination<T> {
  pageInfo: PageInfo;
  items: T[];
  totalCount: number;
}

export interface IPaginationOptions {
  limit: number;
  page: number;
}

export function PaginationAbstraction<T>(classRef: new () => T): Type<IPagination<T>> {
  abstract class Pagination implements IPagination<T> {
    @ApiProperty({
      description: 'Pagination information',
      type: PageInfo
    })
    @ValidateNested({each: true})
    @TypeTrans(() => PageInfo)
    pageInfo: PageInfo;
    
    @ApiProperty({
      description: 'List of items',
      type: [classRef]
    })
    @ValidateNested({each: true})
    @TypeTrans(() => classRef)
    items: T[];
    
    @ApiProperty({
      description: 'Total items in list',
      example: 10
    })
    @IsInt()
    totalCount: number;
  }
  
  return Pagination as Type<IPagination<T>>;
}