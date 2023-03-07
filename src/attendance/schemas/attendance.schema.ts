import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, SchemaType } from 'mongoose';

export type AttendanceDocument = Attendance & Document;

@Schema()
export class Attendance {
  @Prop({ required: true, ref: 'User' })
  employeeID: mongoose.Schema.Types.ObjectId;

  @Prop({ require: true })
  startTime: Date;

  @Prop({ require: false })
  duration: number;

  @Prop({ required: true })
  year: number;

  @Prop({ required: true })
  month: number;

  @Prop({ required: true })
  date: number;

  @Prop({ required: true })
  isActive: boolean;
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);
