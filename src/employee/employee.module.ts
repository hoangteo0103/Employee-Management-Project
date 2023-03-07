import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { AttendanceModule } from 'src/attendance/attendance.module';
import { LeaveModule } from 'src/leave/leave.module';

@Module({
  imports: [AttendanceModule, LeaveModule],
  controllers: [EmployeeController],
  providers: [EmployeeService],
})
export class EmployeeModule {}
