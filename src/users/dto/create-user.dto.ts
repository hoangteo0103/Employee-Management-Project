import { IsEmail, IsNotEmpty } from 'class-validator';
import Role from '../role/roles.enum';
export class CreateUserDto {
  username: string;

  @IsEmail()
  email: string;

  password: string;

  @IsNotEmpty()
  name: string;

  contactNumber: string;
  dateOfBirth: Date;
  refreshToken: string;
  Skills: string[];
  designation: string;
  department: string;
  role: Role;
}
