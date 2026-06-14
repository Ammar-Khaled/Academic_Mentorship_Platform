import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ReviewSessionStatus } from '../../common/enums/review-session-status.enum';

export type ReviewSessionDocument = HydratedDocument<ReviewSession>;

@Schema({ timestamps: { createdAt: true, updatedAt: true } })
export class ReviewSession {
  @Prop({ type: Types.ObjectId, ref: 'MentorProfile', required: true })
  mentor: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'StudentProfile', required: true })
  student: Types.ObjectId;

  @Prop({ required: true })
  startTime: Date;

  @Prop({ required: true })
  endTime: Date;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({
    required: true,
    enum: ReviewSessionStatus,
    type: String,
    default: ReviewSessionStatus.SCHEDULED,
  })
  status: ReviewSessionStatus;

  createdAt: Date;
  updatedAt: Date;
}

export const ReviewSessionSchema = SchemaFactory.createForClass(ReviewSession);

ReviewSessionSchema.index({ mentor: 1, startTime: 1, endTime: 1 });
ReviewSessionSchema.index({ student: 1, status: 1, startTime: -1 });
ReviewSessionSchema.index(
  { mentor: 1, startTime: 1 },
  {
    unique: true,
    partialFilterExpression: { status: ReviewSessionStatus.SCHEDULED },
  },
);
