import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { AttendanceService } from 'src/attendance/attendance.service';
import { LeaveService } from 'src/leave/leave.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import Role from 'src/users/role/roles.enum';
import { UsersService } from 'src/users/users.service';
import { CreateManagerDto } from './dto/create-manager.dto';
import { UpdateManagerDto } from './dto/update-manager.dto';

@Injectable()
export class ManagerService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private attendanceService: AttendanceService,
    private leaveService: LeaveService,
  ) {}

  hashData(data: string) {
    return argon2.hash(data);
  }

  async findAllEmployee() {
    const t = await this.usersService.findAllEmployee();
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
