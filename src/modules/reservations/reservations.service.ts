import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IPaginationOptions } from '../../abstractions/pagination.abstraction';
import { PrismaService } from '../../prisma/prisma.service';
import { PaginatedUsers } from '../users/entities/user.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ListReservationDto } from './dto/list-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { PaginatedReservations } from './entities/reservation.entity';

const hourInMilliseconds = 60 * 60 * 1000;
@Injectable()
export class ReservationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService
  ) {
    this.maxNumberOfSeats = parseInt(this.configService.get('NUMBER_OF_SEATS') || '4', 10);
    this.totalTables = parseInt(this.configService.get('TOTAL_TABLES') || '5', 10);
  }
  private readonly maxNumberOfSeats: number;
  private readonly totalTables: number;
  async create(createReservationDto: CreateReservationDto) {
    const { tableNumber, reservedAt, numberOfGuests, userId } = createReservationDto;
    
    // Should be replaced with actual validation by token or something later on
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    
    this.commonValidate({ tableNumber, numberOfGuests });
    await this.validateTimeSlot({ tableNumber, reservedTime: new Date(reservedAt) })
    
    try {
      const reservation = await this.prisma.reservation.create({
        data: {
          tableNumber,
          reservedAt,
          numberOfGuests,
          userId,
        },
      })
      return reservation
    } catch (e) {
      throw new HttpException('Unknown Error', HttpStatus.BAD_REQUEST)
    }
  }
  
  async findAll({
    after,
    before,
    tableNumber,
    limit = 10,
    page = 1
  }: ListReservationDto): Promise<PaginatedReservations> {
    const reservations = await this.prisma.reservation.findMany({
      take: limit,
      skip: (page - 1) * limit,
      where: {
        tableNumber,
        reservedAt: {
          gte: after ? new Date(after) : undefined,
          lte: before ? new Date(before) : undefined,
        },
      },
    });
    
    const total = await this.prisma.reservation.count({
      where: {
        tableNumber,
        reservedAt: {
          gte: after ? new Date(after) : undefined,
          lte: before ? new Date(before) : undefined,
        },
      },
    });
    return {
      pageInfo: {
        currentPage: page,
        hasNextPage: total > page * limit,
        hasPreviousPage: page > 1,
        count: reservations.length
      },
      items: reservations,
      totalCount: total
    }
  }

  async findOne(id: number) {
    if (Number.isNaN(id)) {
      throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    }
    try {
      const user = await this.prisma.reservation.findUniqueOrThrow({
        where: { id }
      })
      return user
    } catch (e) {
      throw new HttpException('Reservation not found', HttpStatus.NOT_FOUND)
    }
  }

  async update(id: number, updateReservationDto: UpdateReservationDto) {
    if (Number.isNaN(id)) {
      throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    }
    const { tableNumber, reservedAt, numberOfGuests } = updateReservationDto;
    
    this.commonValidate({ tableNumber, numberOfGuests });
    await this.validateTimeSlot({ id, tableNumber, reservedTime: new Date(reservedAt) })
    
    try {
      const updatedReservation = await this.prisma.reservation.update({
        where: {
          id,
        },
        data: {
          tableNumber,
          reservedAt,
          numberOfGuests,
        },
      });
      return updatedReservation
    } catch (e) {
      if (e.code === 'P2025') {
        throw new HttpException('Reservation not found', HttpStatus.NOT_FOUND)
      }
      throw new HttpException('Unknown error', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async remove(id: number) {
    if (Number.isNaN(id)) {
      throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    }
    try {
      const deletedReservation = await this.prisma.reservation.delete({
        where: {
          id,
        },
      });
      return deletedReservation
    } catch (e) {
      if (e.code === 'P2025') {
        throw new HttpException('Reservation not found', HttpStatus.NOT_FOUND)
      }
      throw new HttpException('Unknown error', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
  
  private commonValidate({ tableNumber, numberOfGuests }: { tableNumber: number, numberOfGuests?: number }) {
    if (typeof numberOfGuests === 'number' && numberOfGuests > this.maxNumberOfSeats) {
      throw new HttpException('Number of guests exceeds the limit', HttpStatus.BAD_REQUEST);
    }
    if (tableNumber > this.totalTables) {
      throw new HttpException('Invalid table number', HttpStatus.BAD_REQUEST);
    }
  }
  
  private async validateTimeSlot({ id, tableNumber, reservedTime }: { id?: number, tableNumber: number, reservedTime: Date }) {
    const seatDuration = parseInt(this.configService.get('SEAT_DURATION') || '1', 10);
    const reservedSlots = await this.prisma.reservation.count({
      where: {
        tableNumber,
        reservedAt: {
          gt: new Date(reservedTime.getTime() - seatDuration * hourInMilliseconds),
          lt: new Date(reservedTime.getTime() + seatDuration * hourInMilliseconds),
        },
        ...(id ? { id: { not: id } } : {})
      },
    });
    
    if (reservedSlots > 0) {
      throw new HttpException('Selected time slot is already busy', HttpStatus.BAD_REQUEST);
    }
  }
}
