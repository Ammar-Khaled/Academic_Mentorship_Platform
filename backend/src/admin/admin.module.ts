import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminService } from './admin.service';
import { AiAuditService } from './services/ai-audit.service';
import { AdminController } from './admin.controller';
import { User, UserSchema } from '../users/schemas/user.schema';
import {
  UserApproval,
  UserApprovalSchema,
} from './schemas/user-approval.schema';
import {
  SessionAuditLog,
  SessionAuditLogSchema,
} from '../sessions/schemas/session-audit-log.schema';
import {
  ReviewSession,
  ReviewSessionSchema,
} from '../sessions/schemas/review-session.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserApproval.name, schema: UserApprovalSchema },
      { name: SessionAuditLog.name, schema: SessionAuditLogSchema },
      { name: ReviewSession.name, schema: ReviewSessionSchema },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService, AiAuditService],
})
export class AdminModule {}
