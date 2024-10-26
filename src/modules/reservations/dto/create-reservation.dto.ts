import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';
import { IsTimeInRange } from '../../../validations/is-time-in-range';

export class CreateReservationDto {
  @ApiProperty({
    description: 'The time of the reservation',
    example: '2021-08-01T10:00:00Z',
  })
  @IsDateString()
  @IsNotEmpty()
  @IsTimeInRange()
  reservedAt: string;
  
  @ApiProperty({
    description: 'The table number for the reservation',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  tableNumber: number;
  
  @ApiProperty({
    description: 'The number of guests for the reservation',
    example: 4,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  numberOfGuests: number;
  
  @ApiProperty({
    description: 'The ID of the user making the reservation',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  userId: number;
}