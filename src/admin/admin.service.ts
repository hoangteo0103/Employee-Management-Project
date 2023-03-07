import { BadRequestException, Injectable, Req } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import * as argon2 from 'argon2';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { AttendanceService } from '../attendance/attendance.service';
import { LeaveService } from '../leave/leave.service';
import Role from '../users/role/roles.enum';

@Injectable()
export class AdminService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private attendanceService: AttendanceService,
    private leaveService: LeaveService,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<any> {
    // Check if user exists
    const userExists = await this.usersService.findByUsername(
      createUserDto.username,
    );
    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    // Role designation

    if (createUserDto.designation.includes('Manager'))
      createUserDto.role = Role.Manager;
    else createUserDto.role = Role.Employee;

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

  async findFilter(opts) {
    const t = await this.usersService.findFilter(opts);
    return t;
  }

  async viewAllApplications() {
    const { hasLeave, leaveChunk } = await this.leaveService.findAll();
    const employeeChunk = [];
    for (let i = 0; i < leaveChunk.length; i++) {
      const user = await this.usersService.findById(leaveChunk[i].applicantID);
      employeeChunk.push(user);
    }
    return {
      hasLeave: hasLeave,
      leaves: leaveChunk,
      employees: employeeChunk,
    };
  }
}
