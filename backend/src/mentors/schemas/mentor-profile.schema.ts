import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type MentorProfileDocument = HydratedDocument<MentorProfile>;

@Schema({ timestamps: { createdAt: true, updatedAt: true } })
export class MentorProfile {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Stack', required: true })
  stack: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  bio: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: 0, min: 0, max: 5 })
  averageRating: number;

  @Prop({ required: true, min: 0 })
  hourlyRate: number;

  createdAt: Date;
  updatedAt: Date;
}

export const MentorProfileSchema = SchemaFactory.createForClass(MentorProfile);

MentorProfileSchema.index({ stack: 1, isVerified: 1 });
MentorProfileSchema.index({ averageRating: -1 });
MentorProfileSchema.index({ hourlyRate: 1 });
