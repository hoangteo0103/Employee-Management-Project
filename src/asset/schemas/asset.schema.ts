import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type AssetDocument = Asset & Document;

@Schema()
export class Asset {
  @Prop({ required: true })
  ownerID: mongoose.Schema.Types.ObjectId;

  @Prop({ required: false })
  type: string;

  @Prop({ require: false })
  description: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ require: true })
  receivedDate: Date;

  @Prop({ require: true })
  status: string;
}

export const AssetSchema = SchemaFactory.createForClass(Asset);
