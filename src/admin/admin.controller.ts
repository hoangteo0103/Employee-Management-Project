import { Controller, Get, Post, Body, Patch, Param, Delete ,Res , Req , Render, UseGuards, ConsoleLogger } from '@nestjs/common';
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
import { LeaveService } from 'src/leave/leave.service';
import * as moment from 'moment';
import { title } from 'process';

@UseGuards(RoleGuard(Role.Admin))
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService ,
    private attendanceService : AttendanceService , 
    private userService : UsersService,
    private leaveService : LeaveService) {}
  
  @Get('')
  @Render('Admin/adminHome')
  displayHome(@Req() req)
  {
    return {title : "Admin" , userName : req.user.name };
  }
  
  @Get('view-profile')
  @Render('Admin/viewProfile')
  viewProfileAdmin(@Req() req) {
    return {title : "Profile" , employee : req.user , userName : req.user.name ,      moment : moment 
  };
  };


  // View Employeee
  

  // Query filter 
  @Get('view-employees')
  async findFilter(@Res() res , @Req() req) 
  {
    const users = await this.adminService.findFilter(req.query) ;
    res.json(users);
  }
  
  // @Get('view-employees')
  // async findAll(@GenerateArrayFilter() arrayFilter: ArrayFilter) {
  //   const users = await this.adminService.findAll();
  //   return users.filter(arrayFilter);
  // }


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
      userName : req.user.name ,
      csrfToken : req.csrfToken()
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
      userName : req.user.name, 
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
      userName : req.user.name ,
      moment : moment 

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
      userName : req.user.name ,
      moment : moment 
    }
  }

  @Post('mark-attendance')
  async markEmployeeAttendance(@Req() req , @Res() res) 
  {
    this.attendanceService.create({employeeID : req.user._id , year : new Date().getFullYear() , month : new Date().getMonth() + 1 , date : new Date().getDate() , isActive : false , startTime : new Date() , duration : 0 });
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
      userName : req.user.name,
      moment : moment 

    }
  }

  @Post('edit-employee/:id')
  async editEmployee(@Body() updateUserDto : UpdateUserDto , @Req() req , @Res() res)
  {
    const employeeID = req.params.id ; 
    await this.userService.update(employeeID , updateUserDto) ; 
    res.redirect('/admin');
  }


  // Delete Employee
  @Post("delete-employee/:id")
  async deleteEmployee(@Res() res , @Param() params) 
  {
    const id = params.id ; 
    await this.userService.remove(id) ; 
    res.redirect('/admin/view-all-employees');
  }

  // Leave related 
  @Get('leave-applications')
  @Render('Admin/allApplications')
  async viewAllApplications(@Res() res , @Req() req)
  {
    const data = await this.adminService.viewAllApplications();
    return {
      title : "List of Leave Applications " , 
      ...data , 
      userName : req.user.name,
      moment : moment 

    }
  }

  @Get('respond-application/:leave_id/:employee_id')
  @Render('Admin/applicationResponse')
  async viewApplicationRespond(@Req() req , @Res() res)
  {
    const leaveId = req.params.leave_id ; 
    const employeeID = req.params.employee_id ;

    const leave = await this.leaveService.findOneById(leaveId) ; 
    const employee = await this.userService.findById(employeeID) ; 

    return {
      title : "Respond Leave Application" ,
      leave : leave , 
      employee : employee , 
      userName : req.user.name ,
      moment : moment,
      
    }
  }

  @Post('respond-application')
  async respondLeaveApplication(@Res() res , @Req() req)
  {
    await this.leaveService.update(req.body['leave_id'] , {adminResponse : req.body.status});
    res.redirect('leave-applications');
  }

  @Get('clocking')
  @Render('Admin/clocking')
  async renderClock(@Req() req ){
    const employeeID = req.user._id ; 
    const attendance = await this.attendanceService.findAttendanceEmployeeToday(employeeID);
    if(!attendance) 
    {
      return {
        title : "Clocking",
        isActive : false , 
        userName : req.user.name,
        duration : 0 ,
      }
    }
    
    let newDuration = attendance.duration;
    if(attendance.isActive)
    {
      const newStartTime = new Date()  ;
      newDuration = attendance.duration +  newStartTime.getSeconds() - attendance.startTime.getSeconds();
      await this.attendanceService.update(attendance.id ,{ duration : newDuration});
    }
    return {
      title : "Clocking",
      isActive : attendance.isActive , 
      startTime : attendance.startTime , 
      duration : newDuration ,
      userName : req.user.name 
    }
  }

  @Post('mark-attendance-clocking')
  @Render('Admin/clocking')
  async markAttendanceClocking(@Req() req , @Res() res)
  {
    const employeeID = req.user._id ; 
    const attendance = await this.attendanceService.findAttendanceEmployeeToday(employeeID) ;
    if(!attendance)
    {
      const date = new Date() ; 
      await this.attendanceService.create({employeeID : req.user._id , 
        year : new Date().getFullYear() , 
        month : new Date().getMonth() + 1 , 
        date : new Date().getDate() , 
        isActive : true , 
        startTime : date, 
        duration : 0 
      });
      return {
        title : "Clocking" , 
        isActive : true ,
        startTime : date ,
        duration : 0 ,
        userName : req.user.name 
      };
    }
    let isActive = true; 
    if(attendance.isActive) isActive = false ; 
    let newDuration = attendance.duration;
    if(attendance.isActive)
    {
      console.log("ACTIVE");
      const newStartTime = new Date()  ;
      newDuration = attendance.duration +  newStartTime.getSeconds() - attendance.startTime.getSeconds();
      await this.attendanceService.update(attendance.id ,{ duration : newDuration , isActive : false});
    }
    else {
      console.log("INACTIVE")
      const newStartTime = new Date() ;
      await this.attendanceService.update(attendance._id ,{startTime : newStartTime , isActive : true});
    }
    return {
      title : "Clocking" ,
       isActive : isActive , 
       duration : newDuration,
       userName : req.user.name 
    }
  }

}
