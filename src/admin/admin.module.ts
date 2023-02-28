import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtService } from '@nestjs/jwt';
import { AttendanceModule } from 'src/attendance/attendance.module';
import { AttendanceService } from 'src/attendance/attendance.service';
import { LeaveModule } from 'src/leave/leave.module';

@Module({
  controllers: [AdminController],
  imports :[UsersModule,AttendanceModule,LeaveModule],
  providers: [AdminService,JwtService]
})
export class AdminModule {}
