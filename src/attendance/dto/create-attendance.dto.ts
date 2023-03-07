import mongoose, { Document, SchemaType } from 'mongoose';
export class CreateAttendanceDto {
  employeeID: mongoose.Schema.Types.ObjectId;
  year: number;
  month: number;
  date: number;
  isActive: boolean;
  startTime: Date;
  duration: number;
}
