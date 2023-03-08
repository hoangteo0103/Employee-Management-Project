import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import Role from '../role/roles.enum';
export class CreateUserDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'hoangteo' })
  username: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  password: string;

  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  contactNumber: string;

  @IsOptional()
  @ApiProperty()
  dateOfBirth: Date;

  refreshToken: string;

  @ApiProperty()
  Skills: string[];

  @IsString()
  @ApiProperty()
  designation: string;

  @ApiProperty()
  @IsString()
  department: string;
  role: Role;
}
