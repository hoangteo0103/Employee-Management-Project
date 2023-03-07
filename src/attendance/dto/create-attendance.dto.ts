import { IsNotEmpty, IsNumber } from 'class-validator';
import mongoose, { Document, SchemaType } from 'mongoose';
export class CreateAttendanceDto {
  @IsNotEmpty()
  employeeID: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  @IsNumber()
  year: number;

  @IsNotEmpty()
  @IsNumber()
  month: number;

  @IsNotEmpty()
  @IsNumber()
  date: number;

  @IsNotEmpty()
  isActive: boolean;
  startTime: Date;

  @IsNotEmpty()
  @IsNumber()
  duration: number;
}
