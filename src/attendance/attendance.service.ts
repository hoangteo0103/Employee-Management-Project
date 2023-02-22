import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { Attendance } from './entities/attendance.entity';
import { AttendanceDocument } from './schemas/attendance.schema';

@Injectable()
export class AttendanceService {
  constructor(@InjectModel(Attendance.name) private attendanceModel : Model<AttendanceDocument> ) {};
  async create(createAttendanceDto: CreateAttendanceDto) : Promise<AttendanceDocument>{
    const date = new Date();
    if(this.attendanceModel.find({employeeID : createAttendanceDto.employeeID ,
       year : date.getFullYear() , 
       month : date.getMonth() , 
       date : date.getDate()})
    ) {
      throw new BadRequestException("Already mark attendance");
    };
    const createdAttendance = new this.attendanceModel(createAttendanceDto);

    return createdAttendance.save();
  }

  findAll() {
    return `This action returns all attendance`;
  }

  findOne(id: number) {
    return `This action returns a #${id} attendance`;
  }

  update(id: number, updateAttendanceDto: UpdateAttendanceDto) {
    return `This action updates a #${id} attendance`;
  }

  remove(id: number) {
    return `This action removes a #${id} attendance`;
  }
}
