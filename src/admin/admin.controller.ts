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
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import Role from 'src/users/role/roles.enum';
import RoleGuard from 'src/users/role/roles.guards';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import {
  GenerateArrayFilter,
  ArrayFilter,
} from '@kartikyathakur/nestjs-query-filter';
import { UsersService } from 'src/users/users.service';
import { AttendanceService } from 'src/attendance/attendance.service';
import mongoose from 'mongoose';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { LeaveService } from 'src/leave/leave.service';
import * as moment from 'moment';
import { title } from 'process';
import { AssetService } from 'src/asset/asset.service';
import { CreateAssetDto } from 'src/asset/dto/create-asset.dto';
import { UpdateAssetDto } from 'src/asset/dto/update-asset.dto';

@UseGuards(RoleGuard(Role.Admin))
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

  // View Employeee

  // Query filter
  @Get('view-employees')
  async findFilter(@Res() res, @Req() req) {
    const users = await this.adminService.findFilter(req.query);
    res.json(users);
  }

  // @Get('view-employees')
  // async findAll(@GenerateArrayFilter() arrayFilter: ArrayFilter) {
  //   const users = await this.adminService.findAll();
  //   return users.filter(arrayFilter);
  // }

  @Get('view-all-employees')
  @Render('Admin/viewAllEmployee')
  async displayAll(@Req() req) {
    const users = await this.adminService.findAll();
    return {
      title: 'View all employee',
      userName: req.user.name,
      users: users,
    };
  }

  @Get('/employee-profile/:id')
  @Render('Admin/employeeProfile')
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

  // Add and edit employee

  @Get('add-employee')
  @Render('Admin/addEmployee')
  function(@Req() req) {
    return {
      title: 'Add Employee',
      messages: 'NONE',
      hasErrors: false,
      userName: req.user.name,
    };
  }

  @Post('add-employee')
  async addEmployee(@Body() createUserDto: CreateUserDto, @Res() res) {
    await this.adminService.create(createUserDto);
    res.redirect('view-all-employees');
  }

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

  // Edit employee

  @Get('edit-employee/:id')
  @Render('Admin/editEmployee')
  async editEmployeeView(@Req() req) {
    const employeeID = req.params.id;
    const user = await this.userService.findById(employeeID);
    return {
      title: 'Edit Employee',
      employee: user,
      message: '',
      userName: req.user.name,
      moment: moment,
    };
  }

  @Post('edit-employee/:id')
  async editEmployee(
    @Body() updateUserDto: UpdateUserDto,
    @Req() req,
    @Res() res,
  ) {
    const employeeID = req.params.id;
    await this.userService.update(employeeID, updateUserDto);
    res.redirect('/admin');
  }

  // Delete Employee
  @Post('delete-employee/:id')
  async deleteEmployee(@Res() res, @Param() params) {
    const id = params.id;
    await this.userService.remove(id);
    res.redirect('/admin/view-all-employees');
  }

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

  // Asset
  @Get('all-employee-assets/:id')
  @Render('Admin/employeeAllAssets')
  async viewEmployeeeAssets(@Req() req) {
    const employeeID = req.params.id;
    const assets = await this.assetService.findByOwnerID(employeeID);

    const user = await this.userService.findById(employeeID);
    return {
      title: 'List Of Employee Assets',
      hasAsset: assets.length > 0 ? 1 : 0,
      assets: assets,
      user: user,
      userName: req.user.name,
    };
  }

  @Get('add-employee-asset/:id')
  @Render('Admin/addAsset')
  async addAssetView(@Req() req) {
    const employeeID = req.params.id;
    const user = await this.userService.findById(employeeID);
    console.log();
    return {
      title: 'Add employee asset',
      employee: user,
      userName: req.user.name,
    };
  }

  @Post('add-employee-asset/:id')
  async addAsset(
    @Req() req,
    @Res() res,
    @Body() createAssetDto: CreateAssetDto,
  ) {
    const employeeID = req.params.id;
    createAssetDto.ownerID = employeeID;
    await this.assetService.create(createAssetDto);
    res.redirect(`/admin/all-employee-assets/${employeeID}`);
  }

  @Get('employee-asset-info/:id')
  @Render('Admin/assetInfo')
  async viewAssetInfo(@Req() req) {
    const assetID = req.params.id;

    const asset = await this.assetService.findByID(assetID);
    const user = await this.userService.findById(asset.ownerID);

    return {
      title: 'Employee Asset Info',
      moment: moment,
      asset: asset,
      employee: user,
      message: '',
      userName: req.user.name,
    };
  }

  @Get('edit-employee-asset/:id')
  @Render('Admin/editAsset')
  async editAssetView(@Req() req) {
    const assetID = req.params.id;

    const asset = await this.assetService.findByID(assetID);
    const user = await this.userService.findById(asset.ownerID);

    return {
      title: 'Employee Asset Edit',
      moment,
      asset: asset,
      message: '',
      userName: req.user.name,
    };
  }

  @Post('edit-employee-asset/:id')
  async editAsset(
    @Req() req,
    @Body() updateAssetDto: UpdateAssetDto,
    @Res() res,
  ) {
    const assetID = req.params.id;

    await this.assetService.update(assetID, updateAssetDto);
    res.redirect(`/admin/employee-asset-info/${assetID}`);
  }

  @Post('delete-employee-asset/:id')
  async deleteAsset(@Req() req, @Res() res) {
    const assetID = req.params.id;

    const asset = await this.assetService.findByID(assetID);
    this.assetService.delete(assetID);
    res.redirect(`/admin/all-employee-assets/${asset.ownerID}`);
  }
}
