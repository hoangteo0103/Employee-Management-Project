import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
  Render,
  UseGuards,
} from '@nestjs/common';
import Role from '../users/role/roles.enum';
import RoleGuard from '../users/role/roles.guards';
import { AdminService } from './admin.service';
import { UsersService } from '../users/users.service';
import { AttendanceService } from '../attendance/attendance.service';
import { LeaveService } from '../leave/leave.service';
import * as moment from 'moment';
import { AssetService } from '../asset/asset.service';
import { ApiTags } from '@nestjs/swagger';

@UseGuards(RoleGuard(Role.Admin))
@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private attendanceService: AttendanceService,
    private userService: UsersService,
    private leaveService: LeaveService,
    private assetService: AssetService,
  ) {}

  @Get('')
  @Render('Admin/adminHome')
  displayHome(@Req() req) {
    return { title: 'Admin', userName: req.user.name };
  }

  @Get('view-profile')
  @Render('Admin/viewProfile')
  viewProfileAdmin(@Req() req) {
    return {
      title: 'Profile',
      employee: req.user,
      userName: req.user.name,
      moment: moment,
    };
  }
}
