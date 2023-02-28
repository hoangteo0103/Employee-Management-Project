import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  Render,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guards';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { RefreshTokenGuard } from 'src/common/guards/refreshToken.guards';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('login')
  @Render('login')
  loginMenu(@Req() req)
  {
    return {title : "Login" , hasErrors : false} ;
  }

  @Post('reset-password') 
  async resetPassword(@Req() req , @Res() res)
  {
    await this.authService.resetPassword(req.body.email) ; 
    res.redirect('login');
  }

  @Post('signup')
  async signup(@Body() createUserDto : CreateUserDto , @Res() res) {
    console.log(createUserDto.email);
    await this.authService.signUp(createUserDto);
    res.redirect('login');
  }

  @Post('signin')
  async signin(@Body() data: AuthDto , @Res() res) {
    const jwt_token  = await this.authService.signIn(data);
    res.cookie('access_token' , jwt_token.accessToken);
    res.cookie('refresh_token' , jwt_token.refreshToken);
    if(data.username == "admin") res.redirect('/admin');
    else res.redirect('/employee');
  }
  @UseGuards(AccessTokenGuard)
  @Get('logout')
  logout(@Req() req: Request , @Res() res) {
    this.authService.logout(req.user['sub']);
    res.redirect('/');
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@Req() req: Request) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }
}