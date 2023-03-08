import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UsersModule } from '../users/users.module';
import { JwtService } from '@nestjs/jwt';
import { AttendanceModule } from '../attendance/attendance.module';
import { LeaveModule } from '../leave/leave.module';
import { AssetModule } from '../asset/asset.module';
import { employeeRelatedController } from './employeeRelated.controler';
import { leaveRelatedController } from './leaveRelated.controler';
import { attendanceRelatedController } from './attendanceRelated.controler';
import { assetRelatedController } from './assetRelated.controler';

@Module({
  controllers: [
    AdminController,
    employeeRelatedController,
    leaveRelatedController,
    attendanceRelatedController,
    assetRelatedController,
  ],
  imports: [UsersModule, AttendanceModule, LeaveModule, AssetModule],
  providers: [AdminService, JwtService],
})
export class AdminModule {}
