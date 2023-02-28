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
import { Leave } from 'src/leave/entities/leave.entity';
import { LeaveService } from 'src/leave/leave.service';


@Injectable()
export class AdminService {
  constructor(
    private usersService: UsersService,
    private jwtService : JwtService,
    private attendanceService : AttendanceService,
    private leaveService : LeaveService
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

  async findFilter(opts)
  {
    const t = await this.usersService.findFilter(opts) ;
    return t; 
  }

  async viewAllApplications()
  {
    const {hasLeave , leaveChunk } = await this.leaveService.findAll() ; 
    let employeeChunk = [];
    for(var i = 0 ; i < leaveChunk.length ; i++)
    {
      const user = await this.usersService.findById(leaveChunk[i].applicantID);
      employeeChunk.push(user);
    }
    return { 
      hasLeave : hasLeave , 
      leaves : leaveChunk , 
      employees : employeeChunk ,
    }
  }
}
