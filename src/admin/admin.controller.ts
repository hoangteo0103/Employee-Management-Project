import { Controller, Get, Post, Body, Patch, Param, Delete ,Res , Req , Render, UseGuards } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import Role from 'src/users/role/roles.enum';
import RoleGuard from 'src/users/role/roles.guards';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { GenerateArrayFilter, ArrayFilter } from '@kartikyathakur/nestjs-query-filter';
import { UsersService } from 'src/users/users.service';

@UseGuards(RoleGuard(Role.Admin))
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  
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


  // Add and edit employee

  @Post('add-employee')
  async addEmployee(@Body() createUserDto : CreateUserDto , @Res() res) {
    createUserDto.type = "employee";
    await this.adminService.create(createUserDto);
    res.redirect('view-all-employees');
  }

  // Attendance 

  @Get('view-attendance-current') 
  async displayAttendanceCurrent(@Req() req)
  {

  }

  @Post('mark-attendance')
  async markEmployeeAttendance(@Req() req , @Res() res) 
  {
    await this.adminService.markAttendance(req.user);
    res.redirect('view-attendance-current');
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
