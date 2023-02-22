import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AttendanceModule } from 'src/attendance/attendance.module';
import { AttendanceService } from 'src/attendance/attendance.service';

@Module({
  controllers: [AdminController],
  imports :[UsersModule,AttendanceModule],
  providers: [AdminService,JwtService]
})
export class AdminModule {}
