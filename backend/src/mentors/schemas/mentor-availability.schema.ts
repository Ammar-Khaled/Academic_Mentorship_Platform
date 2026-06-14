import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type MentorAvailabilityDocument = HydratedDocument<MentorAvailability>;

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class MentorAvailability {
  @Prop({ type: Types.ObjectId, ref: 'MentorProfile', required: true })
  mentor: Types.ObjectId;

  /** 0 = Sunday … 6 = Saturday */
  @Prop({ required: true, min: 0, max: 6 })
  dayOfWeek: number;

  /** Local time in HH:mm (24-hour) */
  @Prop({ required: true, match: /^([01]\d|2[0-3]):[0-5]\d$/ })
  startTime: string;

  /** Local time in HH:mm (24-hour) */
  @Prop({ required: true, match: /^([01]\d|2[0-3]):[0-5]\d$/ })
  endTime: string;

  createdAt: Date;
}

export const MentorAvailabilitySchema =
  SchemaFactory.createForClass(MentorAvailability);

MentorAvailabilitySchema.index(
  { mentor: 1, dayOfWeek: 1, startTime: 1, endTime: 1 },
  { unique: true },
);
MentorAvailabilitySchema.index({ mentor: 1, dayOfWeek: 1 });
