import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ReviewSession,
  ReviewSessionSchema,
} from './schemas/review-session.schema';
import {
  SessionAuditLog,
  SessionAuditLogSchema,
} from './schemas/session-audit-log.schema';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ReviewSession.name, schema: ReviewSessionSchema },
      { name: SessionAuditLog.name, schema: SessionAuditLogSchema },
    ]),
  ],
  controllers: [SessionsController],
  providers: [SessionsService],
  exports: [SessionsService, MongooseModule],
})
export class SessionsModule {}
