import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'The name of the user', example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;
  
  @ApiProperty({ description: 'The email address of the user', example: 'john.doe@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
