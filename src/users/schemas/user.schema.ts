import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import Role from '../role/roles.enum';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  _id: mongoose.Schema.Types.ObjectId;
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: false })
  name: string;

  @Prop({ required: false })
  dateOfBirth: Date;

  @Prop({ required: false })
  contactNumber: string;

  @Prop()
  refreshToken: string;

  @Prop({ require: true, default: Role.Employee })
  role: Role;

  @Prop({ require: false })
  department: string;

  @Prop({ require: false })
  Skills: [string];

  @Prop({ require: false })
  designation: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
