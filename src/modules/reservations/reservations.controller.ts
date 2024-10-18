import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ApiCreatedResponse, ApiFoundResponse, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ListReservationDto } from './dto/list-reservation.dto';
import { PaginatedReservations, ReservationEntity } from './entities/reservation.entity';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

@ApiTags('reservations')
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: ReservationEntity,
  })
  create(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationsService.create(createReservationDto);
  }

  @Post('/find-all')
  @ApiResponse({
    status: 201,
    description: 'The records have been successfully retrieved.',
    type: PaginatedReservations,
  })
  findAll(
    @Body() listReservationDto: ListReservationDto,
  ) {
    return this.reservationsService.findAll(listReservationDto);
  }

  @Get(':id')
  @ApiFoundResponse({
    description: 'The record has been successfully created.',
    type: ReservationEntity,
  })
  findOne(@Param('id') id: string) {
    return this.reservationsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOkResponse({
    description: 'The record has been successfully created.',
    type: ReservationEntity,
  })
  update(@Param('id') id: string, @Body() updateReservationDto: UpdateReservationDto) {
    return this.reservationsService.update(+id, updateReservationDto);
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'The record has been successfully created.',
    type: ReservationEntity,
  })
  remove(@Param('id') id: string) {
    return this.reservationsService.remove(+id);
  }
}
