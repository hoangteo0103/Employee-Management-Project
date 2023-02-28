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
    await this.attendanceModel.find({employeeID : createAttendanceDto.employeeID ,
       year : date.getFullYear() , 
       month : date.getMonth() + 1 , 
       date : date.getDate()})
    .exec(function(err , docs) {
      if(docs.length > 0)
      {
        throw new BadRequestException("Already mark attendance");
      }
    });
    const createdAttendance = new this.attendanceModel(createAttendanceDto);
    return createdAttendance.save();
  }
  
  async findSpecificEmployee(opts) : Promise <any>
  {
    let found = 0 , attendanceChunk = [] ;
    const docs = await this.attendanceModel.find(opts).sort({_id:-1}).exec();
    if(docs.length > 0)
    {
      found = 1 ; 
    }
    for(var i = 0 ; i < docs.length ; i++)
      attendanceChunk.push(docs[i]) ; 
    return {found : found , attendanceChunk : attendanceChunk};
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
