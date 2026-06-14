import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type StudentProfileDocument = HydratedDocument<StudentProfile>;

@Schema({ timestamps: { createdAt: true, updatedAt: true } })
export class StudentProfile {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  user: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  createdAt: Date;
  updatedAt: Date;
}

export const StudentProfileSchema =
  SchemaFactory.createForClass(StudentProfile);
