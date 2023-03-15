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
import { CreateUserDto } from '../users/dto/create-user.dto';
import Role from '../users/role/roles.enum';
import RoleGuard from '../users/role/roles.guards';
import { AdminService } from './admin.service';
import { UsersService } from '../users/users.service';
import { AttendanceService } from '../attendance/attendance.service';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { LeaveService } from '../leave/leave.service';
import * as moment from 'moment';
import { AssetService } from '../asset/asset.service';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';

@UseGuards(RoleGuard(Role.Admin))
@ApiCookieAuth()
@ApiTags('admin-employee-related')
@Controller('admin')
export class employeeRelatedController {
  constructor(
    private readonly adminService: AdminService,
    private attendanceService: AttendanceService,
    private userService: UsersService,
    private leaveService: LeaveService,
    private assetService: AssetService,
  ) {}
  @Get('view-employees')
  async findFilter(@Res() res, @Req() req) {
    const users = await this.adminService.findFilter(req.query);
    res.json(users);
  }

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
  @UsePipes(new ValidationPipe())
  async addEmployee(@Body() createUserDto: CreateUserDto, @Res() res) {
    await this.adminService.create(createUserDto);
    res.redirect('view-all-employees');
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
}
