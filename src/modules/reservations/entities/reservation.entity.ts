import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsDateString } from 'class-validator';
import { PaginationAbstraction } from '../../../abstractions/pagination.abstraction';

export class ReservationEntity {
  @ApiProperty({
    description: 'The id of the reservation',
    type: 'integer',
    example: 1,
  })
  @IsInt()
  id: number;
  
  @ApiProperty({
    description: 'The date and time of the reservation in ISO format',
    type: 'string',
    example: '2021-08-01T10:00:00Z',
  })
  @IsDateString()
  reservedAt: Date;
  
  
  @ApiProperty({
    description: 'The table number of the reservation',
    type: 'integer',
    example: 1,
  })
  @IsInt()
  tableNumber: number;
  
  
  @ApiProperty({
    description: 'The number of guests of the reservation',
    type: 'integer',
    example: 4,
  })
  @IsInt()
  numberOfGuests: number;
  
  
  @ApiProperty({
    description: 'The id of the user who makes reservation',
    type: 'integer',
    example: 1,
  })
  @IsInt()
  userId: number;
}

export class PaginatedReservations extends PaginationAbstraction(ReservationEntity) {}
