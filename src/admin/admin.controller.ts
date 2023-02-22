import { Controller, Get, Post, Body, Patch, Param, Delete ,Res , Req , Render, UseGuards } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import Role from 'src/users/role/roles.enum';
import RoleGuard from 'src/users/role/roles.guards';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { GenerateArrayFilter, ArrayFilter } from '@kartikyathakur/nestjs-query-filter';
import { UsersService } from 'src/users/users.service';
import { AttendanceService } from 'src/attendance/attendance.service';
import mongoose from 'mongoose';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';

@UseGuards(RoleGuard(Role.Admin))
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService ,
    private attendanceService : AttendanceService , 
    private userService : UsersService) {}
  
  @Get('')
  @Render('Admin/adminHome')
  displayHome(@Req() req)
  {
    return {title : "Admin" , userName : req.user.name};
  }
  
  @Get('view-profile')
  @Render('Admin/viewProfile')
  viewProfileAdmin(@Req() req) {
    return {title : "Profile" , employee : req.user , userName : req.user.name};
  };


  // View Employeee

  @Get('view-employees')
  async findAll(@GenerateArrayFilter() arrayFilter: ArrayFilter) {
    const users = await this.adminService.findAll();
    return users.filter(arrayFilter);
  }


  @Get('view-all-employees')
  @Render('Admin/viewAllEmployee')
  async displayAll(@Req() req)
  {
    const users = await this.adminService.findAll();
    return {title : "View all employee" , userName : req.user.name, users : users};
  }

  @Get('/employee-profile/:id')
  @Render('Admin/employeeProfile')
  async getEmployeeProfile(@Req() req , @Res() res)
  {
    var employeeID = req.params.id ; 
    const user = await this.userService.findById(employeeID);
    return {
      title : "Employee Profile" , 
      employee : user,
      userName : req.user.name 
    }
  }
  
  // Add and edit employee

  @Get('add-employee')
  @Render('Admin/addEmployee')
  function (@Req() req){
    return {
      title : "Add Employee" ,
      messages : "NONE" ,
      hasErrors : false ,
      userName : req.user.name
    };

  }


  @Post('add-employee')
  async addEmployee(@Body() createUserDto : CreateUserDto , @Res() res) {
    await this.adminService.create(createUserDto);
    res.redirect('view-all-employees');
  }

  // Attendance 

  @Post('view-attendance')
  @Render('Admin/viewAttendanceSheet')
  async displayAttendance(@Req() req , @Res() res) 
  {
     let data = await this.attendanceService.findSpecificEmployee({employID : req.user._id , month : req.body.month , year : req.body.year});
     return {
      title : "Attendance sheet" ,  
      month : req.body.month , 
      found : data.found ,
      attendance : data.attendanceChunk ,
      userName : req.user.name 
     }
  }

  @Get('view-attendance-current') 
  @Render('Admin/viewAttendanceSheet')
  async displayAttendanceCurrent(@Req() req , @Res() res)
  {
    let data = await this.attendanceService.findSpecificEmployee({employeeID : req.user._id , 
      month : new Date().getMonth() + 1 , 
      year : new Date().getFullYear()});
    return {
      title : "Attendance sheet" ,
      month : new Date().getMonth() + 1,
      found : data.found ,
      attendance : data.attendanceChunk,
      userName : req.user.name 
    }
  }

  @Post('mark-attendance')
  async markEmployeeAttendance(@Req() req , @Res() res) 
  {
    this.attendanceService.create({employeeID : req.user._id , year : new Date().getFullYear() , month : new Date().getMonth() + 1 , date : new Date().getDate() , present : true});
    res.redirect('view-attendance-current');
  }


  // Edit employee

  @Get('edit-employee/:id')
  @Render('Admin/editEmployee')
  async editEmployeeView(@Req() req) {
    const employeeID = req.params.id ; 
    const user = await this.userService.findById(employeeID) ; 
    return {
      title : "Edit Employee" ,
      employee : user, 
      message : "" ,
      userName : req.user.name
    }
  }

  @Post('edit-employee/:id')
  async editEmployee(@Body() updateUserDto : UpdateUserDto , @Req() req , @Res() res)
  {
    const employeeID = req.params.id ; 
    await this.userService.update(employeeID , updateUserDto) ; 
    res.redirect('/admin');
  }



  @Post()
  create(@Body() createAdminDto: CreateAdminDto) {
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(+id, updateAdminDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(+id);
  }
}
