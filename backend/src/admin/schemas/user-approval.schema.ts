import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserApprovalDocument = HydratedDocument<UserApproval>;

export enum UserApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  BLOCKED = 'blocked',
  REJECTED = 'rejected',
}

@Schema({ timestamps: { createdAt: true, updatedAt: true } })
export class UserApproval {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  })
  user: Types.ObjectId;

  @Prop({
    required: true,
    enum: UserApprovalStatus,
    type: String,
    default: UserApprovalStatus.PENDING,
  })
  status: UserApprovalStatus;

  @Prop({ trim: true })
  approvalNotes?: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
  })
  approvedBy?: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
  })
  blockedBy?: Types.ObjectId;

  @Prop({ trim: true })
  blockReason?: string;

  createdAt: Date;
  updatedAt: Date;
}

export const UserApprovalSchema = SchemaFactory.createForClass(UserApproval);
