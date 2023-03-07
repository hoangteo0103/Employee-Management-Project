import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Render,
  Req,
  Res,
} from '@nestjs/common';
import { ManagerService } from './manager.service';
import { CreateManagerDto } from './dto/create-manager.dto';
import { UpdateManagerDto } from './dto/update-manager.dto';
import Role from 'src/users/role/roles.enum';
import { UseGuards } from '@nestjs/common';
import RoleGuard from 'src/users/role/roles.guards';
import { AttendanceService } from 'src/attendance/attendance.service';
import { UsersService } from 'src/users/users.service';
import { LeaveService } from 'src/leave/leave.service';
import * as moment from 'moment';

@UseGuards(RoleGuard(Role.Manager))
@Controller('manager')
export class ManagerController {
  constructor(
    private readonly ManagerService: ManagerService,
    private attendanceService: AttendanceService,
    private userService: UsersService,
    private leaveService: LeaveService,
  ) {}

  @Get('')
  @Render('Manager/ManagerHome')
  displayHome(@Req() req) {
    return { title: 'Manager', userName: req.user.name };
  }

  @Get('view-profile')
  @Render('Manager/viewManagerProfile')
  viewProfileManager(@Req() req) {
    return {
      title: 'Profile',
      employee: req.user,
      userName: req.user.name,
      moment: moment,
    };
  }

  // View Employeee

  // Query filter
  @Get('view-employees')
  async findFilter(@Res() res, @Req() req) {
    const users = await this.ManagerService.findFilter(req.query);
    res.json(users);
  }

  // @Get('view-employees')
  // async findAll(@GenerateArrayFilter() arrayFilter: ArrayFilter) {
  //   const users = await this.ManagerService.findAll();
  //   return users.filter(arrayFilter);
  // }

  @Get('view-all-employees')
  @Render('Manager/viewAllEmployee')
  async displayAll(@Req() req) {
    const users = await this.ManagerService.findAllEmployee();
    return {
      title: 'View all employee',
      userName: req.user.name,
      users: users,
    };
  }

  @Get('/employee-profile/:id')
  @Render('Manager/employeeProfile')
  async getEmployeeProfile(@Req() req, @Res() res) {
    const employeeID = req.params.id;
    const user = await this.userService.findById(employeeID);
    return {
      title: 'Employee Profile',
      employee: user,
      userName: req.user.name,
      moment: moment,
    };
  }

  // Attendance

  @Post('view-attendance')
  @Render('Manager/viewAttendanceSheet')
  async displayAttendance(@Req() req, @Res() res) {
    const userList = [];
    const attendanceList = await this.attendanceService.findFilter({
      month: req.body.month,
      year: new Date().getFullYear(),
    });
    for (const attendance of attendanceList) {
      const user = await this.userService.findById(attendance.employeeID);
      userList.push(user);
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
  @Render('Manager/viewAttendanceSheet')
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
  // Leave related
  @Get('leave-applications')
  @Render('Manager/allApplications')
  async viewAllApplications(@Res() res, @Req() req) {
    const data = await this.ManagerService.viewAllApplications();
    return {
      title: 'List of Leave Applications ',
      ...data,
      userName: req.user.name,
      moment: moment,
    };
  }

  @Get('respond-application/:leave_id/:employee_id')
  @Render('Manager/applicationResponse')
  async viewApplicationRespond(@Req() req, @Res() res) {
    const leaveId = req.params.leave_id;
    const employeeID = req.params.employee_id;

    const leave = await this.leaveService.findOneById(leaveId);
    const employee = await this.userService.findById(employeeID);

    return {
      title: 'Respond Leave Application',
      leave: leave,
      employee: employee,
      userName: req.user.name,
      moment: moment,
    };
  }

  @Post('respond-application')
  async respondLeaveApplication(@Res() res, @Req() req) {
    await this.leaveService.update(req.body['leave_id'], {
      ManagerResponse: req.body.status,
    });
    res.redirect('leave-applications');
  }

  @Get('clocking')
  @Render('Manager/clocking')
  async renderClock(@Req() req) {
    const employeeID = req.user._id;
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
        newStartTime.getSeconds() -
        attendance.startTime.getSeconds();
      await this.attendanceService.update(attendance.id, {
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
  @Render('Manager/clocking')
  async markAttendanceClocking(@Req() req, @Res() res) {
    const employeeID = req.user._id;
    const attendance = await this.attendanceService.findAttendanceEmployeeToday(
      employeeID,
    );
    if (!attendance) {
      const date = new Date();
      await this.attendanceService.create({
        employeeID: req.user._id,
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        date: new Date().getDate(),
        isActive: true,
        startTime: date,
        duration: 0,
      });
      res.redirect('clocking');
    }
    let isActive = true;
    if (attendance.isActive) isActive = false;
    let newDuration = attendance.duration;
    if (attendance.isActive) {
      const newStartTime = new Date();
      newDuration =
        attendance.duration +
        newStartTime.getSeconds() -
        attendance.startTime.getSeconds();
      await this.attendanceService.update(attendance.id, {
        duration: newDuration,
        isActive: false,
      });
    } else {
      const newStartTime = new Date();
      await this.attendanceService.update(attendance._id, {
        startTime: newStartTime,
        isActive: true,
      });
    }
    res.redirect('clocking');
  }

  // Active list
  @Get('view-active')
  @Render('Manager/viewActive')
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
