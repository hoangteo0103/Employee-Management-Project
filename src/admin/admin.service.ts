import { BadRequestException, Injectable , Req} from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import * as argon2 from 'argon2';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { CreateAttendanceDto } from 'src/attendance/dto/create-attendance.dto';
import { AttendanceService } from 'src/attendance/attendance.service';
import mongoose from 'mongoose';


@Injectable()
export class AdminService {
  constructor(
    private usersService: UsersService,
    private jwtService : JwtService,
    private attendanceService : AttendanceService
  ) {}
  async create(createUserDto: CreateUserDto): Promise<any> {
      // Check if user exists
      const userExists = await this.usersService.findByUsername(
        createUserDto.username,
      );
      if (userExists) {
        throw new BadRequestException('User already exists');
      }
  
      // Hash password
      const hash = await this.hashData(createUserDto.password);
      const newUser = await this.usersService.create({
        ...createUserDto,
        password: hash,
      });
  }

  hashData(data: string) {
    return argon2.hash(data);
  }

  async findAll() {
    const t = await this.usersService.findAll();
    return t;
  }

  findOne(id: number) {
    return `This action returns a #${id} admin`;
  }

  update(id: number, updateAdminDto: UpdateAdminDto) {
    return `This action updates a #${id} admin`;
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }

}
