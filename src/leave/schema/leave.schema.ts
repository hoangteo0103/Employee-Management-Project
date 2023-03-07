import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type LeaveDocument = Leave & Document;

@Schema()
export class Leave {
  @Prop({ required: true, ref: 'User' })
  applicantID: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  type: string;

  @Prop({ require: true })
  startDate: Date;

  @Prop({ require: true })
  endDate: Date;

  @Prop({ require: true })
  appliedDate: Date;

  @Prop({ require: true })
  reason: string;

  @Prop({ default: 'N/A' })
  adminResponse: string;
}

export const LeaveSchema = SchemaFactory.createForClass(Leave);
