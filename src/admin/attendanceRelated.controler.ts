import {
  Controller,
  Get,
  Post,
  Body,
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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@UseGuards(RoleGuard(Role.Admin))
@ApiBearerAuth('jwt')
@ApiTags('admin-attendance-related')
@Controller('admin')
export class attendanceRelatedController {
  constructor(
    private readonly adminService: AdminService,
    private attendanceService: AttendanceService,
    private userService: UsersService,
    private leaveService: LeaveService,
    private assetService: AssetService,
  ) {}

  // Attendance

  @Post('view-attendance')
  @Render('Admin/viewAttendanceSheet')
  async displayAttendance(@Req() req, @Res() res) {
    const userList = [];
    const attendanceList = await this.attendanceService.findFilter({
      month: req.body.month,
      year: new Date().getFullYear(),
    });
    for (const attendance of attendanceList) {
      userList.push(attendance.employeeID);
    }

    return {
      title: 'Attendance sheet',
      userName: req.user.name,
      moment: moment,
      found: attendanceList.length > 0,
      userList: userList,
      attendanceList: attendanceList,
    };
  }

  @Get('view-attendance-current')
  @Render('Admin/viewAttendanceSheet')
  async displayAttendanceCurrent(@Req() req, @Res() res) {
    const data = await this.attendanceService.findSpecificEmployee({
      employeeID: req.user._id,
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    });
    return {
      title: 'Attendance sheet',
      month: new Date().getMonth() + 1,
      found: data.found,
      attendance: data.attendanceChunk,
      userName: req.user.name,
      moment: moment,
    };
  }

  @Post('mark-attendance')
  async markEmployeeAttendance(@Req() req, @Res() res) {
    this.attendanceService.create({
      employeeID: req.user._id,
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      date: new Date().getDate(),
      isActive: false,
      startTime: new Date(),
      duration: 0,
    });
    res.redirect('view-attendance-current');
  }

  @Get('clocking')
  @Render('Admin/clocking')
  async renderClock(@Req() req) {
    const employeeID = req.user.id;
    const attendance = await this.attendanceService.findAttendanceEmployeeToday(
      employeeID,
    );
    if (!attendance) {
      return {
        title: 'Clocking',
        isActive: false,
        userName: req.user.name,
        duration: 0,
      };
    }

    let newDuration = attendance.duration;
    let newStartTime = attendance.startTime;
    if (attendance.isActive) {
      newStartTime = new Date();
      newDuration =
        attendance.duration +
        Math.floor(newStartTime.getTime() / 1000) -
        Math.floor(attendance.startTime.getTime() / 1000);
      await this.attendanceService.update(attendance._id, {
        duration: newDuration,
        startTime: newStartTime,
      });
    }
    return {
      title: 'Clocking',
      isActive: attendance.isActive,
      startTime: newStartTime,
      duration: newDuration,
      userName: req.user.name,
    };
  }

  @Post('mark-attendance-clocking')
  @Render('Admin/clocking')
  async markAttendanceClocking(@Req() req, @Res() res) {
    const employeeID = req.user.id;
    const attendance = await this.attendanceService.findAttendanceEmployeeToday(
      employeeID,
    );
    if (!attendance) {
      const date = new Date();
      await this.attendanceService.create({
        employeeID: req.user.id,
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        date: new Date().getDate(),
        isActive: true,
        startTime: date,
        duration: 0,
      });
      res.redirect('clocking');
      return;
    }
    this.attendanceService.toggleActive(attendance);
    res.redirect('clocking');
  }

  // Active list
  @Get('view-active')
  @Render('Admin/viewActive')
  async viewActiveList(@Req() req) {
    const activeList = await this.attendanceService.findAllActive();
    const userList = [];
    for (const attendance of activeList) {
      const user = await this.userService.findById(attendance.employeeID);
      userList.push(user);
    }

    return {
      title: 'View active',
      found: activeList.length > 0,
      activeList: activeList,
      userList: userList,
      userName: req.user.name,
    };
  }
}
