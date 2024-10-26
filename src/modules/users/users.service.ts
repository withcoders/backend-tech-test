import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from 'prisma/prisma-client/runtime/library';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ListUserDto } from './dto/list-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginatedUsers } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService
  ) {}
  
  async create(createUserDto: CreateUserDto) {
    try {
      const user = await this.prisma.user.create({
        data: {
          ...createUserDto
        }
      })
      return user
    } catch (e: any) {
      if (e.code === 'P2002') {
        throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST)
      }
      throw new HttpException('Unknown Error', HttpStatus.BAD_REQUEST)
    }
  }

  async findAll({ limit = 10, page = 1 }: ListUserDto): Promise<PaginatedUsers> {
    const users = await this.prisma.user.findMany({
      take: limit,
      skip: (page - 1) * limit
    });
    
    const total = await this.prisma.user.count();
    return {
      pageInfo: {
        currentPage: page,
        hasNextPage: total > page * limit,
        hasPreviousPage: page > 1,
        count: users.length
      },
      items: users,
      totalCount: total
    }
  }

  async findOne(id: number) {
    if (Number.isNaN(id)) {
      throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    }
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: { id }
      })
      return user
    } catch (e) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (Number.isNaN(id)) {
      throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    }
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: {
          ...updateUserDto
        }
      })
      return user
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
      const deletedUSer = await this.prisma.user.delete({
        where: { id }
      })
      
      return deletedUSer
    } catch (e) {
      if (e.code === 'P2025') {
        throw new HttpException('Reservation not found', HttpStatus.NOT_FOUND)
      }
      throw new HttpException('Unknown error', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
