import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { IsTimeInRange } from '../../../validations/is-time-in-range';
import { CreateReservationDto } from './create-reservation.dto';

export class UpdateReservationDto  {
  @ApiProperty({ description: 'The time of the reservation' })
  @IsDateString()
  @IsNotEmpty()
  @IsTimeInRange()
  reservedAt: string;
  
  @ApiProperty({ description: 'The table number for the reservation' })
  @IsInt()
  @IsNotEmpty()
  tableNumber: number;
  
  @ApiProperty({ description: 'The number of guests for the reservation' })
  @IsInt()
  @IsOptional()
  numberOfGuests?: number;
}
