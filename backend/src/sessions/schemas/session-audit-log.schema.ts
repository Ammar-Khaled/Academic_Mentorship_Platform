import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { AuditLogStatus } from './../../common/enums/audit-log-status.enum';

export type SessionAuditLogDocument = HydratedDocument<SessionAuditLog>;

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class SessionAuditLog {
  @Prop({
    type: Types.ObjectId,
    ref: 'ReviewSession',
    required: true,
    unique: true,
  })
  session: Types.ObjectId;

  @Prop({ trim: true })
  predictedTag?: string;

  @Prop({ min: 0, max: 1 })
  confidenceScore?: number;

  @Prop({ required: true, enum: AuditLogStatus, type: String })
  status: AuditLogStatus;

  @Prop({ trim: true })
  errorMessage?: string;

  @Prop({ min: 0 })
  latencyMs?: number;

  createdAt: Date;
}

export const SessionAuditLogSchema =
  SchemaFactory.createForClass(SessionAuditLog);
