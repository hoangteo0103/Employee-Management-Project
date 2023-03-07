import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { EmployeeModule } from './employee/employee.module';
import { AdminModule } from './admin/admin.module';
import { AttendanceModule } from './attendance/attendance.module';
import { ConfigModule } from '@nestjs/config';
import { LeaveModule } from './leave/leave.module';
import { ManagerModule } from './manager/manager.module';
import { AssetModule } from './asset/asset.module';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forRoot('mongodb://127.0.0.1:27017'),
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    EmployeeModule,
    AdminModule,
    AttendanceModule,
    LeaveModule,
    ManagerModule,
    AssetModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
