import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, SchemaType } from 'mongoose';

export type AttendanceDocument = Attendance & Document;

@Schema()
export class Attendance {
  @Prop({required:true})
  employeeID : mongoose.Schema.Types.ObjectId;

  @Prop({require : true })
  startTime : Date ; 
  
  @Prop({require : false})
  duration : number ;

  @Prop({required:true})
  year : Number ; 

  @Prop({required:true})
  month : Number ; 

  @Prop({required:true})
  date : Number ; 

  @Prop({required:true})
  isActive : Boolean;

}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);