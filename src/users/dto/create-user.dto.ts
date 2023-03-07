import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import Role from '../role/roles.enum';
export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsString()
  contactNumber: string;

  @IsNotEmpty()
  dateOfBirth: Date;
  refreshToken: string;
  Skills: string[];

  @IsString()
  designation: string;

  @IsString()
  department: string;
  role: Role;
}
