import { Controller, Get, Post, Body, Patch, Param, Delete, Render,Req, Res,  UseGuards } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import RoleGuard from 'src/users/role/roles.guards';
import Role from 'src/users/role/roles.enum';
import { AttendanceService } from 'src/attendance/attendance.service';

@UseGuards(RoleGuard(Role.Employee))
@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService , 
    private attendanceService : AttendanceService) {}

  @Get('')
  @Render('Employee/employeeHome')
  displayHome()
  {
    return {title : "Employee" , userName : "hello"};
  }

  @Get('view-profile')
  @Render('Employee/viewProfile')
  viewProfileEmployee(@Req() req)
  {
    return {title : "Profile" , employee : req.user , userName : req.user.name};
  }

  // Attendance 

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

  @Post('mark-employee-attendance')
  markEmployeeAttendance(@Req() req , @Res() res)
  {
    this.attendanceService.create({employeeID : req.user._id , year : new Date().getFullYear() , month : new Date().getMonth() + 1 , date : new Date().getDate() , present : true});
    res.redirect('view-attendance-current');
  }
 


  @Post()
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.create(createEmployeeDto);
  }

  @Get()
  findAll() {
    return this.employeeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeeService.update(+id, updateEmployeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeeService.remove(+id);
  }
}
