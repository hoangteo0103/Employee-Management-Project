import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
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

  @ValidateIf((o) => o.username != null)
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  password: string;

  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @ValidateIf((o) => o.username != null)
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  contactNumber: string;

  @ValidateIf((o) => o.username != null)
  @IsOptional()
  @ApiProperty()
  dateOfBirth: Date;

  @ValidateIf((o) => o.username != null)
  refreshToken: string;

  @ValidateIf((o) => o.username != null)
  @ApiProperty()
  Skills: string[];

  @ValidateIf((o) => o.username != null)
  @IsString()
  @ApiProperty()
  designation: string;

  @ValidateIf((o) => o.username != null)
  @ApiProperty()
  @IsString()
  department: string;
  role: Role;
}
