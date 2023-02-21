import { Controller, Get, Post, Body, Patch, Param, Delete, Render,Req,  UseGuards } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import RoleGuard from 'src/users/role/roles.guards';
import Role from 'src/users/role/roles.enum';

@UseGuards(RoleGuard(Role.Employee))
@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

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
