import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { SessionsService } from './sessions.service';
import { SessionsController } from './sessions.controller';

import {
  ReviewSession,
  ReviewSessionSchema,
} from './schemas/review-session.schema';
import {
  SessionAuditLog,
  SessionAuditLogSchema,
} from './schemas/session-audit-log.schema';
import {
  MentorProfile,
  MentorProfileSchema,
} from '../mentors/schemas/mentor-profile.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ReviewSession.name, schema: ReviewSessionSchema },
      { name: SessionAuditLog.name, schema: SessionAuditLogSchema },
      { name: MentorProfile.name, schema: MentorProfileSchema },
    ]),
  ],
  controllers: [SessionsController],
  providers: [SessionsService],
  exports: [SessionsService, MongooseModule],
})
export class SessionsModule {}