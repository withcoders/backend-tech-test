import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';
import { PaginationAbstraction } from '../../../abstractions/pagination.abstraction';

export class UserEntity {
  @ApiProperty({
    description: 'The id of the user',
    type: 'integer',
    example: 1,
  })
  @IsInt()
  id: number;
  
  @ApiProperty({
    description: 'The name of the user',
    type: 'string',
    example: 'John Doe',
  })
  @IsString()
  name: string;
  
  @ApiProperty({
    description: 'The email of the user',
    type: 'string',
    example: 'john.doe@gmail.com',
  })
  @IsString()
  email: string;
}

export class PaginatedUsers extends PaginationAbstraction(UserEntity) {}