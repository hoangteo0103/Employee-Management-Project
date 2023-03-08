import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import Role from '../role/roles.enum';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false, unique: true })
  username: string;

  @Prop({
    required: function () {
      return this.username ? true : false;
    },
  })
  password: string;

  @Prop({
    required: function () {
      return this.username ? true : false;
    },
  })
  name: string;

  @Prop({
    required: function () {
      return this.username ? true : false;
    },
  })
  dateOfBirth: Date;

  @Prop({
    required: function () {
      return this.username ? true : false;
    },
  })
  contactNumber: string;

  @Prop()
  refreshToken: string;

  @Prop({ require: true, default: Role.Employee })
  role: Role;

  @Prop({
    required: function () {
      return this.username ? true : false;
    },
  })
  department: string;

  @Prop({
    required: function () {
      return this.username ? true : false;
    },
  })
  Skills: [string];

  @Prop({
    required: function () {
      return this.username ? true : false;
    },
  })
  designation: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
