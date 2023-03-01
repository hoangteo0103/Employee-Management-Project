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

  async findAttendanceEmployeeToday(employeeID : string) : Promise<AttendanceDocument> {
      const date = new Date() ;
      const day = date.getDate() ; 
      const month = date.getMonth() + 1 ;
      const year = date.getFullYear() ; 
      const data = await this.attendanceModel.findOne({month : month , year : year , day : day , employeeID : employeeID}).exec() ; 
      return data ; 
  }

  async findFilter(queryObj:any) {
    let queryStr = JSON.stringify(queryObj) ;
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt|eq)\b/g , match => `$${match}`) 
    const users = await this.attendanceModel.find(queryObj) ;
    return users ; 
  }

  async findAllActive() : Promise<any>  {
    const date = new Date() ; 
    const day = date.getDate() ; 
    const month = date.getMonth() + 1 ; 
    const year = date.getFullYear() ;
    const data = await this.attendanceModel.find({year : year , month : month , day : day , isActive : true}).exec(); 
    return data ;
  }

  findOne(id: number) {
    return `This action returns a #${id} attendance`;
  }

  async update(id: string, updateAttendanceDto: any) {
   await this.attendanceModel.findByIdAndUpdate(id , updateAttendanceDto );
  }

  remove(id: number) {
    return `This action removes a #${id} attendance`;
  }
}
