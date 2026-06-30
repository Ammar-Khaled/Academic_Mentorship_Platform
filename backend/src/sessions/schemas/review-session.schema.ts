import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ReviewSessionStatus } from '../../common/enums/review-session-status.enum';

export type ReviewSessionDocument = HydratedDocument<ReviewSession>;

@Schema({ timestamps: { createdAt: true, updatedAt: true } })
export class ReviewSession {
  @Prop({ type: Types.ObjectId, ref: 'MentorProfile', required: true })
  mentor: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  student: Types.ObjectId;

  @Prop({ required: true })
  startTime: Date;

  @Prop({ required: true })
  endTime: Date;

  @Prop({ type: String, trim: true, default: '' })
  description: string;

  @Prop({
    type: String,
    required: true,
    enum: ReviewSessionStatus,
    default: ReviewSessionStatus.SCHEDULED,
  })
  status: ReviewSessionStatus;

  @Prop({ type: String, trim: true, default: null })
  evaluationNotes: string | null;

  @Prop({ type: Date, default: null })
  evaluatedAt: Date | null;

  @Prop({ type: Number, min: 1, max: 5, default: null })
  rating: number | null;

  createdAt: Date;
  updatedAt: Date;
}

export const ReviewSessionSchema = SchemaFactory.createForClass(ReviewSession);

// Compound indexes for efficient querying
ReviewSessionSchema.index({ mentor: 1, startTime: 1, endTime: 1 });
ReviewSessionSchema.index({ student: 1, status: 1, startTime: -1 });
ReviewSessionSchema.index({ mentor: 1, status: 1, startTime: -1 });
