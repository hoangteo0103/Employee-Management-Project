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
  ConsoleLogger,
  UsePipes,
  ValidationPipe,
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
@ApiTags('admin-leave-related')
@Controller('admin')
export class leaveRelatedController {
  constructor(
    private readonly adminService: AdminService,
    private attendanceService: AttendanceService,
    private userService: UsersService,
    private leaveService: LeaveService,
    private assetService: AssetService,
  ) {}

  // Leave related
  @Get('leave-applications')
  @Render('Admin/allApplications')
  async viewAllApplications(@Res() res, @Req() req) {
    const data = await this.adminService.viewAllApplications();
    return {
      title: 'List of Leave Applications ',
      ...data,
      userName: req.user.name,
      moment: moment,
    };
  }

  @Get('respond-application/:leave_id/:employee_id')
  @Render('Admin/applicationResponse')
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
      adminResponse: req.body.status,
    });
    res.redirect('leave-applications');
  }
}
