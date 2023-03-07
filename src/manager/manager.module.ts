import { Module } from '@nestjs/common';
import { ManagerService } from './manager.service';
import { ManagerController } from './manager.controller';
import { UsersModule } from '../users/users.module';
import { AttendanceModule } from '../attendance/attendance.module';
import { LeaveModule } from '../leave/leave.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [UsersModule, AttendanceModule, LeaveModule],
  controllers: [ManagerController],
  providers: [ManagerService, JwtService],
})
export class ManagerModule {}
