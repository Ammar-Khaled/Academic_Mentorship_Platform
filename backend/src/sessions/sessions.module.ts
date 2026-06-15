import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SessionsService } from './sessions.service';
import { SessionsController } from './sessions.controller';
import { ReviewSession, ReviewSessionSchema } from './schemas/review-session.schema';
import { SessionAuditLog, SessionAuditLogSchema } from './schemas/session-audit-log.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ReviewSession.name, schema: ReviewSessionSchema },
      { name: SessionAuditLog.name, schema: SessionAuditLogSchema },
    ]),
  ],
  controllers: [SessionsController],
  providers: [SessionsService],
})
export class SessionsModule {}