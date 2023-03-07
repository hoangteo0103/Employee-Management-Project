import { Controller, Get, Render, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  loginMenu(@Res() res) {
    res.redirect('auth/login');
  }

  @Get('logout')
  function(@Res() res) {
    res.redirect('auth/logout');
  }
}
