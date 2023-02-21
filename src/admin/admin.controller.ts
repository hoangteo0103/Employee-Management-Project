import { Controller, Get, Post, Body, Patch, Param, Delete ,Res , Render, UseGuards } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import Role from 'src/users/role/roles.enum';
import RoleGuard from 'src/users/role/roles.guards';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';


@UseGuards(RoleGuard(Role.Admin))
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  
  @Get('')
  @Render('Admin/adminHome')
  displayHome()
  {
    return {title : "Admin" , userName : "hello"};
  }

  @Get('view-all-employees')
  @Render('Admin/viewAllEmployee')
  async displayAll()
  {
    const users = await this.adminService.findAll();
    return {title : "View all employee" , userName : "HEHE", users : users};
  }

  

  @Get('add-employee')
  @Render('Admin/addEmployee')
  function (){
    return {
      title : "Add Employee" ,
      messages : "NONE" ,
      hasErrors : false ,
      userName : "hello"
    };
  }

  @Post('add-employee')
  async addEmployee(@Body() createUserDto : CreateUserDto , @Res() res) {
    createUserDto.type = "employee";
    await this.adminService.create(createUserDto);
    res.redirect('view-all-employees');
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
