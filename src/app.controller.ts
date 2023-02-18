import { Controller, Get , Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('login')
  @Render('login')
  hello()
  {
    return {message : "Hello" , title : "Hello" , hasErrors : false};
  }

  @Get('admin')
  @Render('Admin/adminHome')
  admin()
  {
    return {message : "HELLO" , title : "Admin" , userName : "Hoang"};
  }

  @Get('employee')
  @Render('Employee/employeeHome')
  he()
  {
    return {message : "HELLO" , title : "Admin" , userName : "Hoang"};
  }
}
