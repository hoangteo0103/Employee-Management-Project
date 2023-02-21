import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import Role from '../role/roles.enum';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({required:true})
  type : string;

  @Prop({ required: true, unique: true  })
  email: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({required : false})
  name : string;

  @Prop({required:false})
  dateOfBirth : Date

  @Prop({required:false})
  contactNumber : string

  @Prop()
  refreshToken: string;

  @Prop({require : true  , default : Role.Employee})
  role : Role

}

export const UserSchema = SchemaFactory.createForClass(User);