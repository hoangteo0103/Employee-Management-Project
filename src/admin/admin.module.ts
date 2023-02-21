import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [AdminController],
  imports :[UsersModule],
  providers: [AdminService ]
})
export class AdminModule {}
