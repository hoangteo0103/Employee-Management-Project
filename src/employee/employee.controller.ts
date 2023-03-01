import { Controller, Get, Post, Body, Patch, Param, Delete, Render,Req, Res,  UseGuards } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import RoleGuard from 'src/users/role/roles.guards';
import Role from 'src/users/role/roles.enum';
import { AttendanceService } from 'src/attendance/attendance.service';
import { CreateLeaveDto } from 'src/leave/dto/create-leave.dto';
import { LeaveService } from 'src/leave/leave.service';
import * as moment from 'moment';

@UseGuards(RoleGuard(Role.Employee))
@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService , 
    private attendanceService : AttendanceService,
    private leaveService : LeaveService) {}

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
    return {title : "Profile" , employee : req.user , userName : req.user.name ,moment : moment  };
  }

  // Attendance 

  @Post('view-attendance')
  @Render('Employee/viewAttendance')
  async displayAttendance(@Req() req , @Res() res)
  {
    let data = await this.attendanceService.findSpecificEmployee({employeeID : req.user._id , 
      month : req.body.month , 
      year : new Date().getFullYear()});
    return {
      title : "Attendance sheet" ,
      month : req.body.month,
      found : data.found ,
      attendance : data.attendanceChunk,
      userName : req.user.name , 
      moment : moment 
    }
  }

  @Get('view-attendance-current') 
  @Render('Employee/viewAttendance')
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

  @Post('mark-employee-attendance')
  markEmployeeAttendance(@Req() req , @Res() res)
  {
    this.attendanceService.create({employeeID : req.user._id , year : new Date().getFullYear() , month : new Date().getMonth() + 1 , date : new Date().getDate() , isActive : false , startTime : new Date() , duration : 0 });
    res.redirect('view-attendance-current');
  }

  // Leaves related 
  @Get('apply-for-leave') 
  @Render('Employee/applyForLeave')
  applyForLeaveView(@Req() req , @Res() res)
  {
    return {
      title : "Apply for Leave" , 
      userName : req.user.name 
    }
  };

  @Post('apply-for-leave')
  applyForLeave(@Req() req , @Res() res , @Body() createLeaveDto : CreateLeaveDto)
  {
    createLeaveDto.appliedDate = new Date() ; 
    createLeaveDto.applicantID = req.user.id ; 
    this.leaveService.create(createLeaveDto);  
    res.redirect('view-profile');
  }

  @Get('applied-leaves') 
  @Render('Employee/appliedLeaves')
  async viewAppliedLeaves(@Req() req , @Res() res)
  {
    const data = await this.leaveService.findById(req.user.id) ;
    return {
      title : "List Of Applied Leaves" , 
      hasLeave : data.hasLeave , 
      leaves : data.leaveChunk , 
      userName : req.user.name,
      moment : moment
    }
  }

  // Clocking
  @Get('clocking')
  @Render('Employee/clocking')
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
  @Render('Employee/clocking')
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
      res.redirect('clocking');
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
    res.redirect('clocking');
  }
 
}
