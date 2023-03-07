import { Module } from '@nestjs/common';
import { ManagerService } from './manager.service';
import { ManagerController } from './manager.controller';
import { UsersModule } from 'src/users/users.module';
import { AttendanceModule } from 'src/attendance/attendance.module';
import { LeaveModule } from 'src/leave/leave.module';
import { AuthModule } from 'src/auth/auth.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [UsersModule, AttendanceModule, LeaveModule],
  controllers: [ManagerController],
  providers: [ManagerService, JwtService],
})
export class ManagerModule {}
